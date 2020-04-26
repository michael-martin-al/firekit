import React from 'react'
import PropTypes from 'prop-types'
import { states } from '../hooks/use-model-collection'
const AsyncListContext = React.createContext()

AsyncListContext.displayName = 'AsyncListContext'

function useAsyncList() {
  const context = React.useContext(AsyncListContext)
  if (context === undefined) {
    throw new Error('useAsyncList must be used within an <AsyncList />')
  }
  return context
}

export function ListError({ children }) {
  const { state, error } = useAsyncList()
  return state === states.error
    ? React.Children.map(children, (child) => React.cloneElement(child, { error }))
    : null
}

export function ListLoading({ children }) {
  const { state } = useAsyncList()
  return (state === states.loading) ? children : null
}

export function ListContent({ children }) {
  return children
}

export function AsyncList({
  state,
  error,
  children
}) {
  return (
    <AsyncListContext.Provider value={{ state, error }}>
      {children}
    </AsyncListContext.Provider>
  )
}

AsyncList.propTypes = {
  state: PropTypes.oneOf(states.$array),
  error: PropTypes.oneOfType([PropTypes.instanceOf(Error)]),
}

AsyncList.defaultProps = {
  state: states.loading,
  error: null,
}

export default AsyncList