import React from 'react'
// import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
// import DialogActions from '@material-ui/core/DialogActions'
// import DialogContent from '@material-ui/core/DialogContent'
// import DialogContentText from '@material-ui/core/DialogContentText'
// import DialogTitle from '@material-ui/core/DialogTitle'
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
          {/*
            <DialogTitle id="alert-dialog-slide-title">
            {"Use Google's location service?"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Let Google help apps determine location. This means sending anonymous location data to
              Google, even when no apps are running.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Disagree
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Agree
            </Button>
          </DialogActions> */}
        </Dialog>
      </div>
    )
  }
}

export default SignIn
