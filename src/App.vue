<template>
  <div class="configurator">
    <div class="main-container">
      <TopLine/>
      <main>
        <ModificationWizard></ModificationWizard>
      </main>
    </div>
  </div>
</template>

<script setup>
  import TopLine from "./components/TopLine.vue";
  import ModificationWizard from "./components/ModificationWizard.vue";


</script>

<style lang="scss">

body::-webkit-scrollbar {
  width: 8px;
}
body::-webkit-scrollbar-track {
  background: #d6d6d6;
}
body::-webkit-scrollbar-thumb {
  background-color: #343536;
}

#app {
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
</style>