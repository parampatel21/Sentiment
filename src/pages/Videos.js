import React, { useState, useEffect, useContext } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import {storage, firestore} from '../firebase'
import Navbar from './components/Navbar';
import { GlobalContext } from './components/GlobalState';
import '../styles/HomePage.css'

function Videos() {
    const { getuser} = useAuth()
    const uid = getuser()
    console.log(uid)
    const [selectedOption, setSelectedOption] = useState('option1');
    const [globalPerformance, setGlobalPerformance] = useContext(GlobalContext)[0];
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        let temp = performances;
        if (event.target.value == 'id') {
            temp.sort((a, b) => {
                return a.id - b.id;
            });
            console.log('id')
        } else if (event.target.value == 'title') {
            temp.sort((a, b) => {
                if (a.title < b.title) {
                    return -1;
                }
                if (a.title > b.title) {
                    return 1;
                }
                return 0;
            });
            console.log('title')
        } else if (event.target.value == 'created') {
            temp.sort((a, b) => {
                if (a.timestamp > b.timestamp) {
                    return -1;
                }
                if (a.timestamp < b.timestamp) {
                    return 1;
                }
                return 0;
            });
            console.log('created')
        } else if (event.target.value == 'updated') {
            temp.sort((a, b) => {
                if (a.dateUpdated > b.dateUpdated) {
                    return -1;
                }
                if (a.dateUpdated < b.dateUpdated) {
                    return 1;
                }
                return 0;
            });
            console.log('updated')
        }
        console.log(temp)
        setPerformances(temp)
    };

    // TO GET COLLECTION REFERENCE
    const [performances, setPerformances] = useState([]);

    async function loadTitlesFromCollection(uid) {
        const accessInfoRef = firestore.collection(uid).doc('access_info');
        let runningCount = 0
        return accessInfoRef.get()
            .then((doc) => {
            const data = doc.data();
            runningCount = data.running_count;

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
                        const dateUpdated = data.dateUpdated;
                        temp.push({ id: i, title: title, content: script, timestamp: timestamp, dateUpdated: dateUpdated })
                    }
                }));
            }
                return Promise.all(promises).then(() => {
                    return temp
                });
            })
            .catch((error) => console.error('Error getting access info: ', error));
    }

    useEffect(() => {
      loadTitlesFromCollection(uid)
        .then(titles => setPerformances(titles))
        .catch(error => console.error('Error getting performances: ', error));
    }, [uid], [performances]);
    // END OF COLLECTION REFERENCE

    const handleDelete = (objectId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (confirmDelete) {
            const title = performances.find((element) => element.id === objectId).title;
            const collectionRef = firestore.collection(uid);
            collectionRef.where("title", "==", title)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.ref.delete().then(() => {
                    console.log("Document successfully deleted!");

                    const accessInfoRef = firestore.collection(uid).doc('access_info');
                    accessInfoRef.get().then((doc) => {
                        const data = doc.data();
                        console.log(data)

                        const storageRef = storage.ref();
                        const fileRef = storageRef.child(uid + '_' + objectId + '.avi');
                        console.log(uid + '_' + objectId + '.avi')
                        fileRef.delete().then(() => {
                            console.log(`Successfully deleted`);
                        })

                    })

                    window.location.reload();
                    }).catch((error) => {
                    console.error("Error removing document: ", error);
                    });
                });
                }).catch((error) => {
                    console.error("Error querying documents: ", error);
                });
            }
        };
    
        const handleDownload = (objectId) => {
            const title = performances.find((element) => element.id === objectId).title;
            const collectionRef = firestore.collection(uid);
            collectionRef.where("title", "==", title)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  console.log(doc.id);
                  const storageRef = storage.ref();
                  const fileRef = storageRef.child(uid + '_' + doc.id + '.avi');
                  fileRef.getDownloadURL().then(function(url) {
                    // create a new page to view/download the file
                    const newTab = window.open();
                    const video = document.createElement('video');
                    video.src = url;
                    video.controls = true;
                    video.style.width = "100%";
                    video.style.height = "100%";
                    newTab.document.body.style.margin = "0px";
                    newTab.document.body.appendChild(video);
                    const text = document.createTextNode("To download, click the three dots in the video player.");
                    const p = document.createElement('p');
                    p.style.position = "absolute";
                    p.style.top = "10px";
                    p.style.left = "10px";
                    p.style.color = "white";
                    p.appendChild(text);
                    newTab.document.body.appendChild(p);
                  }).catch(function(error) {
                    // handle errors
                    console.log(error);
                  });
                });
              })
              .catch((error) => {
                console.log("Error getting documents: ", error);
              });
          };

        const handleUpdate = (objectId) => {
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            const currentDate = `${year}:${month}:${day}:${hours}:${minutes}:${seconds}`;

            const title = performances.find((element) => element.id === objectId).title;
            const collectionRef = firestore.collection(uid);
            const newTitle = prompt('Enter a new name:', title);
            if (newTitle) {
                collectionRef.where("title", "==", title)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                    doc.ref.update({ title: newTitle })
                        .then(() => {
                        console.log('Document successfully updated!');
                        const doc = collectionRef.doc(objectId.toString()).set({
                            dateUpdated: currentDate
                        }, {merge: true});
                        
                        window.location.reload();
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

        const handleSelect = (objectId) => {
            const temp = performances.find((element) => element.id === objectId);
            setGlobalPerformance(temp);
        }

    const testServerText = () => {
        fetch('https://134.209.213.235:443', {
            method: 'POST',
            body:  '{"uid": "XrD8vDF13QQgv6HLEZz9brdo54N2", "index":"1"}'
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error(error))

    } // PORT IS DIFFERENT IT SAYS 443


    const testServerVideo = () => {
        fetch('https://134.209.213.235:444', {
            method: 'POST',
            body:  '{"uid": "XrD8vDF13QQgv6HLEZz9brdo54N2", "index":"1"}'
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error(error))

    }

    return (
        <div className="container">
            <Navbar />
            <main>
                <div>
                    <h1>Your Videos</h1>
                    <button onClick={() => testServerText()}>test</button>
                    <select id="select-options" value={selectedOption} onChange={handleOptionChange} style={{ width: '100%' }}>
                        <option value={'id'}>Video ID</option>
                        <option value={'title'}>Title</option>
                        <option value={'created'}>Date Created</option>
                        <option value={'updated'}>Date Updated</option>
                    </select>
                    <button className='sort-button'>Sort By</button>
                    &nbsp;
                    {performances.map(object => (
                        <div key={object.id} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link to={`/videos/${object.id}`} style={{ width: '100%' }} onClick={() => handleSelect(object.id)} className='list-item'>{object.title}</Link>
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

export default Videos;