export default function (key) {
  return {
    get () {
      let path = key.split('.');
      return path.reduce((pValue, cValue) => {
        return pValue[cValue];
      }, getOwnerStore(this, path[0]));
    },

    set (value) {
      let path = key.split('.');
      let length = path.length - 1;
      let store = getOwnerStore(this, path[0]);

      for (let i = 0; i < length; i++) {
        if (store.hasOwnProperty(path[i])) {
          store = store[path[i]];
        }
      }

      store[path[length]] = value;
    },
  };
}

function getOwnerStore (src, key) {
  do {
    if (typeof src.$data.cstore !== 'undefined' && typeof src.$data.cstore[key] !== 'undefined')
      return src.cstore;
  } while (src = src.$parent);

  throw new Error(`unable to get cstore key: ${key}`);
}
