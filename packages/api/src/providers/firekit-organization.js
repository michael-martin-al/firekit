import React from 'react'
import { useFirekitAuth } from './firekit-auth'
import { makeModel as baseMakeModel } from '../model-creators/make-model'
import { makeStateModel } from '../model-creators/make-state-model'
import { firestoreClient as firestore } from '../clients/firestore-client'
import * as yup from 'yup'

const FirekitOrganizationContext = React.createContext()
FirekitOrganizationContext.displayName = 'FirekitOrganizationContext'


export function useFirekitOrganization() {
  const context = React.useContext(FirekitOrganizationContext)
  if (context === undefined) {
    throw new Error(`useFirekitOrganization must be used within a FirekitOrganizationContext`)
  }
  return context
}


const states = makeStateModel([
  'loading',
  'idle',
  'error',
  'success'
])

function makeOrganizationModel({ id, data }) {
  return baseMakeModel({
    name: 'Organization',
    id,
    data,
    schema: yup.object().shape({
      name: yup.string().required('Name is required')
    })
  })
}

function makeOrganizationUserModel({ id, data }) {
  return baseMakeModel({
    name: 'OrganizationUser',
    id,
    data,
    schema: yup.object().shape({
      organizationId: yup.string().required('OrganizationId is required')
    })
  })
}

export function FirekitOrganizationProvider(props) {
  const [organizationUser, setOrganizationUser] = React.useState()
  const [organization, setOrganization] = React.useState()
  const [error, setError] = React.useState()
  const [state, setState] = React.useState(states.idle)
  const { user } = useFirekitAuth()

  React.useEffect(() => {
    if (user && user.uid) {
      setState(states.loading);
      (async () => {
        try {
          const load = firestore.load({
            Model: makeOrganizationUserModel,
            docPath: `/users/${user.uid}`
          })
          setOrganizationUser(await load())
          setState(states.success)
        } catch (e) {
          setError(e)
          setOrganizationUser(null)
          setState(states.error)
        }
      })()
    } else {
      setOrganizationUser(null)
    }
  }, [user])

  React.useEffect(() => {
    if (organizationUser) {
      (async () => {
        try {
          const load = firestore.load({
            Model: makeOrganizationModel,
            docPath: `/organizations/${organizationUser.organizationId.$value}`
          })
          setOrganization(await load())
          setState(states.success)
        } catch (e) {
          setError(e)
          setOrganization(null)
          setState(states.error)
        }
      })()
    }
  }, [organizationUser])

  const value = React.useMemo(() => ({
    organization, error, state
  }), [organization, error, state])

  return (
    <FirekitOrganizationContext.Provider value={value} {...props} />
  )
}