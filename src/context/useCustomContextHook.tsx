import { Context, useContext } from "react";

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
}
export const useCustomContext = (context: Context<NoteContextType>) => {
  const ctx = useContext(context);
  if (ctx === null) return;

  return ctx;
};
