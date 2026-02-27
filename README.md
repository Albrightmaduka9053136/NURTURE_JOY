# Nurture Joy

## AI-Powered Pregnancy Decision Support System (DSS)

---

# Project Overview

Nurture Joy is an AI-powered, chatbot-centered Decision Support System (DSS) designed to provide expectant parents with personalized, explainable, and non-diagnostic support throughout pregnancy.

The platform integrates:

* Natural Language Processing (NLP)
* Supervised machine learning models
* Retrieval-Augmented Generation (RAG)
* Explainable AI (XAI)
* Human-in-the-loop moderation

Nurture Joy enhances emotional well-being support, pregnancy risk awareness, and community safety — while explicitly **not replacing medical professionals or clinical diagnosis**.

---

# Problem Statement

Pregnant individuals frequently experience emotional stress, anxiety, uncertainty, and limited access to personalized pregnancy insights. Existing digital resources provide generic advice that fails to adapt to individual circumstances. Meanwhile, online support communities face moderation overload and risk missing urgent emotional distress signals.

There is a need for a:

* Safe
* Explainable
* Human-centered
* Ethically bounded

AI Decision Support System that improves early emotional awareness, structured risk insights, and community responsiveness.

---

# Vision

To ensure every expectant parent receives personalized, compassionate, and accessible AI-supported guidance — anytime, anywhere.

---

# Mission

To develop a responsible and explainable AI-driven pregnancy support system that:

* Detects emotional distress signals using NLP
* Provides personalized, non-diagnostic risk awareness
* Prioritizes urgent community posts
* Uses Retrieval-Augmented Generation (RAG) to deliver grounded feedback
* Maintains strict ethical, safety, and privacy safeguards

---

# System Architecture Overview

Nurture Joy follows a hybrid AI architecture:

### 1 Chatbot Interaction Layer (Primary Entry Point)

* Conversational data collection
* Emotional support
* Knowledge-grounded responses (via RAG)
* First-line trust-building

### 2 NLP & ML Processing Layer

* Sentiment detection
* Emotion classification
* Risk scoring
* Post prioritization

### 3 Decision Support Layer

* Risk category assignment
* Explainable feature contributions (SHAP)
* Moderator alert ranking
* Escalation pathways

### 4 Human-in-the-Loop Layer

* Moderator review of flagged cases
* Escalation to external resources
* Continuous model feedback loop

---

# Core Design Principle: Chatbot as Foundation

The AI chatbot is the primary interaction interface and first system component implemented.

It enables:

* Emotional support & trust-building
* Structured data collection for ML models
* Grounded responses using RAG
* Clear, human-readable explanations

All downstream machine learning components depend on chatbot-driven data collection.

---

# Use Cases

---

## Use Case 1 — Emotional Well-Being & Sentiment Detection (Foundational)

### Problem

Emotional distress (stress, anxiety, postpartum depression) may go unnoticed.

### ML Methods Implemented

* Transformer-based sentiment classification (e.g., fine-tuned BERT)
* Emotion detection model
* Rule-based crisis keyword detection
* Confidence scoring

### Inputs

* Chatbot conversations
* Journals
* Community posts

### Outputs

* Sentiment category: Positive / Neutral / Stressed / Anxious
* Risk confidence score
* Triggered supportive responses
* Escalation recommendation (if needed)

### Business Value

* Early trust and engagement
* Early detection of mental health risk
* Safer support environment

---

## Use Case 2 — Personalized Pregnancy Risk Prediction

### Problem

Generic pregnancy advice fails to account for personal health variables.

### ML Methods Implemented

* Supervised classification model (Logistic Regression + Gradient Boosting)
* Explainability using SHAP
* Structured feature engineering

### Inputs

* Age
* BMI
* Trimester
* Symptoms
* Medical history

### Outputs

* Risk category: Low / Medium / High
* Feature contribution explanation
* Personalized, non-diagnostic recommendations

### Business Value

* Encourages preventive care
* Reduces missed warning signs
* Improves health awareness

---

## Use Case 3 — Community Post Moderation & Prioritization

### Problem

High forum volume leads to missed urgent posts.

### ML Methods Implemented

* NLP classification
* Risk-weighted ranking
* Hybrid model (rule-based + transformer scoring)

### Outputs

* Ranked urgency list
* High-risk alerts
* Trend analysis dashboard

### Business Value

* Faster response to distressed users
* Reduced moderator overload
* Increased community safety

---

# RAG (Retrieval-Augmented Generation) Integration

### Purpose

To ensure chatbot responses are:

* Grounded in verified knowledge
* Explainable
* Consistent
* Safer

### How It Works

1. User question received
2. Knowledge base retrieval (guidelines, policies, resources)
3. Relevant documents passed to LLM
4. Grounded response generated
5. Safety filter applied

### Benefits

* Reduced hallucinations
* Updatable knowledge base
* Traceable information sources

### Limitations

* Retrieval quality dependency
* Increased latency
* System complexity
* Requires curated knowledge base

---

# Model Metrics & Evaluation Strategy

To ensure safety and performance:

### Sentiment & Risk Models

* Precision
* Recall (priority for high-risk detection)
* F1-score
* ROC-AUC
* Calibration score

### Moderation Model

* Alert precision rate
* False positive rate
* Moderator agreement score

### RAG Evaluation

* Retrieval accuracy
* Faithfulness to source
* Hallucination rate
* Response latency

---

# Ethical Safeguards

* Non-diagnostic positioning
* Human-in-the-loop escalation
* SHAP-based explainability
* Bias monitoring across demographic segments
* Privacy-by-design architecture
* Secure data storage
* No autonomous medical decisions
* Crisis escalation protocols

---

# Scope & Boundaries

### In Scope

* Emotional distress detection
* Non-diagnostic pregnancy risk awareness
* Post prioritization & moderation support
* Explainable AI

### Out of Scope

* Clinical diagnosis
* Medical prescriptions
* Fetal anomaly prediction
* Replacement of professional healthcare judgment

---

# Technology Stack

| Layer               | Technology                                    |
| ------------------- | --------------------------------------------- |
| ML Models           | Python (Scikit-learn, Transformers)           |
| Explainability      | SHAP                                          |
| Retrieval           | Vector Database (FAISS / Pinecone equivalent) |
| Backend API         | RESTful Services                              |
| Application Backend | Java Spring Boot                              |
| Frontend            | Chatbot UI + Moderator Dashboard              |
| Data Governance     | Privacy controls + bias monitoring            |

---

# Team Information

**Team Name:**
Scrum Team 3 – Nurture Joy

**Members:**

* Lesley Wanjiku Kamamo — 8984972
* Andrew Silveira — 5077086
* Abdullahi Abdirizak Mohamed — 9082466
* Albright Maduka Ifechukwude — 9053136

---

# References

* World Health Organization (WHO) – Maternal Health Guidelines
* Centers for Disease Control and Prevention (CDC) – Pregnancy Risk Factors
* Lewis et al. (2020) – Retrieval-Augmented Generation
* SHAP Documentation – Explainable AI
* Rajkomar et al. (2019) – Machine Learning in Medicine
* Fitzpatrick et al. (2017) – Mental Health Chatbots
