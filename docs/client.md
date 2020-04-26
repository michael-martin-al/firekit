# Client Interface
## Purpose
Make calls to a service to fetch/update/create/delete data, usually asynchronously

---

## Exports 

### load : Function
**Returns** Async Function with a `key` property
 
a function that accepts a Model() function as its first argument and returns an async function which will fetch a single resource. The async function must also have a property called `key` that contains a string or array which uniquely identifies the data that will be loaded. This `key` value will be used to identify the returned resource in cache.

 ```javascript
 export function load({
   Model, /* A Model() creator */
   ...
   /* any additional config values necessary for target backend */
 }) {

   async function loader() {
     /* 1. do some loading */
     /* 2. Use Model creator function to create a Model instance */
     /* 3. Return the Model instance */
   }

   loader.key = `some unique id` // an unique array or string identifier
   
   return loader
 }
 ```
 
---

### loadCollection
**Returns** Async Function with a `key` property

 a function that accepts a Model() function as its first argument and returns an async function which will fetch a collection of resources. The async function must also have a property called `key` that contains a string or array which uniquely identifies the data that will be loaded. This `key` value will be used to identify the returned resource in cache.

```javascript
export function loadCollection({
  Model, /* A Model() creator */
  ...
  /* any additional config values necessary for target backend */
}) {

  async function loader() {
    /* 1. do some loading */
    /* 2. map through the results from the backend */
    /* 3. Use Model creator function to create an array of Models */
    /* 4. Return the Models[] array */
  }
  
  loader.key = `some unique id` // a unique array or string identifier
  
  return loader
}
```
---

### create
**Returns** Promise

an async function that creates a new resource on the target backend

```javascript
export async function create({
  model: An instance of a Model with magic $ methods,
  ...
  /* any additional config values necessary for target backend */
}) {
  /* check `model.$valid` */
  /* throw Error if not valid */
  /* Otherwise, do some creating and return promise */
}
```

---

### update
**Returns** Promise

an async function that updates an existing resource on the target backend

```javascript
export async function update({
  model: An instance of a Model with magic $ methods,
  ...
  /* any additional config values necessary for target backend */
}) {
  /* check `model.$valid` */
  /* throw Error if not valid */
  /* Otherwise, do some updating and return promise */
}
```

---

### del
**Returns** Promise

an async function that deletes an existing resource on the target backend

```javascript
export async function del({
  /* any config values necessary for target backend */  
}) {
  /* Do some deleting and return promise */
}
```





