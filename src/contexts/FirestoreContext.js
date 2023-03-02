// import React, { useContext, useState, useEffect } from 'react'
// import { firestore } from '../firebase'

// const FirestoreContext = React.createContext()

// export function useFirestore() {
//     return useContext(FirestoreContext)
// }

// export function FirestoreProvider({ children }) {
//     // Implement the functions to use in the UI components here, typically use auth.<functionFromFirebaseAPI> when able
//     function initDBCollection(userUID, name) {
//         try {
//             firestore.collection(userUID).doc("access_info").set({
//                 name: name,
//                 running_count: 0
//             })
//         } catch (e) {
//             console.log(e);
//         }
//     }

//     // Add functions implemented here for exporting to UI components
//     const value = {
//         initDBCollection
//     }

//     return (
//         <FirestoreContext.Provider value={value}>
//             {children}
//         </FirestoreContext.Provider>
//     )
// }