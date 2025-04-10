

import { Box } from "@chakra-ui/react";
import "./styles.css";
import SingleChat from "../MainComponents/SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      px={2}
      py={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      maxW="100%"
      overflowX="hidden"
      boxSizing="border-box"
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
