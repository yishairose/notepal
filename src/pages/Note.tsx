import {
  Card,
  CardContent,
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
import { Circles } from "react-loader-spinner";

interface NoteType {
  id: number;
  title: string;
  content: string;
  created_at: string;
  archived: boolean;
}

interface NoteContextType {
  isLoading: boolean;
  notes: NoteType[] | null;
  addNote: (title: string, content: string) => Promise<NoteType[] | void>;
  deleteNote: (id: number) => Promise<void>;
  archiveNote: (id: number, archived: boolean) => Promise<void>;
}

export default function Note() {
  const navigate = useNavigate();

  const { notes, deleteNote, archiveNote, isLoading } = useContext(
    NoteContext
  ) as NoteContextType;
  const params = useParams();
  const id = Number(params?.id?.slice(1));
  const curNote: NoteType | undefined =
    notes?.filter((note) => note.id === id)?.at(0) ?? undefined;

  function handlDeleteNote() {
    deleteNote(id);
    navigate("/notes");
  }
  function handleArchiveNote() {
    if (curNote) archiveNote(curNote.id, curNote.archived);
  }

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center">
        <Circles
          height="80"
          width="80"
          color="green"
          ariaLabel="three-dots-loading"
        />
      </div>
    );
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
