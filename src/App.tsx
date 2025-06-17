import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import Condiment from "./pages/Condiment";
import Ingredient from "./pages/Ingredient";
import Recipe from "./pages/Recipe";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "condiment",
        element: <Condiment />,
      },
      {
        path: "ingredient",
        element: <Ingredient />,
      },
      {
        path: "recipe",
        element: <Recipe />,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
