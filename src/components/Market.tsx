import { Button, Td, Tr } from "@chakra-ui/react";
import { formatNumber } from "./Popup";
import { useWriteContract } from "wagmi";
import MarketABI from "../abi/Market.json";

export const Market = ({ i, market, onOpen }: any) => {
  const border = i == length - 1 ? "0" : "1px";

  return (
    <Tr key={i} fontSize={"sm"}>
      <Td borderBottomWidth={border}>{market[3]}</Td>
      <Td borderBottomWidth={border} isNumeric>
        {formatNumber(Number(market[2]) / 1e18)}
      </Td>
      <Td borderBottomWidth={border}>
        {getInDaysHoursMinutesSeconds(Number(market[6]) * 1000)}
      </Td>
      <Td borderBottomWidth={border}>
      {getTimeUntil(new Date(Number(market[5]) * 1000))}
      </Td>
      <Td borderBottomWidth={border}>{market[8] == 0 ? "Open" : "Closed"}</Td>
      <Td borderBottomWidth={border}>
        <Button
          key={i}
          size={"sm"}
          onClick={() => {
            onOpen();
          }}
        >
          Bet
        </Button>
      </Td>
    </Tr>
  );
};

const getInDaysHoursMinutesSeconds = (timestamp : number) => {

  const days = Math.floor(timestamp / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timestamp % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timestamp % (1000 * 60)) / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;

}

const getTimeUntil = (date: Date) => {

  const now = new Date();
  
  const diff = date.getTime() - now.getTime();

  const diffAbs = Math.abs(diff);
  const daysAgo = Math.floor(diffAbs / (1000 * 60 * 60 * 24));
  const hoursAgo = Math.floor((diffAbs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesAgo = Math.floor((diffAbs % (1000 * 60 * 60)) / (1000 * 60));

  return `${daysAgo}d ${hoursAgo}h ${minutesAgo}m` + (diff < 0 ? " ago" : "");
};