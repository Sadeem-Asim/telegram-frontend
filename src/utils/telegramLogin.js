const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input"); // npm i input

const apiId = 17720656;
const apiHash = "db2355877197069b70d88dfb586a4fd8";
const stringSession = new StringSession(
  "1BAAOMTQ5LjE1NC4xNjcuOTEBuzh5JqKrOLhctpETq3de+tUx9pP8eq5Cr9JTkOEaQJ8CET58ctTkZij4omiAlAj7QmMg6xkh5fA1YVXJqdGEVBqbYfXHVdvwsDAtHCzw9CAaAUkOpzLmtRQD+AsQHPSe2HZ70Nv/2ZUMxe82U7hCj+Gs7qwY0CfHxIUQc9jD3Vf/kxkPp6Ea7qCdR/IH9B1YEahpFs5kQwB9+znt4BheEMOC9dcrCs+xXxHCtWmBWhrVB+0Av8Rwai8dNTy3bPXWmWCZAkY/omqSj8YSrPMiKPAQXs74wsxKSraNR/tjQn6iZ+HIl/4ygJD4i/gB2+ojvefH6H6ETwNZKjAUtbZJKD4="
); // fill this later with the value from session.save()

exports.telegramLogin = async (req, res) => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
    useWSS: true,
  });
  await client.start({
    phoneNumber: async () => await input.text("Please Enter Phone number"),
    password: async () => await input.text("Please Enter Password"),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  // const TOKEN = client.session.save();
  // const results = await client.invoke(
  //   new Api.messages.GetAllChats({
  //     exceptIds: [7475723],
  //   })
  // );
  // console.log(results.chats[0].id.value);
  // console.log(results.chats[0].title);

  const result = await client.invoke(
    new Api.contacts.GetContacts({
      hash: 3457568,
      limit: 10,
    })
  );
  // result.users.forEach((user, i) => {
  //   console.log(user.firstName);
  //   console.log(i);
  // });
  console.log(result.users[45].firstName);
  const msgs = await client.getMessages(result.users[19].id.value, {
    limit: 10,
  });
  // await client.sendMessage(result.users[45].id.value, {
  //   message: "Ye message code se bhej raha hun 😄",
  //   limit: 20,
  // });

  // const msgs = await client.invoke(
  //   new Api.messages.GetMessages({
  //     id: [result.users[12].id.value],
  //   })
  // );
  console.log(msgs);
  res.send("logged in");
};
