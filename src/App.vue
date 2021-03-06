<script setup>
import BookCard from "@/components/BookCard.vue";
import BookSvg from "@/assets/read-book.svg";
import GridSvg from "@/assets/grid.svg";
import ListSvg from "@/assets/list.svg";
import SearchIcon from "@/assets/search.svg";
import AngleUp from "@/assets/angle-up.svg";
import { useBookStore } from "@/stores/books";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import PopinComponent from "./components/PopinComponent.vue";
const store = useBookStore();
const {
  books,
  listBooks,
  images,
  numberOfBooks,
  activeFilter,
  loading,
  view,
  popin,
  collectionsSearch,
  listCollections,
} = storeToRefs(store);
store.getBooks();

let searchQuery = ref("");
let collection = ref("");

const changeImage = async (event) => {
  let src = event.target.src;
  await store.changeBookImage(store.code, src);
};

const search = async () => {
  store.search(searchQuery.value);
  backToTop();
};

const typeCollection = async () =>
  await store.searchCollection(collection.value);

const addToCollection = async () => {
  await store.addToCollection(collection.value);
};

const filterBooks = async (e) => {
  searchQuery.value = "";
  store.filterBooks(e.target.dataset.filter);
  backToTop();
};

const backToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const changeView = async (e) => {
  store.view = e.target.dataset.view;
};

const fillCollectionSearch = async (e) => {
  collection.value = e.target.innerText;
  await addToCollection(collection.value);
};
</script>

<template>
  <div class="wrapper dark">
    <div class="to-top" @click="backToTop"><AngleUp /></div>
    <div class="length">
      <div>
        <b>{{ view !== "list" ? numberOfBooks : store.allBooks.length }}</b>
        {{
          activeFilter === "book" || activeFilter === "all"
            ? "livre"
            : activeFilter === "comic"
            ? "bd"
            : "collection"
        }}{{ numberOfBooks > 1 ? "s" : "" }}
      </div>
      <div class="view">
        <button
          type="button"
          :class="['view-button', store.view === 'list' ? 'active' : '']"
          @click="changeView"
          data-view="list"
        >
          <ListSvg />
        </button>
        <button
          type="button"
          :class="['view-button', store.view === 'grid' ? 'active' : '']"
          @click="changeView"
          data-view="grid"
        >
          <GridSvg />
        </button>
      </div>
    </div>
    <div v-if="loading" class="loader-container">
      <div class="loader"></div>
    </div>
    <div v-if="!loading">
      <div
        class="grid"
        v-if="view === 'grid' && activeFilter !== 'collections'"
      >
        <BookCard
          v-for="book in books"
          :key="book._id"
          :title="book.title"
          :subtitle="book.subtitle"
          :author="book.author"
          :isbn="book.isbn"
          :image="book.image"
          :borrower="book.borrower"
          :type="book.type"
          :publishedDate="book.publishedDate"
          :imgCode="book.imgCode"
          :set="book.set"
          :volume="book.volume"
        />
      </div>

      <div v-if="view === 'grid' && activeFilter === 'collections'">
        <div v-for="collection in listCollections" :key="collection">
          <div class="collections-title">{{ collection.collection }}</div>
          <div class="grid-collections">
            <BookCard
              v-for="book in collection.books"
              :key="book._id"
              :title="book.title"
              :subtitle="book.subtitle"
              :author="book.author"
              :isbn="book.isbn"
              :image="book.image"
              :borrower="book.borrower"
              :type="book.type"
              :publishedDate="book.publishedDate"
              :imgCode="book.imgCode"
              :set="book.set"
              :volume="book.volume"
            />
          </div>
        </div>
      </div>

      <div class="list" v-if="view === 'list'">
        <div v-for="author in listBooks" :key="author.author">
          <h3>{{ author.author }}</h3>
          <div v-for="book in author.books" :key="book">
            {{ book.title }}
          </div>
        </div>
      </div>
    </div>

    <PopinComponent
      v-if="popin === 'collections'"
      title="Ajouter à une collection"
      id="collections"
    >
      <div class="collections-wrapper">
        <input
          type="text"
          id="collection-search"
          autocomplete="false"
          class="collections-input"
          v-model="collection"
          placeholder="Nom de la collection"
          @keyup="typeCollection"
        />
        <div v-if="collectionsSearch.length">
          <ul class="collection-search">
            <li
              v-for="collection in collectionsSearch"
              :key="collection.name"
              class="collection-search-item"
              @click="fillCollectionSearch"
            >
              {{ collection.name }}
            </li>
          </ul>
        </div>
        <button
          type="button"
          class="collections-submit"
          @click="addToCollection"
        >
          Ajouter
        </button>
      </div>
    </PopinComponent>

    <PopinComponent
      v-if="popin === 'images'"
      title="Choisissez une image"
      id="images"
    >
      <div v-if="images.length" class="images">
        <div v-for="image in images" :key="image" class="image">
          <img :src="image.url" @click="changeImage" />
        </div>
      </div>
    </PopinComponent>

    <h1>
      <div class="display-type" v-if="view !== 'list'">
        <div
          :class="activeFilter === 'book' ? 'active' : ''"
          data-filter="book"
          @click="filterBooks"
        >
          Livres
        </div>
        <div
          :class="activeFilter === 'comic' ? 'active' : ''"
          data-filter="comic"
          @click="filterBooks"
        >
          Bds
        </div>
        <div
          :class="activeFilter === 'collections' ? 'active' : ''"
          data-filter="collections"
          @click="filterBooks"
        >
          Collections
        </div>
        <div
          :class="activeFilter === 'all' ? 'active' : ''"
          data-filter="all"
          @click="filterBooks"
        >
          Tout
        </div>
      </div>

      <div class="logo">
        <BookSvg />
      </div>

      <div class="search" v-if="view !== 'list'">
        <input
          type="text"
          placeholder="Recherche..."
          v-model="searchQuery"
          @keyup="search"
        />
        <SearchIcon class="search-icon" />
      </div>
    </h1>
  </div>
</template>

<style lang="scss">
@import "@/assets/base.css";

.wrapper {
  padding: 0 30px;
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

.grid-collections {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  .book {
    margin-right: 10px;
  }
}

.collections {
  &-title {
    font-size: 24px;
    font-weight: bold;
    margin: 15px 0;
    text-transform: uppercase;
  }

  &-wrapper {
    min-height: 450px;
  }

  &-input {
    width: 100%;
    height: 42px;
    background: transparent;
    border: 1px solid black;
    border-radius: 5px;
    color: inherit;
    font-size: 18px;
    text-align: center;
    font-weight: bold;
  }

  &-submit {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 50px;
    font-size: 18px;
    font-weight: bold;
    border: none;
    cursor: pointer;
  }
}

h1 {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
  text-transform: uppercase;
  position: fixed;
  font-size: inherit;
  z-index: 2;
  left: 0;
  right: 0;
  top: 0;
  background-color: black;
  margin: 0;
  padding: 10px 30px;

  & > div {
    width: 33.33%;
  }
}

.logo {
  width: 40px;
  color: white;
}

.display-type {
  display: flex;
  color: white;
}

.display-type div {
  cursor: pointer;
}

.display-type div.active {
  color: red;
}

.display-type div:not(:last-child) {
  margin-right: 10px;
}

h2 {
  text-align: center;
}

img {
  width: 100px;
}

.length {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-top: 70px;
}

.search {
  display: flex;
  justify-content: flex-end;
}

.search input[type="text"] {
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  border: none;
  padding: 0 5px;
}

.search-icon {
  width: 25px;
  margin-left: 10px;
}

.collection-search {
  max-height: 350px;
  overflow-y: auto;
  margin-top: 10px;

  &-item {
    padding: 15px;
    cursor: pointer;
    font-size: 16px;
    background-color: #202226;
    margin-bottom: 4px;
  }
}

.grid {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.view {
  display: flex;
}

.view-button {
  display: flex;
  background-color: transparent;
  padding: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &.active {
    background-color: rgba(0, 0, 0, 0.137);
  }

  & > * {
    pointer-events: none;
  }
}

.to-top {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  background-color: white;
  padding: 5px;
  cursor: pointer;
}

.loader-container {
  position: fixed;
  display: flex;
  align-items: center;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
}

.loader {
  width: 80px;
  height: 80px;
  margin: 100px auto;
  background-color: #333;

  border-radius: 100%;
  -webkit-animation: sk-scaleout 1s infinite ease-in-out;
  animation: sk-scaleout 1s infinite ease-in-out;
}

body.dark {
  background-color: #35373b;
  color: #c9d1d9;

  .overlay-content {
    background-color: #35373b;
  }

  h1 {
    background-color: #202226;
    color: #c9d1d9;
  }

  .loader-container {
    background-color: #35373b;
  }

  .loader {
    background-color: #c9d1d9;
  }

  .search input[type="text"] {
    background-color: #35373b;
  }

  .book {
    background-color: #202226;

    &-type {
      button {
        background-color: #c9d1d9;

        &.active {
          color: #c9d1d9;
          background-color: black;
        }
      }
    }

    &-options {
      color: #c9d1d9;
      background-color: #202226;

      &-button {
        background-color: #35373b;
        color: #c9d1d9;
      }
    }

    &-option {
      input[type="text"] {
        border-bottom-color: #c9d1d9;
      }
    }
  }

  .collections {
    &-input {
      background: transparent;
      border: none;
      background-color: #202226;
    }

    &-submit {
      color: inherit;
      background-color: #202226;
    }
  }

  .display-type {
    color: #c9d1d9;
  }

  .view-button.active {
    background-color: #202226;
  }
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
  .wrapper {
    padding: 0 10px;
  }

  h1 {
    padding: 10px;

    & > div {
      width: unset;
    }
  }

  .overlay-content {
    width: 85%;
    height: 90%;
    overflow-y: auto;
  }

  .length {
    padding-top: 95px;
  }

  .to-top {
    left: 50%;
    right: unset;
    bottom: 10px;
    transform: translateX(-50%);
  }

  .grid-collections {
    .book {
      margin-right: 0;
    }
  }
}
</style>
