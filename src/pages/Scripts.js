import React, { useState, useEffect, useContext } from 'react'
import { GlobalContext } from './components/GlobalState';
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
    console.log(uid)

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const [runningCount, setRunningCount] = useState(0)



    // TO GET COLLECTION REFERENCE
    const [scripts, setScripts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const newScripts = loadScriptsFromCollection(uid);
            setScripts(newScripts);
        }

        fetchData();
    }, [uid]);

    function loadScriptsFromCollection(uid) {
        
        /* Author-JASON: Idk why running count is undefined. My plan is to get running count and create
           an array by adding the elements that arent undefined since if we delete file[1] the running count
           for each file remains the same and total running_count stays the same. Hope that makes sense :) 
        */
        
        const accessInfoRef = firestore.collection(uid).doc('access_info');
        accessInfoRef.get().then((doc) => {
            const data = doc.data();
            setRunningCount(data.running_count);
        })

        console.log(runningCount)
        let temp = [];
        let temp2 = [];
        let promises = [];

        for (let i = 1; i <= runningCount; i++) {
            const currentCountRef = firestore.collection(uid).doc(i.toString());
            currentCountRef.get().then((doc) => {
                console.log(doc.exists)
                if (doc.exists) {
                    const data = doc.data();
                    const title = data.title;
                    const script = data.script;
                    const timestamp = data.timestamp;
                    console.log(data)
                    temp.push({ id: i, title: title, content: script, timestamp: timestamp })
                    temp2.push(title)


                    try {
                        setError('')
                        setLoading(true)
                        console.log("try reached")
                        // handleUpload(new_count)
                    } catch {
                        console.log("catch reached")
                    }
                }
            });
            // promises.push(promise);
        }
        // await Promise.all(promises);
        return temp;

    }

    // setScripts(loadScriptsFromCollection(uid))


    // END OF COLLECTION REFERENCE


    const handleDelete = (objectId) => {
        console.log('plus u1tra')
        // axios.delete(`/api/objects/${objectId}`)
        //     .then(() => {
        //         setObjects(objects.filter(object => object.id !== objectId));
        //     })
        //     .catch(error => console.error(error));
    };

    const [globalScripts, setGlobalScripts] = useContext(GlobalContext)[2];
    useEffect(() => {
        setGlobalScripts(scripts);
    }, [scripts]);


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