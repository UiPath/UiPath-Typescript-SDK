from typing import Dict
import pyodbc
import json
import logging
from azure.identity import ClientSecretCredential
from azure.keyvault.secrets import SecretClient
from holmes.common.env_vars import AZURE_APP_TENANT_ID, AZURE_APP_CLIENT_ID, AZURE_APP_CLIENT_SECRET
from holmes.core.tools import (
    Tool,
    ToolParameter,
    Toolset,
    ToolsetTag,
)
import os

class FetchKeyVaultSecret(Tool):
    def __init__(self):
        super().__init__(
            name="fetch_keyvault_secret",
            description="Fetch a secret from Azure Key Vault",
            parameters={
                "keyvault_url": ToolParameter(
                    description="Azure Key Vault URL (e.g., 'https://myvault.vault.azure.net/')",
                    type="string",
                    required=True,
                ),
                "secret_name": ToolParameter(
                    description="Name of the secret to fetch",
                    type="string",
                    required=True,
                ),
            },
        )

    def _invoke(self, params: Dict) -> str:
        try:
            tenant_id = AZURE_APP_TENANT_ID
            client_id = AZURE_APP_CLIENT_ID
            client_secret = AZURE_APP_CLIENT_SECRET

            credential = ClientSecretCredential(
                tenant_id=tenant_id,
                client_id=client_id,
                client_secret=client_secret,
                logging_enable=True
            )

            secret_client = SecretClient(
                vault_url=params['keyvault_url'],
                credential=credential
            )

            # Fetch the secret
            secret = secret_client.get_secret(params['secret_name'])
            return secret.value

        except Exception as e:
            error_msg = f"Error fetching secret from Key Vault: {str(e)}"
            logging.error(error_msg)
            return error_msg

    def get_parameterized_one_liner(self, params: Dict) -> str:
        return f"Fetched secret '{params.get('secret_name')}' from Key Vault: {params.get('keyvault_url')}"

class ExecuteAzureSQLQuery(Tool):
    def __init__(self):
        super().__init__(
            name="execute_azure_sql_query",
            description="Execute a SQL query against an Azure SQL database using connection string",
            parameters={
                "query": ToolParameter(
                    description="The SQL query to execute",
                    type="string",
                    required=True,
                ),
                "connection_string": ToolParameter(
                    description="Complete connection string for the database",
                    type="string",
                    required=True,
                ),
            },
        )

    def _invoke(self, params: Dict) -> str:
        try:
            # List available drivers and find SQL Server driver
            drivers = [driver for driver in pyodbc.drivers() if 'SQL Server' in driver]
            if not drivers:
                raise Exception("No SQL Server Driver found. Please install the ODBC Driver for SQL Server")
            
            driver = drivers[0]  # Use the first available SQL Server driver
            print(f"Using driver: {driver}")

            # Clean and format connection string
            conn_str = params['connection_string'].strip()  # Remove any whitespace/newlines
            
            # Split the connection string into individual parameters and clean them
            conn_parts = [part.strip() for part in conn_str.split(';') if part.strip()]
            
            # Create a dictionary of connection parameters
            conn_dict = {}
            for part in conn_parts:
                if '=' in part:
                    key, value = part.split('=', 1)
                    conn_dict[key.strip()] = value.strip()
            
            # Update parameter names for ODBC compatibility
            mapping = {
                'User Id': 'UID',
                'Password': 'PWD',
                'Encrypt': 'Encryption',
                'Initial Catalog': 'Database',
            }
            
            for old_key, new_key in mapping.items():
                if old_key in conn_dict:
                    conn_dict[new_key] = conn_dict.pop(old_key)
            
            # Set specific values
            conn_dict['Driver'] = driver
            conn_dict['Encryption'] = 'yes'
            conn_dict['TrustServerCertificate'] = 'no'
            conn_dict['Authentication'] = 'SqlPassword'
            conn_dict['Trusted_Connection'] = 'no'
            
            # Rebuild connection string
            conn_str = ';'.join(f"{k}={v}" for k, v in conn_dict.items())

            conn = pyodbc.connect(conn_str)
            cursor = conn.cursor()
            
            # Execute the query
            cursor.execute(params["query"])
            
            # Fetch column names
            columns = [column[0] for column in cursor.description]
            
            # Fetch all rows
            rows = cursor.fetchall()
            
            results = []
            for row in rows:
                result = {}
                for i, column in enumerate(columns):
                    value = str(row[i]) if row[i] is not None else None
                    result[column] = value
                results.append(result)

            # Close connections
            cursor.close()
            conn.close()

            return json.dumps(results, indent=2)

        except Exception as e:
            error_msg = f"Error executing SQL query: {str(e)}"
            logging.error(error_msg)
            return error_msg

    def get_parameterized_one_liner(self, params: Dict) -> str:
        return f"Executed SQL query against Azure SQL database: {params.get('database')}"

class AzureSQLQueryToolset(Toolset):
    def __init__(self):
        super().__init__(
            name="database/azure_sqlquery",
            description="Execute SQL DB queries against Azure SQL databases with connection string from KeyVault",
            docs_url="https://learn.microsoft.com/en-us/azure/azure-sql/database/connect-query-python",
            icon_url="",
            prerequisites=[],
            tools=[
                FetchKeyVaultSecret(),
                ExecuteAzureSQLQuery(),
            ],
            tags=[ToolsetTag.CORE],
            enabled=True,
        )

if __name__ == "__main__":
    keyvault_tool = FetchKeyVaultSecret()
    
    keyvault_params = {
        "keyvault_url": "https://plt-stg-config-kv.vault.azure.net/",
        "secret_name": "GWS-Database--ConnectionStrings--GlobalWorkflowServiceDbContext"
    }
    
    try:
        connection_string = keyvault_tool._invoke(keyvault_params)
        sql_tool = ExecuteAzureSQLQuery()
        
        # Parameters for SQL query using the fetched connection string
        query_params = {
            "query": "SELECT NAME FROM sys.tables",
            "connection_string": connection_string
        }
        
        print("Executing SQL query...")
        result = sql_tool._invoke(query_params)
        print("\nQuery Results:")
        print(result)
    except Exception as e:
        print(f"Error during testing: {str(e)}")
