import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
// import { useGCP } from '../contexts/GCPContext';
import { useNavigate } from 'react-router-dom'
import { firestore } from '../firebase';
import Navbar from './components/Navbar';
// import firebase_function from '';
import '../styles/HomePage.css'

function ViewAllScripts() {

    const [selectedOption, setSelectedOption] = useState('option1');
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const { getuser } = useAuth()
    const uid = getuser()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    // TO GET COLLECTION REFERENCE
    const [scripts, setScripts] = useState([]);

    async function loadScriptsFromCollection(uid) {
        let current_count = 1;
        
        /* Author-JASON: Idk why running count is undefined. My plan is to get running count and create
           an array by adding the elements that arent undefined since if we delete file[1] the running count
           for each file remains the same and total running_count stays the same. Hope that makes sense :) 
        */
        const accessInfoRef = firestore.collection(uid).doc('access_info');
        const accessInfoDoc = await accessInfoRef.get()
        const running_count = accessInfoDoc.data.running_count
        console.log(running_count)

        while (current_count <= running_count) {
            const docRef = firestore.collection(uid).doc(current_count++).data.running_count;
            docRef.get().then((doc) => {
                const data = doc.data();
                console.log(data)

                try {
                    setError('')
                    setLoading(true)
                    // handleUpload(new_count)
                } catch {
                    setError('Failed to upload the video')
                }

                try {
                    setError('')
                    setLoading(true)
                    // handleFirestoreUpdate(new_count)
                } catch {
                    // setError('Failed to update the database')
                }

            })
        }
    }

    loadScriptsFromCollection(uid)

    // END OF COLLECTION REFERENCE


    const handleDelete = (objectId) => {
        console.log('plus u1tra')
        // axios.delete(`/api/objects/${objectId}`)
        //     .then(() => {
        //         setObjects(objects.filter(object => object.id !== objectId));
        //     })
        //     .catch(error => console.error(error));
    };

    // function sortScriptByTitle() {
    //     // HOW TO PUT VAR IN STRING IN JS, ADD UID, AND REVERSEORDER
    //     fetch('https://us-central1-sentiment-379415.cloudfunctions.net/firebase_operational' + '?selector=sortScriptByTitle' + `&uid=${uid}` + '&rOrder=0') // Hello World function with parameters (look at end of link)
    //         .then(response => response.text())
    //         .then(data => {
    //             console.log(data); // prints "Hello, John!"
    //         });
    // } // function with multiple parameters

    // sortScriptByTitle()

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
                            <a href={`/scripts/${object.id}`} style={{ width: '100%' }} className='list-item'>{object.title}</a>
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