import {
  createContext,
  SetStateAction,
  useState,
  Dispatch,
  useEffect,
  act,
  useReducer,
  useRef,
} from "react";
import supabase from "../config/supabaseClient";

interface NoteType {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  archived: boolean;
}

interface NoteContextType {
  notes: NoteType[] | null;
  setNotes: Dispatch<SetStateAction<Array<NoteType> | null>>;
  displaying: NoteType[] | null;
  setDisplaying: Dispatch<SetStateAction<Array<NoteType> | null>>;
  setCurPage: Dispatch<SetStateAction<number>> | null;
  curPage: number;
}
export const NoteContext = createContext<NoteContextType | null>(null);

type ChildrenProps = {
  children: React.ReactNode;
};

const notesReducer = (state, action) => {
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
    case "DELETE_NOTE":
      return {
        ...state,
        notes: state.notes.filter((item) => item.id !== action.payload.id),
      };
    case "FILTER_NOTES":
      return { ...state, displaying: action.payload };

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

  const isMounted = useRef(false);

  function setIsLoading() {
    dispatch({ type: "SET_LOADING" });
  }
  function setCurPage(pageNumber) {
    dispatch({ type: "SET_CURRENT_PAGE", payload: pageNumber });
  }

  useEffect(() => {
    (async function () {
      if (!isMounted.current) {
        isMounted.current = true;
        try {
          setIsLoading();
          const { data, error } = await supabase.from("notes").select();

          dispatch({ type: "SET_NOTES", payload: data });
          if (error) throw new Error("Error fetching your notes");
        } catch (error) {
          console.log(error);
        }
        setIsLoading();
      }
    })();
  }, [isLoading]);

  async function addNote(title: string, content: string) {
    try {
      setIsLoading();

      const { data, error } = await supabase
        .from("notes")
        .insert([{ title: title, content: content }])
        .select();

      dispatch({ type: "ADD_NOTE", payload: data[0] });
      setIsLoading();
      return data;
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }

  async function deleteNote(id) {
    try {
      setIsLoading();

      const { data, error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .select();

      dispatch({ type: "DELETE_NOTE", payload: data[0] });
      setIsLoading();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

  async function editNote(id, title, content) {
    try {
      setIsLoading();
      const { data, error } = await supabase
        .from("notes")
        .update({ title: title, content: content })
        .eq("id", id)
        .select();
      dispatch({ type: "EDIT_NOTE", payload: data[0] });
      if (error) throw error;
      setIsLoading();
      return data;
    } catch (error) {
      console.error("Error editing note:", error);
    }
  }

  async function archiveNote(id, archived) {
    try {
      setIsLoading();

      const { data, error } = await supabase
        .from("notes")
        .update({ archived: !archived })
        .eq("id", id)
        .select();
      dispatch({ type: "ARCHIVE_NOTE", payload: data[0] });
      setIsLoading();
    } catch (error) {
      console.log("Error changing archived state", error);
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
        editNote,
        archiveNote,
        isLoading,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}
