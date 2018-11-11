import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'
import firebase from 'firebase/app'
import 'firebase/auth'
import firebaseui from 'firebaseui'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

const firebaseUIConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/auth/',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
}

function Transition(props) {
  return <Slide direction="up" {...props} />
}

class SignIn extends React.Component {
  render() {
    const { open, firebaseApp, handleClose } = this.props
    return (
      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={firebaseApp.auth()} />
        </Dialog>
      </div>
    )
  }
}

export default SignIn
