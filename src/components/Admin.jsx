import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Admin.css';
import { IoMdClose } from 'react-icons/io';
import { db } from '../../firebaseApp';
import {
  addDoc, collection, deleteDoc, doc, getDocs,
  query, Timestamp, updateDoc,
} from 'firebase/firestore';

export default function Admin() {
  const [gameName, setGameName] = useState('');
  const [genres, setGenres] = useState([]);
  const [gameGenres, setGameGenres] = useState([]);
  const [genre, setGenre] = useState('');
  const [gamePicture, setGamePicture] = useState('');
  const [url, setUrl] = useState(true);
  const [requests, setRequests] = useState([]);
  const [description, setDescription] = useState('');
  const [r, refresh] = useState(false);

  const MAX_DESC = 500;

  useEffect(() => {
    async function fetchGenres() {
      const snap = await getDocs(collection(db, 'genres'));
      setGenres(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
    }
    async function fetchRequests() {
      const snap = await getDocs(collection(db, 'game-requests'));
      setRequests(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
    }
    fetchGenres();
    fetchRequests();
  }, [r]);

  function toggleGenre(item) {
    setGameGenres((prev) => {
      if (prev.includes(item)) return prev.filter((x) => x !== item).sort();
      return [...prev, item].sort();
    });
  }

  async function resolveRequest(matchedName) {
    const snap = await getDocs(collection(db, 'game-requests'));
    const lst = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
    const normalize = (s) => s.toLocaleLowerCase().trim().replace(/\s+/g, '');
    const match = lst.find((x) => normalize(x.name) === normalize(matchedName));
    if (match) await delGameRequest(match.id);
  }

  async function addGame() {
    if (gameName.trim().length === 0) return;
    const normalize = (s) => s.toLocaleLowerCase().trim().replace(/\s+/g, '');

    const snap = await getDocs(query(collection(db, 'games')));
    const lst = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
    const existing = lst.find((x) => normalize(x.name) === normalize(gameName));

    if (!existing) {
      await addDoc(collection(db, 'games'), {
        name: gameName, img: gamePicture, likes: 0, dislikes: 0,
        genre: gameGenres, description, createdAt:Timestamp.now()
      });
    }else{
      console.log("A játék már létezik!");
    }

    await resolveRequest(gameName);
    setGameName('');
    setGameGenres([]);
    setDescription('');
    setGamePicture('');
  }

  async function addGenre() {
    if (genre.trim().length === 0) return;
    const snap = await getDocs(collection(db, 'genres'));
    const lst = snap.docs.map((d) => d.data());
    const exists = lst.some(
      (x) => x.name.toLocaleLowerCase().trim() === genre.toLocaleLowerCase().trim()
    );
    if (!exists) {
      await addDoc(collection(db, 'genres'), { name: genre });
      refresh((p) => !p);
      setGenre('');
    } else {
      console.warn('A genre már létezik!');
    }
  }

  async function delGenre(id) {
    try {
      await deleteDoc(doc(db, 'genres', id));
      refresh((p) => !p);
    } catch (err) {
      console.error('Törlés során hiba!', err);
    }
  }

  async function delGameRequest(id) {
    try {
      await deleteDoc(doc(db, 'game-requests', id));
      refresh((p) => !p);
    } catch (err) {
      console.error('Törlés során hiba!', err);
    }
  }

  const canAddGame =
    gameName.trim().length > 0 &&
    gameGenres.length > 0 &&
    gamePicture.trim().length > 0;

  return (
    <div className="admin">
      <Navbar />
      <div className="adds">
        <div className="addNewGame">
          <div>
            <label htmlFor="gameName">Game name: </label>
            <input
              id="gameName" type="text" value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
          </div>
          <div>
            <span>Genres:</span>
            <div>
              {genres.map((x) => (
                <div key={x.id} className="genreDiv" onClick={() => toggleGenre(x.name)}>
                  <div className="genreCheck">
                    <input
                      type="checkbox" readOnly
                      checked={gameGenres.includes(x.name)}
                      id={`chk-${x.name}`}
                    />
                    <label htmlFor={`chk-${x.name}`}>{x.name}</label>
                  </div>
                  <IoMdClose onClick={(e) => { e.stopPropagation(); delGenre(x.id); }} />
                </div>
              ))}
            </div>
          </div>

          <div className="pictureType">
            <h2>Picture upload method</h2>
            <div className="toggle-wrapper">
              <span className={`label ${url ? 'active' : ''}`}>With link</span>
              <label className="toggle">
                <input type="checkbox" checked={!url} onChange={() => setUrl((p) => !p)} />
                <div className="track"><div className="thumb" /></div>
              </label>
              <span className={`label ${!url ? 'active' : ''}`}>With file</span>
            </div>
          </div>

          <div className="addPicture">
            {url ? (
              <div className="picture">
                <label htmlFor="gamePicture">Game picture: </label>
                <input
                  id="gamePicture" type="text" value={gamePicture}
                  onChange={(e) => setGamePicture(e.target.value)}
                />
              </div>
            ) : (
              <div className="file">
                <label htmlFor="myfile">Select files: </label>
                <input
                  style={{ display: 'none' }} type="file" id="myfile" name="myfile"
                  onChange={(e) => setGamePicture(e.target.value)}
                />
                <label className="fileChooser" htmlFor="myfile">File choosing</label>
                {gamePicture.length > 0 && (
                  <div className="fileNames">
                    <span>{gamePicture.split('fakepath\\')[1]}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="addDescription">
            <label htmlFor="gameDescription">Description</label>
            <textarea
              id="gameDescription" className="description" rows={5} maxLength={MAX_DESC}
              placeholder="Write a short description of the game..."
              value={description} onChange={(e) => setDescription(e.target.value)}
            />
            <span className={`charCount${description.length > 450 ? description.length >= MAX_DESC ? ' over' : ' near' : ''}`}>
              {description.length} / {MAX_DESC}
            </span>
          </div>

          <input
            className="addGameButton" style={{ width: '200px' }}
            type="button" value="Add new game"
            onClick={addGame} disabled={!canAddGame}
          />
        </div>

        <div className="oldalso">
          <div className="addGenre">
            <label htmlFor="genre">Genre:</label>
            <input id="genre" type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />
            <input className="addGenreButton" type="button" value="Add genre" onClick={addGenre} />
          </div>
          <div className="gameRequests">
            <span>Game requests:</span>
            {requests.map((x) => (
              <div key={x.id} className="request" onClick={() => setGameName(x.name)}>
                {x.name}
                <IoMdClose onClick={(e) => { e.stopPropagation(); delGameRequest(x.id); }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
