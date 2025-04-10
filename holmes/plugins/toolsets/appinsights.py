from typing import Dict
import logging
from azure.monitor.query import LogsQueryClient
from azure.identity import ClientSecretCredential
from datetime import timedelta
import json
from holmes.common.env_vars import AZURE_APP_CLIENT_ID, AZURE_APP_CLIENT_SECRET, AZURE_APP_TENANT_ID
from holmes.core.tools import (
    Tool,
    ToolParameter,
    Toolset,
    ToolsetTag,
)

class ExecuteKQLQueryV2(Tool):
    def __init__(self):
        super().__init__(
            name="execute_kql_query_v2",
            description="Execute a KQL query against Application Insights using Azure SDK",
            parameters={
                "query": ToolParameter(
                    description="The KQL query to execute",
                    type="string",
                    required=True,
                ),
                "resource_id": ToolParameter(
                    description="The resource ID of the Application Insights instance",
                    type="string",
                    required=True,
                ),
            },
        )

    def _invoke(self, params: Dict) -> str:
        try:
            query = params["query"]
            resource_id = params["resource_id"]
            timespan_days = 100

            # Create credential using service principal
            credential = ClientSecretCredential(
            tenant_id=AZURE_APP_TENANT_ID,
            client_id=AZURE_APP_CLIENT_ID,
            client_secret=AZURE_APP_CLIENT_SECRET
            )
            
            client = LogsQueryClient(credential)

            # Execute the query
            response = client.query_resource(
                resource_id=resource_id,
                query=query,
                timespan=timedelta(days=timespan_days)
            )


            # Parse and format the response
            if response.tables:
                results = []
                table = response.tables[0]  # Get the first table
                column_names = [column for column in table.columns]
                
                for row in table.rows:
                    result = {}
                    for i, value in enumerate(row):
                        # Convert datetime objects to ISO format strings
                        if hasattr(value, 'isoformat'):
                            value = value.isoformat()
                        result[column_names[i]] = value
                    results.append(result)
                
                return json.dumps(results, indent=2)
            else:
                return "No data returned from query"

        

        except Exception as e:
            error_msg = f"Error executing KQL query: {str(e)}"
            logging.error(error_msg)
            return error_msg

    def get_parameterized_one_liner(self, params: Dict) -> str:
        return f"Executed KQL query against Application Insights using resource ID {params.get('resource_id', 'unknown')}"

class AppInsightsV2Toolset(Toolset):
    def __init__(self):
        super().__init__(
            name="azure/appinsights_v2",
            description="Execute KQL queries against Azure Application Insights",
            docs_url="https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-query-overview",
            icon_url="https://raw.githubusercontent.com/Azure/azure-docs-powershell-samples/master/app-insights.png",
            prerequisites=[],
            tools=[
                ExecuteKQLQueryV2(),
            ],
            tags=[ToolsetTag.CORE],
            enabled=True,
        )