import { EntityDataQueryRequest, QueryResponse, PaginationOptions } from '../models/entity';
import { BaseService } from './baseService';

export interface EntityOptions extends PaginationOptions {
  /** Level of related entity expansion */
  expansionLevel?: number;
}

export class EntityService extends BaseService {
  private static readonly BASE_PATH = 'dataservice_/api/EntityService';

  /**
   * Get a single entity by ID
   * @param id - ID of the entity
   * @param options - Additional options like expansionLevel
   * @returns Promise<QueryResponse>
   */
  async getById(
    id: string,
    options: EntityOptions = {}
  ): Promise<QueryResponse> {
    const { expansionLevel = 0 } = options;
    const queryParams = new URLSearchParams();
    
    if (expansionLevel > 0) {
      queryParams.append('expansionLevel', expansionLevel.toString());
    }

    const url = `${EntityService.BASE_PATH}/entity/${id}/query_expansion${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await this.request<QueryResponse>('POST', url, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  }

  /**
   * Get a single entity by name
   * @param name - Name of the entity
   * @param options - Additional options like expansionLevel
   * @returns Promise<QueryResponse>
   */
  async getByName(
    name: string,
    options: EntityOptions = {}
  ): Promise<QueryResponse> {
    const { expansionLevel = 0 } = options;
    const queryParams = new URLSearchParams();
    
    if (expansionLevel > 0) {
      queryParams.append('expansionLevel', expansionLevel.toString());
    }

    const url = `${EntityService.BASE_PATH}/${name}/read${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await this.request<QueryResponse>('GET', url, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  }

  /**
   * List multiple entities with pagination
   * @param name - Name of the entity type to list
   * @param options - Query options including pagination (skip/top) and expansionLevel
   * @returns Promise<QueryResponse> - Response includes totalRecordCount for pagination
   * @example
   * // Get first page (10 items)
   * const page1 = await entityService.list("Users", { skip: 0, top: 10 });
   * 
   * // Get second page (next 10 items)
   * const page2 = await entityService.list("Users", { skip: 10, top: 10 });
   */
  async list(
    name: string,
    options: EntityOptions = {}
  ): Promise<QueryResponse> {
    const { skip, top, expansionLevel = 0 } = options;
    const queryParams = new URLSearchParams();

    if (typeof skip !== 'undefined') {
      queryParams.append('start', skip.toString());
    }
    if (typeof top !== 'undefined') {
      queryParams.append('limit', top.toString());
    }
    if (expansionLevel > 0) {
      queryParams.append('expansionLevel', expansionLevel.toString());
    }

    const url = `${EntityService.BASE_PATH}/${name}/read${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await this.request<QueryResponse>('GET', url);
    return response.data;
  }

  /**
   * Query entities by ID with advanced filtering and pagination
   * @param id - ID of the entity type
   * @param query - Query parameters including filtering, ordering, pagination (skip/top)
   * @param options - Additional options like expansionLevel
   * @returns Promise<QueryResponse> - Response includes totalRecordCount for pagination
   * @example
   * // Query with pagination and filtering
   * const result = await entityService.queryById("12345", {
   *   filter: "age gt 18",
   *   orderBy: ["name asc"],
   *   skip: 0,
   *   top: 10
   * });
   */
  async queryById(
    id: string,
    query: EntityDataQueryRequest,
    options: EntityOptions = {}
  ): Promise<QueryResponse> {
    const { expansionLevel = 0 } = options;
    const queryParams = new URLSearchParams();
    
    if (expansionLevel > 0) {
      queryParams.append('expansionLevel', expansionLevel.toString());
    }

    const url = `${EntityService.BASE_PATH}/entity/${id}/query_expansion${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await this.request<QueryResponse>('POST', url, {
      data: query,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  }

  /**
   * Query entities by name with advanced filtering and pagination
   * @param name - Name of the entity type
   * @param query - Query parameters including filtering, ordering, pagination (skip/top)
   * @param options - Additional options like expansionLevel
   * @returns Promise<QueryResponse> - Response includes totalRecordCount for pagination
   * @example
   * // Query with pagination and filtering
   * const result = await entityService.queryByName("Users", {
   *   filter: "age gt 18",
   *   orderBy: ["name asc"],
   *   skip: 0,
   *   top: 10
   * });
   */
  async queryByName(
    name: string,
    query: EntityDataQueryRequest,
    options: EntityOptions = {}
  ): Promise<QueryResponse> {
    const { expansionLevel = 0 } = options;
    const queryParams = new URLSearchParams();
    
    if (expansionLevel > 0) {
      queryParams.append('expansionLevel', expansionLevel.toString());
    }

    const url = `${EntityService.BASE_PATH}/${name}/query_expansion${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await this.request<QueryResponse>('POST', url, {
      data: query,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  }

  /**
   * Insert a new entity
   * @param name - Name of the entity type to insert into
   * @param data - The entity data to insert
   * @param options - Additional options like expansionLevel
   * @returns Promise<Record<string, any>> - The inserted entity data
   */
  async insert(
    name: string,
    data: Record<string, any>,
    options: EntityOptions = {}
  ): Promise<Record<string, any>> {
    const { expansionLevel = 0 } = options;
    const queryParams = new URLSearchParams();
    
    if (expansionLevel > 0) {
      queryParams.append('expansionLevel', expansionLevel.toString());
    }

    const url = `${EntityService.BASE_PATH}/${name}/insert${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await this.request<Record<string, any>>('POST', url, {
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  }
} 
