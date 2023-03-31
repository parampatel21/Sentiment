import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
// import { useGCP } from '../contexts/GCPContext';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Navbar from './components/Navbar';
// import firebase_function from '';
import '../styles/HomePage.css'

function ViewAllScripts() {

    const [selectedOption, setSelectedOption] = useState('option1');
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const { getuser } = useAuth()
    const UID = getuser()
    const scripts = []

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleDelete = (objectId) => {
        console.log('plus u1tra')
        // axios.delete(`/api/objects/${objectId}`)
        //     .then(() => {
        //         setObjects(objects.filter(object => object.id !== objectId));
        //     })
        //     .catch(error => console.error(error));
    };

    function sortScriptByTitle() {
        // HOW TO PUT VAR IN STRING IN JS, ADD UID, AND REVERSEORDER
        fetch('https://us-central1-sentiment-379415.cloudfunctions.net/firebase_operational' + '?selector=sortScriptByTitle' + '&uid=${UID}' + '&rOrder=0') // Hello World function with parameters (look at end of link)
            .then(response => response.text())
            .then(data => {
                console.log(data); // prints "Hello, John!"
            });
    } // function with multiple parameters

    sortScriptByTitle()

    // const ret = invocationGCPparameterstest("sortScriptByTitle", getuser(), 0)
    // console.log(ret)

    return (
        <div className="container-fluid">
            <Navbar />
            <main>
                <div>
                    <h2>Your Scripts</h2>
                    <select id="select-options" value={selectedOption} onChange={handleOptionChange} style={{ width: '100%' }}>
                        <option value={'byTitle'}>Title</option>
                        <option value={'byDateCreated'}>Date Created</option>
                        <option value={'byDateUpdated'}>Date Updated</option>
                    </select>
                    <button className='sort-button'>Sort By</button>
                    &nbsp;
                    {scripts.map(object => (

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <a href='/script-id' style={{ width: '100%' }} className='list-item'>{object.title}</a>
                            <button style={{ display: 'inline-block' }} className='hero-button' onClick={() => handleDelete(object.id)}>Delete</button>
                            &nbsp;
                            <button style={{ display: 'inline-block' }} className='hero-button' onClick={() => console.log(`Updating ${object.title}`)}>Update</button>
                            &nbsp;
                            <button style={{ display: 'inline-block' }} className='hero-button' onClick={() => console.log(`Downloading ${object.title}`)}>Download</button>
                            &nbsp;
                        </div>

                    ))}
                </div>
            </main >
            <footer>
                <p>&copy; 2023 Sentiment. All rights reserved.</p>
            </footer>
        </div >
    );
}

export default ViewAllScripts;