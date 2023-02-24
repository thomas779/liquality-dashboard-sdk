// // Chakra imports
// import {
//   Box,
//   Button,
//   Flex,
//   HStack,
//   Link, Stack, Text, useColorMode, useColorModeValue
// } from "@chakra-ui/react";
// import {
//   liqualityLogoDark,
//   liqualityLogoLight,
//   ChakraLogoBlue, ChakraLogoDark,
//   ChakraLogoLight, DocumentIcon,
//   HomeIcon,
//   PersonIcon,
//   RocketIcon
// } from "components/Icons/Icons";
// import { SidebarResponsive } from "components/Sidebar/Sidebar";
// import React from "react";
// import { NavLink } from "react-router-dom";
// import routes from "routes.js";
// import { Web3Provider } from "@ethersproject/providers";
// import Web3 from "web3";
// export default function AuthNavbar(props) {
//   const { logo, logoText, secondary, ...rest } = props;
//   const { colorMode } = useColorMode();
//   const [userAccountAddress, setUserAccountAddress] = React.useState("");
//   const [connectedAddrValue, setConnectedAddrValue] = React.useState("");


//   const handleConnectMetamask = async () => {
//     const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
//     const network = await web3.eth.net.getNetworkType();
//     await window.ethereum.enable();
//     //Fetch account data:
//     const accountFromMetaMask = await web3.eth.getAccounts();
//     console.log(accountFromMetaMask, "account in app.js before set state");
//     setUserAccountAddress(accountFromMetaMask);
//     setConnectedAddrValue(
//       String(accountFromMetaMask).substr(0, 5) +
//         "..." +
//         String(accountFromMetaMask).substr(38, 4)
//     );

//     console.log(userAccountAddress, "user metamask address after set state");
//   };

//   // Chakra color mode
//   let mainText = "white";
//   let navbarIcon = "white";
//   let navbarBg = "none";
//   let navbarBorder = "none";
//   let navbarShadow = "initial";
//   let navbarFilter = "initial";
//   let navbarBackdrop = "none";
//   let bgButton = useColorModeValue("white", "navy.900");
//   let colorButton = useColorModeValue("gray.700", "white");
//   let navbarPosition = "absolute";
//   let hamburgerColor = {
//     base: useColorModeValue("gray.700", "white"),
//     md: "white",
//   };
//   let brand = (
//     <Link
//       href={`${process.env.PUBLIC_URL}/#/`}
//       target="_blank"
//       display="flex"
//       lineHeight="100%"
//       fontWeight="bold"
//       justifyContent="center"
//       alignItems="center"
//       color={mainText}
//     >
//       <Stack direction="row" spacing="12px" align="center" justify="center">
//         <liqualityLogoLight w="74px" h="27px" />
//         <Box w="1px" h="20px" bg={"white"} />
//         <ChakraLogoBlue w="82px" h="21px" />
//       </Stack>
//       <Text fontsize="sm" mt="3px">
//         {logoText}
//       </Text>
//     </Link>
//   );
//   hamburgerColor = { base: "white" };
//   var linksAuth = (
//     <HStack display={{ sm: "none", lg: "flex" }}>
//       <NavLink to="/admin/dashboard">
//         <Button
//           fontSize="sm"
//           ms="0px"
//           me="0px"
//           px="0px"
//           me={{ sm: "2px", md: "16px" }}
//           color={navbarIcon}
//           variant="no-effects"
//           leftIcon={<HomeIcon color={navbarIcon} w="12px" h="12px" me="0px" />}
//         >
//           <Text>Dashboard</Text>
//         </Button>
//       </NavLink>
//       <NavLink to="/admin/profile">
//         <Button
//           fontSize="sm"
//           ms="0px"
//           me="0px"
//           px="0px"
//           me={{ sm: "2px", md: "16px" }}
//           color={navbarIcon}
//           variant="no-effects"
//           leftIcon={
//             <PersonIcon color={navbarIcon} w="12px" h="12px" me="0px" />
//           }
//         >
//           <Text>Profile</Text>
//         </Button>
//       </NavLink>
//       <NavLink to="/auth/signup">
//         <Button
//           fontSize="sm"
//           ms="0px"
//           me="0px"
//           px="0px"
//           me={{ sm: "2px", md: "16px" }}
//           color={navbarIcon}
//           variant="no-effects"
//           leftIcon={
//             <RocketIcon color={navbarIcon} w="12px" h="12px" me="0px" />
//           }
//         >
//           <Text>Sign Up</Text>
//         </Button>
//       </NavLink>
//       <Button
//         onClick={handleConnectMetamask}
//         fontSize="sm"
//         ms="0px"
//         px="0px"
//         me={{ sm: "2px", md: "16px" }}
//         color={navbarIcon}
//         variant="no-effects"
//         leftIcon={
//           <DocumentIcon color={navbarIcon} w="12px" h="12px" me="0px" />
//         }
//       >
//         <Text>Connect Wallet</Text>
//       </Button>
//     </HStack>
//   );
//   return (
//     <Flex
//       position={navbarPosition}
//       top="16px"
//       left="50%"
//       transform="translate(-50%, 0px)"
//       background={navbarBg}
//       border={navbarBorder}
//       boxShadow={navbarShadow}
//       filter={navbarFilter}
//       backdropFilter={navbarBackdrop}
//       borderRadius="15px"
//       px="16px"
//       py="22px"
//       mx="auto"
//       width="1044px"
//       maxW="90%"
//       alignItems="center"
//       zIndex="3"
//     >
//       <Flex w="100%" justifyContent={{ sm: "start", lg: "space-between" }}>
//         {brand}
//         <Box
//           ms={{ base: "auto", lg: "0px" }}
//           display={{ base: "flex", lg: "none" }}
//         >
//           <SidebarResponsive
//             hamburgerColor={hamburgerColor}
//             logoText={props.logoText}
//             secondary={props.secondary}
//             routes={routes}
//             logo={
//               <Stack
//                 direction="row"
//                 spacing="12px"
//                 align="center"
//                 justify="center"
//               >
//                 {colorMode === "dark" ? (
//                   <liqualityLogoLight w="74px" h="27px" />
//                 ) : (
//                   <liqualityLogoDark w="74px" h="27px" />
//                 )}
//                 <Box
//                   w="1px"
//                   h="20px"
//                   bg={colorMode === "dark" ? "white" : "gray.700"}
//                 />
//                 {colorMode === "dark" ? (
//                   <ChakraLogoLight w="82px" h="21px" />
//                 ) : (
//                   <ChakraLogoDark w="82px" h="21px" />
//                 )}
//               </Stack>
//             }
//             {...rest}
//           />
//         </Box>
//         {linksAuth}
//         <Link href="https://creative-tim.com/product/liquality-dashboard-chakra">
//           <Button
//             bg={bgButton}
//             color={colorButton}
//             fontSize="xs"
//             variant="no-hover"
//             px="30px"
//             display={{
//               sm: "none",
//               lg: "flex",
//             }}
//           >
//             Free Download
//           </Button>
//         </Link>
//       </Flex>
//     </Flex>
//   );
// }
