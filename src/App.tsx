import Header from "./customComponents/Header";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { NoteProvider } from "./context/NoteContext";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <div className=" dark:bg-black ">
      <NoteProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Header />
          <main className="flex flex-col gap-3 md:p-8   dark:bg-black  mx-auto">
            <Outlet />
            <Toaster />
          </main>
        </ThemeProvider>
      </NoteProvider>
    </div>
  );
}

export default App;
