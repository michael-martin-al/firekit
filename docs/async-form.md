# AsyncForm
A Compound Collection of Components for handling async forms in a web app

## FormLoadError
It should display an error message to the user.
Renders its children when an error occurs while initially loading data. Attaches the `error` prop to all children before rendering.

## FormError
It should display an error message to the user.
Renders its children when an error occurs while performing a form action. Attaches the `error` prop to all children before rendering.

## FormLoading
It should show a spinner or a label indicating the form is loading.
Renders its children when the form is busy with an async action such as loading, saving, etc.

## FormContent
It should contain the body of the form, including any fields, labels, etc.
Renders its children when the form's state is idle, error, loadSuccess, updating, updateSuccess or deleting.

## FormActions
It should render buttons or other UI elements to allow user to perform Save, Delete actions
Renders its children under the same conditions as <FormContent />.
Attaches `state`, `handleDelete`, and `handleSave` props to all children.

## FormDeleteSuccess
It should show a message informing the user that their delete operation succeeded.
Renders its children when the state is deleteSuccess.

## AsyncForm
Renders various states of a form based on the UI state of an async action(s)

### Props
- **state**: the state value from `useModel` hook
- **error**: the error value from `useModel` hook
- **handleSave**: the function returned from the `useModel` hook
- **handleDelete**: the function returned form the `useModel` hook
- **afterUpdate**: the function to fire after a successful update operation
- **afterDelete**: the function to fire after a successful delete operation
- **children**: any combination of the above Components + any other React components to render an input form to the user

## Example
```javascript
import React from 'react'
import {
  AsyncForm,
  FormActions,
  FormContent,
  FormError,
  FormInitError,
  FormInitializing,
  FormLoading
} from './components/async-form'
import useWidget from '../models/use-widget'

function WidgetFormError({ error }) {
  return (
    <p>{error.message}</p>
  )
}

function WidgetFormActions({
  handleSave,
  handleDelete,
  state
}) {
  return (
    <div>
      <button type="submit" disabled={state === 'loading'}>Submit</button>
      <button type="button" onClick={handleSave} disabled={state === 'loading'}>Save</button>
      <button type="button" onClick={handleDelete} disabled={state === 'deleting'}>Delete</button>
    </div>
  )
}

export default function WidgetForm({ id }) {
  const {
    model: widget,
    handleAttributeChange,
    handleSave,
    handleDelete,
    state,
    error,
  } = useWidget(id, { staleTime: 10000 })

  return (
    <AsyncForm
      state={state}
      error={error}
      handleSave={handleSave}
      handleDelete={handleDelete}
      onUpdate={() => {
        alert('Just Updated!')
      }}
    >
      <FormInitializing>
        <p>Initializing...</p>
      </FormInitializing>

      <FormInitError>
        <p>Init Error!</p>
      </FormInitError>

      <FormLoading>
        <p>Loading...</p>
      </FormLoading>

      <FormError>
        <WidgetFormError />
      </FormError>

      <FormContent>
        {widget && widget.$error && widget.$error.map((e) => {
          return <p key={e}>{e}</p>
        })}
        {widget && JSON.stringify(widget.$object)}
        <div><input type="text" name="name" onChange={handleAttributeChange} value={widget ? widget.name.$value : ''} /></div>
        <div><input type="date" name="created" onChange={handleAttributeChange} value={widget ? widget.created.$value : ''} /></div>
        <div><input type="number" name="quantity" onChange={handleAttributeChange} value={widget ? widget.quantity.$value : 0} /></div>
      </FormContent>

      <FormActions>
        <WidgetFormActions />
      </FormActions>
    </AsyncForm>
  )
}
```