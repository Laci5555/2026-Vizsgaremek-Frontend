import React from 'react';
import Navbar from './Navbar';
import Message from './Message';

export default function Home() {
  return (
    <div className="home" style={{ height: '100vh', position: 'relative' }}>
      <Navbar />
      <Message />
    </div>
  );
}
