const express = require("express");
const bodyParser = require("body-parser");
const generalRoutes = require("./routes/general");
const authRoutes = require("./routes/auth_users");

const app = express();
app.use(bodyParser.json());

app.use("/", generalRoutes);
app.use("/", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
