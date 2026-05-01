import React, { useState } from 'react';
import Navbar from './Navbar';
import './Faq.css';
import { IoChevronDown } from 'react-icons/io5';

const faqs = [
  {
    q: "What is Gamminity?",
    a: "Gamminity is a platform built for gamers to connect, discuss their favorite games, find teammates, and build a vibrant community around the games they love."
  },
  {
    q: "Is Gamminity completely free to use?",
    a: "Yes! Gamminity is 100% free for all users. You can create an account, join discussions, use the Finder, and send messages without any hidden costs."
  },
  {
    q: "How do I find teammates to play with?",
    a: "Use our 'Finder' feature! You can browse open groups looking for players, or create your own post specifying the game, your playstyle, and the maximum number of players you need."
  },
  {
    q: "How do I add a game to my favorites?",
    a: "Navigate to your Profile page and click on 'Add game' under the 'Favourite Games' tab. You can search through our database and add the ones you play the most."
  },
  {
    q: "Can I send private messages to other users?",
    a: "Absolutely! Click the floating chat icon in the bottom right corner of the screen. You can search for users and start a direct conversation with them anytime."
  },
  {
    q: "How does the 'Most liked' sorting work in Games?",
    a: "Games are sorted by the total number of likes they have received from the Gamminity community. You can show your appreciation for a game by clicking the like button on its individual page."
  },
  {
    q: "What happens if a Finder room is full?",
    a: "If a room reaches its max player limit, it will be marked as 'FULL' and new users won't be able to join. However, the creator of the room can kick inactive members to make space for new ones."
  },
  {
    q: "Are there any rules for participating in discussions?",
    a: "We ask all users to be respectful and constructive. Hate speech, spamming, toxic behavior, or sharing inappropriate content will result in warnings and potential account bans."
  },
  {
    q: "How do I edit or delete a discussion I created?",
    a: "Go to your Profile and select the 'My Discussions' tab. There you will see a list of all your created discussions. You can click on the text to edit the description, or use the trash icon to delete it entirely."
  },
  {
    q: "I forgot my password. How can I reset it?",
    a: "Currently, if you log in via Google, your credentials are tied to your Google account. If you created a native account using your email and password, password reset features will be introduced in our next major update!"
  }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <Navbar />
      
      <div className="faq-container">
        <div className="faq-header">
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about the platform and how it works.</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIndex === index ? 'active' : ''}`}
            >
              <button 
                className="faq-question" 
                onClick={() => toggleAccordion(index)}
              >
                <span>{faq.q}</span>
                <IoChevronDown className="faq-icon" />
              </button>
              <div className="faq-answer">
                <div className="faq-answer-inner">
                  <p>{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
