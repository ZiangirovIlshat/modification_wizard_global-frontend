<template>
  <div class="app">
    <div class="main-container">
      <div class="modification-wizard-container">
        <ModificationWizard></ModificationWizard>
      </div>
    </div>
  </div>
</template>

<script setup>
  import ModificationWizard from "./components/ModificationWizard.vue";


</script>

<style lang="scss">
.app {
  color: #343536;
  font-size: 14px;
  font-family: "Roboto", sans-serif;
  line-height: 1.2;
}
.main-container {
  max-width: 1600px;
  padding: 10px;
  margin: 0 auto;
}
.catr-bnt {
  background: url(sprite.css-fa95ae05.svg) no-repeat;
  background-position: 42.74193548387097% 78.75%;
  border: none;
  width: 25px;
  height: 25px;
  cursor: pointer;
}
</style>