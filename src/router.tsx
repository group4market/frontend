import { createBrowserRouter, Outlet } from "react-router-dom";
import { App } from "./pages/App";
import { Box } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import { client } from "./client";
import FourMarket from "./abi/FourMarket.json";

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
        loader: async () => {
          const marketIndex = (await client.readContract({
            address: "0x1c6abaaf5b8a410ae89d30c84a0123173daabfa3",
            abi: FourMarket,
            functionName: "s_nextMarketId",
          })) as number;

          let markets = [];

          for (let i = Number(marketIndex) - 1; i >= 0; i--) {
            const market = await client.readContract({
              address: "0x1c6abaaf5b8a410ae89d30c84a0123173daabfa3",
              abi: FourMarket,
              functionName: "getDeployedMarket",
              args: [i],
            });

            markets.push(market);
          }
          return markets;
        },
      },
    ],
  },
]);

export default router;
