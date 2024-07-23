import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  redirect,
  useFetcher,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";

import { NoteContext } from "../context/NoteContext";
import { Circles } from "react-loader-spinner";

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
export default function NoteForm({ type }) {
  const [range, setRange] = useState();
  const [lastChange, setLastChange] = useState();
  const [readOnly, setReadOnly] = useState(false);
  const quillRef = useRef();

  const navigate = useNavigate();
  const { notes, addNote, editNote, isLoading } = useContext(
    NoteContext
  ) as NoteContextType;
  const params = useParams();
  const id = Number(params.id?.slice(1)) || null;
  const [newNoteId, setNewNoteId] = useState(null);

  useEffect(() => {
    if (newNoteId) {
      navigate(`/note/:${newNoteId}`);
    } else {
      return;
    }
  }, [newNoteId, navigate]);

  useEffect(() => {
    if (type === "edit") {
      const curNote = notes?.filter((note) => note.id === id)?.at(0);
      setTitle(curNote?.title);
      setContent(curNote?.content);
    }
  }, []);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit() {
    if (type === "new") {
      const data = await addNote(title, content);
      setNewNoteId(data[0].id);
    }
    if (type === "edit") {
      const data = await editNote(id, title, content);
      if (data) {
        setNewNoteId(data[0].id);
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 mt-24  ">
      {isLoading ? (
        <div className="self-center mt-10">
          <Circles
            height="80"
            width="80"
            radius="9"
            color="green"
            ariaLabel="three-dots-loading"
          />
        </div>
      ) : (
        <Form className="flex flex-col gap-5  w-2/4">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl self-start">
            {type === "new" ? "Add new note" : "Edit your note"}
          </h1>
          <div className="flex flex-col gap-3">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="note">Note</Label>
            <Textarea
              placeholder="Type your message here."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {type === "edit" ? "Edit Note" : "Add note"}
            </Button>

            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}
