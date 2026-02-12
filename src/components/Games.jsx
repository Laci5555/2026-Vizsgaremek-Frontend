import {useEffect, useState } from 'react'
import Navbar from './Navbar'
import "./Games.css";
import { IoSearchOutline } from 'react-icons/io5';
import { TfiFilter } from 'react-icons/tfi';
import { IoMdClose } from 'react-icons/io';

export default function Games({darkmode,setDarkmode}) {

  const jatekok = ["Cyberpunk 2077", "Devil may cry 5", "Fortnite", "Valorant", "Counter Strike 2", "League of Legends", "Clair Obscure: Expedition 33", "Hollow knight: Silksong", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game"]

  const genres=["Action","Adventure","Fighting","FPS","Gacha","Horror","MOBA","Puzzle","Racing","RPG","Strategy","Survival","Shooter","Simulation","Sports"];

  const [game,setGame]=useState("");

  const [games,setGames]=useState([...jatekok]);

  const [refresh,setRefresh]=useState(false);
  const [showFilter,setShowFilter]=useState(false);

  useEffect(()=>{
    async function getGames() {
      // setGames([...jatekok])
      console.log(games);
      setShowFilter(false);
    }
    getGames();
  },[refresh]);

  async function getGame() {
    let modGames=[];
    if(game==""){
      setGames([...jatekok])
    } else {
      modGames=jatekok.filter(x=>x.toLowerCase().includes(game.toLowerCase()));
      console.log(modGames);
      setGames(modGames);
    }
    setRefresh(!refresh);
  }

  function showingFilter() {
    setShowFilter(!showFilter);
  }

  return (
    <div className='games'>
      <Navbar darkmode={darkmode} setDarkmode={setDarkmode}/>
      <div className="hbox">
        <button className='filterIcon' onClick={showingFilter}><TfiFilter  /></button>
        <div className={`filter ${showFilter ? "show" : ""}`}>
          <IoMdClose className='close' onClick={showingFilter}/>
          <div className='searchDiv'>
            <IoSearchOutline style={{color:"grey"}}/>
            <input type="text" className='searchBar' value={game} onChange={e=>setGame(e.target.value)}/>
            <input className='searchBtn' type="button" value="Search" onClick={getGame}/>
          </div>
          <div className='checkboxs'>
            {genres.map(x=><div className='genres' key={x}>
                <input type="checkbox" name="" id={x} />
                <label htmlFor={x}>{x}</label>
            </div>)}
          </div>
        </div>
        <div className="cardlist">
          {games.length>0 ? games.map(x => <div className='card'>{x}</div>) : <div>Sajnos ilyen nevű játék nincs...</div>}
        </div>
      </div>
    </div>
  )
}
