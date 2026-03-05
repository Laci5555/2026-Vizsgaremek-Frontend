import React from 'react'
import { useState } from 'react';

export default function Admin() {

    //let genres=["Action","Adventure","Fighting","FPS","Gacha","Horror","MOBA","Puzzle","Racing","RPG","Strategy","Survival","Shooter","Simulation","Sports"];
    let [gameName,setGameName]=useState("");
    let [genres,setGenres]=useState(["Action","Adventure","Fighting","FPS","Gacha","Horror","MOBA","Puzzle","Racing","RPG","Strategy","Survival","Shooter","Simulation","Sports"]);
    let [gameGenres,setGameGenres]=useState([]);
    let [genre,setGenre]=useState("");
    let [gamePicture,setGamePicture]=useState("");

    function addGameGenres(item) {
        let gameGenres2=[...gameGenres];
        gameGenres2.push(item);
        setGameGenres(gameGenres2);
    }

    function addGame() {
        console.log(gameName);
        console.log(gamePicture);
    }

    function addGenre() {
        let genres2=[...genres];
        genres2.push(genre);
        setGenres(genres2);
    }

    console.log(gameGenres,genres);
    

  return (
    <div className='admin'>
        <div className="addNewGame">
            <div>
                <label>Game name:</label>
                <input type="text" value={gameName} onChange={(e) => setGameName(e.target.value)}/>
            </div>
            <div>
                <label>Genres:</label>
                <div>{genres.map(x=><div><input key={x} type="checkbox" name="" id="chk" onChange={()=>addGameGenres(x)}/><label htmlFor='chk'>{x}</label></div>)}</div>
            </div>
            <div>
                <label>Game picture</label>
                <input type="text" value={gamePicture} onChange={(e) => setGamePicture(e.target.value)}/>
            </div>
            <input type="button" value="Add genres to the new game" onClick={addGame}/>
        </div>
        <div className="addGenre">
            <label>Genre:</label>
            <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)}/>
            <input type="button" value="Add genre" onClick={addGenre}/>
        </div>
    </div>
  )
}
