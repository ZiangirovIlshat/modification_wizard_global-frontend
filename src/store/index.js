import { createStore } from "vuex";

import cart from "./modules/cart";
import limit from "./modules/modificationWizard/limit";
import vpiType from "./modules/modificationWizard/vpiType";

export default createStore({
  modules: {
    cart,
    limit,
    vpiType,
  }
});