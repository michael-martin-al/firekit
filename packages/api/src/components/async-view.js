import React from 'react'
import PropTypes from 'prop-types'
import { useModel } from '../hooks/use-model'

const AsyncViewContext = React.createContext()

AsyncViewContext.displayName = 'AsyncViewContext'

const { states } = useModel

function useAsyncView() {
  const context = React.useContext(AsyncViewContext)
  if (context === undefined) {
    throw new Error('useAsyncView must be used within an <AsyncView />')
  }
  return context
}

export function ViewError({ children }) {
  const { state, error } = useAsyncView()
  return [states.error, states.loadError].indexOf(state) > -1
    ? React.Children.map(children, (child) =>
        React.cloneElement(child, { error }),
      )
    : null
}

export function ViewLoading({ children }) {
  const { state } = useAsyncView()
  return state === states.loading ? children : null
}

export function ViewContent({ children }) {
  const { state } = useAsyncView()
  return [states.idle, states.loadSuccess].indexOf(state) > -1 ? children : null
}

export function AsyncView({ state, error, children }) {
  return (
    <AsyncViewContext.Provider value={{ state, error }}>
      {children}
    </AsyncViewContext.Provider>
  )
}

AsyncView.propTypes = {
  state: PropTypes.oneOf(states.$array),
  error: PropTypes.oneOfType([PropTypes.instanceOf(Error)]),
}

AsyncView.defaultProps = {
  state: states.loading,
  error: null,
}

export default AsyncView
