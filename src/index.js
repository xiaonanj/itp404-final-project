import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Root from "./routes/Root";
import Home from "./routes/Home";
import Search from "./routes/Search";
import Detail from "./routes/Detail";
import Notes from "./routes/Notes";
import NoteDetail from "./routes/NoteDetail";
import Comments from "./routes/Comments";

// Sensitive data from environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Fallback component for error boundaries
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

// Define routes for your application
const router = createBrowserRouter([
  {
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Root />
      </ErrorBoundary>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
        loader() {
          return fetch(`${API_BASE_URL}/legalRules?_embed=notes&_embed=comments`)
            .then((response) => response.json())
            .catch((error) => {
              console.error("Error loading legal rules:", error);
              return [];
            });
        },
      },
      {
        path: "/search",
        element: <Search />,
        loader() {
          return fetch(`${API_BASE_URL}/legalRules`)
            .then((response) => response.json())
            .catch((error) => {
              console.error("Error loading search data:", error);
              return [];
            });
        },
      },
      {
        path: "/search/:legalRuleId",
        element: <Detail />,
        loader({ params }) {
          return fetch(`${API_BASE_URL}/legalRules/${params.legalRuleId}?_embed=notes&_embed=comments`)
            .then((response) => response.json())
            .catch((error) => {
              console.error("Error loading detail data:", error);
              return null;
            });
        },
      },
      {
        path: "/notes",
        element: <Notes />,
        loader() {
          return fetch(`${API_BASE_URL}/notes?_expand=legalRule`)
            .then((response) => response.json())
            .catch((error) => {
              console.error("Error loading notes:", error);
              return [];
            });
        },
      },
      {
        path: "/notes/:noteId",
        element: <NoteDetail />,
        loader({ params }) {
          return fetch(`${API_BASE_URL}/notes/${params.noteId}?_expand=legalRule`)
            .then((response) => response.json())
            .catch((error) => {
              console.error("Error loading note detail:", error);
              return null;
            });
        },
      },
      {
        path: "/comments",
        element: <Comments />,
        loader() {
          return Promise.all([
            fetch(`${API_BASE_URL}/comments`).then((res) => res.json()),
            fetch(`${API_BASE_URL}/legalRules`).then((res) => res.json()),
            fetch(`${API_BASE_URL}/users`).then((res) => res.json()),
          ])
            .then(([comments, legalRules, users]) => ({ comments, legalRules, users }))
            .catch((error) => {
              console.error("Error loading comments:", error);
              return { comments: [], legalRules: [], users: [] };
            });
        },
      },
    ],
  },
]);

// Create the root for React and render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />
  </React.StrictMode>
);

// Performance monitoring
reportWebVitals();
