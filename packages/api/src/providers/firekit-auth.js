import React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'

const FirekitAuthContext = React.createContext()
FirekitAuthContext.displayName = 'FirekitAuthContext'

export function useFirekitAuth() {
  const context = React.useContext(FirekitAuthContext)
  if (context === undefined) {
    throw new Error(`useFirekitAuth must be used within a FirekitAuthProvider`)
  }
  return context
}

export function FirekitAuthLoading({ children }) {
  const { isIdle, isLoading } = useFirekitAuth()
  return isIdle || isLoading ? children : null
}

export function FirekitAuthError({ children }) {
  const { isError, error } = useFirekitAuth()
  return isError
    ? React.Children.map(children, (child) =>
        React.cloneElement(child, { error }),
      )
    : null
}

export function FirekitAuthContent({ children }) {
  const context = useFirekitAuth()
  return context.isSuccess
    ? React.Children.map(children, (child) =>
        React.cloneElement(child, { ...context }),
      )
    : null
}

export function FirekitAuthProvider(props) {
  const [user, setUser] = React.useState()
  const [state, setState] = React.useState('idle')
  const [error, setError] = React.useState()

  const isLoading = state === 'loading'
  const isIdle = state === 'idle'
  const isSuccess = state === 'success'
  const isSignedIn = Boolean(user)

  React.useEffect(() => {
    setState('loading')
    return firebase.auth().onAuthStateChanged(
      (FirebaseUser) => {
        setUser(FirebaseUser)
        setState('success')
      },
      (e) => {
        setError(e)
        setState('error')
      },
    )
  }, [])

  const value = React.useMemo(
    () => ({ user, isLoading, isIdle, isSuccess, isSignedIn, error }),
    [user, isLoading, isIdle, isSuccess, isSignedIn, error],
  )

  return <FirekitAuthContext.Provider value={value} {...props} />
}
