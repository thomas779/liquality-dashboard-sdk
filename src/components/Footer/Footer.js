/*eslint-disable*/
import { Flex, Link, List, ListItem, Text } from "@chakra-ui/react";
import React from "react";

export default function Footer(props) {
  return (
    <Flex
      flexDirection={{
        base: "column",
        xl: "row",
      }}
      alignItems={{
        base: "center",
        xl: "start",
      }}
      justifyContent='space-between'
      px='30px'
      pb='20px'>
      <Text
        color='gray.400'
        textAlign={{
          base: "center",
          xl: "start",
        }}
        mb={{ base: "20px", xl: "0px" }}>
        <Text as='span'>
          ETHDenver {" "}
        </Text>
        <Link
          color='blue.400'
          href='https://www.Liquality.io/'
          target='_blank'>
            Liquality.io {" "}
        </Link>
        Hackathon
      </Text>
    </Flex>
  );
}
