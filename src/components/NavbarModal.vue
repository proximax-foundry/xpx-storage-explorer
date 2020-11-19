<template>
  <div id="navbarModal" class="modal" :class="{ active : modalActive }">
    <div class="modal-overlay" aria-label="Close" @click="$emit('update:modalActive', false)"></div>
    <div class="modal-container">
      <div id="navbarEnd" class="modal-header">
        <button href="#close" class="btn btn-clear float-right" aria-label="Close" @click="$emit('update:modalActive', false)"></button>
      </div>
      <div id="navbarSearch" class="modal-body">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modalActive: Boolean,
  },
};
</script>
