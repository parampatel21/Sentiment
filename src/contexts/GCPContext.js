import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'
import { useAuth } from './AuthContext'

const GCPContext = React.createContext()

export function useGCP() {
    return useContext(GCPContext)
}

export function GCPProvider( children ) {

    const { getuser } = useAuth()
    const UID = getuser()
    const [loading, setLoading] = useState(true)

    function sortScriptByTitle() {
        // HOW TO PUT VAR IN STRING IN JS, ADD UID, AND REVERSEORDER
        fetch('https://us-central1-sentiment-379415.cloudfunctions.net/firebase_operational' + '?selector=sortScriptByTitle' + '&uid=${UID}' + '&rOrder=0') // Hello World function with parameters (look at end of link)
            .then(response => response.text())
            .then(data => {
                console.log(data); // prints "Hello, John!"
            });
    } // function with multiple parameters

    function sortScriptByTimeStamp() {
        // HOW TO PUT VAR IN STRING IN JS, ADD UID, AND REVERSEORDER
        fetch('https://us-central1-sentiment-379415.cloudfunctions.net/firebase_operational' + '?selector=sortScriptByTimeStamp' + '&uid=${UID}' + '&rOrder=0') // Hello World function with parameters (look at end of link)
            .then(response => response.text())
            .then(data => {
                console.log(data); // prints "Hello, John!"
            });
    } // function with multiple parameters

    function sortScriptByRunningCount() {
        // HOW TO PUT VAR IN STRING IN JS, ADD UID, AND REVERSEORDER
        fetch('https://us-central1-sentiment-379415.cloudfunctions.net/firebase_operational' + '?selector=sortScriptByRunningCount' + '&uid=${UID}' + '&rOrder=0') // Hello World function with parameters (look at end of link)
            .then(response => response.text())
            .then(data => {
                console.log(data); // prints "Hello, John!"
            });
    } // function with multiple parameters

    // Add functions implemented here for exporting to UI components
    const value = {
        sortScriptByRunningCount,
        sortScriptByTimeStamp,
        sortScriptByTitle
    }

    return (
        <GCPContext.Provider value={value}>
            {!loading && children}
        </GCPContext.Provider>
    )
}