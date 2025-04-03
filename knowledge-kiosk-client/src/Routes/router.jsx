import { createBrowserRouter, RouterProvider } from "react-router";
import { Root } from "../Componenets/Authentication/Root/root";
import { SlideShow } from "../Componenets/Home/Slideshow";
import { Register } from "../Componenets/Authentication/register";
import { Error } from "../Componenets/Error/Error";

let router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, // Use Root here to render SlideShow and Outlet
    errorElement: <Error />,
    children: [
      { path: "/", element: <SlideShow /> }, // Make sure SlideShow is still rendered
      { path: "/register", element: <Register /> }, // Register is rendered when navigating to /register
    ],
  },
]);

export default router;
