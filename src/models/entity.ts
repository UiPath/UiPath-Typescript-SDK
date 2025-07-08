/**
 * Response from entity queries including pagination information
 */
export interface QueryResponse {
  /** The JSON string containing the entity data */
  jsonValue: string;
  /** Total number of records matching the query (before pagination) */
  totalRecordCount: number;
}

/**
 * Pagination options for entity queries
 */
export interface PaginationOptions {
  /** Number of records to skip (for pagination) */
  skip?: number;
  /** Maximum number of records to return */
  top?: number;
}

/**
 * Request parameters for querying entities
 */
export interface EntityDataQueryRequest extends PaginationOptions {
  /** OData filter expression */
  filter?: string;
  /** Properties to order by (e.g. ["name asc", "age desc"]) */
  orderBy?: string[];
  /** Properties to include in the response */
  select?: string[];
  /** Whether to include total count in response */
  count?: boolean;
} 