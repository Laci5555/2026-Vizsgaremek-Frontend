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

    function addGameGenres(item) {
        let gameGenres2=[...gameGenres];
        gameGenres2.push(item);
        setGameGenres(gameGenres2);
    }

    function addGame() {
        console.log(gameName);
        console.log(gamePicture);
        console.log(gameGenres);
    }

    function addGenre() {
        let genres2=[...genres];
        genres2.push(genre);
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
                    <div>{genres.map(x=><div key={x}><input  type="checkbox" name="" id="chk" onChange={()=>addGameGenres(x)}/><label htmlFor='chk'> {x}</label></div>)}</div>
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
                        <div>
                            <label htmlFor='gamePicture'>Game picture: </label>
                            <input id='gamePicture' type="text" value={gamePicture} onChange={(e) => setGamePicture(e.target.value)}/>
                        </div> : 
                        <div>
                            <label for="myfile">Select files: </label>
                            <input type="file" id="myfile" name="myfile" multiple value={gamePicture} onChange={(e) => setGamePicture(e.target.value)}/>
                        </div>
                    }
                </div>
                <input style={{width:"200px"}} type="button" value="Add new game" onClick={addGame}/>
            </div>
            <div className="addGenre">
                <label htmlFor='genre'>Genre:</label>
                <input id='genre' type="text" value={genre} onChange={(e) => setGenre(e.target.value)}/>
                <input type="button" value="Add genre" onClick={addGenre}/>
            </div>
        </div>
        
    </div>
  )
}
