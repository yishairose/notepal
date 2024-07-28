import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Notes from "./pages/Notes.tsx";
import NewNote from "./pages/NewNote.tsx";
import { Navigate } from "react-router-dom";
import Note from "./pages/Note.tsx";
import Edit from "./pages/Edit.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Navigate to="/notes" replace />,
      },
      { path: "/notes", element: <Notes /> },
      { path: "/new", element: <NewNote /> },
      { path: "/edit/:id", element: <Edit /> },
      { path: "/note/:id", element: <Note /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
