import { createBrowserRouter, RouterProvider } from "react-router";
import { Root } from "../Components/Authentication/Root/root";
import { SlideShow } from "../Components/Home/Slideshow";
import { Register } from "../Components/Authentication/register";
import { Error } from "../Components/Error/Error";
import RegistrationStatus from "../Components/Authentication/RegistrationStatus";
import { Login } from "../Components/Authentication/login";
import { AllPublicFiles } from "../Components/AllPublic";
import { KioskChannel } from "../Components/KIosk-Channel/KioskChannel";
import { Feedback } from "../Components/Feedback/Feedback";
import { Website } from "../Components/Websites/Website";
import { Thread } from "../Components/Thread/THread";
import PrivateRoute from "../Components/Protected/Private";
import { Overview } from "../Components/Dashboard/Overview/Overview";


import { AskQuestions } from "../Components/Dashboard/AskQuestions/AskQuestions";
import { SubmitFeedback } from "../Components/Dashboard/SubmitFeedback/SubmitFeedback";
import { Profile } from "../Components/Dashboard/Profile/Profile";
import { Dashboard } from "../Components/Dashboard/Dashboard";
import { AllUsers } from "../Components/Dashboard/AllUsers/AllUsers";
import { AdminProtection } from "../Components/AdminProtection/AdminProtection";
import { Upload } from "../Components/Dashboard/Upload/Upload";
import { PdfViewer } from "../Components/PdfViewer";
import { AllFiles } from "../Components/Dashboard/AllFiles/AllFiles";




async function slidesLoader() {
  const response = await fetch("http://localhost:5000/pdfPublicCollection", {
    credentials: "include",
  });
  const data = await response.json();
  // Convert to fully-qualified URLs
  return data.map((pdf) => `http://localhost:5000/files/${pdf.filename}`).reverse();
}
// singlePdfLoader.js
export async function singlePdfLoader({ params }) {
  const { id } = params;
  const res = await fetch(`http://localhost:5000/pdfCollection/${id}`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("PDF not found or error fetching single PDF");
  }
  const data = await res.json(); 

  return {
    ...data,
    fullUrl: `http://localhost:5000${data.url}`,
  };
}


let router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, 
    errorElement: <Error />,
    children: [
      { path: "/", element: <SlideShow /> , loader : slidesLoader }, 
      { path: "/register", element: <Register /> },
      { path: "/registration-status", element: <RegistrationStatus /> }, 
      { path: "/all-files", element: <AllPublicFiles />, loader : slidesLoader },
      {path: "/kiosk-channel", element: <KioskChannel /> },
      {
        path: "/pdf/:id",
        element: <PdfViewer />,
        loader : singlePdfLoader
      },
      {path: "/feedback", element: <Feedback /> },
      {path: "/websites", element: <PrivateRoute><Website /></PrivateRoute> },
      {path: "/thread", element:<PrivateRoute><Thread /></PrivateRoute>  },
      {path: "/login", element: <Login /> },
    ],
  },
  {
    path : '/dashboard',
    element : <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    errorElement: <Error></Error>,
    children : [
      {
        path : "/dashboard/overview",
        element : <Overview></Overview>
      },
      {
        path : "/dashboard/upload",
        element:<Upload></Upload>
      },
      {
        path : "/dashboard/allFiles",
        element : <AllFiles></AllFiles>
      },
      {
        path : "/dashboard/allUsers",
        element:<AdminProtection><AllUsers></AllUsers></AdminProtection>
      },
      {
        path : "/dashboard/askQuestions",
        element:<AskQuestions></AskQuestions>
      },
      {
        path : "/dashboard/feedback",
        element:<SubmitFeedback></SubmitFeedback>
      },
      {
        path : "/dashboard/profile",
        element:<Profile></Profile>
      },
      {
        path: "/dashboard/home",
        element : <SlideShow></SlideShow>
      }
      

    ]
  }
]);

export default router;
