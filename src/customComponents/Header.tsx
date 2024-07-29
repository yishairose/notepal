import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotepadText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { ModeToggle } from "../components/ui/mode-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b  px-8 md:px-6 mb-4 md:mb-0">
      <nav className="flex gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full ">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold mr-auto"
        >
          <NotepadText className="h-6 w-6 " /> &nbsp;
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight ">
            NotePal
          </h3>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="cursor-pointer">
              Logout
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </nav>
    </header>
  );
}
