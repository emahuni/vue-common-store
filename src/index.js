import StoreAccessor from './store-accessor';

function plugin (Vue) {

  if (plugin.installed) {
    return;
  }

  // console.debug(`index.js-9: plugin() - Vue.prototype: %o`, Vue.prototype);

  // Register a global mixin to manage the getters/setters for our store.
  Vue.mixin({
    /**
     * The 'beforeCreate' life-cycle hook for Vue 2.0
     *
     * @return {void}
     */
    beforeCreate () {
      registerStore(this);
    },

    /**
     * The 'init' life-cycle hook for Vue 1.0
     *
     * @return {void}
     */
    init () {
      registerStore(this);
    },
  });
}

function registerStore (vm) {
  // Initialize the computed option if it hasn't already been initialized.
  if (typeof vm.$options.computed === 'undefined') {
    vm.$options.computed = {};
  }

  // add direct access to store on this vm
  vm.$options.computed.$cstore = function () {
    return vm.$root.cstore;
  };

  // 1.) Check for a store "option" on the component.
  // 2.) Check for a store "object" on the root vue model.
  if (typeof vm.$options.cstore !== 'undefined' && typeof vm.$root.cstore !== 'undefined') {
    // Check if the store option is a non-empty array.
    if (Array.isArray(vm.$options.cstore)) {
      // Loop through the elements of the "store" option.
      vm.$options.cstore.forEach(property => {
        // Create a computed property using our StoreAccessor helper class.
        vm.$options.computed[property] = new StoreAccessor(property);
      });
    } else {
      // Loop through the store options.
      for (var key in vm.$options.cstore) {
        if (typeof vm.$options.cstore[key] == 'function') {
          // Handle a function
          vm.$options.computed[key] = new StoreAccessor(vm.$options.cstore[key](vm.$root.cstore, vm));
        } else if (typeof vm.$options.cstore[key] == 'string') {
          // Handle a string
          vm.$options.computed[key] = new StoreAccessor(vm.$options.cstore[key]);
        }
      }
    }
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

export default plugin;
