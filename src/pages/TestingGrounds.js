import React, { useState, useEffect } from 'react'
import { Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Navbar from './components/Navbar';
// import '../styles/styles.css'
import '../styles/HomePage.css'


function TestingGrounds() {

    const [selectedOption, setSelectedOption] = useState('option1');
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const performances = [
        { id: 1, title: 'Video Performance 1' },
        { id: 2, title: 'Video Performance 2' },
        { id: 3, title: 'This is my video title! Success!' },
        { id: 4, title: 'Video Performance 4' },
        { id: 5, title: 'Video Performance 5' },
    ];
    const listItems = performances.map(performance =>
        <div>
            {performance.title}
            <a className='list-button' href='performance-id'>Edit</a>
            <a className='list-button' href='performance-id'>View</a>
            <a className='list-button' href='performance-id'>Delete</a>
            {/* <Button href='/script-id' className='button'>{script.text}</Button> */}
            {/* <li key={script.id} onClick={() => handleOptionClick(script)}>{script.text}</li> */}
        </div>
    );
    const { fetchPerformanceByID } = useAuth()
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
                    <h2>Your Performances</h2>
                    {performances.map(object => (

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <h3 className="button-title" style={{ marginRight: '10px', display: 'inline-block' }}>{object.title}</ h3>
                            <button style={{ display: 'inline-block' }} className='hero-button' onClick={() => handleDelete(object.id)}>Delete</button>
                            <button style={{ display: 'inline-block' }} className='hero-button' onClick={() => console.log(`Viewing ${object.title}`)}>View</button>
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

export default TestingGrounds;
