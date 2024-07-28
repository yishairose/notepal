import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

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
  isLoading: boolean;
  notes: NoteType[] | null;
  addNote: (title: string, content: string) => Promise<NoteType[] | void>;
  deleteNote: (id: number) => Promise<void>;
  editNote: (
    id: number,
    title: string,
    content: string
  ) => Promise<NoteType[] | void>;
}

export default function NoteForm({ type }: { type: string }) {
  const navigate = useNavigate();
  const { notes, addNote, editNote, isLoading } = useContext(
    NoteContext
  ) as NoteContextType;
  const params = useParams();
  const id = Number(params.id?.slice(1)) || null;
  const [newNoteId, setNewNoteId] = useState<number | null>(null);

  useEffect(() => {
    if (newNoteId) {
      navigate(`/note/:${newNoteId}`);
    } else {
      return;
    }
  }, [newNoteId, navigate]);
  console.log(newNoteId);

  useEffect(() => {
    if (type === "edit") {
      const curNote = notes?.filter((note) => note.id === id)?.at(0);
      if (!curNote) return;
      setTitle(curNote?.title);
      setContent(curNote?.content);
    }
  }, [id, notes, type]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit() {
    if (type === "new") {
      const data = await addNote(title, content);
      if (data) {
        setNewNoteId(data[0].id);
      }
    }
    if (type === "edit") {
      if (!id) return;
      const data = await editNote(id, title, content);
      if (data) {
        setNewNoteId(data[0].id);
      }
    }
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
    <div className="flex flex-col items-center gap-5 mt-24  ">
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
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setTitle(target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="note">Note</Label>
          <Textarea
            placeholder="Type your message here."
            value={content}
            onChange={(e) => {
              const target = e.target;
              setContent(target.value);
            }}
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {type === "edit" ? "Edit Note" : "Add note"}
          </Button>

          <Button
            variant="outline"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
