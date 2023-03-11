import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import logo from '../../assets/nonsense.png'


export default function Navbar() {
    const { error, setError } = useState("")
    const { logout, isAuthenticated } = useAuth()
    async function handleLogout() {
        setError('')

        try {
            await logout()
            // navigate('/login')
            window.location.reload();
        } catch {
            setError('Failed to log out')
        }
    }

    return (
        <header>
            <div className="logo">
                <a href="/">
                    <img src={logo} alt="Logo" />
                </a>
            </div>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about-us">About Us</a></li>
                    <li><a href="/view-all-performances">View Performances</a></li>
                    <li><a href="/view-all-scripts">View Scripts</a></li>
                    <li><a href="/update-profile">Manage Account</a></li>
                    {isAuthenticated ? (
                        <li><a href="" onClick={handleLogout}>Logout</a></li>
                    ) : (
                        <li><a href="/login">Login</a></li>
                    )}
                    {/* <li><a href="" onClick={use_axios}>Test Google Cloud Function</a></li> */}

                </ul>
            </nav>
        </header>
    )
}
