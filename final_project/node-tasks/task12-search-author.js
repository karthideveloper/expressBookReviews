const axios = require("axios");

async function getBooksByAuthor() {
  try {
    const response = await axios.get(
      "http://localhost:5000/books/author/Rowling"
    );
    console.log("Books by Author:\n", response.data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

getBooksByAuthor();
