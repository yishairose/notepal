import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, useFetcher, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { NoteContext } from "../context/NoteContext";
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
  displaying: NoteType[] | null;
  setDisplaying: Dispatch<SetStateAction<NoteType[]> | undefined>;
  setCurPage: Dispatch<SetStateAction<number>>;
}
export default function NoteForm({ type }) {
  const fetcher = useFetcher();

  const navigate = useNavigate();
  const params = useParams();
  const id = Number(params.id.slice(1));

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!fetcher.data && fetcher.state === "idle") fetcher.load(`/note/:${id}`);
    if (fetcher.data) setTitle(fetcher.data[0].title);
    if (fetcher.data) setContent(fetcher.data[0].content);
  }, [fetcher, id]);

  async function handleSubmit() {
    if (type === "new") {
      const { data, error } = await supabase
        .from("notes")
        .insert([{ title: title, content: content }])
        .select();
      navigate(`/note/:${data?.at(0).id}`);
      return data;
    }
    if (type === "edit") {
      console.log("edit");
    }
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
            Add note
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
    </div>
  );
}
