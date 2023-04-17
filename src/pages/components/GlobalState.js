import { createContext, useState, useEffect } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [globalPerformance, setGlobalPerformance] = useState({});
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
        const storedPerfomance = localStorage.getItem('globalPerformance');
        if (storedPerfomance) {
            setGlobalPerformance(JSON.parse(storedPerfomance));
        }
    }, []);

    useEffect(() => {
        // Store setGlobalPerformances data in local storage whenever it changes
        localStorage.setItem('setGlobalPerformance', JSON.stringify(setGlobalPerformance));
    }, [setGlobalPerformance]);

    return (
        // When calling GlobalContext, [0]=performances, [1]=user, [2]=scripts
        <GlobalContext.Provider value={[ [ globalPerformance, setGlobalPerformance], 
                                            [globalUser, setGlobalUser]]}>
            {children}
        </GlobalContext.Provider>
    );
};
