"""
AI-Assisted Document & Verification Analysis Module for ImpactLink.
Extracts identifiers (NGO Darpan, CIN, PAN, Registration Numbers), compares with organization profile,
and generates explainable anomaly flags and risk scores for admin reviews.
"""

from typing import Dict, Any, List
import re


def extract_regex_patterns(text: str) -> Dict[str, Any]:
    """Extracts common Indian registration identifiers and representative details."""
    patterns = {
        "ngo_darpan": r'[A-Z]{2}/\d{4}/\d{7}',
        "cin": r'[LU]{1}\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}',
        "pan": r'[A-Z]{5}[0-9]{4}[A-Z]{1}',
        "phone": r'(?:\+91[\-\s]?)?[6789]\d{9}',
        "email": r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
        "pincode": r'\b[1-9][0-9]{5}\b'
    }

    extracted = {}
    for key, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted[key] = match.group(0).strip()
    return extracted


class DocumentAnalyzer:
    def analyze_document(
        self,
        document_text: str,
        doc_type: str,
        org_profile: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Compares extracted document content against organization profile.
        Detects missing fields, discrepancies, and computes risk assessment.
        """
        extracted = extract_regex_patterns(document_text)
        discrepancies: List[str] = []
        missing_fields: List[str] = []
        risk_score = 0.0

        # Check Org Name presence
        org_name = org_profile.get("name", "").strip().lower()
        if org_name and org_name not in document_text.lower():
            discrepancies.append(f"Organization name '{org_profile.get('name')}' was not found in document text.")
            risk_score += 35.0

        # Check Representative Name
        rep_name = org_profile.get("representative_name", "").strip().lower()
        if rep_name and rep_name not in document_text.lower():
            discrepancies.append(f"Authorized representative '{org_profile.get('representative_name')}' not explicitly matched.")
            risk_score += 20.0

        # Specific Document Type Validations
        if doc_type == "NGO_DARPAN":
            if "ngo_darpan" not in extracted:
                missing_fields.append("Valid NGO Darpan registration ID pattern not detected.")
                risk_score += 25.0
        elif doc_type == "CIN_LLPIN":
            if "cin" not in extracted:
                missing_fields.append("Corporate Identification Number (CIN) pattern not detected.")
                risk_score += 25.0

        # Phone / Contact alignment check
        if "phone" in extracted and org_profile.get("phone"):
            doc_phone = re.sub(r'\D', '', extracted["phone"])[-10:]
            prof_phone = re.sub(r'\D', '', org_profile.get("phone", ""))[-10:]
            if doc_phone != prof_phone:
                discrepancies.append(f"Document phone ({extracted['phone']}) differs from profile contact.")
                risk_score += 15.0

        risk_score = min(100.0, risk_score)
        if risk_score <= 20.0:
            suggested_status = "LOW_RISK_RECOMMEND_APPROVAL"
        elif risk_score <= 50.0:
            suggested_status = "MODERATE_RISK_MANUAL_REVIEW"
        else:
            suggested_status = "HIGH_RISK_MORE_INFO_REQUIRED"

        return {
            "document_type": doc_type,
            "extracted_data": extracted,
            "missing_fields": missing_fields,
            "inconsistencies": discrepancies,
            "ai_risk_score": round(risk_score, 2),
            "suggested_review_status": suggested_status,
            "explanation": "Document verified with low discrepancies" if not discrepancies else "Discrepancies flagged for admin inspection"
        }
