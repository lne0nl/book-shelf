<script setup>
import BookSvg from "@/assets/read-book.svg";
import { useBookStore } from "@/stores/books";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const store = useBookStore();
const { books, imagesVisible, images, numberOfBooks } = storeToRefs(store);
store.getBooks();

let input = ref("");

const togglePopin = () => {
  store.imagesVisible = !store.imagesVisible;
};

const getImages = (code) => {
  store.code = code;
  store.searchImages(code);
};

const changeImage = async (event) => {
  let src = event.target.src;
  await store.changeBookImage(store.code, src);
  togglePopin();
};

const openOptions = (event) => {
  const book = document.getElementById(event.target.dataset.book);
  if (book.classList.contains("active")) {
    book.classList.remove("active");
  } else {
    book.classList.add("active");
  }
};

const lendBook = async (e) => {
  e.preventDefault();
  const borrower = input.value;
  const bookISBN = e.target.dataset.book;
  document.getElementById(bookISBN).classList.remove("active");
  await store.lendBook(bookISBN, borrower);
};

const returnBook = async (isbn) => {
  document.getElementById(isbn).classList.remove("active");
  await store.returnBook(isbn);
};

const removeBook = async (isbn) => {
  document.getElementById(isbn).classList.remove("active");
  await store.removeBook(isbn);
};

const setType = async (isbn, type) => await store.setType(isbn, type)
</script>

<template>
  <h5 class="length">
    Actuellement {{ numberOfBooks }} livres dans la bibliothèque
  </h5>
  <div class="shelf">
    <div v-for="book in books" :key="book">
      <div class="book" :id="book.isbn">
        <div
          class="cover"
          :style="`background-image: url(${book.image})`"
          @click="
            togglePopin();
            getImages(book.isbn);
          "
        ></div>
        <div class="info">
          <div class="book-options">
            <button
              type="button" 
              class="book-options-button"
              @click="openOptions"
              :data-book="book.isbn"
            >
              ···
            </button>
            <ul class="book-options-list">
              <li v-if="!book.borrower" class="book-option">
                <form @submit="lendBook" :data-book="book.isbn">
                  <label>
                    Prêter le livre à
                    <input
                      name="name"
                      type="text"
                      v-model="input"
                      autocomplete="false"
                    />
                  </label>
                  <button type="submit">OK</button>
                </form>
              </li>
              <li v-if="book.borrower" class="book-option" @click="returnBook(book.isbn)">
                Retour du livre
              </li>
              <li class="book-option">Ajouter à une collection</li>
              <li class="book-option" @click="removeBook(book.isbn)">
                Supprimer le livre
              </li>
            </ul>
          </div>
          <div class="title">{{ book.title }}</div>
          <div class="subtitle" v-if="book.subtitle">
            {{ book.subtitle }}
          </div>
          <div class="author">{{ book.author }}</div>
          <div class="date">
            {{ book.publishedDate }}
          </div>
          <div v-if="book.borrower">Prêté à {{ book.borrower }}</div>
          <div class="book-type">
            <button :class="book.type === 'book' ? 'active' : ''" type="button" @click="setType(book.isbn, 'book')">
              Livre
            </button>
            <button :class="book.type === 'comic' ? 'active' : ''" type="button" @click="setType(book.isbn, 'comic')">
              BD
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="imagesVisible" class="popin">
    <div class="overlay" @click="togglePopin"></div>
    <div class="overlay-content">
      <div v-if="images.length" class="images">
        <div v-for="image in images" :key="image" class="image">
          <img :src="image.url" @click="changeImage" />
        </div>
      </div>
    </div>
  </div>
  <h1>
    <div class="logo">
      <BookSvg />
    </div>
  </h1>
</template>

<style>
@import "@/assets/base.css";

.overlay {
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.589);
}

.overlay-content {
  position: fixed;
  z-index: 100;
  max-width: 95%;
  top: 50%;
  left: 50%;
  max-height: 95%;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  transform: translate(-50%, -50%);
}

.images {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
}

.image {
  margin: 0 5px;
}

h1 {
  text-align: center;
  text-transform: uppercase;
  position: fixed;
  z-index: 2;
  left: 0;
  right: 0;
  top: 0;
  background-color: black;
  margin: 0;
  padding: 10px;
}

.logo {
  display: flex;
  align-items: center;
  width: 40px;
  margin: auto;
  color: white;
}

h2 {
  text-align: center;
}

img {
  width: 100px;
}

.length {
  margin-top: 70px;
}

.shelf {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.book {
  position: relative;
  display: flex;
  margin-bottom: 10px;
  padding: 10px 45px 10px 10px;
  border-radius: 5px;
  width: 400px;
  background-color: rgba(0, 0, 0, 0.137);
}

.book-options {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 25.33px;
  height: 17px;
  font-size: 18px;
  border-radius: 8px;
  background-color: white;
  overflow: hidden;
  color: white;
}

.book.active .book-options {
  z-index: 1;
  left: 10px;
  bottom: 10px;
  top: 10px;
  right: 10px;
  width: auto;
  height: auto;
  color: black;
}

.book-options-button {
  position: absolute;
  top: 0;
  right: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.book-options-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding-left: 15px;
}

.book-option {
  margin: 5px 0;
  cursor: pointer;
}

.book-option input[type="text"] {
  width: 150px;
  margin-right: 15px;
  border: none;
  border-bottom: 1px solid black;
  font-size: inherit;
}

.book-option button {
  font-weight: bold;
  background-color: transparent;
  border: none;
  font-size: inherit;
  cursor: pointer;
}

.book-type {
  position: absolute;
  display: flex;
  bottom: 10px;
  right: 10px;
}

.book-type button {
  border: none;
  padding: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.book-type button.active {
  background-color: rgb(83, 139, 78);
  color: white;
}

.book-type button:first-child {
  margin-right: 10px;
}

.cover {
  margin-right: 10px;
  height: 160px;
  width: 100px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border: 1px solid black;
  cursor: pointer;
}

.info {
  flex: 1;
}

.title {
  font-size: 22px;
  font-weight: bold;
}

.subtitle {
  font-size: 16px;
}

.author {
  margin-top: 10px;
  font-size: 16px;
}

.date {
  font-style: italic;
}

@media only screen and (max-width: 1024px) {
  .overlay-content {
    width: 85%;
    height: 90%;
    overflow-y: auto;
  }
}
</style>
