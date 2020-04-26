# useModel Hook

## Purpose
- Manage all of the various UI states that occur when fetching data asynchronously
- Fetch the data from a backend using a Client
- Store the data in a local cache using `react-query`
- Handle form interactions: field value changes, updates, creates, deletes

```javascript
function useModel({
  /* function for loading a single resource */
  loadModel, 
  
  /* function for saving (upsert?) a single resource */
  saveModel, 
  
  /* function for deleting a single resource */  
  deleteModel, 
  
  /* function for mutating the local copy of a resource */
  updateModel, 
  
  /* passed through the `react-query` */
  /* See https://github.com/tannerlinsley/react-query#usequery */  
  queryConfig, 
}) {

  ...

  return {
    /* a Model instance */
    model,
    
    /* a function that can be used to handle form onChange events */ 
    handleAttributeChange, 
    
    /* a function that can be used to save this model to backend */
    handleSave, 
    
    /* a function that can be used to delete this model from backend */
    handleDelete, 
    
    /* one of the valid states listed below */
    state, 
    
    /* an error that occurred while fetching, saving, etc. */    
    error, 
  }
}
```

## Valid Values for `state`
- idle
- error
- loading
- loadError
- loadSuccess
- updating
- updateSuccess
- deleting
- deleteSuccess