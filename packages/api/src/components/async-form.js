import React from 'react'
import PropTypes from 'prop-types'
import { useModel } from '../hooks/use-model'

const AsyncFormContext = React.createContext()

AsyncFormContext.displayName = 'AsyncFormContext'

const states = useModel.states

function useAsyncForm() {
  const context = React.useContext(AsyncFormContext)
  if (context === undefined) {
    throw new Error('useAsyncForm must be used within an <AsyncForm />')
  }
  return context
}

export function FormLoadError({ children }) {
  const { state } = useAsyncForm()
  return (state === states.loadError) ? children : null
}

export function FormError({ children }) {
  const { state, error } = useAsyncForm()
  return (state === states.error)
    ? React.Children.map(children, (child) => React.cloneElement(child, { error }))
    : null
}

export function FormLoading({ children }) {
  const { state } = useAsyncForm()
  return ([
    states.updating,
    states.deleting,
    states.loading,
  ].indexOf(state) > -1) ? children : null
}

export function FormContent({ children }) {
  const { state } = useAsyncForm()
  return ([
    states.idle,
    states.error,
    states.loadSuccess,
    states.updating,
    states.updateSuccess,
    states.deleting
  ].indexOf(state) > -1) ? children : null
}

export function FormActions({ children }) {
  const { state, handleDelete, handleSave } = useAsyncForm()
  return ([
    states.idle,
    states.error,
    states.loadSuccess,
    states.updating,
    states.updateSuccess,
    states.deleting
  ].indexOf(state) > -1)
    ? React.Children.map(children, (child) => React.cloneElement(child, {
      state,
      handleDelete,
      handleSave,
    }))
    : null
}

export function FormDeleteSuccess({ children }) {
  const { state } = useAsyncForm()
  return (state === states.deleteSuccess) ? children : null
}

export function AsyncForm({
  state,
  error,
  handleSave,
  handleDelete,
  afterUpdate,
  afterDelete,
  children
}) {

  async function handleSaveAndUpdate(e) {
    if (Boolean(e) && Boolean(e.preventDefault)) e.preventDefault()
    if (typeof handleSave !== 'function') return
    await handleSave()
    if (typeof afterUpdate === 'function') {
      afterUpdate()
    }
  }

  async function handleDeleteAndUpdate(e) {
    if (typeof handleDelete !== 'function') return
    await handleDelete()
    if (typeof afterDelete === 'function') {
      afterDelete()
    }
  }

  return (
    <AsyncFormContext.Provider value={{
      state,
      error,
      handleDelete: handleDeleteAndUpdate,
      handleSave: handleSaveAndUpdate,
    }}>
      <form onSubmit={handleSaveAndUpdate} noValidate autoComplete="off">
        {children}
      </form>
    </AsyncFormContext.Provider>
  )
}

AsyncForm.propTypes = {
  state: PropTypes.oneOf(states.$array),
  error: PropTypes.oneOfType([PropTypes.instanceOf(Error)]),
  handleSave: PropTypes.func.isRequired,
  handleDelete: PropTypes.func,
  onUpdate: PropTypes.func,
}

AsyncForm.defaultProps = {
  state: states.loading,
  error: null,
  handleDelete: null,
  onUpdate: null
}

export default AsyncForm