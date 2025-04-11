// import { Box } from "@chakra-ui/react";
// import { useState } from "react";
// import Chatbox from "../MainComponents/ChatBox";
// import MyChats from "../MainComponents/MyChats";
// import SideDrawer from "../MainComponents/miscellaneous/SideDrawer";
// import { ChatState } from "../Context/ChatProvider";

// const Chatpage = () => {
//   const [fetchAgain, setFetchAgain] = useState(false);
//   const { user } = ChatState();

//   return (
//     <div style={{ width: "100%" }}>
//       {user && <SideDrawer />}
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         w="100%"
//         h="91.5vh"
//         p="10px"
//         m="10px"
//         gap="19px"
//       >
//         {user && <MyChats fetchAgain={fetchAgain} socket={socket} />}
//         {user && (
//           <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
//         )}
//       </Box>
//     </div>
//   );
// };

// export default Chatpage;
import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import Chatbox from "../MainComponents/ChatBox";
import MyChats from "../MainComponents/MyChats";
import SideDrawer from "../MainComponents/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import io from "socket.io-client";

const ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://yap-hub-chat-app.onrender.com"
    : "http://localhost:5000";

let socket;

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  useEffect(() => {
    if (user) {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
    }
  }, [user]);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
        m="10px"
        gap="19px"
      >
        {user && <MyChats fetchAgain={fetchAgain} socket={socket} />}
        {user && (
          <Chatbox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            socket={socket}
          />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
