import React, { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
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

            <Link className='list-button' to="video-id">{performance.title}</Link>
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

    // function getPerformances(type, uid) {
    //     if (type == 1) {
    //         fetch('https://us-central1-sentiment-379415.cloudfunctions.net/firebase_operational' + '?selector=sortVideosByRunningCount' + '&uid=' + uid + '&rOrder=False') // Hello World function with parameters (look at end of link)
    //         .then(response => response.text())
    //         .then(data => {
    //             console.log(data); // prints "Hello, John!"
    //         });
    //     }
    //     if (type == 2) {
    //         fetch('https://us-central1-sentiment-379415.cloudfunctions.net/firebase_operational' + '?selector=sortVideosByTitle' + '&uid=' + uid + '&rOrder=False') // Hello World function with parameters (look at end of link)
    //         .then(response => response.text())
    //         .then(data => {
    //             console.log(data); // prints "Hello, John!"
    //         });
    //     }
    // }

    function loadTitlesFromCollection(uid) {
        const performances = document.getElementById("performances");
        const counter = 0
        firestore.collection(uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              counter = counter + 1
              const title = doc.data().title;
              const titleElement = document.createElement("p");
              titleElement.textContent = title;
              performances.appendChild({ id: counter, title: titleElement});
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
    }

    loadTitlesFromCollection(uid);


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

        const handleUpdate = (objectId) => {
        const selectedPerformance = performances.find(p => p.id === objectId);
        const newTitle = prompt('Enter a new name:', selectedPerformance.title);
        if (newTitle) {
            const docRef = firestore.collection(uid).doc(selectedPerformance);
            const query = docRef.where('title', '==', selectedPerformance.title);
            query.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                doc.ref.update({ title: newTitle })
                    .then(() => {
                    console.log('Document successfully updated!');
                    })
                    .catch((error) => {
                    console.error('Error updating document: ', error);
                    });
                });
            })
            .catch((error) => {
                console.error('Error querying documents: ', error);
            });
        }
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
                            <Link to='/video-id' style={{ width: '100%' }} className='list-item'>{object.title}</Link>
                            <button style={{ display: 'inline-block' }} className='hero-button' onClick={() => handleDelete(object.id)}>Delete</button>
                            &nbsp;
                            <button style={{ display: 'inline-block' }} className='hero-button' onClick={() => handleUpdate(object.id)}>Update</button>
                            &nbsp;
                            <button style={{ display: 'inline-block' }} className='hero-button' onClick={() =>  handleDownload(object.id)}>Download</button>
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