import React, { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import {storage, firestore} from '../firebase'
import Navbar from './components/Navbar';
import '../styles/HomePage.css'

function ViewAllPerformances() {
    const { getuser} = useAuth()
    const uid = getuser()
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

    function getPerformances(type, uid) {
        if (type == 1) {
            fetch('https://us-central1-sentiment-379415.cloudfunctions.net/firebase_operational' + '?selector=sortVideosByRunningCount' + '&uid=' + uid + '&rOrder=False') // Hello World function with parameters (look at end of link)
            .then(response => response.text())
            .then(data => {
                console.log(data); // prints "Hello, John!"
            });
        }
        if (type == 2) {
            fetch('https://us-central1-sentiment-379415.cloudfunctions.net/firebase_operational' + '?selector=sortVideosByTitle' + '&uid=' + uid + '&rOrder=False') // Hello World function with parameters (look at end of link)
            .then(response => response.text())
            .then(data => {
                console.log(data); // prints "Hello, John!"
            });
        }
    }

    console.log(getPerformances(1, uid))

    const handleDelete = (objectId) => {
            // TODO: not finished
            const title = performances.find(p => p.objectId === objectId).title
            const collectionRef = firestore.collection(uid);
            const query = collectionRef.where("title", "==", title);
            query.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete().then(() => {
                console.log("Document successfully deleted!");
                }).catch((error) => {
                console.error("Error removing document: ", error);
                });
            });
            }).catch((error) => {
                console.error("Error querying documents: ", error);
            });
        };
    
        const handleDownload = (objectId) => {
            const title = performances.find(p => p.objectId === objectId).title
            const collectionRef = firestore.collection(uid);
            const query = collectionRef.where("title", "==", title); // this should be doc title
            const filename = query.id + '.mp4'
            const storageRef = storage.ref();
            const fileRef = storageRef.child(uid + '/' + filename);
    
            fileRef.getDownloadURL().then(function(url) {
                // create a new page to view/download the file
                window.open(url, '_blank');
              }).catch(function(error) {
                // handle errors
                console.log(error);
              });
        }

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