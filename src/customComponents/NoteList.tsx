import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import { NoteContext } from "../context/NoteContext";
import { capitalise, dateStamp } from "../utils/helpers";
import { Circles } from "react-loader-spinner";

interface SearchProps {
  query: string;
  searchType: string;
  sort: string;
}

interface Props {
  tabName: string;
  search: SearchProps;
}
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
  displaying: NoteType[] | null;
  setCurPage: (pageNumber: number) => void;
  addNote: (title: string, content: string) => Promise<NoteType[] | void>;
  deleteNote: (id: number) => Promise<void>;
  deleteMultiple: (selected: number[]) => Promise<void>;
  editNote: (
    id: number,
    title: string,
    content: string
  ) => Promise<NoteType[] | void>;
  archiveNote: (id: number, archived: boolean) => Promise<void>;
  archiveMultiple: (selected: number[]) => Promise<void>;
  unArchiveMultiple: (selected: number[]) => Promise<void>;
  curPage: number;
}

export default function NoteList({ tabName, search }: Props) {
  const navigate = useNavigate();

  const {
    curPage,
    setCurPage,
    deleteNote,
    deleteMultiple,
    isLoading,
    notes,
    archiveNote,
    archiveMultiple,
    unArchiveMultiple,
  } = useContext(NoteContext) as NoteContextType;

  //Evaluate current tab content
  const displaying = useMemo(() => {
    let noteList: NoteType[] | null | undefined = notes;
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

  //Row selection functionality
  const [selected, setSelected] = useState<number[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [allCheckedBox, setAllCheckBox] = useState<boolean | string>(false);

  useEffect(() => {
    if (selected.length > 0 && !allSelected) setAllCheckBox("indeterminate");
    if (allSelected) setAllCheckBox(true);
    if (selected.length === notesToDisplay.length) {
      setAllSelected(true);
    }
    if (selected.length === 0) setAllCheckBox(false);
  }, [selected, allSelected, notesToDisplay]);

  // let checkedAll: boolean | string = false;

  // if (selected.length > 0 && !allSelected) checkedAll = "indeterminate";
  // else if (allSelected) checkedAll = true;
  // if (selected.length === 0) checkedAll = false;

  function handleSelectAll() {
    if (selected.length === notesToDisplay.length) {
      setSelected([]);
      setAllSelected(false);
    } else {
      setSelected(notesToDisplay.map((note) => note.id));
      setAllSelected(true);
    }
    console.log(selected);
  }

  function handleSelect(id: number) {
    if (selected.includes(id)) {
      setSelected((cur) => cur.filter((cur) => cur !== id));
      setAllSelected(false);
    } else {
      setSelected((cur) => [...cur, id]);
    }
  }

  function handlDeleteNote(id: number) {
    deleteNote(id);
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
    <Card className="flex flex-col justify-center">
      <CardHeader>
        <CardTitle>{capitalise(tabName)} notes</CardTitle>
        <CardDescription>
          Keep organised by creating and managing your notes.
        </CardDescription>
        {selected.length > 0 && (
          <div className="flex gap-3 w-full justify-end">
            {tabName === "active" && (
              <Button
                variant="outline"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  archiveMultiple(selected);
                  setSelected([]);
                }}
              >
                Archive
              </Button>
            )}
            {tabName === "archived" && (
              <Button
                variant="outline"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  unArchiveMultiple(selected);
                  setSelected([]);
                }}
              >
                UnArchive
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                deleteMultiple(selected);
                setSelected([]);
              }}
            >
              Delete
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={allCheckedBox}
                />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>

              <TableHead className="hidden md:table-cell">Content</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
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
                  className="cursor-pointer"
                >
                  <TableCell className="hidden sm:table-cell z-20">
                    <Checkbox
                      onCheckedChange={() => handleSelect(note.id)}
                      checked={selected.includes(note.id)}
                      onClick={(e: React.MouseEvent<HTMLElement>) => {
                        e.stopPropagation();
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant={note.archived ? "destructive" : "default"}>
                      {note.archived ? "Archived" : "Active"}
                    </Badge>
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
                        <DropdownMenuLabel
                          onClick={(e: React.MouseEvent<HTMLElement>) =>
                            e.stopPropagation()
                          }
                        >
                          Actions
                        </DropdownMenuLabel>

                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit/:${note.id}`);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>

                        {!note.archived && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              archiveNote(note.id, note.archived);
                            }}
                          >
                            Archive
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Button
                            variant="destructive"
                            className="w-full"
                            onClick={(
                              e: React.MouseEvent<HTMLButtonElement>
                            ) => {
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
        <div className="text-xs text-muted-foreground self-start flex justify-between w-full">
          <div>
            You have <strong>{displaying?.length}</strong>
            {tabName === "all" ? "" : ` ${tabName}`} notes
          </div>
          <div>
            {selected.length > 0 &&
              `${selected.length} note${
                selected.length === 1 ? "" : "s"
              } selected`}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
