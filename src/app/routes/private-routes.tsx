import SignIn from "@/pages/sign-in";
import { Navigate } from "react-router";

const privateRoutes = [
  {
    path: '/',
    element: <SignIn />,
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
];

export default privateRoutes