import { Route, BrowserRouter, Routes, redirect } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import ProtectedRoute from "./components/protectedRoute";
import Projects from "./Pages/Projects/Projects";
import Tracker from "./Pages/Tracker/Tracker";
import Tasks from "./Pages/Tasks/Tasks";
import { useEffect } from "react";

function App() {
  let token = localStorage.getItem("token");
  let isAuthenticated = token ? true : false;

  useEffect(() => {
    if (!token && window.location.pathname !== "/login")
      window.location.href = "/login";
  }, [localStorage]);

   useEffect(() => {
     if (token && window.location.pathname === "/login")
       window.location.href = "/";
   }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <ProtectedRoute
              component={Home}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          exact
          path="/projects"
          element={
            <ProtectedRoute
              component={Projects}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          exact
          path="/tracker"
          element={
            <ProtectedRoute
              component={Tracker}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          exact
          path="/tasks"
          element={
            <ProtectedRoute
              component={Tasks}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Registration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
