"""Simple RAG retriever (no LLM).

- Loads curated KB snippets from ml/kb/kb_articles.json
- Builds a TF-IDF index
- Retrieves top-k relevant snippets for a user query

Designed for the NurtureJoy chatbot to add contextual 'Helpful info' + a safe resource link.
"""

import json
import os
from typing import Dict, List

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


def _build_index() -> None:
    global _KB, _VECTORIZER, _X

    _KB = _load_kb()

    texts = []
    for item in _KB:
        title = str(item.get("title", ""))
        body = str(item.get("text", ""))
        tags = " ".join(item.get("tags", []) or [])
        texts.append(f"{title} {body} {tags}")

    _VECTORIZER = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=30000)
    _X = _VECTORIZER.fit_transform(texts)


# Build at import time
_build_index()


def retrieve_top_k(query: str, k: int = 2, min_score: float = 0.12) -> List[Dict]:
    """Return top-k KB items with cosine similarity scores.

    Each result is a dict including: id, title, text, tags, link, score.
    """
    if not query or not query.strip():
        return []

    assert _VECTORIZER is not None and _X is not None

    q_vec = _VECTORIZER.transform([query])
    sims = cosine_similarity(q_vec, _X).flatten()

    # best indices
    top_idx = sims.argsort()[::-1][:k]
    results: List[Dict] = []
    for idx in top_idx:
        score = float(sims[idx])
        if score < min_score:
            continue
        item = dict(_KB[idx])
        item["score"] = score
        results.append(item)

    return results
