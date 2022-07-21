<script setup>
import { useBookStore } from "@/stores/books";
const store = useBookStore();

defineProps({
  title: String,
});

const closePopin = () => {
  store.closePopin();
};
</script>
<template>
  <div class="popin-overlay" @click.self="closePopin">
    <div class="popin-content">
      <h2>{{ title }}</h2>
      <slot></slot>
    </div>
  </div>
</template>
<style lang="scss">
.popin {
  &-overlay {
    position: absolute;
    z-index: 100;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
  }

  &-content {
    position: fixed;
    z-index: 101;
    overflow: hidden;
    max-width: 95%;
    max-height: 95%;
    top: 50%;
    left: 50%;
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    transform: translate(-50%, -50%);
  }
}

.dark {
  .popin {
    &-content {
      background-color: #35373b;
    }
  }
}

@media only screen and (max-width: 720px) {
  .popin {
    &-content {
      width: 85%;
      height: 90%;
      overflow-y: auto;
    }
  }
}
</style>
