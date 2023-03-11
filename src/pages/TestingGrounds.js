import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Navbar from './components/Navbar';
import '../styles/HomePage.css'

function ViewAllPerformances() {

    const [selectedOption, setSelectedOption] = useState('option1');
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const scripts = [
        { id: 1, title: 'Script 1' },
        { id: 2, title: 'This is my amazing script title!' },
        { id: 3, title: 'Script 3' },
        { id: 4, title: 'Script 4' },
        { id: 5, title: 'Script 5' },
    ];

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

    async function use_axios() {
        axios({
            method: 'post',
            url: 'https://us-central1-sentiment-379415.cloudfunctions.net/test_function',
            data: {
                message: 'Hello'
            }
        })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }



    return (
        <div className="container-fluid">
            <header>
                <Navbar />
            </header>
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

export default ViewAllPerformances;
