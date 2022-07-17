<script setup>
import { useBookStore } from "@/stores/books";
import { ref } from "vue";

const store = useBookStore();

const props = defineProps({
  title: String,
  subtitle: String,
  author: String,
  isbn: String,
  image: String,
  borrower: String,
  type: String,
  publishedDate: String,
  imgCode: String,
});

let input = ref("");
let imgCode = ref(props.imgCode);

const imgCSS = {
  backgroundImage: `url("data:image/jpg;base64,${imgCode.value}")`,
};

const togglePopin = () => {
  store.imagesVisible = !store.imagesVisible;
};

const getImages = (code) => {
  store.code = code;
  store.searchImages(code);
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
    e.target.blur();
    e.preventDefault();
    const field = e.target.getAttribute("name");
    const newValue = e.target.innerText;

    if (newValue !== initialValue) await store.editField(isbn, field, newValue);
  }
  // v-lazy:background-image="imgCode"
};

const setType = async (isbn, type) => await store.setType(isbn, type);
</script>
<template>
  <div class="book" :id="isbn">
    <div
      class="book-cover"
      :style="imgCSS"
      @click="
        togglePopin();
        getImages(isbn);
      "
    >
      <!-- <div class="loader"></div> -->
    </div>
    <div class="book-info">
      <div class="book-options">
        <button
          type="button"
          class="book-options-button"
          @click="openOptions"
          :data-book="isbn"
        >
          ···
        </button>
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
          <li class="book-option">Ajouter à une collection</li>
          <li class="book-option" @click="removeBook(isbn)">
            Supprimer le livre
          </li>
        </ul>
      </div>
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
      <div class="book-date">
        {{ publishedDate }}
      </div>
      <div v-if="borrower">Prêté à {{ borrower }}</div>
      <div class="book-type">
        <button
          :class="type === 'book' ? 'active' : ''"
          type="button"
          @click="setType(isbn, 'book')"
        >
          Livre
        </button>
        <button
          :class="type === 'comic' ? 'active' : ''"
          type="button"
          @click="setType(isbn, 'comic')"
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
  background-color: rgba(0, 0, 0, 0.137);

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

  &-date {
    font-style: italic;
  }

  &-options {
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

    &-button {
      position: absolute;
      top: 0;
      right: 0;
      background-color: transparent;
      border: none;
      cursor: pointer;
    }

    &-list {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      padding-left: 15px;
    }
  }

  &.active .book-options {
    z-index: 1;
    left: 10px;
    bottom: 10px;
    top: 10px;
    right: 10px;
    width: auto;
    height: auto;
    color: black;
  }

  &-option {
    margin: 5px 0;
    cursor: pointer;

    input[type="text"] {
      width: 150px;
      margin-right: 15px;
      border: none;
      border-bottom: 1px solid black;
      font-size: inherit;
    }

    button {
      font-weight: bold;
      background-color: transparent;
      border: none;
      font-size: inherit;
      cursor: pointer;
    }
  }

  &-type {
    position: absolute;
    display: flex;
    bottom: 10px;
    right: 10px;

    button {
      border: none;
      border-radius: 5px;;
      padding: 8px;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      &.active {
        background-color: black;
        color: white;
      }

      &:first-child {
        margin-right: 5px;
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
