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
import {
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NoteContext } from "../context/NoteContext";
import { capitalise, dateStamp } from "../utils/helpers";
import { Circles } from "react-loader-spinner";

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
export default function NoteList({ tabName, search }: Props) {
  const navigate = useNavigate();

  const { curPage, setCurPage, deleteNote, isLoading, notes } = useContext(
    NoteContext
  ) as NoteContextType;

  //Evaluate current tab content
  const displaying = useMemo(() => {
    let noteList = notes;
    if (tabName === "active")
      noteList = notes?.filter((note) => !note.archived);
    if (tabName === "archived")
      noteList = notes?.filter((note) => note.archived);
    return noteList;
  }, [notes, tabName]);

  //Sort functionality
  const { query, searchType, sort } = search;
  const sortedNotes = useMemo(() => {
    const sorted =
      sort === "alpha"
        ? [...(displaying || [])].sort((a, b) =>
            a.title < b.title ? -1 : a.title > b.title ? 1 : 0
          )
        : [...(displaying || [])].sort((a, b) =>
            a.created_at < b.created_at
              ? -1
              : a.created_at > b.created_at
              ? 1
              : 0
          );

    return sorted;
  }, [sort, displaying]);

  //Search functionality maintaining sorted order
  const notesToDisplay = useMemo(() => {
    const lowerCaseQuery = query.toLowerCase();
    const results = [...sortedNotes]?.filter((note) =>
      searchType === "title"
        ? note.title.toLowerCase().includes(lowerCaseQuery)
        : note.content.toLowerCase().includes(lowerCaseQuery)
    );
    return results;
  }, [query, sortedNotes, searchType]);

  //Pagination functionality based on final evaluation of results to display
  const notesPerPage: number = 5;
  const noOfPages = Math.ceil(notesToDisplay.length / notesPerPage);
  const paginatedNotes = notesToDisplay?.slice(
    (curPage - 1) * notesPerPage,
    notesPerPage * curPage
  );

  function handlDeleteNote(id) {
    deleteNote(id);
  }

  return (
    <Card className="flex flex-col justify-center">
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
        <>
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

                  <TableHead className="hidden md:table-cell">
                    Content
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created at
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedNotes?.map((note: NoteType) => {
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

                      <TableCell className="font-medium ">
                        {note.title}
                      </TableCell>
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
                        setCurPage(curPage - 1);
                      }}
                    />
                  </PaginationItem>
                  {Array(noOfPages)
                    .fill(null)
                    .map((_, i) => (
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
                        setCurPage(curPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
            <div className="text-xs text-muted-foreground self-start">
              You have <strong>{displaying?.length}</strong>
              {tabName === "all" ? "" : tabName + ""} notes
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
