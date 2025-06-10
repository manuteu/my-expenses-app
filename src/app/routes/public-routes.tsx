import SignIn from "@/pages/sign-in";
import { Navigate } from "react-router";

const publicRoutes = [
  {
    path: '/',
    element: <SignIn />,
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
];

export default publicRoutes