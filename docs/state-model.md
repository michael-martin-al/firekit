# StateModel
## Purpose
Given an array of strings, return an immutable proxy object useful for keeping track of valid UI states in a state machine.

If developer using an instance of state model, checks value of a state value that doesn't exist, an error is thrown.

This is really handy when playing around with different UI states. Keeps the developer honest and surfaces code problems faster.

## How to Create nad Use a State Model
```javascript
const states = makeStateModel([
  'loading',
  'idle',
  'error'
])

// These are now valid states
if (state === states.loading) return "We are loading..."
if (state === states.idle) return "Just sitting here."
if (state === states.error) return "What?! Something went wrong."

// But, accessing an invalid state will throw an error
// Trying to access `states.working` will throw since 'working' 
// isn't one of the values passed into the model creator function
if (state === states.working) return "We are working here..."
```