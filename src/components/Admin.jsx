import React from 'react'
import { useState } from 'react';
import Navbar from './Navbar';
import "./Admin.css";
import { IoMdClose } from 'react-icons/io';
import { useEffect } from 'react';
import { db } from '../../firebaseApp';
import { addDoc, collection, deleteDoc, doc, getDocs, or, orderBy, query, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';

export default function Admin() {

    const [admin, setAdmin] = useState(true);
    //let genres=["Action","Adventure","Fighting","FPS","Gacha","Horror","MOBA","Puzzle","Racing","RPG","Strategy","Survival","Shooter","Simulation","Sports"];
    let [gameName, setGameName] = useState("");
    let [genres, setGenres] = useState([]);
    let [gameGenres, setGameGenres] = useState([]);
    let [genre, setGenre] = useState("");
    let [gamePicture, setGamePicture] = useState("");
    const [url, setUrl] = useState(true);
    const [requests, setRequests] = useState([]);
    const [fileNames, setFileNames] = useState([]);

    const [r, refresh] = useState(false)


    useEffect(()=>{
        async function fetchGenres() {
            const snap = await getDocs(collection(db, "genres"));
            const lst = snap.docs.map(doc => ({ ...doc.data(), id:doc.id }));
            setGenres(lst)
        }
        fetchGenres()
        async function fetchRequests() {
            const snap = await getDocs(collection(db, "game-requests"));
            const lst = snap.docs.map(doc => ({ ...doc.data(), id:doc.id }));
            setRequests(lst)
        }
        fetchRequests()
    },[r])

    function addGameGenres(item) {
        let gameGenres2 = [...gameGenres];
        if (!gameGenres2.includes(item) && item.trim().length != 0) {
            gameGenres2.push(item);
        } else {
            let i = gameGenres2.findIndex(x => x == item);
            gameGenres2.splice(i, 1);
        }
        setGameGenres(gameGenres2.sort());
        console.log(gameGenres2);
    }

    async function addGame() {
        console.log(gameName);
        console.log(gamePicture);
        console.log(gameGenres);
        const snap = await getDocs(query(collection(db, "games")));
        const lst = snap.docs.map(doc => ({ ...doc.data(), id:doc.id}));
        let i = lst.findIndex(x => x.name.toLocaleLowerCase().trim().split(" ").join("") == gameName.toLocaleLowerCase().trim().split(" ").join(""))
        // console.log(i);
        if(i == -1 && gameName.trim().length != 0){
            await addDoc(collection(db, "games"), {name:gameName, img:gamePicture, likes:0, dislikes:0, genre:gameGenres});
            const snap = await getDocs(query(collection(db, "game-requests")));
            const lst = snap.docs.map(doc => ({ ...doc.data(), id:doc.id}));
            let i = lst.findIndex(x => x.name.toLocaleLowerCase().trim().split(" ").join("") == gameName.toLocaleLowerCase().trim().split(" ").join(""))
            delGameRequest(lst[i].id)
            setGameName("")
            setGameGenres([])
        }else if(i != -1 && gameName.trim().length != 0){
            await updateDoc(doc(db, "games", lst[i].id), {genre:gameGenres, img:gamePicture});
            const snap = await getDocs(query(collection(db, "game-requests")));
            const lst = snap.docs.map(doc => ({ ...doc.data(), id:doc.id}));
            let i = lst.findIndex(x => x.name.toLocaleLowerCase().trim().split(" ").join("") == gameName.toLocaleLowerCase().trim().split(" ").join(""))
            delGameRequest(lst[i].id)
            setGameName("")
            setGameGenres([])
        }
    }

    async function addGenre() {
        const snap = await getDocs(query(collection(db, "genres")));
        const lst = snap.docs.map(doc => ({ ...doc.data()}));
        let i = lst.findIndex(x => x.name.toLocaleLowerCase().trim() == genre.toLocaleLowerCase().trim())
        if(genre.trim().length != 0 && i == -1){
            await addDoc(collection(db, "genres"), {name:genre});
            refresh(!r)
            setGenre("")
        }else{
          console.log("A genre már létezik!");
        }
    }

    async function delGenre(id) {
        try {
            await deleteDoc(doc(db, "genres", id));
            refresh(!r)
        } catch (err) {
            console.log("Törlés során hiba!");
        }
    }

    async function delGameRequest(id) {
        try {
            await deleteDoc(doc(db, "game-requests", id));
            refresh(!r)
        } catch (err) {
            console.log("Törlés során hiba!");
        }
    }


    return (
        <div className='admin'>
            <Navbar />
            <div className='adds'>
                <div className="addNewGame">
                    <div>
                        <label htmlFor='gameName'>Game name: </label>
                        <input id='gameName' type="text" value={gameName} onChange={(e) => setGameName(e.target.value)} />
                    </div>
                    <div>
                        <span>Genres:</span>
                        <div >{genres.map(x => <div key={x.id} className='genreDiv' onClick={() => addGameGenres(x.name)}><div className='genreCheck' ><input type="checkbox" defaultChecked={false} checked={gameGenres.includes(x.name)} name="" id={`chk-${x.name}`} /><label htmlFor={`chk-${x.name}`}>{x.name}</label></div><IoMdClose onClick={() => delGenre(x.id)} /></div>)}</div>
                    </div>
                    <div className='pictureType'>
                        <h2>Picture upload method</h2>
                        <div className="toggle-wrapper">
                            <span className={`label ${url ? "active" : ""}`}>With link</span>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={!url}
                                    onChange={(e) => setUrl(!e.target.checked)}
                                />
                                <div className="track">
                                    <div className="thumb" />
                                </div>
                            </label>
                            <span className={`label ${!url ? "active" : ""}`}>With file</span>
                        </div>
                    </div>
                    <div className='addPicture'>
                        {url ?
                            <div className='picture'>
                                <label htmlFor='gamePicture'>Game picture: </label>
                                <input id='gamePicture' type="text" value={gamePicture} onChange={(e) => setGamePicture(e.target.value)} />
                            </div> :
                            <div className='file'>
                                <label htmlFor="myfile">Select files: </label>
                                <input style={{ display: "none" }} type="file" id="myfile" name="myfile" 
                                    onChange={(e) => { /*const files = Array.from(e.target.files); setFileNames(files.map(f => f.name));*/ setGamePicture(e.target.value);
                                    }}
                                />
                                <label className='fileChooser' htmlFor="myfile">File choosing</label>
                                {gamePicture.length > 0 && (
                                    <div className='fileNames'>
                                        <span >{gamePicture.split("fakepath\\")[1]}</span>
                                    </div>
                                )}
                            </div>
                        }
                    </div>
                    <input className='addGameButton' style={{ width: "200px" }} type="button" value="Add new game" onClick={addGame} disabled={gameName.trim().length==0 || gameGenres.length==0 ||gamePicture.trim().length==0}/>
                </div>
                <div className='oldalso'>
                    <div className="addGenre">
                        <label htmlFor='genre'>Genre:</label>
                        <input id='genre' type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />
                        <input className='addGenreButton' type="button" value="Add genre" onClick={addGenre} />
                    </div>
                    <div className='gameRequests'>
                        <span>Game requests:</span>
                        {requests.map(x => <div className='request' onClick={()=>setGameName(x.name)}>{x.name} <IoMdClose onClick={() => delGameRequest(x.id)} /></div>)}
                    </div>
                </div>
            </div>
        </div>
    )
}