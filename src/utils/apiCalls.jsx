import Axios from "axios";

export const register = async (registerUsername, registerPassword) => {
  const data = await Axios({
    method: "POST",
    data: {
      username: registerUsername,
      password: registerPassword,
    },
    withCredentials: true,
    url: "http://localhost:4000/register",
  });
  return data;
};
export const login = async (loginUsername, loginPassword) => {
  const data = await Axios({
    method: "POST",
    data: {
      username: loginUsername,
      password: loginPassword,
    },
    withCredentials: true,
    url: "http://localhost:4000/login",
  });
  return data;
};
export const getUser = async () => {
  const data = await Axios({
    method: "GET",
    withCredentials: true,
    url: "http://localhost:4000/user",
  });
  return data;
};
