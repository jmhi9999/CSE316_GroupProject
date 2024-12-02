import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "../1.styling/1.Main.css";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isBackgroundVisible, setIsBackgroundVisible] = useState(false);
  const [showDevelopers, setShowDevelopers] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [news, setNews] = useState([]);

  useEffect(() => {
    setTimeout(() => setIsBackgroundVisible(true), 100);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://api-v2.deepsearch.com/v1/global-articles?keyword=FOMC OR 뉴욕증시&api_key=709058f061034926aaac5172f08a5fc3');
        const data = await response.json();
        
        // Transform API data to match our news format
        const transformedNews = data.data
          .filter(item => item.image_url || item.thumbnail_url)
          .map((item, index) => ({
            id: item.id || index + 1,
            title: item.title,
            content: item.summary,
            image: item.image_url || item.thumbnail_url,
            url: item.content_url || '#'
          })); // Filter out items without images

        setNews(transformedNews);
      } catch (error) {
        console.error('Error fetching news:', error);
        // Set fallback news data in case of API failure
        setNews([{
          id: 1,
          title: "Failed to load news",
          content: "Please try again later",
          image: "/resources/1.Main/default-news-image.png",
          url: "#"
        }]);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const briefNews = document.getElementById('brief-news');
      if (!briefNews) return;

      const rect = briefNews.getBoundingClientRect();
      const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;
      
      if (isInView) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === news.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? news.length - 1 : prev - 1));
  };

  const toggleDevelopers = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setShowDevelopers(!showDevelopers);
      setTimeout(() => setIsAnimating(false), 800);
    }
  };

  return (
    <div className="main-container">
      <img 
        src="/resources/1.Main/Back-ground.png" 
        id="back-image" 
        alt="back-image" 
        className={isBackgroundVisible ? 'show' : ''}  
      />
      
      <button 
        className="about-me-button"
        onClick={toggleDevelopers}
      >
        About Us
      </button>

      <div className="developers-section">
        <img 
          src="/resources/1.Main/Developers.png" 
          id="developers" 
          alt="developers" 
          className={`developers-image ${showDevelopers ? 'show' : ''}`}
        />
      </div>
      
      <section id="brief-news">
        <div className={`news-container ${isVisible ? 'show' : ''}`}>
          <button className="slider-button prev" onClick={prevSlide}>
            <ChevronLeft size={24} />
          </button>
          <div className="slider-container">
            <div className="slider-content" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {news.map((item) => (
                <div key={item.id} className="news-box" style={{ position: 'relative' }}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <h2 style={{zIndex:"2", position:'relative', color: "white", textShadow: "2px 2px 4px rgba(0,0,0,0.5)", left:'20px', right:'20px', padding: '0 20px'}}>{item.title}</h2>
                    <h3 style={{ zIndex: "2", position: 'relative', color: "white", textShadow: "2px 2px 4px rgba(0,0,0,0.5)", padding: '0 20px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{item.content}</h3>
                    <img src={item.image} alt="news" style={{width:"100%", position: "absolute", top:"0", left:'0'}} />
                  </a>
                </div>
              ))}
            </div>
          </div>
            <button className="slider-button next" onClick={nextSlide}>
              <ChevronRight size={24} />
            </button>

          <div className="slider-dots">
            {news.map((_, index) => (
              <button
                key={index}
                className={`dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;