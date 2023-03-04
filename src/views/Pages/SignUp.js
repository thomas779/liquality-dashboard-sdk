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
import { SwapService, ERC20Service } from "@liquality/wallet-sdk";
import { setupSDK } from "../../setupSDK";
import { JsonRpcSigner } from "@ethersproject/providers";
import { ethers } from "ethers";
import erc20ABI from "./erc20ABI.json";

function SignUp() {
  setupSDK();
  const bgForm = useColorModeValue("white", "navy.800");
  const titleColor = useColorModeValue("gray.700", "blue.500");
  const textColor = useColorModeValue("gray.700", "white");

  const [fromChain, setFromChain] = useState(1);
  const [toChain, setToChain] = useState(137);
  const [amount, setAmount] = useState("");
  const [fromToken, setFromToken] = useState([]);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState("");
  const [toToken, setToToken] = useState(
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
  );
  const [
    receiveWithDifferentAddress,
    setReceiveWithDifferentAddress,
  ] = useState(false);
  const [receiveAddress, setReceiveAddress] = useState("");
  const [quote, setQuote] = useState(null);

  const rpcUrls = {
    1: "https://mainnet.infura.io/v3/30d6fb21c68f44f8aed1dbeb583a1b0c",
    137: "https://rpc-mainnet.maticvigil.com/",
    43114: "https://api.avax.network/ext/bc/C/rpc",
    42161: "https://arb1.arbitrum.io/rpc",
  };

  const getRPC = (chainId) => {
    return rpcUrls[chainId] || null;
  };

  const fetchAccountBalance = async () => {
    const address = JSON.parse(localStorage.getItem("loginResponse")).address;
    const chainId = JSON.parse(localStorage.getItem("loginResponse")).chainId;

    const listAccountTokens = await ERC20Service.listAccountTokens(
      address,
      chainId
    );
    return listAccountTokens;
  };

  useEffect(() => {
    const fetchTokens = async () => {
      const listAccountTokens = await fetchAccountBalance();
      const tokenObjects = listAccountTokens.map((token) => ({
        tokenSymbol: token.tokenSymbol,
        tokenContractAddress: token.tokenContractAddress,
      }));
      setFromToken(tokenObjects);
    };
    fetchTokens();
  }, []);

  useEffect(() => {
    console.log(amount, toChain, fromChain, "CONDITIONAL RENDER CALLED");
    async function updateQuote() {
      const quoteRequest = {
        srcChainId: fromChain,
        srcChainTokenIn: selectedTokenAddress,
        srcChainTokenInAmount: amount,
        dstChainId: toChain,
        dstChainTokenOut: toToken,
      };
      try {
        const newQuote = await SwapService.getQuote(quoteRequest);
        setQuote(newQuote);
      } catch (error) {
        console.error("catch error", error);
        return setQuote(null);
      }
    }
    updateQuote();
  }, [amount > 0 && amount, toChain, fromChain, selectedTokenAddress, toToken]);

  async function fetchTokenDecimals(token, chainId) {
    const provider = new ethers.providers.JsonRpcProvider(getRPC(chainId));
    const contract = new ethers.Contract(
      token,
      ["function decimals() view returns (uint8)"],
      provider
    );

    const decimals = await contract.decimals();

    return Number(decimals);
  }

  const handleSwapButtonClick = async () => {
    const swapRequest = {
      srcChainId: fromChain,
      srcChainTokenIn: selectedTokenAddress,
      srcChainTokenInAmount: amount,
      dstChainId: toChain,
      dstChainTokenOut: toToken,
      dstChainTokenOutRecipient: receiveAddress,
    };

    if (localStorage.getItem("loginResponse")) {
      try {
        const connectedAccount = JSON.parse(
          localStorage.getItem("loginResponse")
        ).address;
        const chainId = JSON.parse(localStorage.getItem("loginResponse"))
          .chainId;
        const provider = new ethers.providers.JsonRpcProvider(getRPC(chainId));
        const signer = provider.getSigner(connectedAccount);
        console.log(swapRequest, provider, signer, "ACCOUNT AND WEB3 AUTH");

        const tokenContract = new ethers.Contract(
          selectedTokenAddress,
          erc20ABI,
          signer
        );

        const amountToApprove = ethers.utils.parseUnits(
          amount,
          await fetchTokenDecimals(selectedTokenAddress, chainId)
        );

        const tx = await tokenContract.approve(
          "0x663dc15d3c1ac63ff12e45ab68fea3f0a883c251",
          amountToApprove
        );

        await tx.wait();

        const result = await SwapService.swap(swapRequest, signer);
        console.log("Swap result:", result);
      } catch (error) {
        console.error("Error swapping:", error);
      }
    } else {
      console.error("Wallet not Connected:", error);
    }
  };

  const handleChainSelectSrc = (event) => {
    setFromChain(event.target.value);
  };

  const handleChainSelectDst = (event) => {
    setToChain(event.target.value);
  };

  const handleFromToken = (e) => {
    const selectedToken = fromToken.find(
      (token) => token.tokenSymbol === e.target.value
    );
    setSelectedTokenAddress(selectedToken.tokenContractAddress);
  };

  const handleToToken = (e) => {
    setToToken(e.target.value);
  };

  const handleAmountIn = async (e) => {
    e.persist();

    setTimeout(() => {
      const inputValue = e.target.value;
      if (inputValue.length > 0) {
        setAmount(e.target.value);
      }
    }, 1000);
  };

  const toggleAddressIn = (e) => {
    setReceiveWithDifferentAddress(e.target.checked);
  };

  const handleAddressIn = (e) => {
    setReceiveAddress(e.target.value);
  };

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
            <Select
              id="from-token-input"
              fontSize="sm"
              ms="4px"
              placeholder="Select Token"
              mb="24px"
              size="lg"
              //   value={selectedToken}
              onChange={handleFromToken}
            >
              {fromToken.map((token) => (
                <option key={token.tokenSymbol}>{token.tokenSymbol}</option>
              ))}
            </Select>
            <Input
              id="amount-input"
              //   value={amount}
              onChange={handleAmountIn}
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
              fontSize="sm"
              ms="4px"
              type="text"
              placeholder="Token Contract Address"
              mb="24px"
              size="lg"
            />
            {quote && (
              <Input
                disabled
                id="amount-output"
                value={"" + Number(quote.amount).toFixed(2)}
                variant="auth"
                fontSize="sm"
                ms="4px"
                type="currency"
                placeholder="Estimated Amount Received"
                mb="24px"
                size="lg"
              />
            )}
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
