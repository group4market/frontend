import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
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
  Text,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import FourMarket from "../abi/FourMarket.json";
import Market from "../abi/Market.json";
import Token from "../abi/Token.json";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { parseEther } from "viem";

export const Popup = ({
  isOpen,
  onClose,
  type,
}: {
  isOpen: any;
  onClose: any;
  type: "create" | string;
}) => {
  const toast = useToast();

  const { data: hash, isError, error, writeContract } = useWriteContract();

  useEffect(() => {
    if (hash) {
      toast({
        title: "Tx Submitted",
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
        description: error.message,
        status: "error",
        duration: 8000,
        isClosable: true,
      });
    }
  }, [hash]);

  return (
    <Modal isOpen={isOpen} size={"xl"} onClose={onClose} isCentered>
      <ModalOverlay />
      {type === "create" ? (
        <CreatePopup writeContract={writeContract} />
      ) : (
        <BetPopup contract={type} writeContract={writeContract} />
      )}
    </Modal>
  );
};

const CreatePopup = ({ writeContract }: any) => {
  const [question, setQuestion] = useState<string>("");

  const [info, setInfo] = useState<string>("");

  const [deadline, setDeadline] = useState<number>(Date.now());

  const [resolution, setResolution] = useState<number>(24 * 60 * 60);

  const [resolver, setResolver] = useState<string>("");

  return (
    <ModalContent w={"full"} m={{ base: 2, md: 0 }}>
      <ModalHeader>Create Market</ModalHeader>
      <ModalCloseButton />
      <ModalBody w={"full"}>
        <VStack h={"xs"} w={"full"} justifyContent={"space-between"}>
          <Input
            type="text"
            placeholder="Question"
            onChange={(e: any) => setQuestion(e.target.value)}
          />
          <Textarea
            placeholder="Additional market info..."
            onChange={(e: any) => setInfo(e.target.value)}
          />
            <InputGroup>
            <InputLeftAddon>Deadline</InputLeftAddon>
            <Input
              placeholder="Select Date and Time"
              size="md"
              type="datetime-local"
              defaultValue={new Date().toISOString().slice(0, 16)}
              onChange={(e: any) =>
              setDeadline(new Date(e.target.value).getTime())
              }
            />
            </InputGroup>
          <InputGroup>
            <InputLeftAddon>Resolution</InputLeftAddon>
            <NumberInput
              onChange={(valueString) => setResolution(parseInt(valueString))}
              value={resolution}
              min={86400}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <InputRightAddon>
              <Text>
                ({Math.floor(resolution / (24 * 60 * 60))}D{" "}
                {Math.floor((resolution % (24 * 60 * 60)) / (60 * 60))}Hrs{" "}
                {Math.floor((resolution % (60 * 60)) / 60)}Mins{" "}
                {resolution % 60}s)
              </Text>
            </InputRightAddon>
          </InputGroup>

          <Input
            type="text"
            placeholder="Resolver Address"
            onChange={(e: any) => setResolver(e.target.value)}
          />
          <Button
            w={"full"}
            onClick={() => {
              writeContract({
                address: "0x1c6abaaf5b8a410ae89d30c84a0123173daabfa3",
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
            Create Market
          </Button>
        </VStack>
      </ModalBody>
      <Box flex={"1"} />
    </ModalContent>
  );
};

const BetPopup = ({ contract, writeContract }: any) => {
  const { address } = useAccount();

  const [amount, setAmount] = useState<number>(0);

  const { data }: any = useReadContract({
    address: contract,
    abi: Market,
    functionName: "getMarketDetails",
  });

  const yesBalance: any = useReadContract({
    address: data?.[11] || "",
    abi: Token,
    functionName: "balanceOf",
    args: [address],
  });

  const noBalance: any = useReadContract({
    address: data?.[12] || "",
    abi: Token,
    functionName: "balanceOf",
    args: [address],
  });

  const yesSupply: any = useReadContract({
    address: data?.[11] || "",
    abi: Token,
    functionName: "totalSupply",
  });

  const noSupply: any = useReadContract({
    address: data?.[12] || "",
    abi: Token,
    functionName: "totalSupply",
  });

  return (
    <ModalContent w={"full"} m={{ base: 2, md: 0 }}>
      <ModalHeader>Bet</ModalHeader>
      <ModalCloseButton />
      <ModalBody w={"full"}>
        <VStack w={"full"} justifyContent={"flex-start"} spacing={4}>
          <pre>
            {JSON.stringify(
              data,
              (key, value) =>
                typeof value === "bigint" ? Number(value) : value,
              2
            )}
          </pre>
          <HStack w={"full"} justifyContent={"space-between"}>
            <Text>Market Address</Text>
            <Link
              href={"https://sepolia.etherscan.io/address/" + contract}
              isExternal
            >
              {truncateAddress(contract)}
              <ExternalLinkIcon mx="2px" />
            </Link>
          </HStack>
          <HStack w={"full"} justifyContent={"space-between"}>
            <Text>My Yes Balance</Text>
            <Text>{Number(yesBalance?.data) / 1e18} YES</Text>
          </HStack>
          <HStack w={"full"} justifyContent={"space-between"}>
            <Text>My No Balance</Text>
            <Text>{Number(noBalance?.data) / 1e18} NO</Text>
          </HStack>

          <HStack w={"full"} justifyContent={"space-between"}>
            <Text>
              {Number(yesSupply?.data) / 1e18} YES (
              {(
                (Number(yesSupply?.data) /
                  1e18 /
                  (Number(noSupply?.data) / 1e18 +
                    Number(yesSupply?.data) / 1e18)) *
                100
              ).toFixed(2)}
              %){" "}
            </Text>
            <Text>/</Text>
            <Text>
              {Number(noSupply?.data) / 1e18} NO (
              {(
                (Number(noSupply?.data) /
                  1e18 /
                  (Number(noSupply?.data) / 1e18 +
                    Number(yesSupply?.data) / 1e18)) *
                100
              ).toFixed(2)}
              %)
            </Text>
          </HStack>
          <HStack w={"full"}>
            <Text>Amount</Text>
            <NumberInput
              w={"full"}
              precision={2}
              step={0.2}
              onChange={(valueString) => setAmount(parseFloat(valueString))}
              value={amount}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text>ETH</Text>
          </HStack>
          <HStack w={"full"} justifyContent={"space-between"}>
            {["Yes", "No"].map((option, i) => (
              <Button
                key={i}
                w={"full"}
                onClick={() => {
                  writeContract({
                    address: contract,
                    abi: Market,
                    functionName: "bet",
                    args: [i + 1],
                    value: parseEther(amount.toString()),
                  });
                }}
              >
                {option}
              </Button>
            ))}
          </HStack>
        </VStack>
      </ModalBody>
      <Box flex={"1"} />
    </ModalContent>
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

function truncateAddress(address: string) {
  return address.slice(0, 6) + "..." + address.slice(-6);
}
