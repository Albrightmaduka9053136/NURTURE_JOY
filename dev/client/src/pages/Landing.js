import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../utils/css/index.css";
 
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};
 
const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
 
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
 
  return (
    <div className="landing-container">
 
      {/* NAVBAR */}
      <nav className={`landing-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="logo">NURTURE JOY</div>
        <ul>
          <li><a href="#about">About</a></li>
          <li><Link to="/login" className="nav-link" style={{color: "white"}}>Login</Link></li>
        </ul>
      </nav>
 
      {/* HERO */}
      <section className="hero"
        style={{ backgroundImage: "url(https://images.pexels.com/photos/1261909/pexels-photo-1261909.jpeg)" }}>
        <div className="hero-overlay"></div>
 
        <div className="hero-content">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp}>
            AI-Enabled Emotional & Pregnancy Support
          </motion.h1>
 
          <motion.p initial="hidden" animate="visible" variants={fadeUp}>
            Bridging the gap between clinical data and maternal well-being.
          </motion.p>
 
          <Link to="/register" className="hero-btn">
            Get Started
          </Link>
 
          <Link to="/login" className="hero-btn">
            Log In
          </Link>
        </div>
      </section>
 
      {/* ABOUT */}
<section id="about" className="about-modern">
 
  <div className="about-wrapper">
 
    <div className="about-image">
      <img
        src="https://images.pexels.com/photos/7155387/pexels-photo-7155387.jpeg"
        alt="Calm maternal space"
      />
    </div>
 
    <div className="about-text">
      <h2>Bridging the Maternal Support Gap</h2>
 
      <p>
        Pregnancy is more than a clinical journey — it is emotional, vulnerable,
        and deeply personal. Yet many mothers experience long gaps between appointments,
        limited emotional reassurance, missed early warning signs, and overwhelming
        misinformation online. Nurture Joy was created to bridge that space — offering
        safe, explainable, AI-powered support that listens, flags potential risks early,
        and empowers mothers without ever replacing the clinician.
      </p>
 
      <a href="#usecases" className="about-btn">
        Learn More
      </a>
    </div>
 
  </div>
</section>
 
{/* VISION | MISSION | PHILOSOPHY */}
<section className="foundation-section">
 
  <div className="foundation-grid">
 
    <div className="foundation-card">
      <h3>Vision</h3>
      <p>
        Throughout pregnancy, every mother receives individualized,
        knowledgeable, and caring support — anytime, anywhere.
      </p>
    </div>
 
 <div className="foundation-card">
      <h3>Vision</h3>
      <p>
        Throughout pregnancy, every mother receives individualized,
        knowledgeable, and caring support — anytime, anywhere.
      </p>
    </div>
    
    <div className="foundation-card">
      <h3>Mission</h3>
      <p>
        To deliver a safe digital platform using machine learning to
        offer expectant mothers and healthcare professionals data-driven
        decision support and personalized pregnancy insights.
      </p>
    </div>
 
    <div className="foundation-card">
      <h3>Core Philosophy</h3>
      <p>
        Decision support, not diagnosis. We augment human judgment,
        provide non-diagnostic insights, and prioritize safety through
        explainable AI.
      </p>
    </div>
 
  </div>
 
</section>
 
 
{/* USE CASES */}
<section id="usecases" className="usecases-modern">
 
  <h2 className="usecases-title">Our Core Solutions</h2>
 
  <div className="usecases-grid">
 
    <div className="usecase-modern-card">
      <img
        src="https://images.unsplash.com/photo-1584515933487-779824d29309"
        alt="Emotional Support"
      />
      <div className="usecase-content">
        <span className="usecase-date">Real-Time Emotional Support</span>
        <h3>Emotional Well-Being Chatbot</h3>
        <p>
          NLP-powered support that listens, validates emotions,
          and provides safe, non-clinical guidance between appointments.
        </p>
      </div>
    </div>
 
    <div className="usecase-modern-card">
      <img
        src="https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg"
        alt="Risk Prediction"
      />
      <div className="usecase-content">
        <span className="usecase-date">Early Awareness System</span>
        <h3>Non-Diagnostic Risk Prediction</h3>
        <p>
          Machine learning models identify patterns and flag potential
          high-risk indicators — encouraging timely clinical consultation.
        </p>
      </div>
    </div>
 
    <div className="usecase-modern-card">
      <img
        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
        alt="Community Moderation"
      />
      <div className="usecase-content">
        <span className="usecase-date">Safe Community Spaces</span>
        <h3>AI-Assisted Community Moderation</h3>
        <p>
          Sentiment and toxicity detection ensure a supportive
          environment free from harmful or misleading content.
        </p>
      </div>
    </div>
 
  </div>
 
</section>
 
{/* CTA SECTION */}
<section className="cta-modern">
 
  <div className="cta-overlay"></div>
 
  <div className="cta-content">
    <h2>“Nurture Joy”</h2>
 
    <h3>Scrum Team 3</h3>
 
    <p className="cta-team">
      Kamamo Lesley | Abdullahi Mohammed <br />
      Andrew Silveria | Albright Maduka
    </p>
 
    <p className="cta-course">
      INFO8665-26W-Sec1 – Projects in Machine Learning
    </p>
 
    <p className="cta-quote">
      We are dedicated to ensuring every mother feels heard, supported, and safe.
      We do not replace the clinician; we empower the community and the patient
      through responsible, explainable AI.
    </p>
 
    <Link to="/register" className="cta-modern-btn">
      Get Started Today
    </Link>
 
  </div>
 
</section>
 
{/* FOOTER */}
<footer className="landing-footer-modern">
  <p>
    Decision Support, Not Diagnosis • Human-in-the-Loop • Safety First
  </p>
</footer>
 
 
 
   
 
    </div>
  );
};
 
export default LandingPage;