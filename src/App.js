import React, { useState, useEffect } from "react";
import "./App.css";
import Axios from "axios";
import User from "./pages/User/user";
import { Button, Container, Grid, Typography, TextField } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Store } from "react-notifications-component";
function App() {
  const [isAuthenticated, setAuthentication] = useState(false);
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [data, setData] = useState({});

  useEffect(() => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "https://telegrammulitplebackend.herokuapp.com/isLoggedIn",
    }).then((res) => {
      console.log(res.data.user);
      if (res.data.user) {
        setData(res.data.user);
        setAuthentication(true);
        Store.addNotification({
          title: "Successfully Logged In",
          type: "success",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 1000,
            onScreen: true,
          },
        });
      }
    });
  }, []);

  const register = () => {
    Axios({
      method: "POST",
      data: {
        username: registerUsername,
        password: registerPassword,
      },
      withCredentials: true,
      url: "https://telegrammulitplebackend.herokuapp.com/register",
    }).then((res) => {
      if (res.data.message === "success") {
        Store.addNotification({
          title: "Successfully Registered",
          message: "Login Now To Use The Application",
          type: "success",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 2000,
            onScreen: true,
          },
        });
        window.setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        Store.addNotification({
          title: "Error",
          message: "Cannot Register User Already Registered",
          type: "success",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 2000,
            onScreen: true,
          },
        });
      }
    });
  };
  const login = () => {
    Axios({
      method: "POST",
      data: {
        username: loginUsername,
        password: loginPassword,
      },
      withCredentials: true,
      url: "https://telegrammulitplebackend.herokuapp.com/login",
    }).then((res) => {
      console.log(res);
      if (res.data.message === "success") {
        console.log("true");
        setData(res.data.user);
        setAuthentication(true);
        Store.addNotification({
          title: "Successfully Logged In",
          type: "success",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 1000,
            onScreen: true,
          },
        });
      } else {
        Store.addNotification({
          title: "Error",
          message: "Incorrect Email Or Password",
          type: "danger",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 1000,
            onScreen: true,
          },
        });
      }
    });
  };

  const logOut = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "https://telegrammulitplebackend.herokuapp.com/logOut",
    }).then((res) => {
      console.log(res);
      setAuthentication(false);
      Store.addNotification({
        title: "Successfully Logged Out",
        type: "success",
        insert: "top",
        container: "top-right",
        dismiss: {
          duration: 1000,
          onScreen: true,
        },
      });
      // window.location.reload();
    });
  };

  if (isAuthenticated === true && data) {
    return (
      <div className="App">
        <Button variant="contained" onClick={logOut} id="logoutBtn">
          <LogoutIcon />
        </Button>
        <User data={data} />
      </div>
    );
  } else {
    return (
      <Container maxWidth="lg">
        <div className="App">
          <Typography variant="h1" id="title" component="h1">
            Telegram Multiple Accounts
          </Typography>

          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              <div className="login-container">
                <Typography variant="h2" component="h6" id="login-title">
                  Login
                </Typography>
                <TextField
                  onChange={(e) => setLoginUsername(e.target.value)}
                  label="Username"
                  placeholder="1224353"
                  color="secondary"
                  variant="filled"
                  id="login-text"
                />
                <TextField
                  onChange={(e) => setLoginPassword(e.target.value)}
                  label="Password"
                  placeholder="1224353"
                  variant="filled"
                  color="secondary"
                  id="login-text"
                />
                <button onClick={login} className="submit-button">
                  Submit
                </button>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="login-container">
                <Typography variant="h2" component="h6" id="login-title">
                  Register
                </Typography>
                <TextField
                  sx={{ input: { color: "red" } }}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  label="Username"
                  placeholder="1224353"
                  color="secondary"
                  variant="filled"
                  id="login-text"
                />

                <TextField
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  label="Password"
                  variant="filled"
                  color="secondary"
                  placeholder="1224353"
                  id="login-text"
                />
                <button onClick={register} className="submit-button">
                  Submit
                </button>
              </div>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default App;
// https://painor.gitbook.io/gramjs/working-with-messages/messages.getmessages
