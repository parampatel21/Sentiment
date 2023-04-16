import React, { useState, useEffect, useContext } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import {storage, firestore} from '../firebase'
import Navbar from './components/Navbar';
import { GlobalContext } from './components/GlobalState';
import '../styles/HomePage.css'

function ViewAllPerformances() {
    const { getuser} = useAuth()
    const uid = getuser()
    const [selectedOption, setSelectedOption] = useState('option1');
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };    
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // TO GET COLLECTION REFERENCE
    const [performances, setPerformances] = useState([]);

    async function loadTitlesFromCollection(uid) {
        let counter = 0
        let temp = []
        const collectionRef = firestore.collection(uid);
        return collectionRef.get().then((querySnapshot) => {            
          querySnapshot.forEach((doc) => {
            counter++
            const title = doc.data().title;
            if (title == null) return temp
            temp.push({ id: counter, title: title});
          });
          return temp;
        }).catch((error) => {
          console.error('Error getting documents: ', error);
          return [];
        });
    }

    useEffect(() => {
      loadTitlesFromCollection(uid)
        .then(titles => setPerformances(titles))
        .catch(error => console.error('Error getting performances: ', error));
    }, [uid]);
    // END OF COLLECTION REFERENCE

    const handleDelete = (objectId) => {
        // TODO: RUNNING COUTNT IS NOT DECREMENTED AND FIREBASE STORAGE DOES NOT CLEAR SAID VIDEO
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (confirmDelete) {
            const title = performances[objectId - 1].title;
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
                        const old_count = data.running_count
                        const new_count = data.running_count - 1

                        firestore.collection(uid).doc("access_info").set({
                            running_count: new_count
                        }, { merge: true })

                        const storageRef = storage.ref();
                        const fileRef = storageRef.child(uid + '_' + old_count + '.avi');
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
            const title = performances[objectId - 1].title;
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
        const title = performances[objectId - 1].title;
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

    const [globalPerformances, setGlobalPerformances] = useContext(GlobalContext)[0];
    useEffect(() => {
        setGlobalPerformances(performances)
        console.log(globalPerformances)
    })

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
                        <div key={object.id} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link to={`/videos/${object.id}`} style={{ width: '100%' }} className='list-item'>{object.title}</Link>
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