import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, DarkMode, Flex, Spinner } from "@chakra-ui/react";
import theme from "./theme.tsx";
import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import "@rainbow-me/rainbowkit/styles.css";
import { darkTheme, getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const FullSpinner = () => (
  <Flex w={"100vw"} h={"100vh"} justifyContent={"center"} alignItems={"center"}>
    <Spinner />
  </Flex>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={ darkTheme()}
        >
          <ChakraProvider theme={theme}>
            <DarkMode>
              <RouterProvider
                router={router}
                fallbackElement={<FullSpinner />}
              />
            </DarkMode>
          </ChakraProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
