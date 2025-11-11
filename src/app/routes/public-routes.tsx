import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";

const publicRoutes = [
  {
    path: '/',
    element: <SignUp />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
];

export default publicRoutes