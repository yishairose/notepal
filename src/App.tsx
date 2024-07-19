import Header from "./customComponents/Header";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { NoteProvider } from "./context/NoteContext";

function App() {
  return (
    <div className=" dark:bg-black ">
      <NoteProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Header />
          <main className="flex flex-col gap-3 p-8  dark:bg-black w-9/12 mx-auto">
            <Outlet />
          </main>
        </ThemeProvider>
      </NoteProvider>
    </div>
  );
}

export default App;
