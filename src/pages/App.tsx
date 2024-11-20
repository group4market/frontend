import { useEffect, useState } from "react";
import {
  VStack,
  Heading,
  Container,
  Stack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Skeleton,
  useDisclosure,
  Divider,
  HStack,
} from "@chakra-ui/react";
import { useAccount, useReadContract } from "wagmi";
import { Market } from "@/components/Market";
import { Popup } from "@/components/Popup";
import { useLoaderData } from "react-router-dom";

export const App = () => {
  const data: any = useLoaderData();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [popup, setPopup] = useState("create");

  return (
    <Container
      maxW={"container.xl"}
      py={5}
      textAlign={"start"}
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
    >
      <HStack py={10} w={"full"}>
        <Heading w={"100%"}>Markets</Heading>
        <Button variant={"ghost"} onClick={() => {
          setPopup("create");
          onOpen();
        }}>
          Create Market
        </Button>
      </HStack>

      <Stack
        w={"full"}
        justifyContent={"center"}
        alignItems={"flex-start"}
        flexDir={{ base: "column", md: "row" }}
      >
        <VStack
          w={{ base: "100%" }}
          borderWidth={"0.05em"}
          bg={"#101010"}
          borderRadius={"lg"}
          h={"unset"}
        >
          {data ? (
            <TableContainer h={"auto"} w={"full"}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Question</Th>
                    <Th isNumeric>Balance</Th>
                    <Th>Resolution</Th>
                    <Th>Deadline</Th>
                    <Th>Status</Th>
                    <Th>Resolver</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((market: any, i: number) => (
                    <Market
                      key={i}
                      market={market}
                      onOpen={() => {
                        setPopup(market[market.length - 1]);
                        onOpen()
                      }}
                    />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Stack w={"100%"}>
              <Skeleton
                variant="rectangular"
                borderRadius={"md"}
                m={2}
                h={20}
              />
            </Stack>
          )}
        </VStack>
      </Stack>
      <Popup
        onClose={onClose}
        isOpen={isOpen}
        type={popup}
      />
    </Container>
  );
};
