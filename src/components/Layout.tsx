import { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Flex
      flexDirection="column"
      h="100vh"
      bg="gray.800"
      alignItems="center"
      justifyContent="center"
    >
      {children}
    </Flex>
  );
}
