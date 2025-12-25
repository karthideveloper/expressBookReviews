const express = require("express");
const bodyParser = require("body-parser");

const generalRoutes = require("./router/general");
const authRoutes = require("./router/auth_users");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.use("/", generalRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
