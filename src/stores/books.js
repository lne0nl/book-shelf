import { defineStore } from "pinia";
const URL = import.meta.env.VITE_URL;

export const useBookStore = defineStore("bookStore", {
  state: () => ({
    books: [],
    images: [],
    code: 0,
    imagesVisible: false,
    numberOfBooks: 0,
  }),
  actions: {
    async getBooks() {
      this.books = [];
      const result = await fetch(`${URL}/books`);
      const data = await result.json();
      this.books = data;
      this.numberOfBooks = this.books.length;
    },
    async searchImages(code) {
      this.images = [];
      const result = await fetch(`${URL}/books/image/${code}`);
      const data = await result.json();
      this.images = data;
    },
    async changeBookImage(code, src) {
      this.books.filter((book) => {
        if (book.isbn === code) book.image = src;
      });
      await fetch(`${URL}/books/image/set`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ code, src }),
      });
    },
    async lendBook(bookISBN, borrower) {
      this.books.filter((book) => {
        if (book.isbn === bookISBN) {
          book.borrower = borrower;
        }
      });
      await fetch(`${URL}/books/lend`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ bookISBN, borrower }),
      });
    },
    async returnBook(isbn) {
      this.books.filter((book) => {
        if (book.isbn === isbn) {
          book.borrower = "";
        }
      });
      await fetch(`${URL}/books/return/${isbn}`);
    },
    async removeBook(isbn) {
      const book = this.books.find((o) => o.isbn === isbn);
      const bookIndex = this.books.indexOf(book);
      this.books.splice(bookIndex, 1);
      await fetch(`${URL}/books/remove/${isbn}`);
    },
    async setType(isbn, type) {
      const book = this.books.find((o) => o.isbn === isbn);
      const bookIndex = this.books.indexOf(book);
      this.books[bookIndex].type = type;

      await fetch(`${URL}/books/type`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ isbn, type })
      });
    }
  },
});
