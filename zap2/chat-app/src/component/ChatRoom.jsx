import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import EmojiPicker from "emoji-picker-react";
import MenuIcon from "@material-ui/icons/Menu";
import axios from "axios";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {
  AppBar,
  Button,
  Slide,
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
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import "./Chat.css";
import { dark } from "@material-ui/core/styles/createPalette";

// Crie um tema personalizado
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#303030', // Cor de fundo escura
    },
    text: {
      primary: '#fff', // Cor do texto clara
    },
  },
});

var stompClient = null;

const ChatRoom = () => {
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState("CHATROOM");
  const [autoReply, setAutoReply] = useState(false);
  const [autoReplyMessage, setAutoReplyMessage] = useState("");
  const [result, setResult] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    receivername: "",
    connected: false,
    message: "",
  });

  const [menuOpen, setMenuOpen] = useState(false);

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
    var payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        if (!privateChats.get(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        break;
        case "MESSAGE":
          generateAndSendReply(payloadData.message);
          publicChats.push(payloadData);
          setPublicChats([...publicChats]);
          break;
    }
  };
  

  const generateAndSendReply = async (message) => {
    console.log('Entrou no useEffect')
    console.log('Prompt = ', message)

    const response = await axios.post("http://localhost:3333/api/call", {prompt: message});
    console.log(response.data)
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
        message: autoReply ? autoReplyMessage : userData.message,
        status: "MESSAGE",
      };
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
      if (autoReply) {
        setAutoReplyMessage("");
      }
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
            placeholder="Digite seu nick"
            name="userName"
            value={userData.username}
            onChange={handleUsername}
            margin="normal"
          />
          <button className="buttonRegister" type="button" onClick={registerUser} style={{margin:"12px"}}>
            conectar
          </button>
        </div>
      </div>
    );
  }

  return (
    <Grid container className="dark-container">
          <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Zap2
          </Typography>
        </Toolbar>
      </AppBar>
      </ThemeProvider>
      {menuOpen && (
        <Slide direction="right" in={menuOpen} mountOnEnter unmountOnExit>
        <Grid item xs={3}>
          <Paper style={{ borderRadius: "4px", background:"#434343"}}>
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
       </Slide>

      )}
      
      <Grid item xs={9}>
        <Paper
          style={{
            height: "calc(100vh - 64px)",
            borderRadius: "12px",
            overflowY: "auto",
          }}
        >
          <div className="div-chat"
            style={{
              height: "calc(100% - 50px)",
              padding: "16px",
            }}
          >
            {tab === "CHATROOM" && (
              <ul className="chat-messages" style={{borderRadius: "12px"}}>
                {publicChats.map((chat, index) => (
                  <li className={`message`} key={index}>
                    <div className="avatar">{chat.senderName}</div>
                    <div className="message-data">{chat.message}</div>
                  </li>
                ))}
              </ul>
            )}
            {tab !== "CHATROOM" && (
              <ul className="chat-messages" style={{borderRadius: "12px"}}>
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
              backgroundColor: "#434343",
              borderRadius: "12px",
            }}
          >
            <Button onClick={() => setAutoReply(!autoReply)}>
  {autoReply ? "Desativar Resposta Automática" : "Ativar Resposta Automática"}
</Button>

            <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <InsertEmoticonIcon />
            </IconButton>
            {showEmojiPicker && (
              <div>
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
            <TextField className="input-chat"
              multiline
              rows={3}
              placeholder="Digite sua mensagem aqui"
              value={autoReply ? autoReplyMessage : userData.message}
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
                        Enviar
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon />}
                        onClick={sendPrivateValue}
                        style={{ borderRadius: "12px" }}
                      >
                        Enviar
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
