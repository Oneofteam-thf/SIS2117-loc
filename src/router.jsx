import React from 'react';
import { Login } from 'login';
import { createBrowserRouter } from 'react-router-dom';
import { App } from 'App';
import { Users } from 'users';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/users",
    element: <Users />,
  },
]);

export { router }