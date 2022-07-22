<script setup>
import { useBookStore } from "@/stores/books";
import { ref } from "vue";

const store = useBookStore();

defineProps({
  title: String,
  subtitle: String,
  author: String,
  isbn: String,
  image: String,
  borrower: String,
  type: String,
  publishedDate: String,
  imgCode: String,
  set: String,
  volume: Number,
});

let input = ref("");

const getImages = async (code) => {
  store.code = code;
  await store.openPopin("images");
  store.searchImages();
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

const editField = async (e, isbn, initialValue) => {
  if (e.key === "Enter") {
    let newValue;
    e.target.blur();
    e.preventDefault();
    const field = e.target.getAttribute("name");
    newValue =
      field === "volume" ? parseInt(e.target.innerText) : e.target.innerText;

    if (newValue !== initialValue) await store.editField(isbn, field, newValue);
  }
};

const setType = async (isbn, type) => await store.setType(isbn, type);

const openCollections = async (isbn) => {
  document.getElementById(isbn).classList.remove("active");
  store.code = isbn;
  await store.openPopin("collections");
  document.getElementById("collection-search").focus();
};
</script>
<template>
  <div class="book" :id="isbn">
    <button
      type="button"
      class="book-options-button"
      @click="openOptions"
      :data-book="isbn"
    >
      ···
    </button>
    <div class="book-options">
      <ul class="book-options-list">
        <li v-if="!borrower" class="book-option">
          <form @submit="lendBook" :data-book="isbn">
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
        <li v-if="borrower" class="book-option" @click="returnBook(isbn)">
          Retour du livre
        </li>
        <li class="book-option" @click="openCollections(isbn)">
          Ajouter à une collection
        </li>
        <li class="book-option" @click="removeBook(isbn)">
          Supprimer le livre
        </li>
      </ul>
    </div>
    <div
      class="book-cover"
      :style="`background-image: url(data:image/jpg;base64,${imgCode})`"
      @click="getImages(isbn)"
    ></div>
    <div class="book-info">
      <div
        class="book-title"
        contenteditable="true"
        name="title"
        @keypress="editField($event, isbn, title)"
      >
        {{ title }}
      </div>
      <div
        class="book-subtitle"
        contenteditable="true"
        name="subtitle"
        @keypress="editField($event, isbn, subtitle)"
      >
        {{ subtitle }}
      </div>
      <div
        class="book-author"
        contenteditable="true"
        name="author"
        @keypress="editField($event, isbn, author)"
      >
        {{ author }}
      </div>
      <div class="book-collection" v-if="set">
        {{ set }}
        <div
          class="book-collection-volume"
          contenteditable="true"
          name="volume"
          @keypress="editField($event, isbn, volume)"
        >
          {{ volume ? volume : "#" }}
        </div>
      </div>
      <div v-if="borrower">Prêté à {{ borrower }}</div>
      <div class="book-type">
        <button
          :class="type === 'book' ? 'active' : ''"
          type="button"
          @click.self="setType(isbn, 'book')"
        >
          Livre
        </button>
        <button
          :class="type === 'comic' ? 'active' : ''"
          type="button"
          @click.self="setType(isbn, 'comic')"
        >
          BD
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.book {
  display: flex;
  position: relative;
  margin-bottom: 10px;
  padding: 10px 45px 10px 10px;
  border-radius: 5px;
  width: 360px;
  background-color: rgb(226, 226, 226);
  overflow: hidden;

  &-cover {
    display: flex;
    align-items: center;
    margin-right: 10px;
    height: 160px;
    width: 100px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border: 1px solid black;
    cursor: pointer;

    &[lazy="loading"] .loader {
      display: block;
    }

    &[lazy="loaded"] .loader {
      display: none;
    }
  }

  &-info {
    flex: 1;
  }

  &-title {
    font-size: 20px;
    font-weight: bold;
  }

  &-subtitle {
    font-size: 16px;
  }

  &-author {
    margin-top: 10px;
    font-size: 16px;
  }

  &-collection {
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 5px 10px;
    background-color: rgba($color: #000000, $alpha: 0.7);
    width: 100%;

    &-volume {
      font-weight: bold;
      background-color: white;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      padding: 0 12px;
      display: flex;
      align-items: center;
      color: black;
    }
  }

  &-date {
    font-style: italic;
  }

  &-options {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    font-size: 18px;
    border-radius: 5px;
    background-color: rgb(226, 226, 226);
    overflow: hidden;

    &-button {
      position: absolute;
      z-index: 2;
      top: 10px;
      right: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
      font-weight: bold;
      background-color: white;
      border: none;
      cursor: pointer;
      border-radius: 50%;
    }

    &-list {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 0;
      height: 0;
      padding-left: 15px;
      font-size: 16px;
    }
  }

  &.active {
    .book-options {
      left: 0;
      bottom: 0;
      top: 0;
      right: 0;
    }

    .book-options-list {
      width: auto;
      height: 100%;
    }
  }

  &-option {
    margin: 5px 0;
    cursor: pointer;

    input[type="text"] {
      width: 150px;
      margin-right: 15px;
      border: none;
      border-bottom: 1px solid black;
      background-color: transparent;
      color: inherit;
      font-size: inherit;
    }

    button {
      font-weight: bold;
      background-color: transparent;
      border: none;
      font-size: inherit;
      color: inherit;
      cursor: pointer;
    }
  }

  &-type {
    position: absolute;
    bottom: 40px;
    right: 10px;

    button {
      border: none;
      border-radius: 3px;
      width: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      &.active {
        background-color: black;
        color: white;
      }

      &:first-child {
        margin-bottom: 5px;
      }
    }
  }
}

.loader {
  width: 40px;
  height: 40px;
  margin: 100px auto;
  background-color: #333;

  border-radius: 100%;
  -webkit-animation: sk-scaleout 1s infinite ease-in-out;
  animation: sk-scaleout 1s infinite ease-in-out;
}

@-webkit-keyframes sk-scaleout {
  0% {
    -webkit-transform: scale(0);
  }
  100% {
    -webkit-transform: scale(1);
    opacity: 0;
  }
}

@keyframes sk-scaleout {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}

@media only screen and (max-width: 720px) {
  .book {
    width: 100%;

    &-title {
      font-size: 16px;
    }

    &-subtitle {
      font-size: 14px;
    }

    &-author {
      margin-top: 0;
      font-size: 14px;
    }

    &-type button {
      font-size: 14px;
    }

    &-cover {
      height: 140px;
      width: 90px;
    }
  }
}
</style>
