import AppLayout from "@/pages/_layout/app";
import CardsPage from "@/pages/cards";
import DashboardPage from "@/pages/dashboard";
import MethodsPage from "@/pages/methods";
import { Navigate } from "react-router";

const privateRoutes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
      {
        path: '/cards',
        element: <CardsPage />,
      },
      {
        path: '/methods',
        element: <MethodsPage />,
      },
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
];

export default privateRoutes