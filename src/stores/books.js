import { defineStore } from "pinia";
import * as JsonSearch from "search-array";
import * as Utils from "@/utils";
const URL = import.meta.env.VITE_URL;

export const useBookStore = defineStore("bookStore", {
  state: () => ({
    books: [],
    allBooks: [],
    onlyComics: [],
    onlyBooks: [],
    listBooks: [],
    images: [],
    code: 0,
    numberOfBooks: 0,
    activeFilter: "all",
    searchResult: [],
    loading: true,
    view: "grid",
    popin: "",
    collections: [],
    collectionsSearch: [],
  }),
  actions: {
    async getBooks() {
      try {
        this.loading = true;
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

        const collections = [];

        this.allBooks.forEach((book) => {
          if (book.set && !collections.includes(book.set)) {
            collections.push(book.set);
            this.collections.push({ name: book.set });
          }
        });

        this.listBooks = Utils.getBooksList(this.allBooks);
      } finally {
        this.loading = false;
      }
    },
    async searchImages() {
      this.images = [];
      const result = await fetch(`${URL}/books/image/${this.code}`);
      const data = await result.json();
      this.images = data;
    },
    async changeBookImage(isbn, src) {
      try {
        const response = await fetch(`${URL}/books/image/set`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ isbn, src }),
        });
        const json = await response.json();
        this.books.filter((book) => {
          if (book.isbn === isbn) book.imgCode = json.imgCode;
        });
      } finally {
        this.popin = "";
      }
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
        const searcher = new JsonSearch.default(this.allBooks, {
          indice: {
            title: "title",
            author: "author",
            subtitle: "subtitle",
            set: "set",
          },
        });
        const foundBooks = searcher.query(`"${searchQuery}"`);
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
    async addToCollection(collection) {
      try {
        await fetch(`${URL}/books/set/add`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ isbn: this.code, collection }),
        });
      } finally {
        this.popin = "";
      }
    },
    async searchCollection(collection) {
      const searcher = new JsonSearch.default(this.collections);
      const foundCollections = searcher.query(`"${collection}"`, {
        indice: {
          name: "name",
        },
      });
      this.collectionsSearch = foundCollections;
    },
  },
});
