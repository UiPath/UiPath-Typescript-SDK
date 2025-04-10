import json
import re
from typing import Dict, Optional
import requests
from holmes.common.env_vars import UIPATH_BASE_URL, UIPATH_TOKEN
from holmes.core.tools import (
    Tool,
    ToolParameter,
    Toolset,
    ToolsetTag,
)

def extract_alert_details(description: str) -> Optional[Dict]:
    """Extract the alert details JSON block from the description."""
    # Find content between {code} tags that contains alert details
    match = re.search(r'\{code\}(.*?)\{code\}', description, re.DOTALL)
    if not match:
        return None
    
    try:
        # Parse the JSON content
        alert_json = json.loads(match.group(1))
        return alert_json
    except json.JSONDecodeError:
        return None

def extract_runbook_confluence_page_id(description: str) -> Optional[str]:
    """Extract the runbook link and page ID from the description."""
    match = re.search(r'\[Runbook link\|(.*?)\]', description)
    if match:
        url = match.group(1)
        # Extract page ID from URL
        page_id_match = re.search(r'/pages/(\d+)/', url)
        if page_id_match:
            return page_id_match.group(1)
    return None

class FetchJiraDetails(Tool):
    def __init__(self):
        super().__init__(
            name="fetch_jira_details",
            description="Fetch Jira issue details including title, configurationItems (resource IDs). Use this first to get resource IDs for investigate jira issue.",
            parameters={
                "issue_id": ToolParameter(
                    description="The Jira issue ID to fetch (e.g., SRE-356493)",
                    type="string",
                    required=True,
                ),
            },
        )

    def _invoke(self, params: Dict) -> str:
        # Hardcoded values
        base_url = UIPATH_BASE_URL
        auth_token = UIPATH_TOKEN

        # Get issue ID from parameters
        issue_id = params.get("issue_id")
        if not issue_id:
            return "Error: issue_id is required"

        headers = {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json"
        }

        try:
            response = requests.get(
                f"{base_url}/issue?jql=issue%20%3D%22{issue_id}%22",
                headers=headers
            )
            response.raise_for_status()
            
            # Parse response
            data = response.json()
            if not data or not isinstance(data, list) or len(data) == 0:
                return f"No issue found for ID: {issue_id}"

            issue = data[0]
            description = issue.get("fields", {}).get("description", "")
            # summary = issue.get("fields", {}).get("summary", "")
            
            # Extract alert details and runbook link
            alert_details = extract_alert_details(description)
            confluence_page_id = extract_runbook_confluence_page_id(description)
            
            result = {
                # "title": summary,
                "resourceId": alert_details.get("essentials", {}).get("configurationItems", [""])[0] if alert_details and alert_details.get("essentials", {}).get("configurationItems") else None,
                "alert_timestamp": alert_details.get("essentials", {}).get("firedDateTime") if alert_details else None,
                "runbook_confluence_page_id": confluence_page_id
            }
            
            return json.dumps(result, indent=2)

        except requests.exceptions.RequestException as e:
            return f"Error fetching Jira issue: {str(e)}"
        except Exception as e:
            return f"Error processing Jira data: {str(e)}"

    def get_parameterized_one_liner(self, params: Dict) -> str:
        issue_id = params.get("issue_id", "unknown")
        return f"Fetched Jira issue {issue_id} details"

class AddJiraComment(Tool):
    def __init__(self):
        super().__init__(
            name="add_jira_comment",
            description="Add a comment to a Jira issue",
            parameters={
                "issue_id": ToolParameter(
                    description="The Jira issue ID to comment on (e.g., PLT-79830)",
                    type="string",
                    required=True,
                ),
                "comment": ToolParameter(
                    description="The comment text to add",
                    type="string",
                    required=True,
                ),
            },
        )

    def _invoke(self, params: Dict) -> str:
        base_url = UIPATH_BASE_URL
        auth_token = UIPATH_TOKEN

        # Get parameters
        issue_id = params.get("issue_id")
        comment = params.get("comment")
        
        # Clean up the comment formatting
        # Remove multiple empty lines and normalize spacing
        comment = re.sub(r'\n\s*\n\s*\n+', '\n\n', comment.strip())
        
        # Convert markdown code blocks to Jira code blocks
        comment = re.sub(r'`([^`]+)`', '{code}\\1{code}', comment)
        
        # Convert markdown bold to Jira bold
        comment = re.sub(r'\*\*([^*]+)\*\*', '*\\1*', comment)
        
        # Convert markdown headings to Jira headings
        comment = re.sub(r'^#{1,6}\s+(.*?)$', 'h2. \\1', comment, flags=re.MULTILINE)  # Handles all heading levels
        
        # Convert bullet points
        comment = re.sub(r'^\*\s+', '* ', comment, flags=re.MULTILINE)
        
        # Format numbered lists - handle up to 3 levels of nesting
        comment = re.sub(r'^\s*(\d+)\.\s+', '# ', comment, flags=re.MULTILINE)  # First level
        comment = re.sub(r'^\s*[a-z]\.\s+', '## ', comment, flags=re.MULTILINE)  # Second level
        comment = re.sub(r'^\s*[i]+\.\s+', '### ', comment, flags=re.MULTILINE)  # Third level
        
        # Add extra newline before headings for better readability
        comment = re.sub(r'\n(h2\. )', '\n\n\\1', comment)

        if not issue_id or not comment:
            return "Error: Both issue_id and comment are required"

        headers = {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(
                f"{base_url}/issue/{issue_id}/comment?issueIdOrKey={issue_id}",
                headers=headers,
                json={"body": comment}
            )
            response.raise_for_status()
            
            return f"Successfully added comment to {issue_id}"

        except requests.exceptions.RequestException as e:
            return f"Error adding comment to Jira issue: {str(e)}"
        except Exception as e:
            return f"Error: {str(e)}"

    def get_parameterized_one_liner(self, params: Dict) -> str:
        issue_id = params.get("issue_id", "unknown")
        return f"Added comment to Jira issue {issue_id}"

class JiraParserToolset(Toolset):
    def __init__(self):
        super().__init__(
            name="jira/parser",
            description="Tools for parsing Jira issues and extracting specific information",
            docs_url="",
            icon_url="https://cdn.worldvectorlogo.com/logos/jira-1.svg",
            prerequisites=[],
            tools=[
                FetchJiraDetails(),
                AddJiraComment(),
            ],
            tags=[ToolsetTag.CORE],
            enabled=True,
        )