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
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { ArrowBigLeft, PackageOpen } from "lucide-react";
import { dateStamp } from "../utils/helpers";
import { fetchNoteItem } from "../utils/api";

export default function Note() {
  const navigate = useNavigate();

  const curNote = useLoaderData();
  const { title, content, created_at, archived } = curNote[0];

  return (
    <div className="flex flex-col items-center gap-5 mt-24 h-screen ">
      <div className="flex gap-3 mb-3 self-start items-center w-full">
        <Button
          className="mr-auto "
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          <ArrowBigLeft />
          Back
        </Button>
        <Link to="/edit/:123">
          <Button>Edit</Button>
        </Link>
        <Toggle variant="outline" pressed={archived}>
          <PackageOpen />
          &nbsp; Archive
        </Toggle>
        <Button variant="destructive">Delete</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle> {title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{content}</p>
        </CardContent>
        <CardFooter>
          <p>Created at: {dateStamp(created_at)}</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export function loader({ params }) {
  const id = Number(params.id?.slice(1));
  const data = fetchNoteItem(id);
  if (!data) return;
  return data;
}
