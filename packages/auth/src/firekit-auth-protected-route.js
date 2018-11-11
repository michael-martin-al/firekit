import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import withFirekitAuth from './with-firekit-auth'

function FirekitAuthProtectedRoute(props) {
  const { component: RouteComponent, ...rest } = props
  const { isSignedIn } = rest
  return (
    <Route
      {...rest}
      render={(renderProps) => {
        if (isSignedIn === true) return (<RouteComponent {...renderProps} />)
        else if (isSignedIn === false) return (<Redirect to="/sign-in" />)
        return null
      }}
    />
  )
}

FirekitAuthProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]).isRequired,
}

FirekitAuthProtectedRoute.defaultProps = {

}

export default withFirekitAuth(FirekitAuthProtectedRoute)
