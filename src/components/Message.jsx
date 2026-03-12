import React from 'react'
import { useEffect } from 'react'
import { db } from '../../firebaseApp';
import { useState } from 'react';
import { addDoc, collection, doc, getDocs, or, orderBy, query, setDoc, Timestamp, where } from 'firebase/firestore';

export default function Message() {

  const [messages, setMessages] = useState([])
  const [friends, setFriends] = useState([])
  const [nonfriends, setNonFriends] = useState([])
  const [users, setUsers] = useState([]);

  let user = {
    email:"admin@gmail.com"
  }

  useEffect(()=>{
    function createKey(a,b){
        return [a,b].sort().join("__");
    }
    async function getMessages() {
      if(user){
          const q = query(
            collection(db, "private-messages"),
            or(
              where("sender", "==", user.email),
              where("receiver", "==", user.email)
            ),
            orderBy("time", "asc")
          );
          
          const adatSnapshot = await getDocs(q);
          
          const adatList = adatSnapshot.docs.map(doc => ({ ...doc.data(), id:doc.id }));
          
          const grouped = {}
          const friendsSet = new Set();
          adatList.forEach(msg => {
            const key = createKey(msg.sender, msg.receiver);
            if(!grouped[key]){
              grouped[key] = {
                participants:[msg.sender,msg.receiver].sort(),
                messages:[]
              }
            }
            grouped[key].messages.push(msg);
            
            
            if (msg.sender != user.email) friendsSet.add(msg.sender);
            if (msg.receiver !== user.email) friendsSet.add(msg.receiver);
          })
          setMessages(Object.values(grouped))
          setFriends([...friendsSet])
        }else{
          setMessages([])
          setFriends([])
        }
    }
    async function getUsers() {
      const snap = await getDocs(collection(db, "user-data"))
      const lst = snap.docs.map(doc => ({ ...doc.data(), id:doc.id }));
      setUsers(lst)
    }
    getUsers()
    getMessages()
  },[])

  useEffect(()=>{
    async function getNonFriends() {
          const adatSnapshot = await getDocs(collection(db, "user-data"));
          const adatList = adatSnapshot.docs.map(doc => ({ ...doc.data(), id:doc.id }));
          const allEmails = adatList.map(u => u.email).filter(Boolean);
          const filteredEmails = allEmails.filter(
            email =>
              email !== user?.email &&     // ne saját magad
              !friends.includes(email)     // ne legyen friend
          );
          setNonFriends(filteredEmails);
    }
    getNonFriends()
  },[friends])
  
  


  return (
    <div>
        {/* hajrá */}
    </div>
  )
}
