import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { Route, Navigate } from 'react-router-dom';

export default function Protected(props) {

    const authValue = useContext(AuthProvider)
    if (authValue.userDataPresent) {
        if (authValue.user == null) {
            return (<Navigate to="/login"></Navigate>)
        }
        else {
            return (

                <Route exact path={props.path}>
                    {props.children}

                </Route>)
        }
    }
    else {

        return null
    }
}