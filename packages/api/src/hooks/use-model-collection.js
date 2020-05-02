import React from 'react'
import { useQuery } from 'react-query'
import { makeStateModel } from '../model-creators/make-state-model'

export const states = makeStateModel(['loading', 'success', 'error'])

/**
 * React hook for fetching a collection of Model objects
 *
 * @param {Object} config
 * @param {Function} config.loadCollection
 * @param {Any} config.collectionKey
 * @param {Object} config.queryConfig
 */
export function useModelCollection({
  loadCollection,
  collectionKey,
  queryConfig = {},
}) {
  const [state, setState] = React.useState(states.loading)

  const {
    status: queryStatus,
    data: collection,
    error,
    refetch: reload,
  } = useQuery(collectionKey, loadCollection, queryConfig)

  React.useEffect(() => {
    setState(states[queryStatus])
  }, [queryStatus])

  return {
    collection,
    state,
    error,
    reload,
  }
}

useModelCollection.states = states
