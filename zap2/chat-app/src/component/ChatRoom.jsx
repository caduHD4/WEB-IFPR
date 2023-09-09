import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import EmojiPicker from 'emoji-picker-react';
import {
  AppBar,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import SendIcon from "@material-ui/icons/Send";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import "./Chat.css";

var stompClient = null;

const ChatRoom = () => {
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState("CHATROOM");
  const [userData, setUserData] = useState({
    username: "",
    receivername: "",
    connected: false,
    message: "",
  });

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const connect = () => {
    let sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe("/chatroom/public", onMessageReceived);
    stompClient.subscribe(
      "/user/" + userData.username + "/private",
      onPrivateMessage
    );
    userJoin();
  };

  const userJoin = () => {
    var chatMessage = {
      senderName: userData.username,
      status: "JOIN",
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

const [showEmojiPicker, setShowEmojiPicker] = useState(false);
const [chosenEmoji, setChosenEmoji] = useState(null);

const onEmojiClick = (event, emojiObject) => {
  setChosenEmoji(emojiObject.emoji); 
};

useEffect(() => {
  if (chosenEmoji) {
    setUserData({ ...userData, message: userData.message + chosenEmoji });
  }
}, [chosenEmoji]);


  const onMessageReceived = (payload) => {
    console.log("RECEBENDO MENSAGEM");
    var payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        if (!privateChats.get(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        break;
      case "MESSAGE":
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        break;
    }
  };

  const onPrivateMessage = (payload) => {
    console.log(payload);
    var payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };

  const [selectedFile, setSelectedFile] = useState();

  const handleCapture = ({ target }) => {
    setSelectedFile(target.files[0]);
    // Aqui você pode adicionar a lógica para enviar o arquivo selecionado
  };

  const sendValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: "MESSAGE",
      };
      console.log(chatMessage);
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  const sendPrivateValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE",
      };

      if (userData.username !== tab) {
        privateChats.get(tab).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  const handleUsername = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, username: value });
  };

  const registerUser = () => {
    connect();
  };

  // Renderização condicional para mostrar o registro ou o chat
  if (!userData.connected) {
    return (
      <div className="container">
        <div className="register">
          <input
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.username}
            onChange={handleUsername}
            margin="normal"
          />
          <button type="button" onClick={registerUser}>
            connect
          </button>
        </div>
      </div>
    );
  }

  return (
    <Grid container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Zap2
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid item xs={3}>
        <Paper style={{ borderRadius: "12px" }}>
          <List>
            <ListItem
              button
              onClick={() => {
                setTab("CHATROOM");
              }}
              className={`member ${tab === "CHATROOM" && "active"}`}
            >
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <ListItemText primary="Chatroom" />
            </ListItem>
            {[...privateChats.keys()].map((name, index) => (
              <ListItem
                button
                onClick={() => {
                  setTab(name);
                }}
                className={`member ${tab === name && "active"}`}
                key={index}
              >
                <ListItemIcon>
                  <ChatIcon />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <Paper
          style={{
            height: "calc(100vh - 64px)",
            borderRadius: "12px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              height: "calc(100% - 80px)",
              padding: "16px",
            }}
          >
            {tab === "CHATROOM" && (
              <ul className="chat-messages">
                {publicChats.map((chat, index) => (
                  <li className={`message`} key={index}>
                    <div className="avatar">{chat.senderName}</div>
                    <div className="message-data">{chat.message}</div>
                  </li>
                ))}
              </ul>
            )}
            {tab !== "CHATROOM" && (
              <ul className="chat-messages">
                {[...privateChats.get(tab)].map((chat, index) => (
                  <li className={`message`} key={index}>
                    <div className="avatar">{chat.senderName}</div>
                    <div className="message-data">{chat.message}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Divider />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              position: "sticky",
              bottom: "0",
              backgroundColor: "#fff",
              borderRadius: "12px",
            }}
          >
            <input
              accept="image/*,video/*"
              style={{ display: "none" }}
              id="icon-button-file"
              type="file"
              onChange={handleCapture}
            />
            <label htmlFor="icon-button-file">
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
            <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
  <InsertEmoticonIcon />
</IconButton>
{showEmojiPicker && (
  <div>
    <EmojiPicker onEmojiClick={onEmojiClick} />
  </div>
)}
            <TextField
              multiline
              rows={3}
              placeholder="Digite sua mensagem aqui"
              value={userData.message}
              onChange={handleMessage}
              variant="outlined"
              style={{ flexGrow: 1, marginRight: "10px" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {tab === "CHATROOM" ? (
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon />}
                        onClick={sendValue}
                        style={{ borderRadius: "12px" }}
                      >
                        Send
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon />}
                        onClick={sendPrivateValue}
                        style={{ borderRadius: "12px" }}
                      >
                        Send
                      </Button>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ChatRoom;