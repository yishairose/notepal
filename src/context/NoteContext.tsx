import {
  createContext,
  SetStateAction,
  useState,
  Dispatch,
  useEffect,
  act,
  useReducer,
} from "react";
import { fetchNotes } from "../utils/api";
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
      return action.payload;
    case "ADD_NOTE":
      return [...state, action.payload];
    case "EDIT_NOTE":
      return state.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    case "ARCHIVE_NOTE":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, archived: action.payload.archived }
          : item
      );
    case "DELETE_NOTE":
      return state.filter((item) => item.id !== action.payload.id);
    default:
      return state;
  }
};

export function NoteProvider({ children }: ChildrenProps) {
  const [notes, dispatch] = useReducer(notesReducer, []);
  const [displaying, setDisplaying] = useState<NoteType[] | null>(notes);
  const [curPage, setCurPage] = useState(1);
  useEffect(() => {
    (async function () {
      try {
        const { data, error } = await supabase.from("notes").select();
        dispatch({ type: "SET_NOTES", payload: data });

        if (error) throw new Error("Error fetching your notes");
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  async function addNote(title: string, content: string) {
    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([{ title: title, content: content }])
        .select();

      dispatch({ type: "ADD_NOTE", payload: data[0] });
      return data;
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }

  async function deleteNote(id) {
    try {
      const { data, error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .select();

      dispatch({ type: "DELETE_NOTE", payload: data[0] });
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

  async function editNote(id, title, content) {
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({ title: title, content: content })
        .eq("id", id)
        .select();
      dispatch({ type: "EDIT_NOTE", payload: data[0] });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error editing note:", error);
    }
  }

  async function archiveNote(id, archived) {
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({ archived: !archived })
        .eq("id", id)
        .select();
      console.log(data);
      dispatch({ type: "ARCHIVE_NOTE", payload: data[0] });
      console.log(notes);
    } catch (error) {
      console.log("Error changing archived state", error);
    }
  }

  return (
    <NoteContext.Provider
      value={{
        notes,
        displaying,
        setDisplaying,
        curPage,
        setCurPage,
        addNote,
        deleteNote,
        editNote,
        archiveNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}
