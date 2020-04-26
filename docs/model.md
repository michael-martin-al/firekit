# Model
## Purpose
Stores data that comes back from a Client. Ensures a few things...

- the properties of the model are immutable
- the values of the model's properties are immutable
- if an attempt is made to access an invalid model property, an error is thrown
- if an attempt to write to any model properties directly is made, an error is thrown
- validates model values against a schema (See Yup: https://github.com/jquense/yup)

A Model is handy for a few BIG reasons...
1. Keeps developer code honest. If a developer tries to add some extra stuff to an API response or otherwise mutate what was provided by the backend, a runtime error is thrown. This encourages good clean code and helps surface code problems sooner.
2. Allows validation against a schema in a single location. The model becomes the source of truth was what is allowed to be stored in the model before it ever gets sent to the Client. 


## Magic $ Properties for Model

- **$id**: the unique identifier for the model in the backend system
- **$valid**: returns a boolean indicating if the model data is valid when tested against the schema
- **$error**: an array of validation errors or `undefined` if `$valid === true`
- **$object**: a copy of the primitive mutable object containing the model data
- **$name**: the name of the model or model type (i.e. Widget, Sprocket, etc.)

## Magic $ Properties for Model[property]

- **$value**: the value of `model[property]`
- **$error**: an array of validation errors associated with `model[property]` or undefined if valid
- **$valid**: boolean indicating if `model[property]` has passed validation test

## Magic $ Methods

**$update**: returns a clone of the current model instance with the new property value
```javascript
const newModel = model.$update(property, value)
```

**$clone**: returns a clone of the current model
```javascript
const newModel = model.$clone()
```

## Create a New Model Instance
```javascript
import makeModel from '@tupos/model-kit' /* Real Name TDB */
import { loadWidget } from './widget-client'
import * as yup from 'yup'

async function makeWidget(widgetId) {
  const widgetResponse = await loadWidget(widgetId)

  const widgetSchema = yup.object().shape({
    name: yup.string().default('').required('Name is required'),
    quantity: yup.number().default(0).required('Quantity is required'),
    email: yup.string().email().default('').required('Email is required')  
  })

  return makeModel({
    name: 'Widget',
    id: widgetId,
    data: widgetResponse.data,
    schema: widgetSchema
  })
}
```

## Accessing Property Values within Model Instance
```javascript
const widget = await makeWidget(1)

/* get the value of widget.name */
console.log(widget.name.$value)

/* get array of validation errors for widget.name if any */
console.log(widget.name.$error) 

/* did the value of widget.name pass validation test? */
console.log(widget.name.$valid) 
```

## Update a Model Instance 
```javascript
const newWidget = widget.$update('name', 'Michael')
```

## Clone a Model Instance
```javascript
const anotherWidget = newWidget.$clone()
```