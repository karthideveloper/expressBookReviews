const axios = require("axios");

async function getAllBooks() {
  try {
    const response = await axios.get("http://localhost:5000/books");
    console.log("All Books:\n", response.data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

getAllBooks();
