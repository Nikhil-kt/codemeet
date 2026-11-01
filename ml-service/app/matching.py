"""
Hybrid Volunteer Matching Engine for ImpactLink.
Combines deterministic eligibility filtering with multi-factor weighted ranking:
  MATCH_SCORE = 0.30*SKILL + 0.25*LOCATION + 0.20*AVAILABILITY + 0.15*EXPERIENCE + 0.10*RELIABILITY
"""

from typing import List, Dict, Any, Optional
import math


def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two coordinates in kilometers."""
    R = 6371.0  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


class VolunteerMatcher:
    def __init__(self, weights: Optional[Dict[str, float]] = None):
        self.weights = weights or {
            "skill": 0.30,
            "location": 0.25,
            "availability": 0.20,
            "experience": 0.15,
            "reliability": 0.10,
        }

    def evaluate_volunteer(
        self,
        event: Dict[str, Any],
        volunteer: Dict[str, Any],
        config: Optional[Dict[str, Any]] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Evaluates a single volunteer against event requirements.
        Returns match output dict or None if filtered out by eligibility rules.
        """
        # 1. Eligibility Filtering
        if volunteer.get("is_suspended", False):
            return None

        if not volunteer.get("location_preference_enabled", True):
            # If volunteer disabled matching/location notifications
            pass

        # Check conflicting events
        conflicting_event_ids = volunteer.get("conflicting_event_ids", [])
        if event.get("id") in conflicting_event_ids:
            return None

        # Mandatory skills check
        event_reqs = event.get("requirements", [])
        mandatory_skills = [
            req["skill_name"].lower()
            for req in event_reqs
            if req.get("is_mandatory", False)
        ]
        volunteer_skills = {
            s["name"].lower(): s.get("proficiency", "INTERMEDIATE")
            for s in volunteer.get("skills", [])
        }

        for mand in mandatory_skills:
            if mand not in volunteer_skills:
                # Disqualified due to lack of mandatory skill
                return None

        # 2. Skill Compatibility (0 - 100)
        required_skills = [req["skill_name"].lower() for req in event_reqs]
        if not required_skills:
            skill_score = 80.0  # General volunteer event
            matched_skills_list = list(volunteer_skills.keys())
        else:
            matched_count = sum(1 for req in required_skills if req in volunteer_skills)
            skill_score = min(100.0, (matched_count / len(required_skills)) * 100.0)
            matched_skills_list = [req for req in required_skills if req in volunteer_skills]

        # 3. Location Compatibility (0 - 100)
        event_lat = event.get("latitude")
        event_lon = event.get("longitude")
        vol_lat = volunteer.get("latitude")
        vol_lon = volunteer.get("longitude")

        distance_km = None
        if event_lat is not None and event_lon is not None and vol_lat is not None and vol_lon is not None:
            distance_km = calculate_haversine_distance(event_lat, event_lon, vol_lat, vol_lon)
            # Distance scoring: <5km: 100, <15km: 85, <30km: 65, <50km: 40, else decaying
            if distance_km <= 5.0:
                location_score = 100.0
            elif distance_km <= 15.0:
                location_score = 85.0
            elif distance_km <= 30.0:
                location_score = 65.0
            elif distance_km <= 50.0:
                location_score = 40.0
            else:
                location_score = max(0.0, 100.0 - (distance_km * 1.5))
        else:
            # Fallback to city match
            if volunteer.get("city", "").lower() == event.get("city", "").lower():
                location_score = 75.0
            else:
                location_score = 30.0

        # 4. Availability Compatibility (0 - 100)
        # Check day of week and time slot overlap
        vol_avail = volunteer.get("availability", [])
        event_day = event.get("day_of_week")  # 0-6
        if volunteer.get("temporary_unavailable", False):
            return None

        if vol_avail:
            day_matches = [
                a for a in vol_avail
                if a.get("day_of_week") == event_day or a.get("specific_date") == event.get("event_date")
            ]
            if day_matches:
                availability_score = 95.0
            else:
                availability_score = 40.0
        else:
            availability_score = 70.0  # Flexible availability indicated

        # 5. Experience Contribution (0 - 100)
        # Combines past hours volunteered and related past events
        hours = float(volunteer.get("total_hours_volunteered", 0.0))
        past_events = int(volunteer.get("past_events_completed", 0))
        # 50+ hours or 5+ events gives max experience score
        experience_score = min(100.0, (hours * 1.2) + (past_events * 8.0))
        if experience_score == 0 and volunteer.get("is_provisional", False):
            experience_score = 60.0  # Fair onboarding baseline for fresh enthusiastic volunteers

        # 6. Reliability Score (0 - 100)
        # From database or provisional default (neutral 70)
        reliability_score = float(volunteer.get("reliability_score", 70.0))

        # 7. Final Weighted Match Score
        w = self.weights
        final_score = (
            w["skill"] * skill_score
            + w["location"] * location_score
            + w["availability"] * availability_score
            + w["experience"] * experience_score
            + w["reliability"] * reliability_score
        )
        final_score = round(min(100.0, max(0.0, final_score)), 2)

        # Recommendation Category
        if final_score >= 85:
            recommendation = "HIGHLY_RECOMMENDED"
        elif final_score >= 70:
            recommendation = "STRONG_MATCH"
        elif final_score >= 50:
            recommendation = "POTENTIAL_MATCH"
        else:
            recommendation = "LOW_ALIGNMENT"

        # Explainable Reason Breakdown
        explanations = []
        if matched_skills_list:
            explanations.append(f"Possesses matching skills: {', '.join(matched_skills_list)}")
        if distance_km is not None:
            explanations.append(f"Located approximately {round(distance_km, 1)} km from event site")
        elif location_score >= 70:
            explanations.append(f"Located in same operating city ({event.get('city')})")

        if availability_score >= 80:
            explanations.append("Confirmed schedule availability during event hours")
        if volunteer.get("is_provisional", False):
            explanations.append("Provisional verified newcomer - fair opportunity included")
        elif reliability_score >= 85:
            explanations.append(f"High historical reliability rating ({reliability_score}/100)")

        return {
            "volunteer_id": volunteer.get("id"),
            "match_score": final_score,
            "skill_score": round(skill_score, 2),
            "location_score": round(location_score, 2),
            "availability_score": round(availability_score, 2),
            "experience_score": round(experience_score, 2),
            "reliability_score": round(reliability_score, 2),
            "distance_km": round(distance_km, 2) if distance_km is not None else None,
            "recommendation_category": recommendation,
            "explanation": explanations,
        }

    def rank_volunteers(
        self,
        event: Dict[str, Any],
        volunteers: List[Dict[str, Any]],
        config: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        results = []
        for vol in volunteers:
            res = self.evaluate_volunteer(event, vol, config)
            if res:
                results.append(res)
        # Sort descending by match_score
        results.sort(key=lambda x: x["match_score"], reverse=True)
        return results

