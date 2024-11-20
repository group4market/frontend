import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Icon,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";

import {
  Link,
  NavLink,
} from "react-router-dom";
import { Connect } from "./Connect";

export default function Navbar() {

  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Flex
        bg={"transparent"}
        color={useColorModeValue("white", "white")}
        borderBottomWidth={"0.01em"}
        borderBottomColor={"#1e1e1e"}
        minH={"7vh"}
        px={{ base: 4, md: "3%" }}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "center", md: "start" }}
          alignItems={"center"}
        >
          <Link to={"/"}>
            <Text fontSize={"0.8em"} fontWeight={"bold"}>
              4Market
            </Text>
          </Link>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>
        <Stack
          flex={{ base: 1 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
          alignItems={"center"}
        >
          <Connect />
        </Stack>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const activeStyle = {
  fontWeight: "bold",
  fontSize: "0.8em",
  color: "#dfdfdf",
};

const inactiveStyle = {
  fontSize: "0.8em",
  fontWeight: "bold",
  color: "#505050",
};

const DesktopNav = () => {
  return (
    <Stack direction={"row"} spacing={2}>
      {NAV_ITEMS.map((navItem) => (
        <Box
          key={navItem.label}
          alignSelf={"center"}
          _hover={{ bg: "#202020", transitionDuration: "0.3s" }}
          borderRadius={"6px"}
          px={3}
          py={1}
        >
          <NavLink
            to={navItem.href ?? "#"}
            style={({ isActive }: any) =>
              isActive ? activeStyle : inactiveStyle
            }
          >
            {navItem.label}
          </NavLink>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("none", "none")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={NavLink}
        to={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children && children.map((child) => <>{child.label}</>)}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Markets",
    href: "/",
  },
];