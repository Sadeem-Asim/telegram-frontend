import { Button, Typography, Modal, Box, TextField } from "@mui/material";
import React, { useState } from "react";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import "./user.css";
import Axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import Account from "./../../components/account/account";
import TelegramIcon from "@mui/icons-material/Telegram";
import { Store } from "react-notifications-component";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  rowGap: 5,
};

const User = ({ data }) => {
  const [openModal, setOpenModal] = useState(false);
  let [apiId, setApiId] = useState(false);
  const [apiHash, setApiHash] = useState(false);
  const [phoneNo, setPhoneNo] = useState(false);
  const [submitButton, setSubmitButton] = useState("Submit");

  const stringSession = new StringSession("");
  const handleClose = () => {
    setOpenModal(false);
  };
  const activeModal = () => {
    setOpenModal(true);
  };
  const addAccount = async () => {
    try {
      setSubmitButton("Connecting");
      console.log("Loading interactive example...");
      apiId = Number(apiId);
      const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
        useWSS: true,
      });
      await client.start({
        phoneNumber: phoneNo,
        phoneCode: () => prompt("Enter Code"),
        onError: (err) => console.log(err),
      });
      setSubmitButton("Connected");
      setApiId("");
      setApiHash("");
      setPhoneNo("");
      console.log("You should now be connected.");
      const token = client.session.save();
      if (token) {
        const newAccount = await Axios({
          method: "POST",
          url: "https://telegrammulitplebackend.herokuapp.com/createAccount",
          withCredentials: true,
          data: {
            apiId: apiId,
            apiHash: apiHash,
            token: token,
            phoneNo: phoneNo,
            username: data.username,
          },
        });
        console.log(newAccount);
        Store.addNotification({
          title: "Successfully Created Account",
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
    } catch (err) {
      Store.addNotification({
        title: "Error",
        message: err.message,
        type: "danger",
        insert: "top",
        container: "top-right",
        dismiss: {
          duration: 1000,
          onScreen: true,
        },
      });
    }
  };

  return (
    <>
      <Button variant="contained" onClick={activeModal} id="addAccountBtn">
        <TelegramIcon />
      </Button>

      <div className="userSection">
        <Modal
          open={openModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Button id="modal-close" onClick={handleClose}>
              <CloseIcon />
            </Button>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Enter Your Telegram Account Details
            </Typography>
            <TextField
              onChange={(e) => setApiId(e.target.value)}
              label="Api Id"
              placeholder="1224353"
              color="secondary"
              focused
              id="modal-text"
            />
            <TextField
              onChange={(e) => setApiHash(e.target.value)}
              label="Api Hash"
              placeholder="38398989738792232"
              color="secondary"
              focused
              id="modal-text"
            />
            <TextField
              onChange={(e) => setPhoneNo(e.target.value)}
              label="Phone No"
              placeholder="+923111111111"
              color="secondary"
              focused
              id="modal-text"
            />
            <Button variant="contained" onClick={addAccount}>
              {submitButton}
            </Button>
          </Box>
        </Modal>
        <div className="userSection-container">
          {data.accounts.length >= 1 ? (
            data.accounts.map((el, i) => {
              return (
                <div className="account">
                  <Account account={el} key={i} username={data.username} />{" "}
                </div>
              );
            })
          ) : (
            <h1 className="addAccountTitle">
              Click The Telegram Button To Add Your First Account
            </h1>
          )}
        </div>
      </div>
    </>
  );
};
export default User;
