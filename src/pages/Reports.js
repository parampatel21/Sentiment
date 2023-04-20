import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { firestore, storage } from '../firebase';
import Navbar from './components/Navbar';
import '../styles/HomePage.css'

function Reports() {
    const navigate = useNavigate()
    const [selectedOption, setSelectedOption] = useState('option1');
    const { getuser } = useAuth()
    const uid = getuser()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [reports, setReports] = useState([])

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        let temp = reports;
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
        setReports(temp)
    };

    async function loadScriptsFromCollection(uid) {
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

    const handleDelete = (objectId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (confirmDelete) {
            const title = reports.find((element) => element.id === objectId).title;
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
                                const old_count = data.running_count
                                const new_count = old_count - 1

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

    const handleUpdate = (objectId) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const currentDate = `${year}:${month}:${day}:${hours}:${minutes}:${seconds}`;

        console.log(objectId)
        const title = reports.find((element) => element.id === objectId).title;
        const collectionRef = firestore.collection(uid);
        const newTitle = prompt('Enter a new name:', title);
        if (newTitle) {
            collectionRef.where("title", "==", title).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.ref.update({ title: newTitle })
                        .then(() => {
                            console.log('Document successfully updated!');
                            const doc = collectionRef.doc(objectId.toString()).set({
                                dateUpdated: currentDate
                            }, { merge: true });

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

    const handleDownload = (objectId) => {
        const docRef = firestore.collection(uid).doc(objectId.toString());
        docRef.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const text = 'Title: ' + data.title + '\nScript: ' + data.script;
                console.log(text);
                // Download text file
                const file = new Blob([text], { type: 'text/plain' });
                const fileURL = URL.createObjectURL(file);
                const downloadLink = document.createElement('a');
                downloadLink.href = fileURL;
                downloadLink.download = data.title;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    useEffect(() => {
        loadScriptsFromCollection(uid)
            .then((reports) => {
                setReports(reports)
            })
            .catch((error) => console.error('Error getting reports: ', error))
    }, [uid])
    console.log(reports)

    return (
        <div className="container-fluid">
            <Navbar />
            <main>
                <div>
                    <h1>Your Reports</h1>
                    <select id="select-options" value={selectedOption} onChange={handleOptionChange} style={{ width: '100%' }}>
                        <option value={'id'}>Report ID</option>
                        <option value={'title'}>Title</option>
                        <option value={'created'}>Date Created</option>
                        <option value={'updated'}>Date Updated</option>
                    </select>
                    <button className='sort-button'>Sort By</button>
                    &nbsp;
                    {reports.map(object => (
                        <div key={object.id} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <a href={`/reports/${object.id}`} style={{ width: '100%' }} className='list-item'>{object.title}</a>
                            <button style={{ display: 'inline-block' }} className='hero-button' onClick={() => handleDelete(object.id)}>Delete</button>
                            &nbsp;
                            <button style={{ display: 'inline-block' }} className='hero-button' onClick={() => handleUpdate(object.id)}>Update</button>
                            &nbsp;
                            <button style={{ display: 'inline-block' }} className='hero-button' onClick={() => handleDownload(object.id)}>Download</button>
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

export default Reports;