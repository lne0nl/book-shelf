import { defineStore } from "pinia";
import * as JsonSearch from "search-array";
const URL = import.meta.env.VITE_URL;

export const useBookStore = defineStore("bookStore", {
  state: () => ({
    books: [],
    allBooks: [],
    onlyComics: [],
    onlyBooks: [],
    images: [],
    code: 0,
    imagesVisible: false,
    numberOfBooks: 0,
    activeFilter: "all",
    searchResult: [],
  }),
  actions: {
    async getBooks() {
      const response = await fetch(`${URL}/books`);
      const jsonResponse = await response.json();
      this.allBooks = jsonResponse;
      this.books = this.allBooks;
      this.numberOfBooks = this.books.length;

      this.onlyComics = [];
      this.onlyBooks = [];

      this.books.filter((book) => {
        if (book.type === "comic") this.onlyComics.push(book);
        else this.onlyBooks.push(book);
      });
    },
    async searchImages(code) {
      this.images = [];
      const result = await fetch(`${URL}/books/image/${code}`);
      const data = await result.json();
      this.images = data;
    },
    async changeBookImage(isbn, src) {
      this.books.filter((book) => {
        if (book.isbn === isbn) book.image = src;
      });
      await fetch(`${URL}/books/image/set`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ isbn, src }),
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
        body: JSON.stringify({ isbn, type }),
      });
    },
    async search(searchQuery) {
      this.activeFilter = "all";

      if (searchQuery.length > 0) {
        const searcher = new JsonSearch.default(this.allBooks);
        const foundBooks = searcher.query(searchQuery);
        this.books = foundBooks;
      } else {
        this.books = this.allBooks;
      }
      this.numberOfBooks = this.books.length;
    },
    async editField(isbn, field, newValue) {
      await fetch(`${URL}/books/edit`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ isbn, field, newValue }),
      });

      const book = this.books.find((o) => o.isbn === isbn);
      const bookIndex = this.books.indexOf(book);
      this.books[bookIndex][field] = newValue;
    },
    async filterBooks(filter) {
      if (filter !== this.activeFilter) {
        this.activeFilter = filter;
        if (filter === "comic") this.books = this.onlyComics;
        else if (filter === "book") this.books = this.onlyBooks;
        else this.books = this.allBooks;

        this.numberOfBooks = this.books.length;
      }
    },
  },
});
