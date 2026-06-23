import './App.css'
import {createBrowserRouter} from "react-router";
import {RouterProvider} from "react-router/dom";
import {Login} from "./pages/Login";
import {Root} from "./components/Root.tsx";

const router = createBrowserRouter([
    {
        path: "/login",
        Component: Login,
    },
    {
        path: "/",
        Component: Root,
        children: [

        ]
    }
]);

function App() {
  return (
      <RouterProvider router={router} />
  )
}

export default App
