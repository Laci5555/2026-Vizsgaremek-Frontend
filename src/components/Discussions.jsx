import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Discussions.css';
import {
  addDoc,
  collection, getDocs,
} from 'firebase/firestore';
import { db } from '../../firebaseApp';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { GoPlus } from 'react-icons/go';
import { IoMdClose } from 'react-icons/io';

const PLACEHOLDER = 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-2409187029.jpg';

const MAX_TITLE = 80;
const MAX_DESC = 300;

export default function Discussions() {
  const [discussions, setDiscussions] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useApp();
  const [r, refresh] = useState(false);

  // modal state
  const [isOpen, setIsOpen] = useState(false);
  const [discTitle, setDiscTitle] = useState('');
  const [discDescr, setDiscDescr] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function getDiscussions() {
      const snap = await getDocs(collection(db, 'discussions'));
      setDiscussions(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    async function getUsers() {
      const snap = await getDocs(collection(db, 'user-data'));
      setUsers(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    getDiscussions();
    getUsers();
  }, [r]);

  function getUser(email) {
    return users.find((x) => x.email === email);
  }

  function openModal() {
    setDiscTitle('');
    setDiscDescr('');
    setError('');
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setError('');
  }

  async function createDiscussion() {
    const title = discTitle.trim();
    const descr = discDescr.trim();

    if (!title) { setError('Title cannot be empty.'); return; }
    if (title.length < 3) { setError('Title must be at least 3 characters.'); return; }
    if (!user?.email) { setError('You must be logged in.'); return; }

    try {
      await addDoc(collection(db, 'discussions'), {
        creatoremail: user.email,
        title,
        description: descr,
      });
      closeModal();
      refresh((p) => !p);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  }

  const canSubmit = discTitle.trim().length >= 3;

  if (users.length === 0) return <div className="discussions"><Navbar /></div>;

  return (
    <div className="discussions">
      <Navbar />

      {/* ── Discussion cards ── */}
      <div className="cardlist">
        {discussions.map((x) => (
          <Link key={x.id} to={`/discussion/${x.id}/${x.title}`}>
            <div className="card">
              <div className="person">
                <img
                  src={getUser(x.creatoremail)?.picture || PLACEHOLDER}
                  alt=""
                  className="picture"
                  onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
                />
                <span>{getUser(x.creatoremail)?.username}</span>
              </div>
              <div className="text">
                <p>{x.title}</p>
                <p>{x.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── FAB – bottom-left ── */}
      <div className="createDiscussion" style={{ left: 28, right: 'auto' }} onClick={openModal} title="New discussion">
        <GoPlus />
      </div>

      {/* ── Create discussion modal ── */}
      <div
        className={`backdrop ${isOpen ? 'visible' : ''}`}
        onMouseDownCapture={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-top-bar" />

          <button className="close-btn" onClick={closeModal}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <div className="newgame" style={{ gap: 16 }}>
            <h2>Start a new discussion</h2>

            {/* Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em' }}>
                TITLE <span style={{ color: '#e05' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="What's on your mind?"
                maxLength={MAX_TITLE}
                value={discTitle}
                onChange={(e) => { setDiscTitle(e.target.value); setError(''); }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: 'none',
                  borderBottom: `1px solid ${error && !discTitle.trim() ? '#e05' : 'rgba(255,255,255,0.15)'}`,
                  padding: '8px 4px',
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.85)',
                  outline: 'none',
                  fontFamily: 'inherit',
                  width: '100%',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
              />
              <span style={{ fontSize: 11, color: discTitle.length > MAX_TITLE * 0.9 ? '#f90' : 'rgba(255,255,255,0.2)', alignSelf: 'flex-end' }}>
                {discTitle.length} / {MAX_TITLE}
              </span>
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em' }}>
                DESCRIPTION <span style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>(optional)</span>
              </label>
              <textarea
                placeholder="Add more context..."
                maxLength={MAX_DESC}
                rows={4}
                value={discDescr}
                onChange={(e) => setDiscDescr(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.15)',
                  padding: '8px 4px',
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.85)',
                  outline: 'none',
                  fontFamily: 'inherit',
                  width: '100%',
                  boxSizing: 'border-box',
                  resize: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
              <span style={{ fontSize: 11, color: discDescr.length > MAX_DESC * 0.9 ? '#f90' : 'rgba(255,255,255,0.2)', alignSelf: 'flex-end' }}>
                {discDescr.length} / {MAX_DESC}
              </span>
            </div>

            {/* Error */}
            {error && (
              <p style={{ margin: 0, fontSize: 12, color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5.5" stroke="#ff6b6b" />
                  <line x1="6" y1="3.5" x2="6" y2="6.5" stroke="#ff6b6b" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="6" cy="8.5" r="0.6" fill="#ff6b6b" />
                </svg>
                {error}
              </p>
            )}

            <button
              className="submit-btn"
              disabled={!canSubmit}
              onClick={createDiscussion}
            >
              Create discussion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
