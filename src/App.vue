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

html {
  scrollbar-width: thin;

  &::-webkit-scrollbar { width: 8px; }
}

#app {
  color: #343536;
  font-size: 14px;
  font-family: "Roboto", sans-serif;
  line-height: 1.2;
}
.main-container {
  max-width: 1800px;
  padding: 10px;
  margin: 0 auto;
}
</style>