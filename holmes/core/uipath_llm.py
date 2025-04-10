from typing import Any, Dict, List, Optional, Type, Union

import litellm
from holmes.core.llm import LLM
from holmes.core.tool_calling_llm import ToolCallingLLM
from litellm import ModelResponse
from pydantic import BaseModel
import requests
import json
import logging
import os

from holmes.core.tools import Tool

class UiPathResponse(BaseModel):
    id: str
    model: str
    object: str
    created: int
    choices: List[Dict[str, Any]]
    usage: Dict[str, int]

class UiPathCustomLLM(LLM):
    def __init__(self, api_key: str):
        self.model = "anthropic.claude-3-5-sonnet-20241022-v2:0"
        self.api_key = api_key
        self.base_url = os.getenv("UIPATH_LLM_BASE_URL")

    def check_llm(self, model: str, api_key: Optional[str]):
        if not api_key:
            raise Exception("API key is required for UiPath LLM")
        if not self.base_url:
            raise Exception("UIPATH_BASE_URL is required")
        return True

    def get_context_window_size(self) -> int:
        return 200000

    def get_maximum_output_token(self) -> int:
        return 8192

    def count_tokens_for_message(self, messages: list[dict], tools: Optional[List[Tool]] = []) -> int:
        # return sum(len(str(msg.get("content", ""))) // 4 for msg in messages)
        return litellm.token_counter("bedrock/anthropic.claude-3-5-sonnet-20241022-v2:0", messages=messages)  
         

    def completion(
        self,
        messages: List[Dict[str, Any]],
        tools: Optional[List[Any]] = [],
        tool_choice: Optional[Union[str, dict]] = None,
        response_format: Optional[Union[dict, Type[BaseModel]]] = None,
        temperature: Optional[float] = None,
        drop_params: Optional[bool] = None,
    ) -> Any:
        try:
            headers = {
                'X-UIPATH-STREAMING-ENABLED': 'false',
                'X-UiPath-LlmGateway-RequestingProduct': 'testproduct',
                'X-UiPath-LlmGateway-TimeoutSeconds': '60',
                'X-UiPath-LlmGateway-RequestingFeature': 'testfeature',
                'X-UiPath-LlmGateway-NormalizedApi-ModelName': self.model,
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.api_key}'
            }

            # Prepare the normalized request payload
            payload = {
                "messages": messages,
                "max_tokens": 1000,
                "n": 1,
                "topP": 1,
                "temperature": temperature or 0,
                "frequency_penalty": 0,
                "presence_penalty": 0
            }

            # Only include tools if they are provided
            if tools:
                payload["tools"] = tools
                if tool_choice:
                    payload["tool_choice"] = tool_choice

            logging.debug(f"Sending request to UiPath LLM: {json.dumps(payload, indent=2)}")
            logging.debug(f"----payload: {payload}")
            
            response = requests.post(
                self.base_url,
                headers=headers,
                json=payload
            )
            
            if response.status_code != 200:
                logging.error(f"API request failed with status {response.status_code}: {response.text}")
                raise Exception(f"API request failed: {response.text}")

            response_data = response.json()
            logging.debug(f"UiPath LLM response: {response_data}")
            
            # Use our custom response object

            return UiPathResponse(
                id=response_data.get("id", ""),
                model=response_data.get("model", ""),
                object=response_data.get("object", ""),
                created=response_data.get("created", 0),
                choices=[
                    {
                        "finish_reason": choice.get("finish_reason", "stop"),
                        "index": choice.get("index", 0),
                        "message": {
                            "role": choice["message"].get("role", "assistant"),
                            "content": choice["message"].get("content", ""),
                            **({"tool_calls": [
                                {
                                    "id": tool_call["id"],
                                    "arguments": tool_call["arguments"],
                                    "name": tool_call["name"]
                                }
                                for tool_call in choice["message"]["tool_calls"]
                            ]} if "tool_calls" in choice["message"] else {})
                        },
                    }
                    for choice in response_data.get("choices", [])
                ],
                usage=response_data.get("usage", {
                    "prompt_tokens": 0,
                    "completion_tokens": 0,
                    "total_tokens": 0,
                }),
            )

        except Exception as e:
            logging.error(f"Error in UiPath LLM completion: {str(e)}")
            raise
# for testing
def ask_holmes():
    api_key = ""  # Replace with API key
    prompt = "what pods are unhealthy in my cluster?"

    system_prompt = "You are an AI assistant helping with Kubernetes clusters."
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt}
    ]

    ai = UiPathCustomLLM(api_key)
    response = ai.completion(messages=messages)
    print(response.model_dump())

if __name__ == "__main__":
    ask_holmes()