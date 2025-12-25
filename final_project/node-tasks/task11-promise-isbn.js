const axios = require("axios");

axios
  .get("http://localhost:5000/books/isbn/1")
  .then((response) => {
    console.log("Book by ISBN:\n", response.data);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
