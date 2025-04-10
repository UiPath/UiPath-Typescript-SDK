from typing import Dict
import logging
from azure.monitor.query import LogsQueryClient
from azure.identity import DefaultAzureCredential
from datetime import timedelta
import json
from holmes.core.tools import (
    Tool,
    ToolParameter,
    Toolset,
    ToolsetTag,
)

def check_azure_auth():
    try:
        credential = DefaultAzureCredential()
        # Try to get a token to verify authentication
        credential.get_token("https://monitor.azure.com/.default")
        return True
    except Exception as e:
        logging.error(f"Azure authentication check failed: {str(e)}")
        return False

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
            query = self._optimize_query(params["query"])
            resource_id = params["resource_id"]
            timespan_days = 100

            try:
                credential = DefaultAzureCredential()
                client = LogsQueryClient(credential)
            except Exception as auth_error:
                error_msg = f"Failed to authenticate with Azure: {str(auth_error)}"
                logging.error(error_msg)
                return error_msg

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
                # 
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

    def _optimize_query(self, query: str) -> str:
        """Optimize the query to return fewer columns and rows"""
        # Don't convert the whole query to lowercase, only for comparison
        query = query.strip()
        query_lower = query.lower()
        
        # Common essential fields for each table type - maintain proper casing
        TABLE_ESSENTIAL_FIELDS = {
            "traces": ["timestamp", "operation_Id", "operation_ParentId", "message", "severityLevel"],
            "requests": ["timestamp", "operation_Id", "operation_ParentId", "name", "success", "duration"],
            "exceptions": ["timestamp", "operation_Id", "operation_ParentId", "type", "message", "outerMessage"],
            "customEvents": ["timestamp", "operation_Id", "operation_ParentId", "name"],
            "dependencies": ["timestamp", "operation_Id", "operation_ParentId", "name", "type", "success"],
            "pageViews": ["timestamp", "operation_Id", "operation_ParentId", "name", "duration"],
            "customMetrics": ["timestamp", "operation_Id", "operation_ParentId", "name", "value"]
        }
        
        # Special handling for 'union *'
        if "union *" in query_lower:
            tables_query = []
            for table_name, fields in TABLE_ESSENTIAL_FIELDS.items():
                table_query = f"({table_name} | project {', '.join(fields)})"
                tables_query.append(table_query)
            
            conditions = query.split("union *")[1].strip()
            query = f"""union {','.join(tables_query)} {conditions}"""
            return query
        
        # Handle queries with explicit table references
        for table_name in TABLE_ESSENTIAL_FIELDS.keys():
            if table_name.lower() in query_lower:
                if "project" not in query_lower:
                    fields = TABLE_ESSENTIAL_FIELDS[table_name]
                    query = f"{query} | project {', '.join(fields)}"
                    break
        
        # Handle regular union queries
        if "union" in query_lower and "union *" not in query_lower:
            parts = query.split("union")
            new_parts = []
            for part in parts:
                part = part.strip()
                if part:
                    for table_name in TABLE_ESSENTIAL_FIELDS.keys():
                        if table_name.lower() in part.lower():
                            if "project" not in part.lower():
                                part = f"({part} | project {', '.join(TABLE_ESSENTIAL_FIELDS[table_name])})"
                            break
                    new_parts.append(part)
            query = "\nunion\n".join(new_parts)

        # if "top" not in query_lower:
        #     query = f"{query} | top 200 by timestamp desc"
        
        return query

class AppInsightsV2Toolset(Toolset):
    def __init__(self):
        super().__init__(
            name="azure/appinsights_v2",
            description="Execute KQL queries against Azure Application Insights",
            docs_url="https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-query-overview",
            icon_url="https://raw.githubusercontent.com/Azure/azure-docs-powershell-samples/master/app-insights.png",
            prerequisites=[
                # CallablePrerequisite(
                #     name="azure_auth",
                #     description="Azure authentication must be configured",
                #     check_func=check_azure_auth
                # )
            ],
            tools=[
                ExecuteKQLQueryV2(),
            ],
            tags=[ToolsetTag.CORE],
            enabled=True,
        )