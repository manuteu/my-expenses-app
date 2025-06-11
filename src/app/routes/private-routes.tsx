import AppLayout from "@/pages/_layout/app";
import CardsPage from "@/pages/cards";
import DashboardPage from "@/pages/dashboard";
import { Navigate } from "react-router";

const privateRoutes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/cards',
        element: <CardsPage />,
      },
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
];

export default privateRoutes