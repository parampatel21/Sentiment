import { createContext, useState, useEffect } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [globalPerformances, setGlobalPerformances] = useState([]);
    const [globalUser, setGlobalUser] = useState(null);

    useEffect(() => {
        // Retrieve globalUser data from local storage, if it exists
        const storedUser = localStorage.getItem('globalUser');
        if (storedUser) {
            setGlobalUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        // Store globalUser data in local storage whenever it changes
        localStorage.setItem('globalUser', JSON.stringify(globalUser));
    }, [globalUser]);

    useEffect(() => {
        // Retrieve globalPerformances data from local storage, if it exists
        const storedPerfomances = localStorage.getItem('globalPerformances');
        if (storedPerfomances) {
            setGlobalPerformances(JSON.parse(storedPerfomances));
        }
    }, []);

    useEffect(() => {
        // Store setGlobalPerformances data in local storage whenever it changes
        localStorage.setItem('setGlobalPerformances', JSON.stringify(setGlobalPerformances));
    }, [setGlobalPerformances]);

    return (
        // When calling GlobalContext, [0]=performances, [1]=user, [2]=scripts
        <GlobalContext.Provider value={[ [ globalPerformances, setGlobalPerformances], 
                                            [globalUser, setGlobalUser]]}>
            {children}
        </GlobalContext.Provider>
    );
};
