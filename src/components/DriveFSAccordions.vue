<template>
  <div v-if="files.length == 0 && folders.length == 0" class="empty">
    <div class="empty-title h5">No Folders or Files</div>
  </div>
  <div v-else class="columns my-2">
    <div class="column col-12 divider" data-content="Browse"></div>
    <div
      v-if="folders.length > 0"
      class="accordion mt-2 column col-6 col-md-12"
    >
      <input
        id="accordion-folders"
        type="checkbox"
        name="accordion-checkbox"
        hidden
      />
      <label class="accordion-header" for="accordion-folders">
        <i class="icon icon-arrow-right mr-1"></i>
        <FontAwesomeIcon
          :icon="['fas', 'folder-open']"
          size="lg"
          class="mr-2"
        />
        Folder(s)
      </label>
      <div class="accordion-body">
        <ul class="menu menu-nav">
          <li
            v-for="item in folders"
            :key="item.Cid"
            class="menu-item tile tile-centered"
          >
            <div class="tile-content text-ellipsis">
              <div class="tile-title h5">
                <router-link
                  :to="{
                    name: 'Drive',
                    params: { cid: $route.params.cid.concat(item.Name) },
                  }"
                >
                  {{ item.Name }}
                </router-link>
              </div>
              <div class="tile-subtitle text-gray">
                Cid:
                <b>{{ item.Cid["/"] }}</b>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="files.length > 0" class="accordion mt-2 column col-6 col-md-12">
      <input
        id="accordion-files"
        type="checkbox"
        name="accordion-checkbox"
        hidden
      />
      <label class="accordion-header" for="accordion-files">
        <i class="icon icon-arrow-right mr-1"></i>
        <FontAwesomeIcon :icon="['fas', 'file-alt']" size="lg" class="mr-2" />
        File(s)
      </label>
      <div class="accordion-body">
        <ul class="menu menu-nav">
          <li
            v-for="item in files"
            :key="item.Cid"
            class="menu-item tile tile-centered"
          >
            <div class="tile-content text-ellipsis">
              <div class="tile-title h5">
                {{ item.Name }}
              </div>
              <div class="tile-subtitle text-gray">
                Size:
                <b>{{ $filters.bytesToSize(item.Size) }}</b>
                · Cid:
                <b>{{ item.Cid["/"] }}</b>
              </div>
            </div>
            <div class="tile-action">
              <a
                class="btn btn-link"
                :href="driveFileHttp($route.params.cid[0], item.Cid['/'])"
                :download="item.Name"
              >
                <i class="icon icon-download"></i>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFolderOpen, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { inject } from "vue";

export default {
  name: "DriveFSAccordions",
  components: {
    FontAwesomeIcon,
  },
  props: {
    files: {
      type: Array,
      default: () => [],
    },
    folders: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const siriusStore = inject("siriusStore");
    library.add(faFolderOpen, faFileAlt);

    return {
      driveFileHttp: siriusStore.driveFileHttp,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/main";
@import "spectre.css/src/variables";
@import "spectre.css/src/mixins/text";
@import "spectre.css/src/mixins/shadow";
@import "spectre.css/src/accordions";
@import "spectre.css/src/menus";
@import "spectre.css/src/tiles";

.divider {
  border-top: $border-width solid $secondary-color;

  &[data-content]::after {
    color: $primary-color;
  }
}
</style>
