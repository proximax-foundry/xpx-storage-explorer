<template>
  <ul class="pagination">
    <template v-if="pagination.totalPages < 11">
      <li class="page-item" :class="{ disabled: pagination.pageNumber == 1 }">
        <router-link
          :to="{
            path: '/drives',
            query: {
              pageNumber:
                pagination.pageNumber == 1 ? 1 : pagination.pageNumber - 1,
              pageSize: pagination.pageSize,
            },
          }"
          class="btn btn-link"
          >Prev</router-link
        >
      </li>
      <li
        v-for="n in pagination.totalPages"
        :key="n"
        class="page-item"
        :class="{ active: n == pagination.pageNumber }"
      >
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: n, pageSize: pagination.pageSize },
          }"
          class="btn btn-link"
          >{{ n }}</router-link
        >
      </li>
      <li
        class="page-item"
        :class="{
          disabled: pagination.pageNumber == pagination.totalPages,
        }"
      >
        <router-link
          :to="{
            path: '/drives',
            query: {
              pageNumber:
                pagination.pageNumber == pagination.totalPages
                  ? pagination.totalPages
                  : pagination.pageNumber + 1,
              pageSize: pagination.pageSize,
            },
          }"
          class="btn btn-link"
          >Next</router-link
        >
      </li>
    </template>
    <template v-else-if="pagination.pageNumber == 1">
      <li class="page-item disabled">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: 1, pageSize: pagination.pageSize },
          }"
          class="btn btn-link"
          >Prev</router-link
        >
      </li>
      <li class="page-item active">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: 1, pageSize: pagination.pageSize },
          }"
          class="btn btn-link"
          >1</router-link
        >
      </li>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: 2, pageSize: pagination.pageSize },
          }"
          class="btn btn-link"
          >2</router-link
        >
      </li>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: 3, pageSize: pagination.pageSize },
          }"
          class="btn btn-link"
          >3</router-link
        >
      </li>
      <li class="page-item">
        <span>...</span>
      </li>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: {
              pageNumber: pagination.totalPages,
              pageSize: pagination.pageSize,
            },
          }"
          class="btn btn-link"
          >{{ pagination.totalPages }}</router-link
        >
      </li>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: 2, pageSize: pagination.pageSize },
          }"
          class="btn btn-link"
          >Next</router-link
        >
      </li>
    </template>
    <template v-else-if="pagination.pageNumber == pagination.totalPages">
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: {
              pageNumber: pagination.pageNumber - 1,
              pageSize: pagination.pageSize,
            },
          }"
          class="btn btn-link"
          >Prev</router-link
        >
      </li>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: 1, pageSize: pagination.pageSize },
          }"
          class="btn btn-link"
          >1</router-link
        >
      </li>
      <li class="page-item">
        <span>...</span>
      </li>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: {
              pageNumber: pagination.pageNumber - 2,
              pageSize: pagination.pageSize,
            },
          }"
          class="btn btn-link"
          >{{ pagination.pageNumber - 2 }}</router-link
        >
      </li>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: {
              pageNumber: pagination.pageNumber - 1,
              pageSize: pagination.pageSize,
            },
          }"
          class="btn btn-link"
          >{{ pagination.pageNumber - 1 }}</router-link
        >
      </li>
      <li class="page-item active">
        <router-link
          :to="{
            path: '/drives',
            query: {
              pageNumber: pagination.totalPages,
              pageSize: pagination.pageSize,
            },
          }"
          class="btn btn-link"
          >{{ pagination.totalPages }}</router-link
        >
      </li>
      <li class="page-item disabled">
        <router-link
          :to="{
            path: '/drives',
            query: {
              pageNumber: pagination.totalPages,
              pageSize: pagination.pageSize,
            },
          }"
          class="btn btn-link"
          >Next</router-link
        >
      </li>
    </template>
    <template v-else>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: {
              pageNumber: pagination.pageNumber - 1,
              pageSize: pagination.pageSize,
            },
          }"
          class="btn btn-link"
          >Prev</router-link
        >
      </li>
      <li v-if="pagination.pageNumber - 1 != 1" class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: { pageNumber: 1, pageSize: pagination.pageSize },
          }"
          class="btn btn-link"
          >1</router-link
        >
      </li>
      <li v-if="pagination.pageNumber > 3" class="page-item">
        <span>...</span>
      </li>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: {
              pageNumber: pagination.pageNumber - 1,
              pageSize: pagination.pageSize,
            },
          }"
          class="btn btn-link"
          >{{ pagination.pageNumber - 1 }}</router-link
        >
      </li>
      <li class="page-item active">
        <router-link
          :to="{
            path: '/drives',
            query: {
              pageNumber: pagination.pageNumber,
              pageSize: pagination.pageSize,
            },
          }"
          class="btn btn-link"
        >
          {{ pagination.pageNumber }}
        </router-link>
      </li>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: {
              pageNumber: pagination.pageNumber + 1,
              pageSize: pagination.pageSize,
            },
          }"
          class="btn btn-link"
        >
          {{ pagination.pageNumber + 1 }}
        </router-link>
      </li>
      <li
        v-if="pagination.pageNumber < pagination.totalPages - 2"
        class="page-item"
      >
        <span>...</span>
      </li>
      <li
        v-if="pagination.pageNumber + 1 != pagination.totalPages"
        class="page-item"
      >
        <router-link
          :to="{
            path: '/drives',
            query: {
              pageNumber: pagination.totalPages,
              pageSize: pagination.pageSize,
            },
          }"
          class="btn btn-link"
        >
          {{ pagination.totalPages }}
        </router-link>
      </li>
      <li class="page-item">
        <router-link
          :to="{
            path: '/drives',
            query: {
              pageNumber: pagination.pageNumber + 1,
              pageSize: pagination.pageSize,
            },
          }"
          class="btn btn-link"
        >
          Next
        </router-link>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  name: "DrivesPagination",
  props: {
    pagination: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/main";
@import "spectre.css/src/variables";
@import "spectre.css/src/pagination";

.pagination {
  justify-content: center;
}
</style>
