import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import Condiment from "./pages/Condiment";
import Ingredient from "./pages/Ingredient";
import Recipe from "./pages/Recipe";
import RecipeDetail from "./pages/RecipeDetail";
import GlobalStyle from "./styles/GlobalStyles";

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
      {
        path: "recipe-detail",
        element: <RecipeDetail />,
      },
    ],
  },
]);
function App() {
  return (
    <>
      <GlobalStyle />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
