import pyrebase
import os
import firebase_admin
from firebase_admin import credentials, storage
from collections.abc import Mapping



config = {
    "apiKey": "AIzaSyBeGxpyW7-XKT4scH41JCzn2Tzb3s7sveY",
    "authDomain": "sentiment-6696b.firebaseapp.com",
    "databaseURL": "https://sentiment-6696b-default-rtdb.firebaseio.com",
    "projectId": "sentiment-6696b",
    "storageBucket": "sentiment-6696b.appspot.com",
    "messagingSenderId": "929145383886",
    "appId": "1:929145383886:web:4059c05a3f9aebca45199f",
    "measurementId": "G-38C03L0RC1"
}

firebase = pyrebase.initialize_app(config=config)
storage = firebase.storage()

path_on_cloud = "Scripts/Script.txt"
path_local = "Script.txt"
storage.child(path_on_cloud).put(path_local)