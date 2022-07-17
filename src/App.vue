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
const store = useBookStore();
const {
  books,
  listBooks,
  imagesVisible,
  images,
  numberOfBooks,
  activeFilter,
  loading,
  view,
} = storeToRefs(store);
store.getBooks();

let searchQuery = ref("");

const togglePopin = () => {
  store.imagesVisible = !store.imagesVisible;
};

const changeImage = async (event) => {
  let src = event.target.src;
  await store.changeBookImage(store.code, src);
  togglePopin();
};

const search = async () => {
  store.search(searchQuery.value);
  backToTop();
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
</script>

<template>
  <div class="to-top" @click="backToTop"><AngleUp /></div>
  <div class="length">
    <div>
      <b>{{ view !== "list" ? numberOfBooks : store.allBooks.length }}</b>
      livre{{ numberOfBooks > 1 ? "s" : "" }}
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
    <div class="grid" v-if="view === 'grid'">
      <BookCard
        v-for="book in books"
        :key="book"
        :title="book.title"
        :subtitle="book.subtitle"
        :author="book.author"
        :isbn="book.isbn"
        :image="book.image"
        :borrower="book.borrower"
        :type="book.type"
        :publishedDate="book.publishedDate"
        :imgCode="book.imgCode"
      />
    </div>
    <div class="list" v-if="view === 'list'">
      <div v-for="author in listBooks" :key="author">
        <h3>{{ author.author }}</h3>
        <div v-for="book in author.books" :key="book">
          {{ book.title }}
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
</template>

<style lang="scss">
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
  padding: 10px;
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

.display-type div:nth-child(2) {
  margin: 0 10px;
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
  margin-top: 70px;
}

.search {
  color: white;
  display: flex;
}

.search input[type="text"] {
  font-size: inherit;
  font-family: inherit;
}

.search-icon {
  width: 25px;
  margin-left: 10px;
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
  top: 56px;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
}

.loader {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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
  .overlay-content {
    width: 85%;
    height: 90%;
    overflow-y: auto;
  }

  .length {
    margin-top: 95px;
  }

  .to-top {
    left: 50%;
    right: unset;
    bottom: 10px;
    transform: translateX(-50%);
  }
}
</style>
