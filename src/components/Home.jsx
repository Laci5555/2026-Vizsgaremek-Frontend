import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Message from './Message';
import './Home.css';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebaseApp';
import { AiFillLike } from 'react-icons/ai';
import { FaUsers, FaComments, FaGamepad, FaDiscord, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { HiArrowRight, HiArrowUp } from 'react-icons/hi';

const PLACEHOLDER = 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-2409187029.jpg';

/* ── Animated stat counter ── */
function StatCounter({ icon, value, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current && value > 0) {
          started.current = true;
          const duration = 1500;
          const steps = 60;
          const stepVal = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += stepVal;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="home-stat" ref={ref}>
      <div className="home-stat-icon">{icon}</div>
      <div className="home-stat-number">{count}</div>
      <div className="home-stat-label">{label}</div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const homeRef = useRef(null);
  const [games, setGames] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Track scroll position for scroll-to-top button
  useEffect(() => {
    const el = homeRef.current;
    if (!el) return;
    function onScroll() {
      setShowScrollTop(el.scrollTop > 400);
    }
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [loading]);

  function scrollToTop() {
    homeRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [gamesSnap, discSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, 'games')),
          getDocs(collection(db, 'discussions')),
          getDocs(collection(db, 'user-data')),
        ]);
        setGames(gamesSnap.docs.map((d) => ({ ...d.data(), id: d.id })));
        setDiscussions(discSnap.docs.map((d) => ({ ...d.data(), id: d.id })));
        setUsers(usersSnap.docs.map((d) => ({ ...d.data(), id: d.id })));
      } catch (err) {
        console.error('Home fetch error:', err);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const activeUsers = users.filter((u) => !u.disabled);

  const newestGames = [...games]
    .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
    .slice(0, 6);

  const topRatedGames = [...games]
    .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
    .slice(0, 6);

  const trendingDiscussions = discussions.slice(0, 5);

  function getUser(email) {
    return users.find((u) => u.email === email);
  }

  if (loading) {
    return (
      <div className="home">
        <Navbar />
        <div className="home-loading">
          <div className="home-loader" />
        </div>
      </div>
    );
  }

  return (
    <div className="home" ref={homeRef}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero-bg">
          <div className="home-hero-orb home-hero-orb-1" />
          <div className="home-hero-orb home-hero-orb-2" />
          <div className="home-hero-orb home-hero-orb-3" />
        </div>
        <div className="home-hero-content">
          <span className="home-hero-tag">🎮 Your Gaming Community</span>
          <h1>Discover, Rate &amp;<br />Discuss Your Favorite Games</h1>
          <p>
            Browse our growing collection, share your opinions, and connect
            with fellow gamers in one place.
          </p>
          <div className="home-hero-buttons">
            <button className="home-btn-primary" onClick={() => navigate('/games')}>
              Browse Games <HiArrowRight />
            </button>
            <button className="home-btn-outline" onClick={() => navigate('/discussions')}>
              Join Discussions
            </button>
          </div>
        </div>
      </section>

      {/* ── Recently Added ── */}
      <section className="home-section">
        <div className="home-section-header">
          <div>
            <h2>🆕 Recently Added</h2>
            <p>The latest games in our collection</p>
          </div>
          <button className="home-view-all" onClick={() => navigate('/games')}>
            View All <HiArrowRight />
          </button>
        </div>
        {newestGames.length > 0 ? (
          <div className="home-games-scroll">
            {newestGames.map((g) => (
              <div className="home-game-card" key={g.id} onClick={() => navigate('/games')}>
                <img src={g.img} alt={g.name} />
                <div className="home-game-info">
                  <h3>{g.name}</h3>
                  <div className="home-game-meta">
                    <span className="home-game-likes"><AiFillLike /> {g.likes ?? 0}</span>
                    {g.genre?.slice(0, 2).map((genre, i) => (
                      <span className="home-game-genre" key={i}>{genre}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="home-empty">No games added yet.</div>
        )}
      </section>

      {/* ── Top Rated ── */}
      <section className="home-section">
        <div className="home-section-header">
          <div>
            <h2>⭐ Top Rated</h2>
            <p>Community favorites with the most likes</p>
          </div>
          <button className="home-view-all" onClick={() => navigate('/games')}>
            View All <HiArrowRight />
          </button>
        </div>
        {topRatedGames.length > 0 ? (
          <div className="home-games-scroll">
            {topRatedGames.map((g) => (
              <div className="home-game-card" key={g.id} onClick={() => navigate('/games')}>
                <img src={g.img} alt={g.name} />
                <div className="home-game-info">
                  <h3>{g.name}</h3>
                  <div className="home-game-meta">
                    <span className="home-game-likes"><AiFillLike /> {g.likes ?? 0}</span>
                    {g.genre?.slice(0, 2).map((genre, i) => (
                      <span className="home-game-genre" key={i}>{genre}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="home-empty">No games rated yet.</div>
        )}
      </section>

      {/* ── Trending Discussions ── */}
      <section className="home-section">
        <div className="home-section-header">
          <div>
            <h2>💬 Trending Discussions</h2>
            <p>Hot topics from the community</p>
          </div>
          <button className="home-view-all" onClick={() => navigate('/discussions')}>
            View All <HiArrowRight />
          </button>
        </div>
        {trendingDiscussions.length > 0 ? (
          <div className="home-disc-grid">
            {trendingDiscussions.map((disc) => {
              const creator = getUser(disc.creatoremail);
              return (
                <Link
                  key={disc.id}
                  to={`/discussion/${disc.id}/${disc.title}`}
                  className="home-disc-card"
                >
                  <div className="home-disc-creator">
                    <img
                      src={creator?.picture || PLACEHOLDER}
                      alt=""
                      onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
                    />
                    <span>{creator?.username ?? 'Unknown'}</span>
                  </div>
                  <h3>{disc.title}</h3>
                  {disc.description && <p>{disc.description}</p>}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="home-empty">No discussions yet.</div>
        )}
      </section>

      {/* ── Stats ── */}
      <section className="home-stats-bar">
        <StatCounter icon={<FaGamepad />} value={games.length} label="Games" />
        <StatCounter icon={<FaComments />} value={discussions.length} label="Discussions" />
        <StatCounter icon={<FaUsers />} value={activeUsers.length} label="Members" />
      </section>

      {/* ── FAQ CTA ── */}
      <section className="home-section home-faq-cta">
        <div className="home-faq-content">
          <h2>Have questions?</h2>
          <p>Whether you're new to Gamminity or looking to learn more about our features, our FAQ section has the answers to the most common questions.</p>
          <button className="home-faq-btn" onClick={() => navigate('/faq')}>
            Visit FAQ <HiArrowRight />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="home-footer-grid">
          <div className="home-footer-col">
            <h3>GameHub</h3>
            <p>
              Your ultimate gaming community platform. Discover new games,
              share your opinions, and connect with gamers worldwide.
            </p>
          </div>
          <div className="home-footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li onClick={() => navigate('/games')}>Games</li>
              <li onClick={() => navigate('/discussions')}>Discussions</li>
              <li onClick={() => navigate('/finder')}>Finder</li>
              <li onClick={() => navigate('/faq')}>Faq</li>
            </ul>
          </div>
          <div className="home-footer-col">
            <h4>Contact</h4>
            <div className="home-footer-contact">
              <span><MdEmail /> info@gamehub.com</span>
              <span><MdPhone /> +36 1 234 5678</span>
              <span><MdLocationOn /> Budapest, Fő utca 1.</span>
            </div>
          </div>
          <div className="home-footer-col">
            <h4>Follow Us</h4>
            <div className="home-footer-socials">
              <a href="#" aria-label="Twitter"><FaXTwitter /></a>
              <a href="#" aria-label="Discord"><FaDiscord /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>
        </div>
        <div className="home-footer-bottom">
          <span>&copy; 2026 GameHub. All rights reserved.</span>
        </div>
      </footer>

      {/* ── FAB buttons ── */}
      <Message />
      {showScrollTop && (
        <button className="home-scroll-top" onClick={scrollToTop} title="Scroll to top">
          <HiArrowUp />
        </button>
      )}
    </div>
  );
}
