import React from 'react'
import { useQuery } from 'react-query'
import { makeStateModel } from '../model-creators/make-state-model'


export const states = makeStateModel([
  'idle',
  'error',
  'loading',
  'loadError',
  'loadSuccess',
  'updating',
  'updateSuccess',
  'deleting',
  'deleteSuccess'
])

export function useModel({
  loadModel,
  saveModel,
  deleteModel,
  updateModel,
  queryConfig = {}
}) {
  const [model, setModel] = React.useState()
  const [state, setState] = React.useState(states.loading)
  const [error, setError] = React.useState()
  const { status: queryStatus, data, error: queryError } = useQuery(loadModel ? loadModel.key : null, loadModel, queryConfig)

  function handleAttributeChange(e) {
    const { value, name } = e.target
    setModel(updateModel(model, name, value))
  }

  async function handleDelete() {
    if (!(typeof deleteModel === 'function')) return
    try {
      setState(states.deleting)
      await deleteModel(model)
      setState(states.deleteSuccess)
    } catch (deleteError) {
      setError(deleteError)
      setState(states.error)
    }
  }

  async function handleSave() {
    if (Boolean(model) && typeof saveModel === 'function') {
      setState(states.updating)
      setError(null)
      try {
        const savedModel = await saveModel(model)
        if (savedModel) setModel(savedModel)
        setState(states.updateSuccess)
      } catch (er) {
        setError(er)
        setState(states.error)
      }
    }
  }

  React.useEffect(() => {
    if (state === states.updateSuccess) {
      const timeout = setTimeout(() => {
        setState(states.idle)
      }, 5000)

      return () => {
        clearTimeout(timeout)
      }
    } else {
      return () => { }
    }
  }, [state])

  React.useEffect(() => {
    if (queryStatus === 'error') setState(states.loadError)
    else if (queryStatus === 'success') setState(states.loadSuccess)
    else if (queryStatus === 'loading') setState(states.loading)
  }, [queryStatus])

  React.useEffect(() => {
    setError(queryError)
  }, [queryError])

  React.useEffect(() => {
    setModel(data)
  }, [data])

  return {
    model,
    handleAttributeChange,
    handleSave,
    handleDelete,
    state,
    error,
  }
}
