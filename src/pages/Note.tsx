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
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowBigLeft, PackageOpen } from "lucide-react";
import { dateStamp } from "../utils/helpers";
import { NoteContext } from "../context/NoteContext";
import { useContext } from "react";

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
}

export default function Note() {
  const navigate = useNavigate();

  const { notes, deleteNote, archiveNote } = useContext(
    NoteContext
  ) as NoteContextType;
  const params = useParams();
  const id = Number(params.id.slice(1));
  const curNote = notes?.filter((note) => note.id === id)?.at(0);

  function handlDeleteNote() {
    deleteNote(id);
    navigate("/notes");
  }
  function handleArchiveNote() {
    archiveNote(curNote.id, curNote?.archived);
    // setArchived((cur) => !cur);
    // archiveNote(curNote.id, archived);
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
            <Toggle
              variant="outline"
              pressed={curNote.archived}
              onPressedChange={handleArchiveNote}
            >
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
