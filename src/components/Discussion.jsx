import React from 'react'
import Navbar from './Navbar'
import { useState } from 'react'
import "./Discussion.css";

export default function Discussion() {

  const [discussion,setDiscussion] =useState([
    {id:1, profile: "Aang", pfp:"https://sm.ign.com/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.jpg", szoveg:"Ez az első üzenet!"},
    {id:2, profile: "Aang", pfp:"https://sm.ign.com/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.jpg", szoveg:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim natus in facilis quis vel. Corporis, hic, explicabo consequatur, nostrum molestias possimus voluptate id inventore error at obcaecati similique perferendis fuga?"},
    {id:3, profile: "Aang", pfp:"https://sm.ign.com/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.jpg", szoveg:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim natus in facilis quis vel. Corporis, hic, explicabo consequatur, nostrum molestias possimus voluptate id inventore error at obcaecati similique perferendis fuga?"},
    {id:4, profile: "Aang", pfp:"https://sm.ign.com/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.jpg", szoveg:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim natus in facilis quis vel. Corporis, hic, explicabo consequatur, nostrum molestias possimus voluptate id inventore error at obcaecati similique perferendis fuga?"}
  ]);

  
  return (
    <div className='discussion'>
      <Navbar/>
      <div className="cardlist">
        {discussion.map(x=><div className='card' key={x.id}>
          <div className='person'>
            <img src={x.pfp} alt="" className='kep'/>
            <span>{x.profile}</span>
          </div>
          <div className='text'>
            {x.szoveg}
          </div>
          <input type="button" value="Csatlakozás" />
        </div>)}
      </div>
      
    </div>
  )
}
