<template>
  <div class="app">
    <div class="main-container">
      <header class="header">
        <div class="header__item logo">
          <a href="https://owen.ru" target="_blabk" title="на главную"></a>
          <img src="https://owen.ru/uploads/312/owen_icons_logo.png" alt="logo">
        </div>
        <div class="header__item cart">
            <Cart/>
        </div>      
      </header>
      <div class="modification-wizard-container">
        <ModificationWizard></ModificationWizard>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Cart from "./components/Cart.vue";
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
.header {
  display: flex;
  justify-content: space-between;
  gap: 10px;

  &__item {
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    height: 70px;
  }
}
.cart {
  width: 70px;
}
.logo {
  width: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  a {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  img {
    width: 70%;
    height: auto;
  }
}
</style>