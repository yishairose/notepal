import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ListFilter, Search, SquarePen } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NoteList from "../customComponents/NoteList";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext, useEffect, useRef, useState } from "react";
import { NoteContext } from "../context/NoteContext";

interface NoteContextType {
  setCurPage: (pageNumber: number) => void;
}

export default function Notes() {
  const [sort, setSort] = useState("created");
  const [searchType, setSearchType] = useState("title");
  const [query, setQuery] = useState("");
  const { setCurPage } = useContext(NoteContext) as NoteContextType;

  //Reset pagination on component mount
  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      setCurPage(1);
    }
    return;
  }, [setCurPage]);

  return (
    <Tabs
      defaultValue="active"
      className="w-full "
      onValueChange={() => {
        setCurPage(1);
      }}
    >
      <div className="flex items-center gap-3  mb-3 p-4 flex-col md:flex-row md:justify-between justify-between">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="all">All notes</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <div className="flex gap-3  ">
          <form
            className=" sm:flex-initial"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative flex ">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notes..."
                className="pl-8 pr-[90px] sm:w-full md:w-[200px] lg:w-[200px] xl:w-[300px]"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setQuery(e.target.value);
                  setCurPage(1);
                }}
                value={query}
              />
              <Select
                onValueChange={(value: string) => {
                  setQuery("");
                  setSearchType(value);
                }}
                defaultValue={searchType}
              >
                <SelectTrigger className="w-30 absolute top-0 right-0 h-full border-none bg-transparent outline-none focus:ring-0 focus:ring-none focus:ring-offset-0 focus:border-none focus:outline-none">
                  <SelectValue placeholder="Search by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Search</SelectLabel>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ListFilter />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sort Notes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                <DropdownMenuRadioItem value="alpha">A-Z</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="created">
                  Date Created
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link to="/new">
          <Button>
            <SquarePen />
            <span className="sm:whitespace-nowrap">&nbsp; Create note</span>
          </Button>
        </Link>
      </div>
      <TabsContent value="active">
        <NoteList tabName={"active"} search={{ query, searchType, sort }} />
      </TabsContent>
      <TabsContent value="all">
        <NoteList tabName={"all"} search={{ query, searchType, sort }} />
      </TabsContent>
      <TabsContent value="archived">
        <NoteList tabName={"archived"} search={{ query, searchType, sort }} />
      </TabsContent>
    </Tabs>
  );
}
