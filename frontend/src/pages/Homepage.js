import React, { useEffect } from "react";
import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../MainComponents/Authentication/Login";
import SignUp from "../MainComponents/Authentication/SignUp";
import { useNavigate } from "react-router-dom";

const Homepage = () => {

const navigate = useNavigate();

useEffect(() => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  if (user) {
    navigate("/chats");
  }
}, [navigate]);


  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        boxShadow="lg"
        borderWidth="1px"
      >
        <Text
          fontSize="3xl"
          fontFamily="Fira Code"
          color="#1a1d23"
          textAlign="center"
        >
          Yap-Hub
        </Text>
      </Box>

      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs variant="enclosed" isFitted>
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign up</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
