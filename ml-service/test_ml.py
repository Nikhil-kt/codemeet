"""
Unit tests for ImpactLink ML Service
Tests the matching algorithm, similarity deduplication, document analysis, and campaign health metrics.
"""

import unittest
from app.matching import VolunteerMatcher, calculate_haversine_distance
from app.similarity import ReportDeduplicator
from app.document_analysis import DocumentAnalyzer
from app.campaign_metrics import CampaignAnalyzer


class TestMLService(unittest.TestCase):
    def setUp(self):
        self.matcher = VolunteerMatcher()
        self.deduplicator = ReportDeduplicator()
        self.doc_analyzer = DocumentAnalyzer()
        self.campaign_analyzer = CampaignAnalyzer()

    def test_haversine_distance(self):
        # Distance between Marina Beach and Adyar, Chennai (~4.5 km)
        dist = calculate_haversine_distance(13.0475, 80.2824, 13.0067, 80.2565)
        self.assertTrue(3.0 <= dist <= 6.0, f"Expected ~4.5 km, got {dist}")

    def test_matching_algorithm(self):
        event = {
            "id": "e1",
            "title": "Marina Beach Cleanup",
            "latitude": 13.0475,
            "longitude": 80.2824,
            "city": "Chennai",
            "day_of_week": 6,  # Saturday
            "event_date": "2026-11-14",
            "requirements": [
                {"skill_name": "Beach & Water Body Cleanup", "is_mandatory": True},
                {"skill_name": "Waste Segregation & Recycling", "is_mandatory": False}
            ]
        }

        vol_eligible = {
            "id": "v1",
            "latitude": 13.0336,
            "longitude": 80.2785,
            "city": "Chennai",
            "skills": [
                {"name": "Beach & Water Body Cleanup"},
                {"name": "Waste Segregation & Recycling"}
            ],
            "availability": [{"day_of_week": 6}],
            "total_hours_volunteered": 45,
            "past_events_completed": 4,
            "reliability_score": 92.0,
            "is_provisional": False
        }

        vol_missing_mandatory = {
            "id": "v2",
            "latitude": 13.0475,
            "longitude": 80.2824,
            "skills": [{"name": "Web Development"}],  # missing mandatory cleanup
            "availability": [{"day_of_week": 6}]
        }

        results = self.matcher.rank_volunteers(event, [vol_eligible, vol_missing_mandatory])
        self.assertEqual(len(results), 1, "Disqualified volunteer without mandatory skill should be excluded")
        top_match = results[0]
        self.assertEqual(top_match["volunteer_id"], "v1")
        self.assertGreaterEqual(top_match["match_score"], 80.0)
        self.assertIn("Possesses matching skills", top_match["explanation"][0])

    def test_report_deduplication(self):
        existing = [
            {"id": "rep-1", "volunteer_id": "v1", "description": "Cleaned the north zone of Marina beach and gathered 15 bags of plastic waste along the tide line."}
        ]
        duplicate_report = {
            "id": "rep-2",
            "description": "Cleaned the north zone of Marina beach and collected 15 bags of plastic waste along the tide line."
        }
        unique_report = {
            "id": "rep-3",
            "description": "Conducted awareness stall near light house and distributed 100 cloth bags to evening visitors."
        }

        dup_result = self.deduplicator.analyze_submission(duplicate_report, existing)
        self.assertTrue(dup_result["is_potential_duplicate"])
        self.assertGreater(dup_result["highest_similarity_score"], 0.75)

        uniq_result = self.deduplicator.analyze_submission(unique_report, existing)
        self.assertFalse(uniq_result["is_potential_duplicate"])
        self.assertEqual(uniq_result["flag"], "CLEAN")

    def test_document_analysis(self):
        doc_text = """
        GOVERNMENT OF INDIA
        NGO DARPAN REGISTRATION CERTIFICATE
        Organization: Green Earth Trust
        Unique Darpan ID: TN/2021/0192834
        Authorized Signatory: Ananya Sharma
        Official Contact: +91 9811122334
        """
        org_profile = {
            "name": "Green Earth Trust",
            "representative_name": "Ananya Sharma",
            "phone": "+91 9811122334"
        }

        analysis = self.doc_analyzer.analyze_document(doc_text, "NGO_DARPAN", org_profile)
        self.assertEqual(analysis["ai_risk_score"], 0.0)
        self.assertEqual(analysis["suggested_review_status"], "LOW_RISK_RECOMMEND_APPROVAL")
        self.assertEqual(analysis["extracted_data"].get("ngo_darpan"), "TN/2021/0192834")

    def test_campaign_metrics(self):
        event_data = {"volunteers_required": 20, "status": "EVENT_IN_PROGRESS"}
        registrations = [{"status": "CONFIRMED"} for _ in range(16)]
        tasks = [
            {"status": "COMPLETED"},
            {"status": "COMPLETED"},
            {"status": "IN_PROGRESS"},
            {"status": "OPEN"}
        ]
        attendance = [{"status": "PRESENT"} for _ in range(15)] + [{"status": "ABSENT"}]

        metrics = self.campaign_analyzer.analyze_campaign(event_data, registrations, tasks, attendance)
        self.assertGreaterEqual(metrics["campaign_completion_percentage"], 50.0)
        self.assertEqual(metrics["volunteers_confirmed"], 16)
        self.assertEqual(metrics["health_status"], "HEALTHY")


if __name__ == "__main__":
    unittest.main()

