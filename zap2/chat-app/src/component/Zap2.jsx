import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
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
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import ChatIcon from "@material-ui/icons/Chat";
import SendIcon from "@material-ui/icons/Send";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicOffIcon from "@material-ui/icons/MicOff";
import MenuIcon from "@material-ui/icons/Menu";
import MicIcon from "@material-ui/icons/Mic";
import AndroidIcon from "@material-ui/icons/Android";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import EmojiPicker from "emoji-picker-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import AudioFile from "./assets/audio/zap2.mp3";
import "./Chat.css";

// Muda a cor do tela da interface
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#303030",
    },
    text: {
      primary: "#fff",
    },
  },
});

var stompClient = null;

const Zap2 = () => {
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState("CHATROOM");
  const [result, setResult] = useState("");
  const [autoReply, setAutoReply] = useState(false);
  const autoReplyRef = useRef(autoReply);
  const [isRecording, setIsRecording] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [audio] = useState(new Audio(AudioFile));
  const [userData, setUserData] = useState({
    username: "",
    receivername: "",
    connected: false,
    message: "",
  });

  const playSound = () => {
    audio.play();
  };

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  useEffect(() => {
    autoReplyRef.current = autoReply;
  }, [autoReply]);

  useEffect(() => {
    if (result) {
      sendAutoReply(result);
      setResult("");
    }
  }, [result]);

  useEffect(() => {
    if (chosenEmoji) {
      setUserData({ ...userData, message: userData.message + chosenEmoji });
    }
  }, [chosenEmoji]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

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

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject.emoji);
  };

  const toggleAutoReply = () => {
    setAutoReply(!autoReply);
  };

  // AQUI ADICIONEI UMA CONDIÇÃO PARA RESPONDER A MENSAGEM
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
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        break;
    }
    /*SE O BOTÃO DO RP ESTIVER LIGADO E O NOME DO POSTADOR FOR DIFERENTE DO USUARIO 
    ELE FAZ CHAMADA.*/
    if (
      autoReplyRef.current === true &&
      payloadData.senderName !== userData.username
    ) {
      generateAndSendReply(
        payloadData.message,
        payloadData.senderName,
        userData.username
      );
    }
  };

  /*Demorei 10 mil anos pra tentar fazer isso funcionar sem fazer duas requisões na API.
  Tudo isso por causa do true que não estava entrando no onMessageReceived e no onPrivateMessage.
  Então lembrei do useRef e deu certo, gloriaaaaaaaaa.*/

  const onPrivateMessage = (payload) => {
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
    if (
      autoReplyRef.current === true &&
      payloadData.senderName !== userData.username
    ) {
      generateAndSendReply(
        payloadData.message,
        payloadData.senderName,
        userData.username
      );
    }
  };

  // FAZ UM POST PARA A API E RECEBE A RESPOSTA.
  // TBM CRIE UM PROMPT PADRÃO PARA DAR UM CONTEXTO À IA.
  const generateAndSendReply = async (message, senderName, username) => {
    const response = await axios.post("http://localhost:3333/api/call", {
      prompt: `Você é ${username}, respondendo a mensagem de ${senderName}. Seja bem educado e conciso em suas respostas, seja muito humano. Mensagem: "${message}"`,
    });
    setResult({ data: response.data, senderName: senderName });
  };

  const onError = (err) => {
    console.log(err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };


  // POR ENQUANTO O AUTOREPLY SÓ ENVIA EM CHAT PRIVADO, ESTOU ARRUMANDO
  const sendAutoReply = (result) => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        message: result.data,
        status: "MESSAGE",
      };
      if (result.senderName !== userData.username) {
        privateChats.get(result.senderName).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      chatMessage.receiverName = result.senderName;
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));

      setUserData({ ...userData, message: "" });
    }
  };

  const sendValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: "MESSAGE",
      };
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

  // TELA PARA CONECTAR
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
          <button
            className="buttonRegister"
            type="button"
            onClick={registerUser}
            style={{ margin: "12px" }}
          >
            conectar
          </button>
        </div>
      </div>
    );
  }

  // PAGINA PRINCIPAL
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
            <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div>
                <a href="#" onClick={playSound}>
                  <img
                    src="https://appsgeyser.io/geticon.php?widget=whatsapp%202_13754110&width=512"
                    alt="zap2"
                    //Esticado de proposito.
                    style={{
                      width: "150px",
                      height: "50px",
                      marginRight: "8px",
                    }}
                  />
                </a>
                Zap2
              </div>
            </Typography>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      {menuOpen && (
        <Slide direction="right" in={menuOpen} mountOnEnter unmountOnExit>
          <Grid item xs={3}>
            <Paper style={{ borderRadius: "4px", background: "#434343" }}>
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

      <Grid item xs={menuOpen ? 9 : 12}>
        <Paper
          style={{
            height: "calc(100vh - 64px)",
            borderRadius: "12px",
            overflowY: "auto",
          }}
        >
          <div
            className="div-chat"
            style={{
              height: "calc(100% - 50px)",
              padding: "16px",
            }}
          >
            {tab === "CHATROOM" && (
              <ul className="chat-messages" style={{ borderRadius: "12px" }}>
                {publicChats.map((chat, index) => (
                  <li className={`message`} key={index}>
                    <div className="avatar">{chat.senderName}</div>
                    <div className="message-data">{chat.message}</div>
                  </li>
                ))}
              </ul>
            )}
            {tab !== "CHATROOM" && (
              <ul className="chat-messages" style={{ borderRadius: "12px" }}>
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
            <Button
              className="ButtonAuto"
              variant="contained"
              color="primary"
              onClick={() => {
                toggleAutoReply();
                handleClick();
              }}
              title="Auto Reply"
            >
              <AndroidIcon style={{ color: autoReply ? "green" : "red" }} />
            </Button>

            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              style={{ marginTop: "45px" }}
            >
              <MuiAlert
                onClose={handleClose}
                severity={autoReply ? "success" : "error"}
                elevation={6}
                variant="filled"
              >
                Auto Reply{" "}
                {autoReply
                  ? "Ligada | A conversa será respodida automaticamente"
                  : "Desligada"}
              </MuiAlert>
            </Snackbar>
            <IconButton
              title="Transcritor de fala"
              onClick={() => {
                if (isRecording) {
                  SpeechRecognition.stopListening();
                  setUserData({ ...userData, message: transcript });
                } else {
                  resetTranscript(); // Limpa o transcript
                  SpeechRecognition.startListening({ continuous: true });
                }
                setIsRecording(!isRecording);
              }}
            >
              {isRecording ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            <IconButton
              title="Emojis"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <InsertEmoticonIcon />
            </IconButton>
            {showEmojiPicker && (
              <div>
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
            <TextField
              className="input-chat"
              multiline
              rows={3}
              placeholder="Digite sua mensagem aqui"
              value={userData.message}
              onChange={handleMessage}
              variant="outlined"
              style={{ flexGrow: 1, marginRight: "10px" }}
              onKeyDown={(ev) => {
                if (ev.key === "Enter") {
                  ev.preventDefault();
                  if (tab === "CHATROOM") {
                    sendValue();
                  } else {
                    sendPrivateValue();
                  }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {tab === "CHATROOM" ? (
                      <Button
                        title="Nada mais nada menos do que um botão de enviar"
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon />}
                        onClick={sendValue}
                        style={{ borderRadius: "20px", justifyContent: "left" }}
                      ></Button>
                    ) : (
                      <Button
                        title="Nada mais nada menos do que um botão de enviar"
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon />}
                        onClick={sendPrivateValue}
                        style={{ borderRadius: "12px", justifyContent: "left" }}
                      ></Button>
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

export default Zap2;
