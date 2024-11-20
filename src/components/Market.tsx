import { Button, Td, Tr } from "@chakra-ui/react";
import { formatNumber } from "./Popup";

export const Market = ({ i, market, onOpen }: any) => {
  const border = i == length - 1 ? "0" : "1px";

  return (
    <Tr key={i} fontSize={"sm"}>
      <Td borderBottomWidth={border}>{market[3]}</Td>
      <Td borderBottomWidth={border} isNumeric>
        {formatNumber(Number(market[2]))}
      </Td>
      <Td borderBottomWidth={border}>
        {new Date(Number(market[6])).toLocaleDateString()}
      </Td>
      <Td borderBottomWidth={border}>
        {new Date(Number(market[5])).toLocaleDateString()}
      </Td>
      <Td borderBottomWidth={border}>{market[8] == 0 ? "Open" : "Closed"}</Td>
      <Td borderBottomWidth={border}>{market[7]}</Td>
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
