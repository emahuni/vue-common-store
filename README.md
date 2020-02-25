# vue-common-store

A [Vue.js](http://vuejs.org) plugin that makes it easy to share reactive data between components, with useful functionality.

This plugin can work alongside the official VueJS state management plugin, [Vuex](https://github.com/vuejs/vuex). There are some times when you need to share state with lean code that has no restrictions.

## Installation

##### 1.) Install package:
 
 via Yarn

```
$ yarn add vue-common-store
```

via NPM

```
$ npm install vue-common-store
```

##### 2.) Install plugin within project.
```js
import Vue from 'vue';
import VueStash from 'vue-common-store';

Vue.use(VueStash)
```

if you use Quasar, or something similar, do this in boot file. NB: this skips next step (Initialize your store object), as you are doing it here.
```js
export default function ({ app, Vue }) {
 app.data = {
  cstore: {
      user: {
          name: 'cody'
      }
  }
 }
};
```

or

```js
window.Vue = require('vue');
require('vue-common-store');
```

## Usage

##### 1.) Initialize your store object.
Your store object is nothing more than a simple Javascript object set within your root vue model's `$data` option; Think of it as your "shared data option". Make sure you pre-initialize any properties that you want to be reactive, just like always.

```js
new Vue({
    el: '#app',
    data: {
        cstore: {
            user: {
                name: 'cody'
            }
        }
    }
})
```

_Alternatively, you can import your store from another file._
```js
import cstore from './store';

new Vue({
    el: '#app',
    data: { cstore }
})
```

_store.js_
```js
export default {
    user: {
        name: 'cody'
    }
}
```

##### 2.) Add a "store" option to any child components that need to access data from the store.

*Example 1: Simplest usage*
```js
Vue.component('user-card', {
    cstore: ['user'],
    // Use `ready` for Vue 1.x
    mounted() {
        console.log(this.user.name); // 'cody'
        this.user.name = 'john doe';
        console.log(this.user.name); // 'john doe'
    }
});
```

*Example 2: Object store*

```js
Vue.component('user-card', {
    cstore: {
        user: 'user'
    },
    // Use `ready` for Vue 1.x
    mounted() {
        console.log(this.user.name); // 'cody'
        this.user.name = 'john doe';
        console.log(this.user.name); // 'john doe'
    }
});
```

*Example 3: Access nested store property*

```js
Vue.component('user-card', {
    cstore: {
        name: 'user.name'
    },
    // Use `ready` for Vue 1.x
    mounted() {
        console.log(this.name); // 'cody'
        this.name = 'john doe';
        console.log(this.name); // 'john doe'
    }
});
```

*Example 4: Dynamic store access*

```js
Vue.component('user-card', {
    cstore: {
        name(store, vm) {
            // passed in the root.cstore and 'user-card' vm for easier ref. 'this' refers to the vm.cstore (NB: function is not a lambda)
            // return the data that is dynamically calculated
            return store.user.name;
        },
    
        hasName(store, vm) {
            return !!store.user.name;
        }
    },
    // Use `ready` for Vue 1.x
    mounted() {
        console.log(this.name); // 'cody'
        console.log(this.hasName); // true
        // this.name = 'john doe'; // can't be done, yet
        // console.log(this.name); // 'john doe'
    }
});
```

*Note: The end result of examples 1-4 are equivalent.*

##### 3.) Access the store directly.
This plugin sets `Vue.prototype.$cstore` which allows any component to access the store via `vm.$cstore`.
```js
Vue.component('user-card', {
    // Use `ready` for Vue 1.x
    mounted() {
        console.log(this.$cstore.user.name); // 'cody';
        // this.$cstore.user.name = 'john doe'; // not working yet WIP
        // console.log(this.$cstore.user.name); // 'john doe';
    }
});
```

## Author
Emmanuel Mahuni - vue-common-store

## Attribution
Cody Mercer - vue-stash
Sean Ferguson - vue-stash-nested


## License

[MIT](http://opensource.org/licenses/MIT)
