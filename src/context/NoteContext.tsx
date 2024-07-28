import {
  createContext,
  SetStateAction,
  Dispatch,
  useEffect,
  useReducer,
  useRef,
} from "react";
import supabase from "../config/supabaseClient";
import { useToast } from "../components/ui/use-toast";

interface NoteType {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  archived: boolean;
}

interface NoteContextType {
  isLoading: boolean;
  notes: NoteType[] | null;
  setNotes: Dispatch<SetStateAction<Array<NoteType> | null>>;
  displaying: NoteType[] | null;
  setCurPage: (pageNumber: number) => void;
  addNote: (title: string, content: string) => Promise<NoteType[] | void>;
  deleteNote: (id: number) => Promise<void>;
  deleteMultiple: (selected: number[]) => Promise<void>;
  editNote: (
    id: number,
    title: string,
    content: string
  ) => Promise<NoteType[] | void>;
  archiveNote: (id: number, archived: boolean) => Promise<void>;
  archiveMultiple: (selected: number[]) => Promise<void>;
  unArchiveMultiple: (selected: number[]) => Promise<void>;

  curPage: number;
}

interface State {
  notes: NoteType[];
  curPage: number;
  isLoading: boolean;
}

type Action =
  | { type: "ARCHIVE_NOTE"; payload: NoteType }
  | { type: "ADD_NOTE"; payload: NoteType }
  | { type: "DELETE_NOTE"; payload: NoteType }
  | { type: "EDIT_NOTE"; payload: NoteType }
  | { type: "SET_NOTES"; payload: NoteType[] }
  | { type: "ARCHIVE_MULTIPLE_NOTES"; payload: number[] }
  | { type: "UNARCHIVE_MULTIPLE_NOTES"; payload: number[] }
  | { type: "DELETE_MULTIPLE_NOTES"; payload: number[] }
  | { type: "SET_LOADING" }
  | { type: "SET_CURRENT_PAGE"; payload: number };

export const NoteContext = createContext<NoteContextType | null>(null);

type ChildrenProps = {
  children: React.ReactNode;
};

const notesReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_NOTES":
      return { ...state, notes: action.payload };
    case "ADD_NOTE":
      return { ...state, notes: [...state.notes, action.payload] };
    case "EDIT_NOTE":
      return {
        ...state,
        notes: state.notes.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case "ARCHIVE_NOTE":
      return {
        ...state,
        notes: state.notes.map((item) =>
          item.id === action.payload.id
            ? { ...item, archived: action.payload.archived }
            : item
        ),
      };
    case "ARCHIVE_MULTIPLE_NOTES":
      return {
        ...state,
        notes: state.notes.map((item) => {
          return action.payload.includes(item.id)
            ? { ...item, archived: true }
            : item;
        }),
        curPage: 1,
      };
    case "UNARCHIVE_MULTIPLE_NOTES":
      return {
        ...state,
        curPage: 1,
        notes: state.notes.map((item) =>
          action.payload.includes(item.id) ? { ...item, archived: false } : item
        ),
      };
    case "DELETE_NOTE":
      return {
        ...state,
        notes: state.notes.filter((item) => item.id !== action.payload.id),
      };
    case "DELETE_MULTIPLE_NOTES":
      return {
        ...state,
        curPage: 1,
        notes: state.notes.filter((item) => !action.payload.includes(item.id)),
      };

    case "SET_LOADING":
      return { ...state, isLoading: !state.isLoading };
    case "SET_CURRENT_PAGE":
      return { ...state, curPage: action.payload };

    default:
      return state;
  }
};

export function NoteProvider({ children }: ChildrenProps) {
  const initialState = {
    notes: [],
    curPage: 1,
    isLoading: false,
  };
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const { notes, curPage, isLoading } = state;
  const { toast } = useToast();

  const isMounted = useRef(false);

  function setIsLoading() {
    dispatch({ type: "SET_LOADING" });
  }
  function setCurPage(pageNumber: number) {
    dispatch({ type: "SET_CURRENT_PAGE", payload: pageNumber });
  }

  useEffect(() => {
    (async function () {
      if (!isMounted.current) {
        isMounted.current = true;
        try {
          setIsLoading();
          const { data, error } = await supabase.from("notes").select();
          if (!data) throw new Error(`Error fetching your notes ${error}`);
          dispatch({ type: "SET_NOTES", payload: data });
        } catch (error) {
          console.log(error);
          toast({
            title: "Error",
            description: `There was an error loading your notes: ${error}`,
          });
        }
        setIsLoading();
      }
    })();
  }, [isLoading, toast]);

  async function addNote(title: string, content: string) {
    try {
      setIsLoading();

      const { data, error } = await supabase
        .from("notes")
        .insert([{ title: title, content: content }])
        .select();
      if (!data) throw new Error(`Error adding your note ${error}`);
      dispatch({ type: "ADD_NOTE", payload: data[0] });
      toast({
        title: "Success",
        description: `You have successfully created a new note: ${data[0].title}`,
      });
      setIsLoading();
      return data;
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Error",
        description: `There was an error loading your notes: ${error}`,
      });
    }
  }

  async function deleteNote(id: number) {
    try {
      setIsLoading();

      const { data, error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .select();
      if (!data) throw new Error(`Error deleteing your note ${error}`);
      dispatch({ type: "DELETE_NOTE", payload: data[0] });
      toast({
        title: "Success",
        description: `You have successfully deleted note: ${data[0].title}`,
      });

      setIsLoading();
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: `Error deleteing your note ${error}`,
      });
    }
  }

  async function deleteMultiple(selected: number[]) {
    try {
      setIsLoading();
      const { data, error } = await supabase
        .from("notes")
        .delete()
        .in("id", selected)
        .select();
      if (!data) throw new Error(`Error deleteing your notes ${error}`);
      const deleted = data.map((item) => item.id);
      dispatch({ type: "DELETE_MULTIPLE_NOTES", payload: deleted });
      toast({
        title: "Success",
        description: `You have successfully deleted some notes`,
      });
      setIsLoading();
    } catch (error) {
      toast({
        title: "Error",
        description: `Error deleting your notes: ${error}`,
      });
    }
  }

  async function editNote(id: number, title: string, content: string) {
    try {
      setIsLoading();
      const { data, error } = await supabase
        .from("notes")
        .update({ title: title, content: content })
        .eq("id", id)
        .select();
      if (!data) throw new Error(`Error editing your note ${error}`);
      dispatch({ type: "EDIT_NOTE", payload: data[0] });
      toast({
        title: "Success",
        description: `You have successfully edited note: ${data[0].title}`,
      });
      setIsLoading();
      return data;
    } catch (error) {
      console.error("Error editing note:", error);
      toast({
        title: "Error",
        description: `Error editing your note ${error}`,
      });
    }
  }

  async function archiveNote(id: number, archived: boolean) {
    try {
      setIsLoading();

      const { data, error } = await supabase
        .from("notes")
        .update({ archived: !archived })
        .eq("id", id)
        .select();
      if (!data) throw new Error(`Error archiving your note ${error}`);
      dispatch({ type: "ARCHIVE_NOTE", payload: data[0] });
      toast({
        title: "Success",
        description: `You have successfully ${
          data[0].archived ? "archived" : "unarchived"
        }: ${data[0].title}`,
      });
      setIsLoading();
    } catch (error) {
      console.log("Error changing archived state", error);
      toast({
        title: "Error",
        description: `Error archiving your note ${error}`,
      });
    }
  }

  async function archiveMultiple(selected: number[]) {
    try {
      setIsLoading();
      const upsertArray = selected.map((item) => {
        return { id: item, archived: true };
      });
      const { data, error } = await supabase
        .from("notes")
        .upsert(upsertArray)
        .select();
      if (!data) throw new Error(`Error archiving your notes ${error}`);
      const archived = data?.map((item) => item.id);
      dispatch({ type: "ARCHIVE_MULTIPLE_NOTES", payload: archived });
      toast({
        title: "Success",
        description: `You have successfully archived some notes.`,
      });
      setIsLoading();
    } catch (error) {
      console.log("Error changing archived state", error);
      toast({
        title: "Error",
        description: `Error archiving your notes ${error}`,
      });
    }
  }
  async function unArchiveMultiple(selected: number[]) {
    try {
      setIsLoading();
      const upsertArray = selected.map((item) => {
        return { id: item, archived: false };
      });
      const { data, error } = await supabase
        .from("notes")
        .upsert(upsertArray)
        .select();
      if (!data) throw new Error(`Error unarchiving your notes ${error}`);
      const unArchived = data.map((item) => item.id);
      dispatch({ type: "UNARCHIVE_MULTIPLE_NOTES", payload: unArchived });
      toast({
        title: "Success",
        description: `You have successfully unarchived some notes.`,
      });
      setIsLoading();
    } catch (error) {
      console.log("Error changing unarchived state", error);
      toast({
        title: "Error",
        description: `Error unarchiving your notes ${error}`,
      });
    }
  }

  return (
    <NoteContext.Provider
      value={{
        notes,
        curPage,
        setCurPage,
        addNote,
        deleteNote,
        deleteMultiple,
        editNote,
        archiveNote,
        archiveMultiple,
        unArchiveMultiple,
        isLoading,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}
