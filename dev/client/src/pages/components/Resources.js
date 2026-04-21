import React, { useState } from "react";
import "../../utils/css/resources.css";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import ChatWidget from "../chatbot/ChatWidget";

const Resources = () => {

  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("breathing");
  const [chatOpen, setChatOpen] = useState(false);

  const breathing_videos = [
    {
      title: "5 Minute Deep Breathing Exercise",
      url: "https://www.youtube.com/embed/odADwWzHR24"
    },
    {
      title: "Box Breathing Technique (4x4 Method)",
      url: "https://www.youtube.com/embed/tEmt1Znux58"
    },
    {
      title: "Wim Hof Guided Breathing",
      url: "https://www.youtube.com/embed/tybOi4hjZFQ"
    },
    {
      title: "Calming Breathing for Anxiety",
      url: "https://www.youtube.com/embed/8VwufJrUhic"
    },
    {
      title: "Pregnancy Relaxation Breathing",
      url: "https://www.youtube.com/embed/SEfs5TJZ6Nk"
    }
  ];
  
    const grounding_videos = [
    {
      title: "5-4-3-2-1 Grounding Technique",
      url: "https://www.youtube.com/embed/30VMIEmA114"
    },
    {
      title: "10 Minute Grounding Meditation for Anxiety",
      url: "https://www.youtube.com/embed/1vx8iUvfyCY"
    },
    {
      title: "Grounding Exercise for Stress Relief",
      url: "https://www.youtube.com/embed/ihO02wUzgkc"
    }
  ];

  const journaling_videos = [
    {
      title: "How to Start Journaling for Mental Health", 
      url: "https://www.youtube.com/embed/8tqQYV9sKjA"
    },
    {
      title: "Journaling for Anxiety Relief",
      url: "https://www.youtube.com/embed/9v3V5XQzZzY"
    }
  ];


  return (
    <div className="resources-page">
      <Navbar/>

      <div className="resources-content">

      {/* HERO */}
      <div className="hero">

        <div className="hero-left">
          <h1>Resources</h1>
          <p>
            Nurture guided support to improve your emotional well-being and care journey.
          </p>

          {/* <button className="hero-btn">Dashboard</button> */}
        </div>




        {/* FLOATING CARD */}
        <div className="hero-card" style={{background:"None",display:"flex", justifyContent:"center"}}> 
          <button className="chat-btn" onClick={() => setChatOpen(true)}>
                   Chat Now
                 </button>
         
        </div>

      </div>

      {/* RESOURCES */}
      <div className="resources-section">


        <div className="resource-row">

          {/* Pink CARD */}
          <div className={`resource-card beige   ${activeTab === "breathing" ? "active" : ""}`}
    onClick={() => setActiveTab("breathing")}>
             <h3>Breathing</h3>
            <p>Relaxation & breathing techniques</p>
            <span>Show More</span>
          </div>

          {/* PLANT CARD */}
          <div className= {`resource-card orange ${activeTab === "grounding" ? "active" : ""}`}
    onClick={() => setActiveTab("grounding")}>
             <h3>Grounding</h3>
            <p>Relaxation & breathing techniques</p>
            <span>Show More</span>
          </div>

          {/* GREEN CARD */}
          <div className= {`resource-card green ${activeTab === "care" ? "active" : ""}`}
    onClick={() => setActiveTab("care")}>
            <h3>Care Support</h3>
            <p>See your helpful contacts</p>
            <span>Show More</span>
          </div>

          {/* ORANGE CARD */}
          <div className= {`resource-card orange  ${activeTab === "journaling" ? "active" : ""}`}
    onClick={() => setActiveTab("journaling")}>
            <h3>Journaling</h3>
            <p>Write your thoughts</p>
            <span>Show More</span>
          </div>

          {/* BEIGE CARD */}
          <div className= {`resource-card beige  ${activeTab === "nutrition" ? "active" : ""}`}
    onClick={() => setActiveTab("nutrition")}>
            <h3>Nutrition</h3>
            <p>Healthy eating tips</p>
            <span>Show More</span>
          </div>

        </div>


      {/* content */}
      <div className="resource-content">
{/* breathing */}
      {activeTab === "breathing" && (
   <div className="resource-grid breathing-grid">
        {breathing_videos.map((video, index) => (
          <div key={index} className="breathing-card">
            <h3>{video.title}</h3>

            <div className="video-wrapper">
              <iframe
                src={video.url}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
  )}

{/* grounding */}

{activeTab === "grounding" && (
<div className="resource-grid grounding-grid">
        {grounding_videos.map((video, index) => (
          <div key={index} className="grounding-card">
            <h3>{video.title}</h3>

            <div className="video-wrapper">
              <iframe
                src={video.url}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div> 
        ))}
      </div> 
)}

{/* journaling */}
{activeTab === "journaling" && (
<div className=" journaling-grid">
  < div className="journaling-intro">
    <h2>Journaling Resources</h2>
    <p>
      Explore guided journaling techniques to support your emotional well-being during pregnancy.
    </p>
    <button className="primary" onClick={() => navigate("/resources/journal")} >Start Journaling</button>
  </div>
  <div className="resource-grid">
 { journaling_videos.map((video, index) => (
          <div key={index} className="journaling-card">
            <h3>{video.title}</h3>

            <div className="video-wrapper">
              <iframe
                src={video.url}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div> 
        ))}
  </div>

       
      </div> 
)}

{/* care support */}
{activeTab === "care" && (
<div className=" journaling-grid">
  < div className="journaling-intro">
    <h2>Care Support</h2>
    <p>
      See all saved contact information.
    </p>
    <button className="primary" onClick={() => navigate("/resources/care-providers")} >Save Contacts</button>
  </div>
  <div className="resource-grid">

  </div>

       
      </div> 
)}
      </div>
      </div>

    
    </div>
    
    
    <ChatWidget open={chatOpen} setChatOpen={setChatOpen} />
    </div>
  );
};

export default Resources;