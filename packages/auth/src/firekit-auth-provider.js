import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import User from './user'
import Organization from './organization'
import SignIn from './sign-in'

const organizationId = 'tpK2esZwy93ZNmmPXwlb'

const FIRESTORE_CONFIG = {
  timestampsInSnapshots: true,
}

const DEFAULT_STATE = {
  isSignedIn: undefined,
  user: null,
  firebaseApp: firebase.app(),
  userProfile: null,
  organization: null,
  signinOpen: false,
}

firebase.firestore().settings(FIRESTORE_CONFIG)

const FirekitAuthContext = React.createContext(DEFAULT_STATE)

export const FirekitAuthConsumer = FirekitAuthContext.Consumer

export default class FirekitAuthProvider extends Component {
  constructor(props) {
    super(props)
    this.state = DEFAULT_STATE

    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
  }

  componentDidMount() {
    /* eslint-disable react/no-did-mount-set-state */

    const { firebaseApp } = this.state
    try {
      this.unregisterAuthObserver = firebaseApp.auth().onAuthStateChanged(async (user) => {
        let userProfile
        let organization
        if (user) {
          userProfile = await User.load(user.uid)
          organization = await Organization.load(organizationId)
          if (!userProfile) {
            userProfile = new User({ organizationId }, user.uid)
            await userProfile.save()
          }
        }
        this.setState({
          isSignedIn: !!user, user, userProfile, organization,
        })
      })
    } catch (error) {
      this.setState({ isSignedIn: false, user: null })
    }
  }

  componentWillUnmount() {
    if (typeof this.unregisterAuthObserver === 'function') this.unregisterAuthObserver()
  }

  handleClose() {
    this.setState({ signinOpen: false })
  }

  handleOpen() {
    this.setState({ signinOpen: true })
  }

  render() {
    const { children } = this.props
    const {
      isSignedIn,
      user,
      firebaseApp,
      userProfile,
      organization,
      signinOpen,
    } = this.state

    return (
      <FirekitAuthContext.Provider
        value={{
          isSignedIn,
          user,
          firebaseApp,
          userProfile,
          organization,
          openSignin: this.handleOpen,
        }}
      >
        <React.Fragment>
          {children}
          <SignIn open={signinOpen} firebaseApp={firebaseApp} handleClose={this.handleClose} />
        </React.Fragment>
      </FirekitAuthContext.Provider>
    )
  }
}

FirekitAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
