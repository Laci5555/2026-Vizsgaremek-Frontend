import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./Notfound.css";
import { FaArrowLeftLong, FaHouseChimney } from 'react-icons/fa6';

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className='notFound'>
      <div className='notFound__icon'>
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="56" fill="var(--surface2)" stroke="var(--border)" strokeWidth="1"/>
          <circle cx="42" cy="50" r="6" fill="var(--text-muted)"/>
          <circle cx="78" cy="50" r="6" fill="var(--text-muted)"/>
          <path d="M40 76 Q60 68 80 76" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <line x1="36" y1="36" x2="48" y2="44" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="84" y1="36" x2="72" y2="44" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      <h1 className='notFound__code'>404</h1>
      <p className='notFound__title'>Page cannot be found</p>
      <p className='notFound__sub'>Seems like this page no longer exists,<br/>or has been moved somewhere else.</p>

      <div className='notFound__actions'>
        <button className='notFound__btn notFound__btn--primary' onClick={() => navigate('/')}>
          <span><FaHouseChimney />Home</span>
        </button>
        <button className='notFound__btn notFound__btn--secondary' onClick={() => navigate(-1)}>
          <span><FaArrowLeftLong /> Back</span>
        </button>
      </div>
    </div>
  )
}