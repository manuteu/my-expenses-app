import AppLayout from "@/pages/_layout/app";
import CardsPage from "@/pages/cards";
import CategoriesPage from "@/pages/categories";
import DashboardPage from "@/pages/dashboard";
import ExpensesPage from "@/pages/expenses";
import ImportCsvPage from "@/pages/import";
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
        path: '/expenses',
        element: <ExpensesPage />,
      },
      {
        path: '/cards',
        element: <CardsPage />,
      },
      {
        path: '/methods',
        element: <MethodsPage />,
      },
      {
        path: '/categories',
        element: <CategoriesPage />,
      },
      {
        path: '/import',
        element: <ImportCsvPage />,
      },
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
];

export default privateRoutes