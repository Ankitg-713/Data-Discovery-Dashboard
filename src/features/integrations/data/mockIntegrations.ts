import { Integration } from "../types/integration.types";
import { 
  SiSlack, 
  SiPagerduty, 
  SiOpsgenie,
  SiGmail 
} from "react-icons/si";
import { FaMicrosoft } from "react-icons/fa";

export const mockIntegrations: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    description: "Send real-time alerts to Slack channels when sensitive data is detected",
    icon: SiSlack,
    status: "disconnected",
    category: "messaging",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Get instant notifications in Microsoft Teams channels for security events",
    icon: FaMicrosoft,
    status: "disconnected",
    category: "messaging",
  },
  {
    id: "pagerduty",
    name: "PagerDuty",
    description: "Trigger PagerDuty incidents for critical data security alerts",
    icon: SiPagerduty,
    status: "disconnected",
    category: "incident",
  },
  {
    id: "opsgenie",
    name: "Opsgenie",
    description: "Create Opsgenie alerts for high-priority data discovery events",
    icon: SiOpsgenie,
    status: "disconnected",
    category: "incident",
  },
  {
    id: "email",
    name: "Gmail",
    description: "Send email notifications via Gmail for alerts and daily summaries",
    icon: SiGmail,
    status: "disconnected",
    category: "email",
  },
];
