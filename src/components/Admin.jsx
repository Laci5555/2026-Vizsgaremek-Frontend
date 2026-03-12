import React from 'react'
import { useState } from 'react';
import Navbar from './Navbar';
import "./Admin.css";

export default function Admin() {

    const [admin,setAdmin]=useState(true);
    //let genres=["Action","Adventure","Fighting","FPS","Gacha","Horror","MOBA","Puzzle","Racing","RPG","Strategy","Survival","Shooter","Simulation","Sports"];
    let [gameName,setGameName]=useState("");
    let [genres,setGenres]=useState(["Action","Adventure","Fighting","FPS","Gacha","Horror","MOBA","Puzzle","Racing","RPG","Strategy","Survival","Shooter","Simulation","Sports"]);
    let [gameGenres,setGameGenres]=useState([]);
    let [genre,setGenre]=useState("");
    let [gamePicture,setGamePicture]=useState("");
    const [url,setUrl]=useState(true);
    const [requests,setRequests]=useState(["Elden Ring","Resident Evil: Requiem"]);

    function addGameGenres(item) {
        let gameGenres2=[...gameGenres];
        if(!gameGenres2.includes(item) && item.trim().length!=0){
            gameGenres2.push(item);
        } else{
            let i=gameGenres2.findIndex(x=>x==item);
            gameGenres2.splice(i,1);
        }
        setGameGenres(gameGenres2.sort());
        console.log(gameGenres2);
        
    }

    function addGame() {
        console.log(gameName);
        console.log(gamePicture);
        console.log(gameGenres);
    }

    function addGenre() {
        let genres2=[...genres];
        let i=genres2.findIndex(x=>x.toLocaleLowerCase().trim()==genre.toLocaleLowerCase().trim());
        if(i==-1 && genre.trim().length!=0){
            genres2.push(genre);
            console.log("Nágy sikeer!");
            
        }
        setGenres(genres2);
    }

    
  return (
    <div className='admin'>
        <Navbar/>
        <div className='adds'>
            <div className="addNewGame">
                <div>
                    <label htmlFor='gameName'>Game name: </label>
                    <input id='gameName' type="text" value={gameName} onChange={(e) => setGameName(e.target.value)}/>
                </div>
                <div>
                    <span>Genres:</span>
                    <div>{genres.map(x=><div key={x} onClick={() => addGameGenres(x)}><input type="checkbox" defaultChecked={false} checked={gameGenres.includes(x)} name="" id={`chk-${x}`} /><label htmlFor={`chk-${x}`}>{x}</label></div>)}</div>
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
                            <input id='gamePicture' type="text" value={gamePicture} onChange={(e) => setGamePicture(e.target.value)}/>
                        </div> : 
                        <div className='file'>
                            <label htmlFor="myfile">Select files: </label>
                            <input style={{display:"none"}} type="file" id="myfile" name="myfile" multiple value={gamePicture} onChange={(e) => setGamePicture(e.target.value)}/>
                            <label className='fileChooser' htmlFor="myfile">File choosing</label>
                        </div>
                    }
                </div>
                <input className='addGameButton' style={{width:"200px"}} type="button" value="Add new game" onClick={addGame}/>
            </div>
            <div className='oldalso'>
                <div className="addGenre">
                    <label htmlFor='genre'>Genre:</label>
                    <input id='genre' type="text" value={genre} onChange={(e) => setGenre(e.target.value)}/>
                    <input className='addGenreButton' type="button" value="Add genre" onClick={addGenre}/>
                </div>
                <div className='gameRequests'>
                    {requests.map(x=><div>{x}</div>)}
                </div>
            </div>
            
        </div>
        
    </div>
  )
}
