<template>
    <header class="header">
        <nav>
            <ul class="header__menu">
                <li>
                    <div class="header__menu-item logo">
                        <a href="https://owen.ru" target="_blabk" title="на главную"></a>
                        <img src="https://owen.ru/uploads/312/owen_icons_logo.png" alt="logo">
                    </div>
                </li>
                <li><div class="header__arrow"></div></li>
                <li>
                    <div class="header__menu-item">
                        <a href="/" title="Умный конфигуратор"></a>
                        Умный конфигуратор
                    </div>
                </li>
                <li><div class="header__arrow"></div></li>
                <li>
                    <div class="header__menu-item">
                        <a href="/" title="Выбор датчиков"></a>
                        Выбор датчиков
                    </div>
                </li>
            </ul>
        </nav>

        <div class="header__menu-item cart">
            <Cart/>
        </div>
    </header>
</template>

<script>
    import Cart from "./Cart.vue";

    export default {
        name: "TopLine",

        components: {
            Cart,
        }
    }
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  gap: 10px;

  &__menu {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
  }

  &__menu-item {
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    cursor: pointer;

    @media (max-width: 768px) {
        height: 40px;
    }
  }

  &__arrow {
    border: 8px solid transparent;
    border-left: 12px solid;
    margin: 0 0 0 10px;

    @media (max-width: 768px) {
        display: none;
    }
  }
}

.cart {
    width: 60px;
    padding: 0;
}

.logo {
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 3px;

    a {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    img {
        width: 80%;
        height: auto;
    }
}
</style>