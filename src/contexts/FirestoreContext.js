import React, { useContext, useState, useEffect } from 'react'
import { db } from '../firebase'

const FirestoreContext = React.createContext()

export function useFirestore() {
    return useContext(FirestoreContext)
}

export function FirestoreProvider({ children }) {
    // Implement the functions to use in the UI components here, typically use auth.<functionFromFirebaseAPI> when able
    function initDBCollection(userUID, name) {
        try {
            setDoc(doc(db, userUID, "access_info"), {
                name: name,
                running_count: 0
              });
        } catch (e) {
            console.log(e);
        }
    }

    // Add functions implemented here for exporting to UI components
    const value = {
        initDBCollection
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}