"""
Campaign Health, Risk, and Bottleneck Analytics for ImpactLink.
Provides deterministic statistical metrics and completion risk indicators.
"""

from typing import Dict, Any, List


class CampaignAnalyzer:
    def analyze_campaign(
        self,
        event_data: Dict[str, Any],
        registrations: List[Dict[str, Any]],
        tasks: List[Dict[str, Any]],
        attendance: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        volunteers_required = max(1, int(event_data.get("volunteers_required", 10)))
        total_registered = len(registrations)
        confirmed_count = sum(1 for r in registrations if r.get("status") == "CONFIRMED")
        attended_count = sum(1 for a in attendance if a.get("status") in ("PRESENT", "LATE", "MANUALLY_VERIFIED"))
        absent_count = sum(1 for a in attendance if a.get("status") == "ABSENT")

        total_tasks = len(tasks)
        completed_tasks = sum(1 for t in tasks if t.get("status") == "COMPLETED")
        in_progress_tasks = sum(1 for t in tasks if t.get("status") in ("ASSIGNED", "IN_PROGRESS", "SUBMITTED"))

        # Registration fulfillment ratio
        fulfillment_rate = min(1.0, confirmed_count / volunteers_required)

        # Task completion ratio
        task_completion_rate = (completed_tasks / total_tasks) if total_tasks > 0 else 0.0

        # Bottlenecks and Risk Assessment
        risk_indicators: List[str] = []
        action_recommendations: List[str] = []

        if confirmed_count < volunteers_required * 0.5:
            risk_indicators.append("HIGH_VOLUNTEER_DEFICIT: Confirmed volunteers below 50% target.")
            action_recommendations.append("Trigger AI matching broadcast to suitable nearby volunteers.")

        if total_tasks > 0 and (completed_tasks + in_progress_tasks) < total_tasks * 0.4:
            risk_indicators.append("TASK_STAGNATION: Over 60% tasks unassigned or pending.")
            action_recommendations.append("Assign open tasks to confirmed volunteers or team leaders.")

        if attended_count > 0 and absent_count > (attended_count * 0.3):
            risk_indicators.append("UNUSUAL_ABSENTEEISM: High no-show rate detected.")
            action_recommendations.append("Follow up with absent volunteers; record attendance discrepancy.")

        # Overall Campaign Completion Percentage (Deterministic formula)
        if event_data.get("status") == "COMPLETED":
            completion_percentage = 100.0
        else:
            weight_volunteers = 0.40
            weight_tasks = 0.60
            completion_percentage = round(
                (fulfillment_rate * weight_volunteers + task_completion_rate * weight_tasks) * 100.0,
                1
            )

        return {
            "volunteers_required": volunteers_required,
            "volunteers_registered": total_registered,
            "volunteers_confirmed": confirmed_count,
            "volunteers_attended": attended_count,
            "volunteers_absent": absent_count,
            "tasks_total": total_tasks,
            "tasks_completed": completed_tasks,
            "tasks_in_progress": in_progress_tasks,
            "campaign_completion_percentage": completion_percentage,
            "fulfillment_rate": round(fulfillment_rate * 100.0, 1),
            "task_completion_rate": round(task_completion_rate * 100.0, 1),
            "risk_indicators": risk_indicators,
            "action_recommendations": action_recommendations,
            "health_status": "CRITICAL" if len(risk_indicators) >= 2 else ("MODERATE" if risk_indicators else "HEALTHY")
        }

