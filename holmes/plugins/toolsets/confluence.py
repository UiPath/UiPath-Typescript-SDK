import json
import re
from typing import Dict, Optional
import requests
from bs4 import BeautifulSoup
from holmes.common.env_vars import UIPATH_BASE_URL, UIPATH_TOKEN
from holmes.core.tools import (
    Tool,
    ToolParameter,
    Toolset,
    ToolsetTag,
)

def parse_confluence_content(html_content: str, base_data: dict = None) -> str:
    """Parse the HTML content from Confluence and convert to readable text."""
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Get base URL for constructing full links
    base_url = base_data.get('_links', {}).get('baseUrl', '') if base_data else ''
    
    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()
        
    # Convert specific Confluence macros/elements
    # Convert code blocks
    for code_block in soup.find_all('ac:structured-macro', {'ac:name': 'code'}):
        code_text = code_block.find('ac:plain-text-body')
        if code_text:
            code_text.replace_with(f"\n```\n{code_text.text}\n```\n")
    
    # Convert images to text representation
    for img in soup.find_all('ac:image'):
        alt = img.get('ac:alt', 'image')
        img.replace_with(f"[{alt}]")
    
    # Preserve Confluence ac:link elements
    for ac_link in soup.find_all('ac:link'):
        link_body = ac_link.find('ac:link-body')
        page_ref = ac_link.find('ri:page')
        
        if link_body and page_ref:
            title = page_ref.get('ri:content-title', '')
            text = link_body.get_text()
            # Construct the full URL using the base URL and page title
            page_url = f"{base_url}/display/spaces/{title.replace(' ', '+')}"
            ac_link.replace_with(f"[{text}]({page_url})")
    
    # Get text and clean up
    text = soup.get_text()
    
    # Remove multiple newlines
    text = re.sub(r'\n\s*\n', '\n\n', text)
    
    return text.strip()

class FetchConfluencePage(Tool):
    def __init__(self):
        super().__init__(
            name="fetch_confluence_page",
            description="Fetch Confluence page content by page ID",
            parameters={
                "page_id": ToolParameter(
                    description="The Confluence page ID to fetch",
                    type="string",
                    required=True,
                ),
            },
        )

    def _invoke(self, params: Dict) -> str:
        base_url = UIPATH_BASE_URL
        auth_token = UIPATH_TOKEN

        # Get page ID from parameters
        page_id = params.get("page_id")
        
        if not page_id:
            return "Error: page_id is required"

        headers = {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json"
        }

        try:
            response = requests.get(
                f"{base_url}/pages?id={page_id}",
                headers=headers
            )
            response.raise_for_status()
            
            # Parse response
            data = response.json()
            if not data or not isinstance(data, list) or len(data) == 0:
                return f"No page found for ID: {page_id}"

            page = data[0]
            html_content = page.get("body", {}).get("storage", {}).get("value", "")
            title = page.get("title", "")
            
            # Parse the HTML content with the full page data
            parsed_content = parse_confluence_content(html_content, page)
            
            result = {
                "title": title,
                "content": parsed_content
            }
            return json.dumps(result, indent=2)

        except requests.exceptions.RequestException as e:
            return f"Error fetching Confluence page: {str(e)}"
        except Exception as e:
            return f"Error processing Confluence page: {str(e)}"

    def get_parameterized_one_liner(self, params: Dict) -> str:
        page_id = params.get("page_id", "unknown")
        return f"Fetched Confluence page {page_id}"

class ConfluenceToolset(Toolset):
    def __init__(self):
        super().__init__(
            name="confluence/parser",
            description="Tools for fetching and parsing Confluence pages",
            docs_url="",
            icon_url="https://wac-cdn.atlassian.com/assets/img/favicons/confluence/favicon-32x32.png",
            prerequisites=[],
            tools=[
                FetchConfluencePage(),
            ],
            tags=[ToolsetTag.CORE],
            enabled=True,
        )
