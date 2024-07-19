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
import Error from "./customComponents/Error.tsx";
import { loader as notesLoader } from "./pages/Notes.tsx";
import { loader as noteLoader } from "./pages/Note.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Navigate to="/notes" replace />,
        loader: notesLoader,
        errorElement: <Error />,
      },
      { path: "/notes", element: <Notes /> },
      { path: "/new", element: <NewNote /> },
      { path: "/edit/:id", element: <Edit /> },
      { path: "/note/:id", element: <Note />, loader: noteLoader },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
