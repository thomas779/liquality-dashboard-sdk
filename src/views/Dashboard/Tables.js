// Chakra imports
import {
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TablesProjectRow from "components/Tables/TablesProjectRow";
import TablesTableRow from "components/Tables/TablesTableRow";
import React, { useState, useEffect } from "react";
import { tablesProjectData, tablesTableData } from "variables/general";

import { ERC20Service } from "@liquality/wallet-sdk";
import { TransactionService } from "@liquality/wallet-sdk";
import { setupSDK } from "../../setupSDK";

// Local Storage
if (!window.ethereum) {
  var chainId = JSON.parse(localStorage.getItem("loginResponse")).chainId;
}

const chainIdSelected = () => {
  if (localStorage.getItem("loginResponse")) {
    if (chainId == 5) {
      chainId = 1;
    }
    switch (chainId) {
      case 5:
        return "Goerli Network";
      case 1:
        return "Ethereum Network";
      case _:
        return "Wallet not Connected";
    }
  }
};

function Tables() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [showZeroBalances, setShowZeroBalances] = useState(false);
  const [accountBalance, setAccountBalances] = useState([]);
  const [shouldFetchData, setShouldFetchData] = useState(true);

  const fetchCoingeckoPrice = async (contractAddress) => {
    // console.log(contractAddress);
    const liveUrl = `https://api.coingecko.com/api/v3/coins/${chainId}/contract/${contractAddress}`;
    const res = await fetch(liveUrl);
    const data = await res.json();

    const price = data["market_data"]["current_price"]["usd"];
    const logo = data["image"]["small"];
    // console.log(price, logo, "PRICE AND METADATA IN API fetch");
    return { price, logo };
  };

  const addPricingData = async (listAccountTokens) => {
    // const updatedAccountBalance = [...accountBalance];

    for (const token of listAccountTokens) {
      // if (token.formattedBalance === "0.00") {
      //   continue; // skip tokens with zero balance
      // }

      try {
        const priceData = await fetchCoingeckoPrice(token.tokenContractAddress);
        token.price = priceData.price;
        token.logo = priceData.logo;
        token.balance = (token.price * token.formattedBalance).toFixed(2);
      } catch (error) {
        console.error(
          `Error fetching price data for token ${token.tokenName}: ${error.message}`
        );
      }
      // console.log(updatedAccountBalance, "updatedaccountbalance");
    }
    return listAccountTokens;
  };

  const fetchAccountBalance = async (address, chainId) => {
    const listAccountTokens = await ERC20Service.listAccountTokens(
      address,
      chainId
    );
    // console.log("ACC TOKENS IN FETCH");
    // console.log(JSON.stringify(listAccountTokens));
    // console.log(JSON.stringify(listAccountTokens[0].price));
    return await addPricingData(listAccountTokens);
  };

  useEffect(() => {
    if (localStorage.getItem("loginResponse")) {
      var connectedAccount = JSON.parse(localStorage.getItem("loginResponse"));

      async function fetchData() {
        const updatedList = await fetchAccountBalance(
          connectedAccount.address,
          connectedAccount.chainId
        );
        setAccountBalances(await updatedList);
      }
      fetchData();
    }
  }, [accountBalance]);

  setupSDK();

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            {chainIdSelected()}
          </Text>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ marginRight: "4px" }}>
              <input
                type="checkbox"
                checked={showZeroBalances}
                onChange={(event) => setShowZeroBalances(event.target.checked)}
              />
            </label>
            <button onClick={() => setShowZeroBalances(!showZeroBalances)}>
              {showZeroBalances ? "Hide Zero Balances" : "Show Zero Balances"}
            </button>
          </div>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th pl="0px" borderColor={borderColor} color="gray.400">
                  Token
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Amount
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Price
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Balance
                </Th>
                <Th borderColor={borderColor}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {/* {tablesTableData.map((row, index, arr) => {
                return (
                  <TablesTableRow
                    name={row.name}
                    logo={row.logo}
                    // email={row.email}
                    // subdomain={row.subdomain}
                    domain={row.domain}
                    status={row.status}
                    date={row.date}
                    isLast={index === arr.length - 1 ? true : false}
                    key={index}
                  />
                );
              })} */}
              {accountBalance
                .sort((a, b) => b.formattedBalance - a.formattedBalance)
                .map((row, index, arr) => {
                  if (!showZeroBalances && row.formattedBalance === "0.00") {
                    return null; // skip rendering rows with balance of 0.00 if showZeroBalances is false
                  }
                  return (
                    <TablesTableRow
                      key={index}
                      logo={row.logo}
                      name={row.tokenName}
                      email={row.tokenSymbol}
                      domain={row.formattedBalance}
                      status={row.price}
                      date={'$' + row.balance}
                    />
                  );
                })}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Flex>
  );
}

export default Tables;
