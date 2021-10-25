import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Text,
  Input,
  Select,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  CloseButton,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";
import Identicon from "./Identicon";
import Web3Modal from "web3modal";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { TechnicalAnalysis } from "react-ts-tradingview-widgets";

import { useLocalStorage, fromWeiWithDecimals } from "./../utils/utils";

import { SFXJSON } from "../constants/artifacts";

type Props = {
  handleOpenModal: any;
};

export default function ConnectButton({ handleOpenModal }: Props) {
  const [address, setAddress] = useLocalStorage("address");

  const [valideAddress, setValideAddress] = useLocalStorage(
    "valideAddress",
    false
  );

  const [currency, setCurrency] = useLocalStorage("currency", "USD");

  const [sfxBalance, setSfxBalance] = useState<any | number>(0);

  const [sfxPrice, setSfxPrice] = useState<any | number>(1.01);

  const [sfxPriceByCurrency, setSfxPriceByCurrency] = useState<any | number>(1);

  const [leftCurrency, setLeftCurrency] = useState("$");

  const [rightCurrency, setRightCurrency] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // Mikko's test key - don't copy as your mileage may vary
        infuraId: "af91fde759d040cdb107db42b2eebf2a",
      },
    },
  };

  let web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    theme: {
      background: "rgb(39, 49, 56)",
      main: "rgb(199, 199, 199)",
      secondary: "rgb(136, 136, 136)",
      border: "rgba(195, 195, 195, 0.14)",
      hover: "rgb(16, 26, 32)",
    },
  });

  async function handleConnectWallet() {
    let provider;
    try {
      provider = await web3Modal.connect();
    } catch (e) {
      console.log("Could not get a wallet connection", e);
      return;
    }
    const web3connect = new Web3(provider);
    const accounts = await web3connect.eth.getAccounts();
    setAddress(accounts[0]);
  }

  useEffect(() => {
    async function anyNameFunction() {
      const web3 = new Web3(
        "https://polygon-mainnet.infura.io/v3/af91fde759d040cdb107db42b2eebf2a"
      );

      const sxfContract = new web3.eth.Contract(
        SFXJSON.abi as AbiItem[],
        SFXJSON.contractAddress
      );

      let balance = 0;

      try {
        balance = await sxfContract.methods.balanceOf(address).call();
      } catch (e) {
        return;
      }

      setSfxBalance(
        parseFloat(fromWeiWithDecimals(web3, balance, 18)).toFixed(0)
      );

      setValideAddress(true);
    }
    anyNameFunction();
  }, [address]);

  useEffect(() => {
    let rate = 1;

    if (currency === "EUR") {
      setLeftCurrency("");
      setRightCurrency("€");
      rate = 0.86;
      setSfxPriceByCurrency(sfxPrice * rate);
    } else if (currency === "USD") {
      setLeftCurrency("$");
      setRightCurrency("");
      rate = 1;
      setSfxPriceByCurrency(sfxPrice * rate);
    }
  }, [currency, sfxPrice]);

  function getRandomArbitrary(min: any, max: any) {
    return Math.random() * (max - min) + min;
  }

  useEffect(() => {
    setTimeout(() => {
      setSfxPrice(sfxPrice + getRandomArbitrary(-0.001, 0.001));
    }, getRandomArbitrary(100, 1500));
  }, [sfxPrice]);

  return valideAddress ? (
    <>
      <Box
        display="flex"
        alignItems="center"
        background="gray.700"
        borderRadius="xl"
        py="0"
      >
        <Select
          value={currency}
          color="white"
          fontSize="lg"
          fontWeight="medium"
          borderRadius="xl"
          border="0px solid transparent"
          size="lg"
          onChange={(selectCurrency) => {
            setCurrency(selectCurrency.target.value.toString());
          }}
        >
          <option value="USD">Dollar ($)</option>
          <option value="EUR">Euro (€)</option>
        </Select>
        <Button
          onClick={handleOpenModal}
          bg="gray.800"
          _hover={{
            border: "1px",
            borderStyle: "solid",
            borderColor: "blue.400",
            backgroundColor: "gray.700",
          }}
          m="1px"
          height="45px"
          size="lg"
          color="blue.300"
          fontSize="lg"
          fontWeight="medium"
          borderRadius="xl"
          px="50"
          border="1px solid transparent"
        >
          <Text color="white" fontSize="lg" fontWeight="medium" mr="2">
            {address &&
              `${address.slice(0, 6)}...${address.slice(
                address.length - 4,
                address.length
              )}`}
          </Text>
          <Identicon />
        </Button>
      </Box>
      <br />

      <Text color="white" fontSize="lg" px="5">
        <Stat>
          <StatLabel>
            <Badge>{sfxBalance}</Badge> SullFurix (SFX)
          </StatLabel>
          <StatNumber>
            {leftCurrency} {(sfxBalance * sfxPriceByCurrency).toFixed(4)}{" "}
            {rightCurrency}
          </StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            {(((sfxPrice - 0.9) / 0.9) * 100).toFixed(2)} %
          </StatHelpText>
        </Stat>
      </Text>

      <br />
      <Button
        onClick={onOpen}
        bg="blue.800"
        size="md"
        color="blue.300"
        fontSize="md"
        fontWeight="medium"
        borderRadius="xl"
        border="1px solid transparent"
        _hover={{
          borderColor: "blue.700",
          color: "blue.400",
        }}
        _active={{
          backgroundColor: "blue.800",
          borderColor: "blue.700",
        }}
      >
        See infos
      </Button>

      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="gray.900" color="white" height="75%">
          <DrawerHeader>
            <CloseButton onClick={onClose} />
          </DrawerHeader>
          <DrawerBody>
            <TechnicalAnalysis
              colorTheme="dark"
              symbol="btc"
            ></TechnicalAnalysis>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  ) : (
    <>
      <Box
        display="flex"
        alignItems="center"
        background="gray.700"
        borderRadius="xl"
        py="0"
      >
        <Input
          value={address}
          onChange={(inputAddress) => {
            setAddress(inputAddress.target.value.toString());
          }}
          placeholder="Please enter your address or connect"
          color="white"
          fontSize="lg"
          fontWeight="medium"
          borderRadius="xl"
          border="0px solid transparent"
          size="lg"
        />
        <Button
          onClick={handleConnectWallet}
          bg="blue.800"
          size="lg"
          color="blue.300"
          fontSize="lg"
          fontWeight="medium"
          borderRadius="xl"
          px="50"
          border="1px solid transparent"
          _hover={{
            borderColor: "blue.700",
            color: "blue.400",
          }}
          _active={{
            backgroundColor: "blue.800",
            borderColor: "blue.700",
          }}
        >
          Connect to a wallet
        </Button>
      </Box>
    </>
  );
}
