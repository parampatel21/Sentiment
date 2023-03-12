import React, { useContext, useState, useEffect } from 'react'
import { auth, firestore, googleProvider} from '../firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    // initialize vars and reference their set functions (even if the functions are not yet created)
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const [loggedIn, setLoggedIn] = useState(false)

    // Implement the functions to use in the UI components here, typically use auth.<functionFromFirebaseAPI> when able
    function signup(email, password) {
        setLoggedIn(true)
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(email, password) {
        setLoggedIn(true)
        return auth.signInWithEmailAndPassword(email, password)
    }

    function googleSignIn() {
        auth
        .signInWithPopup(googleProvider)
        .then((result) => {
          /** @type {firebase.auth.OAuthCredential} */
          var credential = result.credential;
          setLoggedIn(true)
          return credential;
        }).catch((error) => {
            setLoggedIn(false);
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          console.log(errorCode, errorMessage, email, credential);
        });
    }

    function logout() {
        setLoggedIn(false)
        console.log(loggedIn)
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email)
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }

    function getuser() {
        return auth.currentUser.uid;
    }

    function isAuthenticated() {
        return loggedIn;
    }

    function initDBCollection(userUID, name) {
        try {
            firestore.collection(userUID).doc("access_info").set({
                name: name,
                running_count: 0
            })
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    // Add functions implemented here for exporting to UI components
    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        getuser,
        initDBCollection,
        isAuthenticated,
        googleSignIn
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}