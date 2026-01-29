import React from 'react'
import Navbar from './Navbar'

export default function Games() {

  const jatekok = ["Cyberpunk 2077", "Devil may cry 5", "Fortnite", "Valorant", "Counter Strike 2", "League of Legends", "Clair Obscure: Expedition 33", "Hollow knight: Silksong", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game"]

  return (
    <div>
      <Navbar/>
      <div className="hbox">
        <div className="filter">
          <input type="text" className='searchBar'/>
          <div className='radiok'>
            
          </div>
        </div>
        <div className="cardlist">
          {jatekok.map(x => <div className='card'>{x}</div>)}
        </div>
      </div>
    </div>
  )
}
