import os
import re
import json
import random
import joblib

# Optional OpenAI client for (a) KB-grounded emotion selection and (b) KB response paraphrasing
try:
    from openai import OpenAI
except Exception:
    OpenAI = None

from flask import Blueprint, request, jsonify
from matplotlib import text
from models.user_model import User

import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify
from database.db import db
from models.chat_session import ChatSession
from models.chat_message import ChatMessage
from routes.auth_routes import get_user_from_token


# RAG retriever (TF-IDF over curated KB snippets)
try:
    from ml.rag_retriever import retrieve_top_k
except Exception:
    retrieve_top_k = None  # RAG is optional

chat_bp = Blueprint("chat", __name__)

# ============================================================
#  PATHS (robust)
# ============================================================
ROUTES_DIR = os.path.dirname(os.path.abspath(__file__))          # .../routes
BACKEND_DIR = os.path.dirname(ROUTES_DIR)                       # .../nuture_joy_backend
ML_DIR = os.path.join(BACKEND_DIR, "ml_models")

SAFETY_MODEL_PATH   = os.path.join(ML_DIR, "nurturejoy_safety_model_v2.joblib")
EMO_STAGE1_PATH     = os.path.join(ML_DIR, "stage1_tfidf.joblib")
EMO_STAGE2_PATH     = os.path.join(ML_DIR, "stage2_tfidf.joblib")
TEMPLATES_V2_PATH   = os.path.join(ML_DIR, "chatbot_templates_v2.json")

# ============================================================
#  LOAD ASSETS ONCE
# ============================================================
safety_bundle  = joblib.load(SAFETY_MODEL_PATH)
emo_stage1     = joblib.load(EMO_STAGE1_PATH)
emo_stage2     = joblib.load(EMO_STAGE2_PATH)

with open(TEMPLATES_V2_PATH, "r", encoding="utf-8") as f:
    TEMPLATES_V2 = json.load(f)

# ============================================================
#  SIMPLE CONVERSATION STATE (in-memory)
#  Later: move to DB table if needed.
# ============================================================
CHAT_STATE = {}  # {user_id: {"turns":0, "last_emotion":..., "last_bucket":..., "recent_templates":[...]}}

def _state_get(user_id: int) -> dict:
    if user_id not in CHAT_STATE:
        CHAT_STATE[user_id] = {"turns": 0, "recent_templates": []}
    return CHAT_STATE[user_id]

def _state_remember_template(user_id: int, template_id: str):
    s = _state_get(user_id)
    s["recent_templates"].append(template_id)
    s["recent_templates"] = s["recent_templates"][-3:]

def _state_is_recent(user_id: int, template_id: str) -> bool:
    return template_id in _state_get(user_id).get("recent_templates", [])

# ============================================================
#  RESOURCE LINKS (front-end routes)
#  Make sure your React app has these pages/routes.
# ============================================================
RESOURCE_LINKS = {
    "breathing_box": "/resources/breathing-box",
    "grounding_54321": "/resources/grounding-54321",
    "provider_directory": "/resources/care-providers",
    "community_support": "/community",
    "journal_prompt": "/resources/journal-prompts",
    "urgent_support": "/resources/urgent-support"
}



# ============================================================
#  RAG RESPONSE (optional)
#  PRIMARY response from KB when available; template is fallback.
# ============================================================


# ============================================================
#  RAG-FIRST RESPONSE (optional)
#  - If retrieval is confident: use KB to BOTH (a) categorize emotion (via metadata) and (b) produce final feedback.
#  - If retrieval is weak/empty: fall back to TF-IDF + rule/template engine.
# ============================================================

RAG_MIN_SCORE = 0.18  # tune: higher -> fewer KB hits, more fallback
LLM_MIN_CONFIDENCE = float(os.environ.get("LLM_MIN_CONFIDENCE", "0.55"))
LLM_MAX_KB_CANDIDATES = int(os.environ.get("LLM_MAX_KB_CANDIDATES", "5"))
LLM_MODEL = os.environ.get("LLM_MODEL", "gpt-5-mini")

def _get_openai_client():
    """Create an OpenAI client if available and configured."""
    if OpenAI is None:
        return None
    api_key = os.environ.get("OPENAI_API_KEY") or os.environ.get("OPENAI_APIKEY")
    if not api_key:
        return None
    try:
        return OpenAI(api_key=api_key)
    except Exception:
        return None


def _llm_select_kb_and_emotion(user_text: str, candidates: list[dict]):
    """Use an LLM as a *classifier* grounded to the provided KB candidates.

    Returns dict: {emotion, confidence, selected_kb_id} or None on failure.
    The model MUST select selected_kb_id from the provided candidates list.
    """
    client = _get_openai_client()
    if client is None or not candidates:
        return None

    allowed_emotions = ["anxious", "stressed", "sad", "overwhelmed", "neutral", "positive", "unknown"]

    cand_compact = []
    for c in candidates:
        cand_compact.append({
            "id": str(c.get("id", "")),
            "type": str(c.get("type", "")),
            "emotion_hint": str(c.get("emotion", "")),
            "intent": str(c.get("intent", "")),
            "title": str(c.get("title", c.get("topic", "")))[:120],
            "text": str(c.get("content", c.get("text", "")))[:700],
        })

    schema = {
        "name": "emotion_selection",
        "schema": {
            "type": "object",
            "properties": {
                "emotion": {"type": "string", "enum": allowed_emotions},
                "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                "selected_kb_id": {"type": "string"},
            },
            "required": ["emotion", "confidence", "selected_kb_id"],
            "additionalProperties": False,
        },
        "strict": True,
    }

    sys_msg = (
        "You are a classifier for a pregnancy emotional well-being support chatbot. "
        "You will be given the user message and a list of KB candidates. "
        "Choose the single best KB candidate ID from the list. "
        "Output an emotion label and confidence. "
        "Rules: (1) selected_kb_id MUST be one of the provided IDs. "
        "(2) If none match well, set emotion='unknown' and confidence < 0.5 and still pick the closest ID."
    )

    try:
        resp = client.responses.create(
            model=LLM_MODEL,
            input=[
                {"role": "system", "content": sys_msg},
                {"role": "user", "content": f"USER_MESSAGE:\n{user_text}\n\nKB_CANDIDATES_JSON:\n{json.dumps(cand_compact, ensure_ascii=False)}"},
            ],
            text={"format": {"type": "json_schema", "json_schema": schema}},
        )
        out_text = getattr(resp, "output_text", None) or ""
        return json.loads(out_text) if out_text else None
    except Exception:
        # If Responses API isn't available in the installed SDK, try chat.completions as fallback (best-effort).
        try:
            comp = client.chat.completions.create(
                model=LLM_MODEL,
                messages=[
                    {"role": "system", "content": sys_msg + " Return ONLY valid JSON with keys emotion, confidence, selected_kb_id."},
                    {"role": "user", "content": f"USER_MESSAGE:\n{user_text}\n\nKB_CANDIDATES_JSON:\n{json.dumps(cand_compact, ensure_ascii=False)}"},
                ],
                temperature=0,
            )
            txt = comp.choices[0].message.content.strip()
            return json.loads(txt)
        except Exception:
            return None


def _llm_rewrite_kb_text(user_text: str, kb_text: str, emotion: str):
    """Rewrite KB text to sound more human, without adding new facts."""
    client = _get_openai_client()
    if client is None or not kb_text:
        return None

    schema = {
        "name": "rewrite",
        "schema": {
            "type": "object",
            "properties": {"final_text": {"type": "string"}},
            "required": ["final_text"],
            "additionalProperties": False,
        },
        "strict": True,
    }

    sys_msg = (
        "Rewrite the provided KB-based response to sound warm and human. "
        "DO NOT add any new medical facts, diagnosis, or advice. "
        "Keep meaning identical. Keep crisis guidance intact. "
        "Keep it concise (<= 110 words)."
    )

    try:
        resp = client.responses.create(
            model=LLM_MODEL,
            input=[
                {"role": "system", "content": sys_msg},
                {"role": "user", "content": f"USER_MESSAGE:\n{user_text}\n\nEMOTION:\n{emotion}\n\nKB_TEXT_TO_REWRITE:\n{kb_text}"},
            ],
            text={"format": {"type": "json_schema", "json_schema": schema}},
        )
        out_text = getattr(resp, "output_text", None) or ""
        data = json.loads(out_text) if out_text else None
        return (data or {}).get("final_text")
    except Exception:
        try:
            comp = client.chat.completions.create(
                model=LLM_MODEL,
                messages=[
                    {"role": "system", "content": sys_msg + ' Return ONLY JSON: {"final_text": "..."}'},
                    {"role": "user", "content": f"USER_MESSAGE:\n{user_text}\n\nEMOTION:\n{emotion}\n\nKB_TEXT_TO_REWRITE:\n{kb_text}"},
                ],
                temperature=0.4,
            )
            txt = comp.choices[0].message.content.strip()
            return json.loads(txt).get("final_text")
        except Exception:
            return None

def _shorten(s: str, n: int = 260) -> str:
    s = (s or "").strip()
    if len(s) <= n:
        return s
    return s[: n - 1].rsplit(" ", 1)[0] + "…"

def _rag_chat_response(user_text: str, max_items: int = 3):
    """Return dict with KB-driven reply + metadata, or None if retrieval is not confident.

    RAG-first behavior:
      - Retrieve top-N KB candidates (default N=LLM_MAX_KB_CANDIDATES)
      - Use an LLM (optional) to *select* the best KB entry and emotion label (classification only)
      - Use KB text as the source of truth for the reply; optionally paraphrase KB text via LLM
      - If retrieval is weak/empty, or LLM confidence is low, return None (caller falls back to TF-IDF templates)
    """
    if retrieve_top_k is None:
        return None

    # Get more candidates for the classifier step
    try:
        candidates = retrieve_top_k(user_text, k=LLM_MAX_KB_CANDIDATES, min_score=RAG_MIN_SCORE)
    except Exception:
        return None

    if not candidates:
        return None

    # LLM selects KB id + emotion (grounded to candidates)
    sel = _llm_select_kb_and_emotion(user_text, candidates)
    selected_id = None
    selected_emotion = None
    sel_conf = 0.0
    if isinstance(sel, dict):
        selected_id = str(sel.get("selected_kb_id", "")).strip() or None
        selected_emotion = str(sel.get("emotion", "")).strip() or None
        try:
            sel_conf = float(sel.get("confidence", 0.0))
        except Exception:
            sel_conf = 0.0

    # If we have an LLM selection but it's not confident enough, treat as not confident -> fallback.
    # (This matches the requirement: TF-IDF templates are the fallback engine.)
    if selected_id and sel_conf < LLM_MIN_CONFIDENCE:
        return None

    # Pick main entry:
    main = None
    if selected_id:
        for c in candidates:
            if str(c.get("id", "")) == selected_id:
                main = c
                break

    # If no LLM selection (no key configured), prefer chat_response; else top-1.
    if main is None:
        for item in candidates:
            if str(item.get("type", "")) == "chat_response":
                main = item
                break
    if main is None:
        main = candidates[0]

    etype = str(main.get("type", "info_article"))
    # Emotion comes from KB if present; else from LLM selection; else neutral.
    emotion = str(main.get("emotion", "")).strip() or (selected_emotion or "neutral")
    if etype != "chat_response" and not selected_emotion:
        # info articles often don't have emotion; keep neutral unless LLM provided one
        emotion = emotion or "neutral"
    intent = str(main.get("intent", "")) if etype == "chat_response" else ""
    link = main.get("link") or ""

    # Main response text comes from KB (chat_response.response stored in content/text).
    main_text = str(main.get("content", main.get("text", ""))).strip()

    # Optional paraphrase (LLM) to make KB text sound more human.
    rewritten = _llm_rewrite_kb_text(user_text, main_text, emotion)
    if rewritten and isinstance(rewritten, str) and len(rewritten.strip()) >= 20:
        main_text = rewritten.strip()

    # Build KB-only reply:
    lines = [main_text]

    # Supporting suggestions (top 2 other hits)
    support = [h for h in candidates if h.get("id") != main.get("id")]
    if support:
        lines.append("")
        lines.append("More helpful ideas:")
        for item in support[: max(0, max_items - 1)]:
            head = (str(item.get("title", "")).strip() or str(item.get("topic", "")).strip() or "Tip")
            body = _shorten(str(item.get("content", item.get("text", ""))).strip(), 220)
            src = str(item.get("source", "")).strip()
            tail = f" — {src}" if src else ""
            lines.append(f"• {head}: {body}{tail}")

    # Gentle follow-up question (still KB-only)
    lines.append("")
    lines.append("What part of this feels most true for you right now?")

    return {
        "reply": "\n".join(lines).strip(),
        "link": link,
        "emotion": emotion or "neutral",
        "intent": intent,
        "hits": candidates[:max_items],
        "selection": sel,
    }

# ============================================================
#  AUTH HELPER (Bearer token stored in User.api_token)
# ============================================================
def get_user_from_token():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ", 1)[1].strip()
    if not token:
        return None
    return User.query.filter_by(api_token=token).first()

# ============================================================
#  BUNDLE INFERENCE HELPER
#  Supports:
#    - sklearn Pipeline with .predict
#    - dict {"vectorizer":..., "model":...}
# ============================================================
def predict_label(bundle, text: str):
    if hasattr(bundle, "predict"):
        return bundle.predict([text])[0]
    model = bundle["model"]
    vec = bundle["vectorizer"]
    X = vec.transform([text])
    return model.predict(X)[0]

# ============================================================
#  HARD SAFETY KEYWORD OVERRIDE (extra guard)
# ============================================================
HIGH_DISTRESS_PATTERNS = [
    r"\bkill myself\b", r"\bsuicide\b", r"\bend my life\b",
    r"\bself[-\s]?harm\b", r"\bhurt myself\b",
    r"\bno reason to live\b", r"\bcan'?t go on\b", r"\bwant to die\b"
]

def high_distress_override(text: str) -> bool:
    t = text.lower()
    return any(re.search(p, t) for p in HIGH_DISTRESS_PATTERNS)

# ============================================================
#  INFORMATION EXTRACTION (Topic/Symptom/Support/Intensity)
# ============================================================
TOPIC_PATTERNS = {
    "ultrasound": [r"\bultrasound\b", r"\banatomy scan\b", r"\bscan results\b"],
    "glucose_test": [r"\bglucose\b", r"\bgestational diabetes\b", r"\bgtt\b"],
    "labor": [r"\blabor\b", r"\bdelivery\b", r"\bbirth\b", r"\bbirth plan\b"],
    "baby_movement": [r"\bkick\b", r"\bmovement\b", r"\bbaby moving\b"],
    "sleep": [r"\binsomnia\b", r"\bcan't sleep\b", r"\bsleep\b"],
}

SYMPTOMS = [
    "nausea", "morning sickness", "back pain", "heartburn", "fatigue",
    "cramps", "swelling", "headache"
]

SUPPORT_WORDS = {
    "partner": ["partner", "husband", "wife"],
    "doctor": ["doctor", "midwife", "nurse", "ob", "provider"],
    "family": ["mom", "dad", "sister", "brother", "family"],
    "friend": ["friend", "friends"]
}

INTENSITY_HIGH = ["extremely", "really", "so much", "can't", "cannot", "overwhelmed", "panicking", "terrified"]
INTENSITY_MILD = ["a bit", "kind of", "somewhat", "little"]

def extract_features(text: str) -> dict:
    t = (text or "").lower()

    topic = None
    for k, pats in TOPIC_PATTERNS.items():
        if any(re.search(p, t) for p in pats):
            topic = k
            break

    symptom = None
    for s in SYMPTOMS:
        if s in t:
            symptom = s
            break

    support = None
    for k, words in SUPPORT_WORDS.items():
        if any(w in t for w in words):
            support = k
            break

    intensity = "medium"
    if any(w in t for w in INTENSITY_HIGH):
        intensity = "high"
    elif any(w in t for w in INTENSITY_MILD):
        intensity = "low"

    return {"topic": topic, "symptom": symptom, "support": support, "intensity": intensity}

# ============================================================
#  BUCKET ROUTING
# ============================================================
def pick_bucket(emotion: str, feats: dict) -> str:
    if emotion == "ANXIETY":
        if feats["topic"] == "ultrasound":
            return "ultrasound"
        if feats["topic"] == "glucose_test":
            return "glucose_test"
        if feats["topic"] == "labor":
            return "labor"
        if feats["symptom"]:
            return "symptoms"
        return "general"

    if emotion == "STRESS":
        if feats["topic"] in ["labor", "glucose_test"]:
            return "preparation"
        if feats["topic"] == "sleep" or feats["symptom"] == "fatigue":
            return "fatigue"
        return "general"

    if emotion == "LOW_MOOD":
        if feats["symptom"] == "fatigue":
            return "fatigue"
        return "general"

    # POSITIVE / NEUTRAL / HIGH_DISTRESS
    return "general"

# ============================================================
#  INTENSITY-BASED OPENING LINE (non-diagnostic)
# ============================================================
INTENSITY_PREFIX = {
    "low": "It sounds like this has been on your mind.",
    "medium": "It sounds like this is really affecting you.",
    "high": "It sounds like this feels really overwhelming right now."
}

# ============================================================
#  TEMPLATE SELECTION + RENDERING
# ============================================================
def choose_template(emotion: str, bucket: str, user_id: int) -> dict:
    emo_obj = TEMPLATES_V2.get(emotion, {})
    bucket_list = emo_obj.get(bucket, [])
    if not bucket_list:
        bucket_list = emo_obj.get("general", [])

    # fallback
    if not bucket_list:
        bucket_list = TEMPLATES_V2.get("NEUTRAL", {}).get("general", [])

    random.shuffle(bucket_list)
    chosen = None
    for cand in bucket_list:
        if not _state_is_recent(user_id, cand["id"]):
            chosen = cand
            break
    if chosen is None:
        chosen = bucket_list[0]

    _state_remember_template(user_id, chosen["id"])
    return chosen

def render_template(template_obj: dict, feats: dict) -> str:
    topic = feats["topic"] or "this"
    symptom = feats["symptom"] or "how you're feeling"
    support = feats["support"] or "someone you trust"

    prefix = INTENSITY_PREFIX.get(feats["intensity"], INTENSITY_PREFIX["medium"])

    parts = [prefix]
    for line in template_obj.get("frame", []):
        line = line.replace("{topic}", topic)
        line = line.replace("{symptom}", symptom)
        line = line.replace("{support}", support)
        parts.append(line)

    # Small, consistent non-diagnostic footer
    #parts.append("Note: I can support you emotionally and help you find resources, but I can’t provide medical diagnosis or medical instructions.")

    return " ".join(parts)

# ============================================================
#  2-STAGE EMOTION PREDICTION (TF-IDF)
# ============================================================
def predict_emotion_2stage(text: str) -> str:
    stage1 = str(predict_label(emo_stage1, text)).upper()

    # Expected stage1: POSITIVE / NEUTRAL / NEGATIVE
    if stage1 in ["POSITIVE", "NEUTRAL"]:
        return stage1

    # If stage1 outputs numeric labels, map here (edit if needed)
    # Example:
    # if stage1 == "0": stage1 = "NEGATIVE"
    # if stage1 == "1": stage1 = "NEUTRAL"
    # if stage1 == "2": stage1 = "POSITIVE"

    stage2 = str(predict_label(emo_stage2, text)).upper()

    # Expected stage2: ANXIETY/STRESS/LOW_MOOD/HIGH_DISTRESS
    if stage2 not in ["ANXIETY", "STRESS", "LOW_MOOD", "HIGH_DISTRESS"]:
        stage2 = "STRESS"

    return stage2

def predict_safety(text: str) -> str:
    pred = str(predict_label(safety_bundle, text)).upper()

    # If your safety model outputs numeric labels, map it here.
    # Common cases:
    #  - "SAFE"/"UNSAFE"
    #  - 0/1 (0 safe, 1 unsafe)
    if pred in ["UNSAFE", "1", "TRUE"]:
        return "UNSAFE"
    return "SAFE"

# ============================================================
#  INTENT HANDLER (continuous dialogue)
#  This is how you respond to follow-ups WITHOUT LLM.
# ============================================================
def handle_intent(intent: str, feats: dict):
    intent = (intent or "").strip()

    if intent in ["breathing_help", "do_breathing"]:
        return {
            "response": (
                "Of course. Here’s a short breathing exercise you can try. "
                "If you feel lightheaded, pause and return to normal breathing."
            ),
            "link": RESOURCE_LINKS["breathing_box"],
            "quick_replies": [
                {"id": "grounding_help", "label": "Try grounding (5-4-3-2-1)"},
                {"id": "share_more", "label": "Share more about how I feel"},
                {"id": "community_support", "label": "Visit community"}
            ]
        }

    if intent in ["grounding_help"]:
        return {
            "response": (
                "Here’s a grounding exercise (5-4-3-2-1). It helps bring attention back to the present moment."
            ),
            "link": RESOURCE_LINKS["grounding_54321"],
            "quick_replies": [
                {"id": "breathing_help", "label": "Try breathing instead"},
                {"id": "share_more", "label": "Share more about how I feel"},
                {"id": "community_support", "label": "Visit community"}
            ]
        }

    if intent in ["contact_provider"]:
        return {
            "response": (
                "If you’d like to talk to someone who’s trained to help, you can message a care provider here. "
                "Connecting with a professional can make things feel a little lighter."
            ),
            "link": RESOURCE_LINKS["provider_directory"],
            "quick_replies": [
                {"id": "share_more", "label": "Share more first"},
                {"id": "breathing_help", "label": "Do a calming exercise"},
                {"id": "community_support", "label": "Ask community"}
            ]
        }

    if intent in ["community_support"]:
        return {
            "response": (
                "Absolutely — community can help you feel less alone. Here’s where you can join discussions and connect with others."
            ),
            "link": RESOURCE_LINKS["community_support"],
            "quick_replies": [
                {"id": "share_more", "label": "Share how I’m feeling"},
                {"id": "breathing_help", "label": "Calming exercise"},
                {"id": "contact_provider", "label": "Message provider"}
            ]
        }

    if intent in ["journal_prompt"]:
        topic = feats.get("topic") or "what you’re experiencing"
        return {
            "response": (
                f"Here’s a gentle journaling prompt: “Right now I’m feeling ___ about {topic}. "
                "One thing I need today is ___.”"
            ),
            "link": RESOURCE_LINKS["journal_prompt"],
            "quick_replies": [
                {"id": "share_more", "label": "Share my answer"},
                {"id": "breathing_help", "label": "Breathing exercise"},
                {"id": "community_support", "label": "Go to community"}
            ]
        }

    # default follow-up
    return {
        "response": "Thanks — tell me a bit more about how you’re feeling right now.",
        "quick_replies": [
            {"id": "share_more", "label": "Share more"},
            {"id": "breathing_help", "label": "Calming exercise"}
        ]
    }

# ============================================================
#  1) GREETING ENDPOINT (bot starts conversation)
# ============================================================
@chat_bp.route("/api/chat/greeting", methods=["GET"])
def chat_greeting():
    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    CHAT_STATE[user.id] = {"turns": 0, "recent_templates": []}

    greeting = f"Welcome my dear {user.username}. How are you feeling today?"
    return jsonify({
        "type": "greeting",
        "response": greeting,
        "quick_replies": [
            {"id": "share_more", "label": "Share how I’m feeling"},
            {"id": "breathing_help", "label": "I want a calming exercise"},
            {"id": "community_support", "label": "Visit community"}
        ]
    }), 200

# ============================================================
#  2) MAIN CHAT ENDPOINT
# ============================================================
@chat_bp.route("/api/chat", methods=["POST"])
def chat():
    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json() or {}
    text = str(data.get("text", "")).strip()
    intent = data.get("intent")  # ✅ quick reply intent

    # Update state turns
    state = _state_get(user.id)
    state["turns"] = int(state.get("turns", 0)) + 1

    # Extract features (even if text empty for intent)
    feats = extract_features(text) if text else {"topic": None, "symptom": None, "support": None, "intensity": "medium"}

    # ------------------------------------------------------------
    # INTENT MODE (continuous dialogue)
    # ------------------------------------------------------------
    if intent:
        payload = handle_intent(intent, feats)
        return jsonify({
            "safety": "SAFE",
            "emotion": None,
            "bucket": None,
            "response": payload["response"],
            "link": payload.get("link"),
            "quick_replies": payload.get("quick_replies", [])
        }), 200

    if not text:
        return jsonify({"error": "Missing text"}), 400

    # ------------------------------------------------------------
    # SAFETY OVERRIDES
    # ------------------------------------------------------------
    if high_distress_override(text):
        template = choose_template("HIGH_DISTRESS", "general", user.id)
        response_text = render_template(template, feats)
        return jsonify({
            "safety": "UNSAFE",
            "emotion": "HIGH_DISTRESS",
            "bucket": "general",
            "response": response_text,
            "link": RESOURCE_LINKS["urgent_support"],
            "quick_replies": [
                {"id": "contact_provider", "label": "Message a care provider"},
                {"id": "community_support", "label": "Visit community"}
            ]
        }), 200

    safety = predict_safety(text)
    if safety == "UNSAFE":
        template = choose_template("HIGH_DISTRESS", "general", user.id)
        response_text = render_template(template, feats)
        return jsonify({
            "safety": "UNSAFE",
            "emotion": "HIGH_DISTRESS",
            "bucket": "general",
            "response": response_text,
            "link": RESOURCE_LINKS["urgent_support"],
            "quick_replies": [
                {"id": "contact_provider", "label": "Message a care provider"},
                {"id": "community_support", "label": "Visit community"}
            ]
        }), 200

    # ------------------------------------------------------------
    # RAG-FIRST (classification-by-retrieval). TF-IDF templates are fallback.
    # ------------------------------------------------------------
    rag = _rag_chat_response(text, max_items=3)
    if rag:
        # Emotion/intent come from the KB entry metadata (RAG-based categorization)
        emotion = rag.get("emotion", "neutral")
        bucket = pick_bucket(emotion, feats)

        # Save state
        state["last_emotion"] = emotion
        state["last_bucket"] = bucket

        response_text = rag.get("reply")
        kb_link = rag.get("link")
        template = None
    else:
        # ------------------------------------------------------------
        # FALLBACK: EMOTION (2-stage TF-IDF) + rule/template engine
        # ------------------------------------------------------------
        emotion = predict_emotion_2stage(text)
        bucket = pick_bucket(emotion, feats)

        # Save state
        state["last_emotion"] = emotion
        state["last_bucket"] = bucket

        template = choose_template(emotion, bucket, user.id)
        response_text = render_template(template, feats)
        kb_link = None
# Provide follow-ups (template specific if present else defaults)
    quick_replies = (template.get("followups") if template else None) or [
        {"id": "breathing_help", "label": "Try a breathing exercise"},
        {"id": "journal_prompt", "label": "Try a journaling prompt"},
        {"id": "contact_provider", "label": "Message a care provider"},
        {"id": "community_support", "label": "Visit community"}
    ]

    return jsonify({
        "safety": "SAFE",
        "emotion": emotion,
        "bucket": bucket,
        "response": response_text,
        "link": kb_link,
        "quick_replies": quick_replies
    }), 200
    
    
    
    
    # chat session
# 1. session start endpoint
@chat_bp.route("/api/chat/session/start", methods=["GET"])
def start_session():

    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    session_id = str(uuid.uuid4())

    session = ChatSession(
        id=session_id,
        user_id=user.id
    )

    db.session.add(session)

    greeting_msg = ChatMessage(
        id=str(uuid.uuid4()),
        session_id=session_id,
        role="assistant",
        type="greeting",
        text=f"Hi {user.username} 😊 Welcome to NurtureJoy. How are you feeling today?",
        link=None,
        quick_replies=[
            {"id": "share_more", "label": "Share how I’m feeling"},
            {"id": "breathing_help", "label": "Try a calming exercise"},
            {"id": "community_support", "label": "Visit community"}
        ]
    )

    db.session.add(greeting_msg)
    db.session.commit()

    return jsonify({
        "session_id": session_id,
        "message": greeting_msg.to_dict()
    }), 200
    


# 2. message endpoint
@chat_bp.route("/api/chat/session/<session_id>/message", methods=["POST"])
def send_message(session_id):

    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    session = ChatSession.query.filter_by(id=session_id, user_id=user.id).first()

    if not session:
        return jsonify({"error": "Invalid session"}), 404

    if session.ended:
        return jsonify({"error": "Session ended"}), 400

    data = request.get_json() or {}
    text = str(data.get("text", "")).strip()

    if not text:
        return jsonify({"error": "Missing text"}), 400

    # Save user message
    user_msg = ChatMessage(
        id=str(uuid.uuid4()),
        session_id=session_id,
        role="user",
        type="chat",
        text=text
    )

    db.session.add(user_msg)
    session.turns += 1

    # === SAFETY FIRST ===
    if predict_safety(text) == "UNSAFE":
        bot_text = "This sounds serious. Please seek urgent support."

        bot_msg = ChatMessage(
            id=str(uuid.uuid4()),
            session_id=session_id,
            role="assistant",
            type="safety",
            text=bot_text,
            link="/resources/urgent-support"
        )

        db.session.add(bot_msg)
        db.session.commit()
        return jsonify({"message": bot_msg.to_dict()}), 200
    
    
    # goodbye emotion
    if text.lower() in ["goodbye", "bye", "see you", "talk later"]:
        bot_text = "Goodbye! It was really good talking with you 💛 Click on the button to end this session?"

        bot_msg = ChatMessage(
            id=str(uuid.uuid4()),
            session_id=session_id,
            role="assistant",
            type="closing",
            text=bot_text,
            quick_replies=[
                {"id": "end_session", "label": "End session"},
                {"id": "continue_chat", "label": "Continue chatting"}
            ]
        )

        db.session.add(bot_msg)
        db.session.commit()
        return jsonify({"message": bot_msg.to_dict()}), 200

    # === RAG-FIRST (classification-by-retrieval). TF-IDF templates are fallback. ===
    feats = extract_features(text)

    rag = _rag_chat_response(text, max_items=3)
    if rag:
        emotion = rag.get("emotion", "neutral")
        bucket = pick_bucket(emotion, feats)
        bot_text = rag.get("reply")
        kb_link = rag.get("link")
        template = None
    else:
        # Fallback to TF-IDF emotion + templates
        emotion = predict_emotion_2stage(text)
        bucket = pick_bucket(emotion, feats)
        template = choose_template(emotion, bucket, user.id)
        bot_text = render_template(template, feats)
        kb_link = None

    bot_msg = ChatMessage(
        id=str(uuid.uuid4()),
        session_id=session_id,
        role="assistant",
        type="chat",
        text=bot_text,
        link=kb_link,
        quick_replies=(template.get("followups") if template else None) or [
            {"id": "breathing_help", "label": "Try breathing"},
            {"id": "journal_prompt", "label": "Try journaling"},
            {"id": "community_support", "label": "Visit community"}
        ]
    )

    db.session.add(bot_msg)
    db.session.commit()

    return jsonify({"message": bot_msg.to_dict()}), 200

# 3.history endpoint
@chat_bp.route("/api/chat/session/<session_id>/history", methods=["GET"])
def get_history(session_id):

    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    session = ChatSession.query.filter_by(id=session_id, user_id=user.id).first()

    if not session:
        return jsonify({"error": "Invalid session"}), 404

    messages = ChatMessage.query.filter_by(session_id=session_id)\
        .order_by(ChatMessage.timestamp.asc())\
        .all()

    return jsonify({
        "session_id": session_id,
        "turns": session.turns,
        "messages": [m.to_dict() for m in messages]
    }), 200
    
    
# 4. intent endpoint (for follow-ups)
@chat_bp.route("/api/chat/session/<session_id>/intent", methods=["POST"])
def run_intent(session_id):

    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    session = ChatSession.query.filter_by(
        id=session_id,
        user_id=user.id
    ).first()

    if not session:
        return jsonify({"error": "Invalid session"}), 404

    if session.ended:
        return jsonify({"error": "Session ended"}), 400

    data = request.get_json() or {}
    intent_id = str(data.get("intent", "")).strip()

    if not intent_id:
        return jsonify({"error": "Missing intent"}), 400
    
    # ===========================
# END SESSION INTENT
# ===========================

    if intent_id == "end_session":

        session.ended = True
        session.ended_at = datetime.utcnow()

        bot_msg = ChatMessage(
        id=str(uuid.uuid4()),
        session_id=session_id,
        role="assistant",
        type="closing",
        text="Your session has been safely closed 🌿 Take care and come back anytime.",
        quick_replies=[]
    )

        db.session.add(bot_msg)
        db.session.commit()

        return jsonify({"message": bot_msg.to_dict()}), 200

    now = datetime.utcnow()

    # 🔹 Save user intent click as a message (for audit trail)
    user_intent_msg = ChatMessage(
        id=str(uuid.uuid4()),
        session_id=session_id,
        role="user",
        type="intent",
        text=f"[intent:{intent_id}]",
        timestamp=now
    )

    db.session.add(user_intent_msg)

    # 🔹 Call your existing intent handler
    # Adjust this to match your real function signature
    payload = handle_intent(intent_id, {
        "topic": None,
        "symptom": None,
        "support": None,
        "intensity": "medium"
    })

    bot_msg = ChatMessage(
        id=str(uuid.uuid4()),
        session_id=session_id,
        role="assistant",
        type="resource",
        text=payload.get("response"),
        link=payload.get("link"),
        quick_replies=payload.get("quick_replies", []),
        timestamp=now
    )

    db.session.add(bot_msg)

    session.turns += 1

    db.session.commit()

    return jsonify({
        "message": bot_msg.to_dict()
    }), 200
    
    
    # 5. end session endpoint
@chat_bp.route("/api/chat/session/<session_id>/sessionend", methods=["POST", "OPTIONS"])
def end_session(session_id):
    
    # 🔹 Allow preflight to pass
    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight OK"}), 200

    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    session = ChatSession.query.filter_by(
        id=session_id,
        user_id=user.id
    ).first()

    if not session:
        return jsonify({"error": "Invalid session"}), 404

    if session.ended:
        return jsonify({"error": "Session already ended"}), 400

    session.ended = True
    session.ended_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "status": "ended",
        "session_id": session_id,
        "ended_at": session.ended_at.isoformat()
    }), 200
    
    
# 6. get all sessions for user (optional, for dashboard)
@chat_bp.route("/api/chat/sessions", methods=["GET", "OPTIONS"])
def get_user_sessions():

    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight OK"}), 200

    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    sessions = ChatSession.query.filter_by(user_id=user.id)\
        .order_by(ChatSession.created_at.desc())\
        .all()

    return jsonify({
        "sessions": [s.to_dict() for s in sessions]
    }), 200
    
# 7. delete a session
@chat_bp.route("/api/chat/session/<session_id>", methods=["DELETE", "OPTIONS"])
def delete_session(session_id):

    # Allow preflight
    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight OK"}), 200

    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    session = ChatSession.query.filter_by(
        id=session_id,
        user_id=user.id
    ).first()

    if not session:
        return jsonify({"error": "Session not found"}), 404

    # Delete messages first
    ChatMessage.query.filter_by(session_id=session_id).delete()

    # Delete session
    db.session.delete(session)
    db.session.commit()

    return jsonify({
        "message": "Session deleted successfully"
    }), 200