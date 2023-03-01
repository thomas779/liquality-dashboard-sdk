// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
  LightMode,
  Select,
} from "@chakra-ui/react";
// Assets
import BgSignUp from "assets/img/BgSignUp.png";
import React, { useState, useEffect } from "react";
// import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { SwapService } from "@liquality/wallet-sdk";
import { setupSDK } from "../../setupSDK";
import Web3 from "web3";

const handleSwap = async () => {
    const swapRequest = {
        srcChainId: 1,
        srcChainTokenIn: "ETH",
        srcChainTokenInAmount: "1.0",
        dstChainId: 2,
        dstChainTokenOut: "DAI",
        dstChainTokenOutRecipient: "0x1234567890abcdef1234567890abcdef12345678",
      };

  try {
    if (localStorage.getItem("loginResponse")) {
      var connectedAccount = JSON.parse(localStorage.getItem("loginResponse"));
      const address = connectedAccount.address;
      const privateKey = web3.eth.getPrivateKey(address);
    }

    console.log(web3, accounts, address, privateKey, "heyysa");

    const sdk = new SDK();
    const result = await sdk.swap(swapRequest, privateKey);
    console.log("Swap result:", result);
  } catch (error) {
    console.error("Error swapping:", error);
  }
};

// handleSwap();

function SignUp() {
  const bgForm = useColorModeValue("white", "navy.800");
  const titleColor = useColorModeValue("gray.700", "blue.500");
  const textColor = useColorModeValue("gray.700", "white");

  const [fromChain, setFromChain] = useState('"Select Origin Chain"');
  const [toChain, setToChain] = useState('"Select Destination Chain"');
  const [amount, setAmount] = useState("");
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [
    receiveWithDifferentAddress,
    setReceiveWithDifferentAddress,
  ] = useState(false);
  const [receiveAddress, setReceiveAddress] = useState("");

  const handleSwapButtonClick = () => {
    // handle swap button click
    // Call your swap SDK function here with the selected parameters
    const swapRequest = {
        srcChainId: fromChain,
        srcChainTokenIn: fromToken,
        srcChainTokenInAmount: amount,
        dstChainId: toChain,
        dstChainTokenOut: toToken,
        dstChainTokenOutRecipient: receiveAddress,
      };
  };

  const handleChainSelectSrc = (event) => {;
    setFromChain(event.target.value);
  };

  const handleChainSelectDst = (event) => {
    setToChain(event.target.value);
  };

  const handleFromToken = (e) => {
    setFromToken(e.target.value);
  };

  const handleToToken = (e) => {
    setToToken(e.target.value);
  };

  const handleAmountIn = (e) => {
    setAmount(e.target.value);
  };

  const toggleAddressIn = (e) => {
    setReceiveWithDifferentAddress(e.target.checked);
  };

  const handleAddressIn = (e) => {
    setReceiveAddress(e.target.value);
  };

  setupSDK();

  return (
    <Flex
      direction="column"
      alignSelf="center"
      justifySelf="center"
      overflow="hidden"
    >
      <Box
        position="absolute"
        minH={{ base: "70vh", md: "50vh" }}
        maxH={{ base: "70vh", md: "50vh" }}
        w={{ md: "calc(100vw - 50px)" }}
        maxW={{ md: "calc(100vw - 50px)" }}
        left="0"
        right="0"
        bgRepeat="no-repeat"
        overflow="hidden"
        zIndex="-1"
        top="0"
        bgImage={BgSignUp}
        bgSize="cover"
        mx={{ md: "auto" }}
        mt={{ md: "14px" }}
        borderRadius={{ base: "0px", md: "20px" }}
      >
        <Box w="100vw" h="100vh" bg="blue.500" opacity="0.8"></Box>
      </Box>
      <Flex
        direction="column"
        textAlign="center"
        justifyContent="center"
        align="center"
        mt="100px"
        mb="20px"
      >
        <Text fontSize="4xl" color="white" fontWeight="bold">
          LiqSwap
        </Text>
        <Text
          fontSize="md"
          color="white"
          fontWeight="normal"
          mt="10px"
          mb="26px"
          w={{ base: "90%", sm: "60%", lg: "40%", xl: "333px" }}
        >
          Swap any tokens across chains
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
        <Flex
          direction="column"
          w="445px"
          background="transparent"
          borderRadius="15px"
          p="40px"
          mx={{ base: "100px" }}
          bg={bgForm}
          boxShadow={useColorModeValue(
            "0px 5px 14px rgba(0, 0, 0, 0.05)",
            "unset"
          )}
        >
          {/* <HStack spacing="15px" justify="center" mb="22px">
          </HStack> */}
          <FormControl>
            <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
              From
            </FormLabel>
            <Select
              id="from-chain-select"
              variant="auth"
              fontSize="sm"
              ms="4px"
              placeholder="Select Origin Chain"
              mb="24px"
              size="lg"
              value={fromChain}
              onChange={handleChainSelectSrc}
            >
              <option value={1}>Ethereum</option>
              <option value={137}>Polygon</option>
              <option value={43114}>Avalanche</option>
              <option value={42161}>Arbitrum</option>
            </Select>
            <Input
              id="from-token-input"
              value={fromToken}
              onChange={handleFromToken}
              variant="auth"
              fontSize="sm"
              ms="4px"
              type="text"
              placeholder="Token Address"
              mb="24px"
              size="lg"
            />
            <Input
              id="amount-input"
              value={amount}
              onChange={handleAmountIn}
              variant="auth"
              fontSize="sm"
              ms="4px"
              type="number"
              placeholder="Amount"
              mb="24px"
              size="lg"
            />
            <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
              To
            </FormLabel>
            <Select
              id="to-chain-select"
              variant="auth"
              fontSize="sm"
              ms="4px"
              placeholder="Select Destination Chain"
              mb="24px"
              size="lg"
              value={toChain}
              onChange={handleChainSelectDst}
            >
              <option value={1}>Ethereum</option>
              <option value={137}>Polygon</option>
              <option value={43114}>Avalanche</option>
              <option value={42161}>Arbitrum</option>
            </Select>
            <Input
              id="to-token-input"
              value={toToken}
              onChange={handleToToken}
              variant="auth"
              fontSize="sm"
              ms="4px"
              type="text"
              placeholder="Token Address"
              mb="24px"
              size="lg"
            />
            <FormControl display="flex" alignItems="center" mb="24px">
              <Switch
                type="checkbox"
                id="receive-with-different-address-checkbox"
                checked={receiveWithDifferentAddress}
                onChange={toggleAddressIn}
                colorScheme="blue"
                me="10px"
              />
              <FormLabel
                htmlFor="receive-with-different-address-checkbox"
                mb="0"
                fontWeight="normal"
              >
                Swap and Send to Another Address
              </FormLabel>
            </FormControl>
            {receiveWithDifferentAddress && (
              <Input
                id="receive-address-input"
                value={receiveAddress}
                onChange={handleAddressIn}
                variant="auth"
                fontSize="sm"
                ms="4px"
                type="text"
                placeholder="Recipient's Address"
                mb="24px"
                size="lg"
              />
            )}
            <Flex>
              {window.ethereum && window.ethereum.isConnected() ? (
                <Button
                  fontSize="10px"
                  variant="dark"
                  fontWeight="bold"
                  w="100%"
                  h="45"
                  mb="24px"
                  onClick={handleSwapButtonClick}
                >
                  SWAP
                </Button>
              ) : (
                <p>Connect Wallet</p>
              )}
            </Flex>
          </FormControl>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            maxW="100%"
            mt="0px"
          >
            {/* <Text color={textColor} fontWeight="medium">
              Already have an account?
              <Link
                color={titleColor}
                as="span"
                ms="5px"
                href="#"
                fontWeight="bold"
              >
                Sign In
              </Link>
            </Text> */}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SignUp;
