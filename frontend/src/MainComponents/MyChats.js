import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, Button, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = useCallback(async () => {
    if (!user?.token) return;

    setIsLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chats", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Failed to load chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.token, setChats, toast]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(userInfo);
    fetchChats();
  }, [fetchAgain, fetchChats]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="#0d0d0d"
      w={{ base: "100%", md: "31%" }}
      borderRadius="xl"
      border="2px solid #1a1a1a"
      boxShadow="0 0 12px #00ffc3aa"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "26px", md: "30px" }}
        fontFamily="Orbitron, sans-serif"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        color="#00FFF7"
        fontWeight="bold"
        letterSpacing="1px"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            bgGradient="linear(to-r, #ff416c, #ff4b2b)"
            color="white"
            _hover={{
              bgGradient: "linear(to-r, #ff6a88, #ffb199)",
              transform: "scale(1.05)",
            }}
            borderRadius="lg"
            boxShadow="0 0 10px #ff416c"
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#1a1a1a"
        w="100%"
        h="100%"
        borderRadius="xl"
        overflowY="hidden"
      >
        {isLoading ? (
          <ChatLoading />
        ) : chats?.length > 0 ? (
          <Stack overflowY="scroll" spacing={2}>
            {chats.map((chat) => (
              <Box
                onClick={() => handleChatSelect(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#00ffd5" : "#2a2a2a"}
                color={selectedChat === chat ? "#0d0d0d" : "#e6e6e6"}
                px={3}
                py={2}
                borderRadius="md"
                key={chat._id}
                transition="0.2s ease-in-out"
                _hover={{
                  bg: selectedChat === chat ? "#00e6bf" : "#333333",
                  transform: "scale(1.02)",
                  boxShadow: "0 0 8px #00ffcc55",
                }}
              >
                <Text fontWeight="semibold" fontSize="md">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs" noOfLines={1} color="#66ffcc">
                    {/* <b>{chat.latestMessage.sender.name}: </b>
                    {chat.latestMessage.content} */}
                    <b>
                      {chat.latestMessage.sender._id === user._id
                        ? "You"
                        : chat.latestMessage.sender.name}{" "}
                      :{" "}
                    </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <Text textAlign="center" color="#777" mt={4}>
            No chats available
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
