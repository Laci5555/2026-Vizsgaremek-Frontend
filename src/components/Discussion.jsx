import React from 'react'
import Navbar from './Navbar'
import { useState } from 'react'
import "./Discussion.css";
import { useEffect } from 'react';
import { addDoc, collection, doc, getDocs, query, setDoc, Timestamp, where } from 'firebase/firestore';
import { db } from '../../firebaseApp';

export default function Discussion({user}) {

  const [discussions,setDiscussions] =useState([]);

  const [users, setUsers] = useState([]);

  const [currentchat, setCurrentchat] = useState([])

  const [message, setMessage] = useState("");

  useEffect(()=>{
    async function getDiscussions() {
      const snap = await getDocs(collection(db, "discussions"))
      const lst = snap.docs.map(doc => ({ ...doc.data(), id:doc.id }));
      setDiscussions(lst)
    }
    async function getUsers() {
      const snap = await getDocs(collection(db, "user-data"))
      const lst = snap.docs.map(doc => ({ ...doc.data(), id:doc.id }));
      setUsers(lst)
    }
    getDiscussions()
    getUsers()
  },[])

  function getUser(email){
    let i = users.findIndex(x => x.email == email)
    return users[i]
  }

  function OpenChat(id){
    setCurrentchat(id)
  }

  async function sendMessage(){
    try {
      if(message!=""){
        await addDoc(collection(db, "discussion-messages"), {comment:message, discussionID:currentchat, email:user.email, time:Timestamp.now()});
      }
    } catch (err) {
      console.log(err);
    }
  }

  
  return (
    <div className='discussion'>
      <Navbar/>
      <div className="cardlist">
        {discussions.map(x=><div className='card' key={x.id} onClick={()=>OpenChat(x.id)}>
          <div className='person'>
            <img src={getUser(x.creatoremail).picture} alt="" className='kep'/>
            <span>{getUser(x.creatoremail).username}</span>
          </div>
          <div className='text'>
            <p>{x.title}</p>
            <p>{x.description}</p>
            {/* --Modal ba-- <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
            <input type="button" value="Send"  onClick={sendMessage}/> */}
          </div>
        </div>)}
      </div>
      
    </div>
  )
}
