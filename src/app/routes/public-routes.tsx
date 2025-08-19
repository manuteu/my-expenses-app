import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import { Navigate } from "react-router";

const publicRoutes = [
  {
    path: '/',
    element: <SignUp />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  // {
  //   path: '*',
  //   element: <Navigate to="/" />,
  // },
];

export default publicRoutes