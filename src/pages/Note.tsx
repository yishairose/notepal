import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "../components/ui/button";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { ArrowBigLeft, PackageOpen } from "lucide-react";
import { dateStamp } from "../utils/helpers";
import { NoteContext } from "../context/NoteContext";
import { useContext } from "react";
import supabase from "../config/supabaseClient";
import { deleteNote } from "../utils/api";

interface NoteType {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  archived: boolean;
}
interface NoteContextType {
  notes: NoteType[] | null;
  displaying: NoteType[] | null;
  setDisplaying: Dispatch<SetStateAction<NoteType[]> | undefined>;
  setCurPage: Dispatch<SetStateAction<number>>;
}

export default function Note() {
  const navigate = useNavigate();

  const { notes, setNotes } = useContext(NoteContext) as NoteContextType;
  const params = useParams();
  const id = Number(params.id.slice(1));
  const curNote = notes?.filter((note) => note.id === id)?.at(0);

  function handlDeleteNote() {
    deleteNote(id);
    setNotes((cur: NoteType[]) => cur.filter((note) => note.id !== id));
    navigate("/notes");
  }
  return (
    <div className="flex flex-col items-center gap-5 mt-24 h-screen ">
      {curNote && (
        <>
          <div className="flex gap-3 mb-3 self-start items-center w-full">
            <Button
              className="mr-auto "
              onClick={(e) => {
                e.preventDefault();
                navigate("/notes");
              }}
            >
              <ArrowBigLeft />
              Back
            </Button>
            <Link to={`/edit/:${curNote.id}`}>
              <Button>Edit</Button>
            </Link>
            <Toggle variant="outline" pressed={curNote.archived}>
              <PackageOpen />
              &nbsp; Archive
            </Toggle>
            <Button
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                handlDeleteNote();
              }}
            >
              Delete
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle> {curNote.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{curNote.content}</p>
            </CardContent>
            <CardFooter>
              <p>Created at: {dateStamp(curNote.created_at)}</p>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
}

export function loader({ params }) {
  // const id = Number(params.id?.slice(1));
  // const data = fetchNoteItem(id);
  // if (!data) return;
  // return data;
  return null;
}
