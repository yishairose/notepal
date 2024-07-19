import { createContext, SetStateAction, useState, Dispatch } from "react";

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

export function NoteProvider({ children }: ChildrenProps) {
  const [notes, setNotes] = useState<NoteType[] | null>([]);
  const [displaying, setDisplaying] = useState<NoteType[] | null>(notes);
  const [curPage, setCurPage] = useState(1);

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
