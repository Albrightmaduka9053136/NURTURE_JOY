# Nurture Joy  
**AI-Powered Pregnancy Support Platform**

---

## Project Overview
Nurture Joy is an AI-driven, chatbot-centered pregnancy support platform designed to provide expectant parents with personalized, explainable, and non-diagnostic insights throughout pregnancy. The system combines machine learning, natural language processing (NLP), and ethical AI practices to support emotional well-being, pregnancy risk awareness, and safe community engagement—without replacing professional medical care.

---

## Problem Statement
Pregnant individuals often experience emotional distress, uncertainty, and limited access to personalized pregnancy insights. Generic health advice fails to account for individual differences, while support teams and moderators face information overload and time constraints. There is a need for a safe, explainable, and supportive AI system that improves emotional awareness, personalized risk insight, and community support coordination.

---

## Project Vision
Throughout pregnancy, every mother receives individualized, knowledgeable, and caring support—anytime, anywhere.

---

## Project Mission
To build a responsible and explainable AI platform that:
- Supports emotional well-being through NLP-driven insights  
- Provides personalized, non-diagnostic pregnancy risk awareness  
- Improves safety and responsiveness in online community forums  
- Maintains strict ethical, privacy, and safety boundaries  

---

## Core Design Principle: Chatbot as Primary Interaction Layer
The AI chatbot is the **primary entry point and first feature implemented**. It enables:
- Early emotional support and trust-building  
- Conversational data collection for machine learning models  
- Clear, human-centered explanations of insights  

All other system capabilities are built on this chatbot foundation.

---

## Use Cases

### Use Case 1 — AI Chatbot for Emotional Well-Being & Sentiment Detection (Foundational)
**Implementation Priority:** First

**Problem**  
Users may experience stress, anxiety, or postpartum depression that goes unnoticed.

**ML Solution**  
An NLP-based sentiment analysis model evaluates user-generated text from:
- Chatbot conversations  
- Journals  
- Community posts  

**Outputs**
- Sentiment classification: Positive, Neutral, Stressed, Anxious  
- Confidence score  
- Triggered supportive responses or resources when risk is detected  

**Business Value**
- Establishes early trust and engagement  
- Creates a safer and more supportive environment  
- Enables early identification of mental health risks  

---

### Use Case 2 — Personalized Pregnancy Risk Prediction (Core ML Use Case)
**Dependency:** Chatbot-based data collection from Use Case 1

**Problem**  
Pregnant users need personalized risk insights instead of generic pregnancy advice.

**ML Solution**  
A supervised classification model predicts pregnancy-related risks (e.g., gestational diabetes and potential complications) using structured health data collected conversationally by the chatbot.

**Inputs**
- Age  
- BMI  
- Trimester  
- Symptoms  
- Medical history  

**Outputs**
- Risk category: Low / Medium / High  
- Explainable feature contributions (e.g., SHAP values)  
- Personalized, non-diagnostic recommendations  

**Business Value**
- Reduces missed warning signs  
- Encourages preventive care behaviors  
- Improves maternal outcomes  

---

### Use Case 3 — Online Community Forum Moderation & Post Prioritization
**Dependency:** NLP outputs from Use Case 1 and risk signals from Use Case 2

**Problem**  
Online community forums can receive large volumes of posts, including emotionally sensitive or urgent content that may be missed by moderators.

**ML Solution**
- Apply sentiment and emotion detection to forum posts  
- Classify posts by urgency and potential risk  
- Rank posts to prioritize moderator attention  

**Outputs**
- Ranked list of posts by urgency  
- Alerts for high-risk or sensitive content  
- Trend summaries of community concerns  

**Business Value**
- Faster response to users in distress  
- Reduced moderator overload  
- Safer and more supportive community environment  
- More efficient use of staff time  

---

## Scope & Boundaries

### In Scope
- Non-diagnostic ML risk prediction  
- NLP-based emotional well-being detection  
- Online community post prioritization and moderation support  
- Explainable AI techniques  

### Out of Scope
- Clinical diagnosis  
- Fetal anomaly prediction  
- Medical treatment recommendations  
- Replacement of professional healthcare judgment  

---

## Technology Stack (Planned)
- **Backend ML:** Python (Scikit-learn, NLP models)  
- **Explainability:** SHAP  
- **API Layer:** RESTful services  
- **Application Backend:** Java Spring Boot  
- **Frontend:** AI chatbot interface and community moderation dashboard  
- **Data Ethics:** Bias monitoring, transparency, and privacy controls  

---

## Team Information

**Team Name:**  
Scrum Team 3 – Nurture Joy

**Team Members**
- Lesley Wanjiku Kamamo — Student ID: 8984972  
- Andrew Silveira — Student ID: 5077086  
- Abdullahi Abdirizak Mohamed — Student ID: 9082466  
- Albright Maduka Ifechukwude — Student ID: 9053136  

---

## References
- World Health Organization (WHO) — Maternal Health Guidelines  
- Centers for Disease Control and Prevention (CDC) — Pregnancy Risk Factors  
- SHAP Documentation — Explainable AI  
- Ethical AI Frameworks for Healthcare  
