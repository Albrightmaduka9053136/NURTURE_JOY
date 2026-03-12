"""Simple RAG retriever (no LLM).

- Loads curated KB entries from ml/kb/kb_articles.json
- Builds a TF-IDF index over multiple fields (topic/title/content/intent/triggers/etc.)
- Retrieves top-k relevant entries for a user query

This retriever supports two entry types:
  - type="chat_response": empathetic response + emotion/intent metadata (preferred for chatbot replies)
  - type="info_article": educational snippet (used when no chat_response matches well)

Designed for the NurtureJoy chatbot to provide KB-first responses with TF-IDF template fallback.
"""

import json
import os
from typing import Dict, List, Tuple

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KB_PATH = os.path.join(BASE_DIR, "kb", "kb_articles.json")

# Cache (module-level)
_KB: List[Dict] = []
_VECTORIZER: TfidfVectorizer | None = None
_X = None


def _load_kb() -> List[Dict]:
    with open(KB_PATH, "r", encoding="utf-8") as f:
        kb = json.load(f)
    if not isinstance(kb, list):
        raise ValueError("KB must be a list of objects")
    return kb


def _as_text(item: Dict) -> str:
    """Build an indexable text blob from an entry."""
    topic = str(item.get("topic", ""))
    title = str(item.get("title", ""))
    content = str(item.get("content", item.get("text", "")))
    source = str(item.get("source", ""))
    etype = str(item.get("type", ""))
    emotion = str(item.get("emotion", ""))
    intent = str(item.get("intent", ""))
    triggers = item.get("triggers", [])
    if isinstance(triggers, list):
        triggers = " ".join([str(t) for t in triggers])
    else:
        triggers = str(triggers)

    # Include metadata tokens to help retrieval behave like "classification-by-retrieval".
    return f"{etype} {emotion} {intent} {triggers} {topic} {title} {content} {source}"


def _build_index() -> None:
    global _KB, _VECTORIZER, _X

    _KB = _load_kb()
    texts = [_as_text(item) for item in _KB]

    _VECTORIZER = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=40000)
    _X = _VECTORIZER.fit_transform(texts)


# Build at import time
_build_index()


def retrieve_top_k(query: str, k: int = 3, min_score: float = 0.18) -> List[Dict]:
    """Return top-k KB items with cosine similarity scores.

    Each result is a dict including the original entry fields + 'score'.

    Notes:
      - We apply a small preference boost to type="chat_response" entries so that
        empathetic responses win ties against generic info snippets.
    """
    if not query or not query.strip():
        return []

    assert _VECTORIZER is not None and _X is not None

    q_vec = _VECTORIZER.transform([query])
    sims = cosine_similarity(q_vec, _X).flatten()

    # Preference boost for chat_response entries
    for i, item in enumerate(_KB):
        if str(item.get("type", "")) == "chat_response":
            sims[i] *= 1.10

    top_idx = sims.argsort()[::-1][: max(k, 1)]
    results: List[Dict] = []
    for idx in top_idx:
        score = float(sims[idx])
        if score < min_score:
            continue
        item = dict(_KB[idx])
        if "id" not in item or not str(item.get("id","")).strip():
            item["id"] = f"kb_{idx}"
        item["score"] = score
        results.append(item)

    return results
