import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Link, useNavigate } from "react-router-dom";
import { SetStateAction, useContext, useRef, useState } from "react";
import { NoteContext } from "../context/NoteContext";
import { capitalise, dateStamp } from "../utils/helpers";
import { deleteNote } from "../utils/api";

interface Props {
  tabName: string;
}
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
  curPage: number;
  setCurPage: Dispatch<SetStateAction<number>> | null;
}
export default function NoteList({ tabName }: Props) {
  const navigate = useNavigate();

  const ctx = useContext(NoteContext) as NoteContextType;
  const { displaying, setNotes }: NoteContextType = ctx;
  const archive = displaying?.filter((note: NoteType) => note.archived);
  const active = displaying?.filter((note: NoteType) => !note.archived);

  const list = (): Array<NoteType> | undefined | null => {
    if (tabName == "archive") return archive;
    if (tabName == "active") return active;
    if (tabName == "all") return displaying;
  };

  const { curPage, setCurPage } = useContext(NoteContext) as NoteContextType;
  const notesPerPage: object = useRef(5);

  const pagination = () => {
    return [...list()]?.slice(
      (curPage - 1) * notesPerPage.current,
      curPage * notesPerPage.current
    );
  };
  const pages = new Array(
    Math.ceil(list()?.length / notesPerPage.current)
  ).fill(1);
  const noOfPages = pages.length;

  function handlDeleteNote(id) {
    deleteNote(id);
    setNotes((cur: NoteType[]) => cur.filter((note) => note.id !== id));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{capitalise(tabName)} notes</CardTitle>
        <CardDescription>
          Keep organised by creating and managing your notes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <Checkbox />
              </TableHead>
              <TableHead>Name</TableHead>

              <TableHead className="hidden md:table-cell">Content</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagination()?.map((note: NoteType) => {
              return (
                <TableRow
                  key={note.id}
                  onClick={() => navigate(`/note/:${note.id}`)}
                >
                  <TableCell className="hidden sm:table-cell z-20">
                    <Checkbox
                      onClick={(e: Event) => {
                        e.stopPropagation();
                      }}
                    />
                  </TableCell>

                  <TableCell className="font-medium ">{note.title}</TableCell>
                  <TableCell className="hidden md:table-cell ">
                    {note.content}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {dateStamp(note.created_at)}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit/:${note.id}`);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem>Archive</DropdownMenuItem>
                        <DropdownMenuItem>
                          <Button
                            variant="destructive"
                            className="w-full"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handlDeleteNote(note.id);
                            }}
                          >
                            Delete
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex flex-col">
        {noOfPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem className="cursor-pointer">
                <PaginationPrevious
                  onClick={() => {
                    if (curPage === 1) return;
                    setCurPage((cur) => cur - 1);
                  }}
                />
              </PaginationItem>
              {pages.map((_, i) => (
                <PaginationItem className="cursor-pointer" key={i}>
                  <PaginationLink
                    onClick={() => {
                      setCurPage(i + 1);
                    }}
                    isActive={i + 1 === curPage}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem className="cursor-pointer">
                <PaginationNext
                  onClick={() => {
                    if (curPage === noOfPages) return;
                    setCurPage((cur) => cur + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
        <div className="text-xs text-muted-foreground self-start">
          You have <strong>{list()?.length}</strong>{" "}
          {tabName === "all" ? "" : tabName} note
        </div>
      </CardFooter>
    </Card>
  );
}
