import React, { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import {storage} from '../firebase'
import Navbar from './components/Navbar';
import '../styles/HomePage.css'

function ViewAllPerformances() {
    const { getuser} = useAuth()
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

            <a className='list-button'>{performance.title}</a>
            <a className='list-button' href='performance-id'>Edit</a>
            <a className='list-button' href='performance-id'>View</a>
            <a className='list-button' href='performance-id'>Delete</a>
            {/* <Button href='/script-id' className='button'>{script.text}</Button> */}
            {/* <li key={script.id} onClick={() => handleOptionClick(script)}>{script.text}</li> */}
        </div>
    );
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

    return (
        <div className="container-fluid">
            <Navbar />
            <main>
                <div>
                    <h2>Your Performances</h2>
                    <select id="select-options" value={selectedOption} onChange={handleOptionChange} style={{ width: '100%' }}>
                        <option value={'byTitle'}>Title</option>
                        <option value={'byDateCreated'}>Date Created</option>
                        <option value={'byDateUpdated'}>Date Updated</option>
                    </select>
                    <button className='sort-button'>Sort By</button>
                    &nbsp;
                    {performances.map(object => (

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <a href='/performance-id' style={{ width: '100%' }} className='list-item'>{object.title}</a>
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

export default ViewAllPerformances;
