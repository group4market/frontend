import { createBrowserRouter, Outlet } from "react-router-dom";
import { App } from "./pages/App";
import { Box } from "@chakra-ui/react";
import Navbar from "./components/Navbar";

const Layout = () => {
  return (
    <Box maxH={"100vh"} w={"full"} textAlign="center" fontSize="xl">
      <Navbar />
      <Box h={"93vh"} overflowY={"scroll"}>
        <Outlet />
      </Box>
    </Box>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
    ],
  },
]);

export default router;
