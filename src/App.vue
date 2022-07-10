<script setup>
import BookCard from "./components/BookCard.vue";
import BookSvg from "@/assets/read-book.svg";
import SearchIcon from "@/assets/search.svg";
import { useBookStore } from "@/stores/books";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const store = useBookStore();
const { books, imagesVisible, images, numberOfBooks, activeFilter } =
  storeToRefs(store);
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
};

const filterBooks = async (e) => {
  searchQuery.value = "";
  store.filterBooks(e.target.dataset.filter);
};
</script>

<template>
  <div class="length">
    <div>
      <b>{{ numberOfBooks }}</b> livre{{ numberOfBooks > 1 ? "s" : "" }}
    </div>
  </div>
  <div class="shelf">
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
    />
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
    <div class="display-type">
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

    <div class="search">
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

.shelf {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

@media only screen and (max-width: 1024px) {
  .overlay-content {
    width: 85%;
    height: 90%;
    overflow-y: auto;
  }

  .length {
    margin-top: 95px;
  }
}
</style>
