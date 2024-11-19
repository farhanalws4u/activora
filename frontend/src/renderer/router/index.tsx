import React from 'react';
import { RouteObject } from 'react-router-dom';
import Home from '@renderer/view/home/Home';
import SignIn from "@renderer/view/signIn/SignIn"
import SignUp from "@renderer/view/signup/SignUp"
import Projects from '@renderer/view/Projects/Projects';
import Tracker from '@renderer/view/Tracker/Tracker';
import Tasks from '@renderer/view/History/History';

const routes: RouteObject[] = [
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/',
    element: <Home />,
  },

  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/projects',
    element: <Projects />,
  },
  {
    path: '/tracker',
    element: <Tracker />,
  },
  {
    path: '/tasks',
    element: <Tasks />,
  },
];

export default routes;
