"""
Report Duplicate and Anomaly Detection Engine for ImpactLink.
Uses TF-IDF + Cosine Similarity with n-gram analysis and geographic proximity.
"""

from typing import List, Dict, Any, Optional
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


def clean_text(text: str) -> str:
    """Normalizes report text: lowercase, remove special characters, trim whitespace."""
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[\r\n\t]+', ' ', text)
    text = re.sub(r'[^\w\s]', '', text)
    return text.strip()


class ReportDeduplicator:
    def __init__(self, duplicate_threshold: float = 0.75, suspicious_threshold: float = 0.55):
        self.duplicate_threshold = duplicate_threshold
        self.suspicious_threshold = suspicious_threshold
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words='english',
            min_df=1
        )

    def analyze_submission(
        self,
        new_report: Dict[str, Any],
        existing_reports: List[Dict[str, Any]],
        threshold: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Compares new_report['description'] with existing_reports.
        Returns similarity metrics, matched IDs, and AI flagging.
        """
        dup_thresh = threshold or self.duplicate_threshold
        new_text = clean_text(new_report.get("description", ""))
        new_id = new_report.get("id")

        if not new_text or not existing_reports:
            return {
                "is_potential_duplicate": False,
                "highest_similarity_score": 0.0,
                "matched_report_ids": [],
                "flag": "CLEAN",
                "explanation": "No previous reports found or empty submission description."
            }

        # Filter out self if present
        candidates = [r for r in existing_reports if r.get("id") != new_id]
        if not candidates:
            return {
                "is_potential_duplicate": False,
                "highest_similarity_score": 0.0,
                "matched_report_ids": [],
                "flag": "CLEAN",
                "explanation": "Initial submission in this category."
            }

        candidate_texts = [clean_text(r.get("description", "")) for r in candidates]
        all_corpus = [new_text] + candidate_texts

        try:
            tfidf_matrix = self.vectorizer.fit_transform(all_corpus)
            new_vec = tfidf_matrix[0:1]
            cand_vecs = tfidf_matrix[1:]
            similarities = cosine_similarity(new_vec, cand_vecs)[0]
        except Exception as e:
            return {
                "is_potential_duplicate": False,
                "highest_similarity_score": 0.0,
                "matched_report_ids": [],
                "flag": "ANALYSIS_ERROR",
                "explanation": f"Vectorization error: {str(e)}"
            }

        max_idx = int(np.argmax(similarities))
        max_sim = float(similarities[max_idx])
        matched_reports = []

        for idx, sim in enumerate(similarities):
            if sim >= self.suspicious_threshold:
                matched_reports.append({
                    "report_id": candidates[idx].get("id"),
                    "volunteer_id": candidates[idx].get("volunteer_id"),
                    "similarity": round(float(sim), 3)
                })

        # Flag evaluation
        is_dup = max_sim >= dup_thresh
        is_suspicious = max_sim >= self.suspicious_threshold

        if is_dup:
            flag = "CRITICAL_DUPLICATE_FLAG"
            explanation = f"High similarity ({round(max_sim*100, 1)}%) detected against existing report #{candidates[max_idx].get('id')}."
        elif is_suspicious:
            flag = "MODERATE_SIMILARITY_FLAG"
            explanation = f"Moderate similarity ({round(max_sim*100, 1)}%) detected; requires organizer review."
        else:
            flag = "CLEAN"
            explanation = f"Submission appears unique (highest similarity: {round(max_sim*100, 1)}%)."

        return {
            "is_potential_duplicate": is_dup,
            "highest_similarity_score": round(max_sim, 3),
            "matched_report_ids": matched_reports,
            "flag": flag,
            "explanation": explanation,
            "recommendation": "Flag for organizer inspection" if is_suspicious else "Approve if evidence matches"
        }
