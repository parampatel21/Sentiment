import { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [globalPerformances, setGlobalPerformances] = useState([]);

    return (
        <GlobalContext.Provider value={[globalPerformances, setGlobalPerformances]}>
            {children}
        </GlobalContext.Provider>
    );
};
