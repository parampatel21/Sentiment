import React, { useState, useEffect, useContext } from 'react'
import { GlobalContext } from './components/GlobalState';
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { firestore } from '../firebase';
import Navbar from './components/Navbar';
import '../styles/HomePage.css'

function ViewAllScripts() {
    const navigate = useNavigate()
    const [selectedOption, setSelectedOption] = useState('option1');
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const { getuser } = useAuth()
    const uid = getuser()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [scripts, setScripts] = useState([])
    const [globalScripts, setGlobalScripts] = useContext(GlobalContext)[2];

    function loadScriptsFromCollection(uid) {
        const accessInfoRef = firestore.collection(uid).doc('access_info');
        let runningCount = 0
        return accessInfoRef.get()
            .then((doc) => {
            const data = doc.data();
            console.log(data)
            runningCount = data.running_count;
            console.log(runningCount)

            let temp = [];
            const promises = []

            for (let i = 1; i <= runningCount; i++) {
                const currentCountRef = firestore.collection(uid).doc(i.toString());
                promises.push(currentCountRef.get().then((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        const title = data.title;
                        const script = data.script;
                        const timestamp = data.timestamp;
                        temp.push({ id: i, title: title, content: script, timestamp: timestamp })
                    }
                }));
            }
                return Promise.all(promises).then(() => {
                    console.log(temp)
                    return temp
                });
            })
            .catch((error) => console.error('Error getting access info: ', error));
    }

    useEffect(() => {
        loadScriptsFromCollection(uid)
            .then((scripts) => {
                setScripts(scripts)
                setGlobalScripts(scripts)
            })
            .catch((error) => console.error('Error getting scripts: ', error))
    }, [uid])

    const handleDelete = (objectId) => {
        console.log('plus u1tra')
    };

    console.log(globalScripts)

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