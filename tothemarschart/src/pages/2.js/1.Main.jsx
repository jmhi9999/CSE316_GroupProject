// Home.jsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "../1.styling/1.Main.css";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isBackgroundVisible, setIsBackgroundVisible] = useState(false);
  const [showDevelopers, setShowDevelopers] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const news = [
    { id: 1, title: "Hello world", content: "This is text for hello world", image: "https://dimg.donga.com/wps/NEWS/IMAGE/2024/11/27/130511695.1.jpg", url:"" },
    { id: 2, title: "New News is effect", content: "This is text for hellume popopopo", image: "https://www.blockmedia.co.kr/wp-content/uploads/2024/10/%EB%8F%84%EC%A7%80%EC%BD%94%EC%9D%B8.png", url:""},
    { id: 3, title: "Popo Get out from here", content: "Trump makes man", image: "https://d2k5miyk6y5zf0.cloudfront.net/article/MYH/20220310/MYH20220310014100641.jpg", url:"" },
    { id: 4, title: "뉴스 제목 4", content: "뉴스 내용 4", image: "https://img.khan.co.kr/news/2024/11/27/news-p.v1.20241127.176fda76ed174992b73207bdd71e56d2_P1.jpeg", url:"" },
  ];

  useEffect(() => {
    setTimeout(() => setIsBackgroundVisible(true), 100);
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
          <div className="slider-container">
            <button className="slider-button prev" onClick={prevSlide}>
              <ChevronLeft size={24} />
            </button>
            
            <div className="slider-content" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {news.map((item) => (
                <div key={item.id} className="news-box" style={{ position: 'relative' }}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <h2 style={{zIndex:"2", position:'relative', color: "white", textShadow: "2px 2px 4px rgba(0,0,0,0.5)", left:'20px'}}>{item.title}</h2>
                    <h3 style={{zIndex:"2", position:'relative', color: "white", textShadow: "2px 2px 4px rgba(0,0,0,0.5)", left:'20px'}}>{item.content}</h3>
                    <img src={item.image} style={{width:"100%", position: "absolute", top:"0", left:'0'}} />
                  </a>
                </div>
              ))}
            </div>
            
            <button className="slider-button next" onClick={nextSlide}>
              <ChevronRight size={24} />
            </button>
          </div>

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