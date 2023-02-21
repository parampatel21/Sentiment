import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { auth } from '../firebase'

// Protect components from access when user is !authenticated

export default function Protected({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const loggedIn = auth.onAuthStateChanged(user => {
        setCurrentUser(user)
    })


    if (!loggedIn) {
        return <Navigate to="/login" replace />;
    }
    return children;
}








