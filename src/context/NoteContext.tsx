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

// const notesReducer = (state, action) => {
//   switch (action.type) {
//     case "SET_NOTES":
//       return action.payload;

//     default:
//       return state;
//   }
// };

export function NoteProvider({ children }: ChildrenProps) {
  const [notes, setNotes] = useState<NoteType[] | null>([]);

  const [displaying, setDisplaying] = useState<NoteType[] | null>(notes);
  const [curPage, setCurPage] = useState(1);
  useEffect(() => {
    (async function () {
      const data = await fetchNotes();
      if (!data) return;
      setNotes(data);
    })();
  }, [setNotes]);

  return (
    <NoteContext.Provider
      value={{
        notes,
        setNotes,
        displaying,
        setDisplaying,
        curPage,
        setCurPage,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}
