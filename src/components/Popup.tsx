import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Tabs,
  TabPanels,
  TabPanel,
  Box,
  HStack,
  Input,
  VStack,
  useToast,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Link,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import FourMarket from "../abi/FourMarket.json";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const tablist = ["Create Market", "Withdraw", "Borrow", "Repay"];

export const Popup = ({ isOpen, onClose }: { isOpen: any; onClose: any }) => {
  const toast = useToast();

  const [amount, setAmount] = useState<number>(0);

  const [question, setQuestion] = useState<string>("");

  const [info, setInfo] = useState<string>("");

  const [deadline, setDeadline] = useState<number>(Date.now());

  const [resolution, setResolution] = useState<number>(Date.now());

  const [resolver, setResolver] = useState<string>("");

  const { data: hash, isError, writeContract } = useWriteContract();

  useEffect(() => {
    if (hash) {
      toast({
        title: "Market Created",
        position: "top-right",
        description: (
          <Link href={"https://sepolia.etherscan.io/tx/" + hash} isExternal>
            View On Etherscan <ExternalLinkIcon mx="2px" />
          </Link>
        ),
        status: "success",
        duration: 8000,
        isClosable: true,
      });
    } else if (isError) {
      toast({
        title: "Error",
        position: "top-right",
        description: "Error creating market",
        status: "error",
        duration: 8000,
        isClosable: true,
      });
    }
  }, [hash]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent w={"full"} m={{ base: 2, md: 0 }}>
        <HStack w={"full"}>
          <Tabs h={"100%"} w={"full"} orientation={"vertical"}>
            <TabPanels w={"full"}>
              {tablist.map((tab: string) => (
                <TabPanel w={"full"} h={"100%"} key={tab}>
                  <ModalHeader>{tab}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody w={"full"}>
                    <VStack
                      h={"xs"}
                      w={"full"}
                      justifyContent={"space-between"}
                    >
                      <Input
                        type="text"
                        placeholder="Question"
                        onChange={(e: any) => setQuestion(e.target.value)}
                      />
                      <Textarea
                        placeholder="Additional market info..."
                        onChange={(e: any) => setInfo(e.target.value)}
                      />
                      <NumberInput
                        w={"full"}
                        onChange={(valueString) =>
                          setDeadline(parseInt(valueString))
                        }
                        value={deadline}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <NumberInput
                        w={"full"}
                        onChange={(valueString) =>
                          setResolution(parseInt(valueString))
                        }
                        value={resolution}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Input
                        type="text"
                        placeholder="Resolver Address"
                        onChange={(e: any) => setResolver(e.target.value)}
                      />
                      <Button
                        w={"full"}
                        onClick={() => {
                          writeContract({
                            address:
                              "0x1c6abaaf5b8a410ae89d30c84a0123173daabfa3",
                            abi: FourMarket,
                            functionName: "createMarket",
                            args: [
                              question,
                              info,
                              BigInt(deadline),
                              BigInt(resolution),
                              resolver,
                            ],
                            value: BigInt(0),
                          });
                        }}
                      >
                        {tab}
                      </Button>
                    </VStack>
                  </ModalBody>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
          <Box flex={"1"} />
        </HStack>
      </ModalContent>
    </Modal>
  );
};

export function formatNumber(num: number, precision = 2) {
  const map = [
    { suffix: "T", threshold: 1e12 },
    { suffix: "B", threshold: 1e9 },
    { suffix: "M", threshold: 1e6 },
    { suffix: "K", threshold: 1e3 },
    { suffix: "", threshold: 1 },
  ];

  const found = map.find((x) => Math.abs(num) >= x.threshold);
  if (found) {
    const formatted = (num / found.threshold).toFixed(precision) + found.suffix;
    return formatted;
  }

  return num.toFixed(precision);
}
