// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import BarChart from "components/Charts/BarChart";
import LineChart from "components/Charts/LineChart";
import IconBox from "components/Icons/IconBox";
// Custom icons
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  WalletIcon,
} from "components/Icons/Icons.js";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Variables
import {
  barChartData,
  barChartOptions,
  // lineChartData,
  lineChartOptions,
} from "variables/charts";
import { pageVisits, socialTraffic } from "variables/general";
import { ERC20Service, NftService } from "@liquality/wallet-sdk";
import { setupSDK } from "../../setupSDK";
import { set } from "lodash";

export default function Dashboard() {
  setupSDK();
  // Chakra Color Mode
  const iconBlue = useColorModeValue("blue.500", "blue.500");
  const iconBoxInside = useColorModeValue("white", "white");
  const textColor = useColorModeValue("gray.700", "white");
  const tableRowColor = useColorModeValue("#F7FAFC", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textTableColor = useColorModeValue("gray.500", "white");

  const { colorMode } = useColorMode();

  const [balance, setBalance] = useState(0);
  const [largestHolding, setLargestHolding] = useState(0);
  const [largestHoldingName, setLargestHoldingName] = useState("");
  const [numberOfTokens, setNumberOfTokens] = useState(0);
  const [nfts, setNfts] = useState([]);

  const [lineChartData, setLineChartData] = useState([]);

  const fetchNfts = async () => {
    const address = JSON.parse(localStorage.getItem("loginResponse")).address;
    const chainId = JSON.parse(localStorage.getItem("loginResponse")).chainId;

    const accountNfts = await NftService.getNfts(address, chainId);
    return accountNfts;
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

  const fetchCoingeckoPrice = async (contractAddress) => {
    // console.log(contractAddress);
    const chainId = JSON.parse(localStorage.getItem("loginResponse")).chainId;
    const liveUrl = `https://api.coingecko.com/api/v3/coins/${chainId}/contract/${contractAddress}`;
    const res = await fetch(liveUrl);
    const data = await res.json();

    const price = data["market_data"]["current_price"]["usd"];
    const id = data["id"];

    return { price, id };
  };

  const fetchHistoricalPrices = async (symbol) => {
    const url = `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=365`;

    const accountBalances = await fetchAccountBalance();

    try {
      const res = await fetch(url);
      const response = await res.json();
      const prices = response.prices.map((data) => {
        return { date: new Date(data[0]), price: data[1] };
      });

      const monthlyAverages = [];
      let currentMonth = null;
      let currentPrices = [];

      for (const price of prices) {
        const month = price.date.getMonth();

        if (currentMonth === null || month === currentMonth) {
          currentMonth = month;
          currentPrices.push(price.price);
        } else {
          const averagePrice =
            currentPrices.reduce((a, b) => a + b) / currentPrices.length;
          monthlyAverages.push(averagePrice.toFixed(2));

          currentMonth = month;
          currentPrices = [price.price];
        }
      }

      const averagePrice =
        currentPrices.reduce((a, b) => a + b) / currentPrices.length;
      monthlyAverages.push(averagePrice.toFixed(2));

      while (monthlyAverages.length < 12) {
        monthlyAverages.push(null);
      }

      return monthlyAverages;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const portfolioData = async () => {
      const balances = await fetchAccountBalance();

      let totalBalance = 0;
      let largestHolding = 0;
      let largestHoldingName = "";
      let prices = [];
      let numberOfTokens = 0;

      for (const balance of balances) {
        const data = await fetchCoingeckoPrice(balance.tokenContractAddress);
        const tokenSymbol = balance.tokenSymbol;

        totalBalance += data.price * balance.formattedBalance;

        if (data.price * balance.formattedBalance > largestHolding) {
          largestHolding = data.price * balance.formattedBalance;
          largestHoldingName = balance.tokenName;
        }

        if (balance.formattedBalance > 0) {
          let historicalPrices = await fetchHistoricalPrices(data.id);
          const pricesWithBalance = historicalPrices.map((price) =>
            (price * Number(balance.formattedBalance)).toFixed(2)
          );
          prices.push({ name: tokenSymbol, data: pricesWithBalance });
          numberOfTokens++;
        }
      }
      const accountNfts = await fetchNfts();

      setNfts(accountNfts.length);
      setLineChartData(prices);
      setNumberOfTokens(numberOfTokens);
      setLargestHolding(largestHolding);
      setLargestHoldingName(largestHoldingName);
      setBalance(totalBalance);
    };

    portfolioData();
  }, []);
  //hej
  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing="24px" mb="20px">
        <Card minH="125px">
          <Flex direction="column">
            <Flex
              flexDirection="row"
              align="center"
              justify="center"
              w="100%"
              mb="25px"
            >
              <Stat me="auto">
                <StatLabel
                  fontSize="xs"
                  color="gray.400"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Total Balance
                </StatLabel>
                <Flex>
                  <StatNumber fontSize="lg" color={textColor} fontWeight="bold">
                    ${balance.toFixed(2)}
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox
                borderRadius="50%"
                as="box"
                h={"45px"}
                w={"45px"}
                bg={iconBlue}
              >
                <WalletIcon h={"24px"} w={"24px"} color={iconBoxInside} />
              </IconBox>
            </Flex>
            <Text color="gray.400" fontSize="sm">
              Total portfolio balance
            </Text>
          </Flex>
        </Card>
        <Card minH="125px">
          <Flex direction="column">
            <Flex
              flexDirection="row"
              align="center"
              justify="center"
              w="100%"
              mb="25px"
            >
              <Stat me="auto">
                <StatLabel
                  fontSize="xs"
                  color="gray.400"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Biggest Bag
                </StatLabel>
                <Flex>
                  <StatNumber fontSize="lg" color={textColor} fontWeight="bold">
                    ${largestHolding.toFixed(2)}
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox
                borderRadius="50%"
                as="box"
                h={"45px"}
                w={"45px"}
                bg={iconBlue}
              >
                <GlobeIcon h={"24px"} w={"24px"} color={iconBoxInside} />
              </IconBox>
            </Flex>
            <Text color="gray.400" fontSize="sm">
              <Text as="span" color="green.400" fontWeight="bold">
                {largestHoldingName}{" "}
              </Text>
              is your largest bag
            </Text>
          </Flex>
        </Card>
        <Card minH="125px">
          <Flex direction="column">
            <Flex
              flexDirection="row"
              align="center"
              justify="center"
              w="100%"
              mb="25px"
            >
              <Stat me="auto">
                <StatLabel
                  fontSize="xs"
                  color="gray.400"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Number Of Tokens
                </StatLabel>
                <Flex>
                  <StatNumber fontSize="lg" color={textColor} fontWeight="bold">
                    {numberOfTokens}
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox
                borderRadius="50%"
                as="box"
                h={"45px"}
                w={"45px"}
                bg={iconBlue}
              >
                <DocumentIcon h={"24px"} w={"24px"} color={iconBoxInside} />
              </IconBox>
            </Flex>
            <Text color="gray.400" fontSize="sm">
              ERC-20 tokens
            </Text>
          </Flex>
        </Card>
        <Card minH="125px">
          <Flex direction="column">
            <Flex
              flexDirection="row"
              align="center"
              justify="center"
              w="100%"
              mb="25px"
            >
              <Stat me="auto">
                <StatLabel
                  fontSize="xs"
                  color="gray.400"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Number of NFTs
                </StatLabel>
                <Flex>
                  <StatNumber fontSize="lg" color={textColor} fontWeight="bold">
                    {nfts}
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox
                borderRadius="50%"
                as="box"
                h={"45px"}
                w={"45px"}
                bg={iconBlue}
              >
                <CartIcon h={"24px"} w={"24px"} color={iconBoxInside} />
              </IconBox>
            </Flex>
            <Text color="gray.400" fontSize="sm">
              ERC-721 tokens
            </Text>
          </Flex>
        </Card>
      </SimpleGrid>
      <Grid
        templateColumns={{ sm: "1fr", lg: "2fr 1fr" }}
        templateRows={{ lg: "repeat(2, auto)" }}
        gap="20px"
      >
        <Card
          bg={
            colorMode === "dark"
              ? "navy.800"
              : "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
          }
          p="0px"
          maxW={{ sm: "320px", md: "100%" }}
        >
          <Flex direction="column" mb="40px" p="28px 0px 0px 22px">
            <Text color="#fff" fontSize="lg" fontWeight="bold" mb="6px">
              Account Balance
            </Text>
            <Text color="#fff" fontSize="sm">
              Portfolio account balance for the past year
            </Text>
          </Flex>
          <Box minH="300px">
            <LineChart
              chartData={lineChartData}
              chartOptions={lineChartOptions}
            />
          </Box>
        </Card>
        {/* <Card p="0px" maxW={{ sm: "320px", md: "100%" }}>
          <Flex direction="column">
            <Flex align="center" justify="space-between" p="22px">
              <Text fontSize="lg" color={textColor} fontWeight="bold">
                Portfolio Composition
              </Text>
              <Link to="/tables">
                <Button variant="primary" maxH="30px">
                  VIEW MORE
                </Button>
              </Link>
            </Flex>
          </Flex>
          <Box overflow={{ sm: "scroll", lg: "hidden" }}>
            <Table>
              <Thead>
                <Tr bg={tableRowColor}>
                  <Th color="gray.400" borderColor={borderColor}>
                    Token
                  </Th>
                  <Th color="gray.400" borderColor={borderColor}>
                    Amount
                  </Th>
                  <Th color="gray.400" borderColor={borderColor}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {socialTraffic.map((el, index, arr) => {
                  return (
                    <Tr key={index}>
                      <Td
                        color={textTableColor}
                        fontSize="sm"
                        fontWeight="bold"
                        borderColor={borderColor}
                        border={index === arr.length - 1 ? "none" : null}
                      >
                        {el.referral}
                      </Td>
                      <Td
                        color={textTableColor}
                        fontSize="sm"
                        borderColor={borderColor}
                        border={index === arr.length - 1 ? "none" : null}
                      >
                        {el.visitors}
                      </Td>
                      <Td
                        color={textTableColor}
                        fontSize="sm"
                        borderColor={borderColor}
                        border={index === arr.length - 1 ? "none" : null}
                      >
                        <Flex align="center">
                          <Text
                            color={textTableColor}
                            fontWeight="bold"
                            fontSize="sm"
                            me="12px"
                          >{`${el.percentage}%`}</Text>
                          <Progress
                            size="xs"
                            colorScheme={el.color}
                            value={el.percentage}
                            minW="120px"
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </Card> */}
      </Grid>
    </Flex>
  );
}
