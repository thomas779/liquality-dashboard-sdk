// Chakra Icons
import { BellIcon } from "@chakra-ui/icons";
// Chakra Imports
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import avatar1 from "assets/img/avatars/avatar1.png";
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";
// Custom Icons
import {
  LiqualityLogoDark,
  LiqualityLogoLight,
  // ChakraLogoDark,
  // ChakraLogoLight,
  ProfileIcon,
  SettingsIcon,
} from "components/Icons/Icons";
// Custom Components
import { ItemContent } from "components/Menu/ItemContent";
import { SearchBar } from "components/Navbars/SearchBar/SearchBar";
import { SidebarResponsive } from "components/Sidebar/Sidebar";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import routes from "routes.js";
import Web3 from "web3";

export default function HeaderLinks(props) {
  const {
    variant,
    children,
    fixed,
    scrolled,
    secondary,
    onOpen,
    ...rest
  } = props;

  const { colorMode } = useColorMode();

  const [userAccountAddress, setUserAccountAddress] = useState("");
  const [connectedAddrValue, setConnectedAddrValue] = useState("");

  const handleConnectMetamask = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const network = await web3.eth.net.getNetworkType();
    await window.ethereum.enable();
    //Fetch account data:
    const accountFromMetaMask = await web3.eth.getAccounts();
    console.log(accountFromMetaMask, "account in app.js before set state");
    setUserAccountAddress(accountFromMetaMask);
    setConnectedAddrValue(
      String(accountFromMetaMask).substr(0, 5) +
        "..." +
        String(accountFromMetaMask).substr(38, 4)
    );
    // window.location.reload();
  };


  useEffect(() => {
    if (userAccountAddress) {
      // get the chain ID of the connected MetaMask wallet
      async function fetchData() {
        const hexChainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        const chainId = parseInt(hexChainId, 16);
        
        let loginResponse = {
          address: userAccountAddress[0],
          chainId: chainId,
        };

        localStorage.setItem("loginResponse", JSON.stringify(loginResponse));
      }
      fetchData();
    }
  }, [userAccountAddress]);

  // Chakra Color Mode
  let navbarIcon =
    fixed && scrolled
      ? useColorModeValue("gray.700", "gray.200")
      : useColorModeValue("white", "gray.200");
  let menuBg = useColorModeValue("white", "navy.800");
  if (secondary) {
    navbarIcon = "white";
  }
  return (
    <Flex
      pe={{ sm: "0px", md: "16px" }}
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
    >
      {/* <SearchBar me='18px' /> */}
      <Button
        onClick={handleConnectMetamask}
        ms="0px"
        px="0px"
        me={{ sm: "2px", md: "16px" }}
        color={navbarIcon}
        variant="no-effects"
        rightIcon={
          document.documentElement.dir ? (
            ""
          ) : (
            <SettingsIcon color={navbarIcon} w="22px" h="22px" me="0px" />
          )
        }
        leftIcon={
          document.documentElement.dir ? (
            <SettingsIcon color={navbarIcon} w="22px" h="22px" me="0px" />
          ) : (
            ""
          )
        }
      >
        <Text display={{ sm: "none", md: "flex" }}>
          {connectedAddrValue ? connectedAddrValue : "Connect Wallet"}
        </Text>
      </Button>
      <SidebarResponsive
        hamburgerColor={"white"}
        logo={
          <Stack align="center" justify="center">
            {colorMode === "dark" ? (
              <LiqualityLogoLight w='100px' h='30px' />
            ) : (
              <LiqualityLogoDark w='100px' h='30px' />
            )}
            {/* <Box
              w="1px"
              h="20px"
              bg={colorMode === "dark" ? "white" : "gray.700"}
            /> */}
            {/* {colorMode === "dark" ? (
              <ChakraLogoLight w="82px" h="21px" />
            ) : (
              <ChakraLogoDark w="82px" h="21px" />
            )} */}
          </Stack>
        }
        colorMode={colorMode}
        secondary={props.secondary}
        routes={routes}
        {...rest}
      />
      {/* <SettingsIcon
        cursor='pointer'
        ms={{ base: "16px", xl: "0px" }}
        me='16px'
        onClick={props.onOpen}
        color={navbarIcon}
        w='18px'
        h='18px'
      />
      <Menu>
        <MenuButton>
          <BellIcon color={navbarIcon} w='18px' h='18px' />
        </MenuButton>
        <MenuList p='16px 8px' bg={menuBg}>
          <Flex flexDirection='column'>
            <MenuItem borderRadius='8px' mb='10px'>
              <ItemContent
                time='13 minutes ago'
                info='from Alicia'
                boldInfo='New Message'
                aName='Alicia'
                aSrc={avatar1}
              />
            </MenuItem>
            <MenuItem borderRadius='8px' mb='10px'>
              <ItemContent
                time='2 days ago'
                info='by Josh Henry'
                boldInfo='New Album'
                aName='Josh Henry'
                aSrc={avatar2}
              />
            </MenuItem>
            <MenuItem borderRadius='8px'>
              <ItemContent
                time='3 days ago'
                info='Payment succesfully completed!'
                boldInfo=''
                aName='Kara'
                aSrc={avatar3}
              />
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu> */}
    </Flex>
  );
}
