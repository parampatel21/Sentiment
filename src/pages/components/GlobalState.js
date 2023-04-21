import { createContext, useState, useEffect } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [globalPerformance, setGlobalPerformance] = useState({});
    const [globalUser, setGlobalUser] = useState(null);
    const [globalTextAnalysis, setGlobalTextAnalysis] = useState('');

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

    useEffect(() => {
        // Retrieve globalPerformances data from local storage, if it exists
        const storedText = localStorage.getItem('globalTextAnalysis');
        if (storedText) {
            setGlobalTextAnalysis(JSON.parse(storedText));
        }
    }, []);

    useEffect(() => {
        // Store setGlobalPerformances data in local storage whenever it changes
        localStorage.setItem('globalTextAnalysis', JSON.stringify(globalTextAnalysis));
    }, [globalTextAnalysis]);

    return (
        // When calling GlobalContext, [0]=performance, [1]=user, [2]=textAnalysis
        <GlobalContext.Provider value={[[globalPerformance, setGlobalPerformance],
        [globalUser, setGlobalUser], [globalTextAnalysis, setGlobalTextAnalysis]]}>
            {children}
        </GlobalContext.Provider>
    );
};
