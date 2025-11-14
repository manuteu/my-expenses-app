import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import { Navigate } from "react-router";

const publicRoutes = [
  {
    path: '/',
    element: <SignIn />,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
];

export default publicRoutes