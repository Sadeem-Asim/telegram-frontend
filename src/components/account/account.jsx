/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import "./account.css";
import { TextField, Button } from "@mui/material";
import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";
import { Circles } from "react-loader-spinner";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { utils } from "telegram";
import { RotatingSquare } from "react-loader-spinner";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Axios from "axios";
import { Store } from "react-notifications-component";
const Account = ({ account, username }) => {
  let { _id, apiId, apiHash, token, phoneNo } = account;
  const stringSession = new StringSession(token);
  apiId = parseInt(apiId);
  const [client, setClient] = useState(
    new TelegramClient(stringSession, apiId, apiHash, {
      retryDelay: 1_000,
      autoReconnect: true,
      connectionRetries: 5,
      useWSS: true,
      requestRetries: 2,
    })
  );
  const [update, setUpdate] = useState(1);
  const [contacts, setContacts] = useState(null);
  const [allContacts, setAllContacts] = useState(null);
  const [currentChatBox, setCurrentChatBox] = useState(null);
  const [currentMessages, setCurrentMessages] = useState();
  const [loaderState, setLoaderState] = useState();
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (currentChatBox) {
      setLoaderState(true);
      client
        .getMessages(currentChatBox.id, {
          limit: 20,
        })
        .then((msgs) => {
          setCurrentMessages(msgs);
          setLoaderState(false);
        });
    }
  }, [currentChatBox]);
  useEffect(() => {
    if (currentChatBox) {
      client
        .getMessages(currentChatBox.id, {
          limit: 20,
        })
        .then((msgs) => {
          setCurrentMessages(msgs);
        });
    }
    if (contacts) {
      client.getDialogs().then((dialogs) => {
        setContacts(dialogs);
      });
    }
  }, [update]);
  const sendMessage = async () => {
    if (currentChatBox && message.length >= 1) {
      await client.sendMessage(currentChatBox.id, { message });
      setUpdate((old) => old + 1);
      setMessage("");
    }
  };
  const deleteAccount = async () => {
    const ans = prompt("Are You Sure You Want To Delete, Enter yes to delete");
    if (ans === "yes") {
      await Axios({
        method: "DELETE",
        url: "https://telegrammulitplebackend.herokuapp.com/deleteAccount",
        withCredentials: true,
        data: {
          _id: _id,
          username: username,
        },
      });
      Store.addNotification({
        title: "Successfully Deleted Account",
        type: "success",
        insert: "top",
        container: "top-right",
        dismiss: {
          duration: 1000,
          onScreen: true,
        },
      });
      window.location.reload();
    }
  };
  const searchContacts = (e) => {
    let search = e.target.value.toLowerCase();
    let searchResult = allContacts.filter((el) => {
      if (el.firstName) {
        return el.firstName.toLowerCase().includes(search);
      } else if (el.title) {
        return el.title.toLowerCase().includes(search);
      } else {
        return null;
      }
    });
    setContacts(searchResult);
  };
  const getToContacts = () => {
    setCurrentChatBox(null);
    setContacts(allContacts);
  };
  useEffect(() => {
    client
      .connect()
      .then(async () => {
        try {
          console.log("You should now be connected.");
          const allChats = await client.invoke(
            new Api.messages.GetAllChats({
              exceptIds: [7475723],
            })
          );
          const allContacts = await client.invoke(
            new Api.contacts.GetContacts({
              hash: 3457568,
            })
          );
          const { users } = allContacts;
          const { chats } = allChats;
          const dialog = await client.getDialogs();
          let allUsers = dialog.concat(users.concat(chats));
          setContacts(dialog);
          setAllContacts(allUsers);
          client.addEventHandler(async (update) => {
            if (update.className === "UpdateNewChannelMessage") {
              Store.addNotification({
                title: `New Message For ${phoneNo}`,
                message: update.message.message,
                type: "success",
                insert: "top",
                container: "top-right",
                dismiss: {
                  duration: 3000,
                  onScreen: true,
                },
              });
              setUpdate((old) => old + 1);
            } else if (update.className === "UpdateShortMessage") {
              Store.addNotification({
                title: `New Message For ${phoneNo}`,
                message: update.message,
                type: "success",
                insert: "top",
                container: "top-right",
                dismiss: {
                  duration: 3000,
                  onScreen: true,
                },
              });
              setUpdate((old) => old + 1);
            }
          });
        } catch (error) {
          Store.addNotification({
            title: "Error",
            message: error.message,
            type: "danger",
            insert: "top",
            container: "top-right",
            dismiss: {
              duration: 1000,
              onScreen: true,
            },
          });
        }
      })
      .catch((err) => {
        Store.addNotification({
          title: `Connection Error ${phoneNo}`,
          message:
            "We Can't Connect You To Telegram Seems Like Your Vpn Is Off Or Internet Connection Is Not Stable . Reload To Get Started Again",
          type: "danger",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 10000,
            onScreen: true,
          },
        });
      });
    console.log("Connected");
  }, [client]);

  if (contacts) {
    return (
      <>
        <div className="account-container">
          <div className="left-side">
            <div className="dialog">
              <div className="dialog-header">
                <span className="dialog-heading">{phoneNo}</span>
                <Button
                  variant="contained"
                  id="deleteAccountBtn"
                  onClick={deleteAccount}
                >
                  <DeleteOutlineIcon />
                </Button>
              </div>
              <div className="search-container">
                <TextField
                  id="standard-basic"
                  label="Search"
                  variant="standard"
                  onChange={searchContacts}
                />
              </div>
            </div>
            <div className="chats">
              {contacts.map((el, i) => {
                let name;
                let { firstName } = el;
                let { title } = el;
                if (firstName) {
                  name = firstName;
                } else if (title) {
                  name = title;
                } else {
                  name = "null";
                }
                return (
                  <div
                    className="chats-container"
                    key={i}
                    onClick={() => {
                      setCurrentChatBox(el);
                      setContacts(null);
                    }}
                  >
                    <div className="user-avatar">{`${name.substring(
                      0,
                      1
                    )}`}</div>
                    <div className="user-name">{name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  } else if (currentChatBox) {
    return (
      <div className="account-container">
        <div className="right-side">
          <div className="dialog">
            <div className="dialog-header">
              <Button
                variant="contained"
                id="backButton"
                onClick={getToContacts}
              >
                <ArrowBackIcon />
              </Button>
              <span className="dialog-heading">{currentChatBox.name}</span>
            </div>
          </div>
          {currentMessages && currentChatBox && !loaderState ? (
            <div className="messages-box">
              {currentMessages.map((el, i) => {
                const { message, sender } = el;
                let senderName = utils.getDisplayName(sender);
                if (message === "") return null;
                if (el.fromId) {
                  return (
                    <span className="message me" key={i}>
                      <span className="message-sender"> {senderName}</span>
                      <span className="message-text">{message}</span>
                    </span>
                  );
                } else {
                  return (
                    <span className="message " key={i}>
                      <span className="message-sender"> {senderName}</span>
                      <span className="message-text">{message}</span>
                    </span>
                  );
                }
              })}
            </div>
          ) : loaderState === true ? (
            <div className="messages-box spinner">
              <RotatingSquare
                height="80"
                width="80"
                radius="9"
                color="blue"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
                visible={loaderState}
              />
            </div>
          ) : (
            <div className="messages-box-default">
              <span className="message me">
                Select A Chat To Start Messaging
              </span>
            </div>
          )}
          <div className="sendMessage">
            <input
              className="input-message"
              placeholder="Write A Message..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <SendIcon className="send-icon" onClick={sendMessage} />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="account-container spinner">
        <Circles
          className="account-spinner"
          height="120"
          width="120"
          radius="9"
          color="blue"
          ariaLabel="loading"
          wrapperStyle={true}
          wrapperClass={true}
          visible={true}
        />
      </div>
    );
  }
};
export default Account;
