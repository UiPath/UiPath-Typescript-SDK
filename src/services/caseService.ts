import { Config } from "../config";
import { ExecutionContext } from "../executionContext";
import { BaseService } from "./baseService";
import { EntityService } from "./entityService";
import {
  QueryResponse,
  PaginationOptions,
  EntityDataQueryRequest,
} from "../models/entity";
import { CaseDefinitionOptions } from "../models/case";

export interface CaseOptions extends PaginationOptions {
  /** Level of related entity expansion */
  expansionLevel?: number;
}

class CaseDefinitionOperations {
  private static readonly DEFAULT_SELECTED_FIELDS = [
    "Id",
    "Name",
    "CaseVersion",
    "SlaHours",
    "Prefix",
    "UpdateTime",
    "CreateTime",
    "KmsKeyId",
  ];

  constructor(
    private readonly entityService: EntityService,
    private readonly definitionName: string
  ) {}

  /**
   * Get active cases for this case definition
   * @param options - Query options for customizing the response
   * @returns Promise<QueryResponse>
   * @example
   * // Get active cases for "Auto Loan Application"
   * const activeCases = await caseService.definition("Auto Loan Application").getActiveCases();
   */
  async getActiveCases(
    options: CaseDefinitionOptions = {}
  ): Promise<QueryResponse> {
    const { start, limit, selectedFields, sortOptions, expansions } = options;

    // Convert our case-specific query format to EntityDataQueryRequest format
    const query: EntityDataQueryRequest = {
      skip: start,
      top: limit,
      select:
        selectedFields || CaseDefinitionOperations.DEFAULT_SELECTED_FIELDS,
      filter: JSON.stringify({
        logicalOperator: 0, // AND
        queryFilters: [
          {
            fieldName: "CaseDefinitionId.Name",
            operator: "=",
            value: this.definitionName,
            typeName: "text",
          },
          {
            fieldName: "CurrentStateDefinitionId.IsFinal",
            operator: "=",
            value: "No",
            typeName: "boolean",
          },
        ],
        expansions: [
          {
            expandedField: "CaseDefinitionId",
            selectedFields: ["Id", "Name"],
          },
          {
            expandedField: "CurrentStateDefinitionId",
            selectedFields: ["Id", "IsFinal"],
          },
        ],
        filterGroups: [],
      }),
      orderBy: sortOptions?.map(
        (sort) => `${sort.fieldName} ${sort.isDescending ? "desc" : "asc"}`
      ) || ["CreateTime desc"],
    };

    return this.entityService.queryByName("Cases", query, {
      expansionLevel: expansions?.length ? 1 : 0,
    });
  }

  /**
   * Get cases by status for this case definition
   * @param status - Status of the cases to retrieve
   * @param options - Query options for customizing the response
   * @returns Promise<QueryResponse>
   * @example
   * // Get cases with status "InProgress" for "Auto Loan Application"
   * const cases = await caseService.definition("Auto Loan Application").getCasesByStatus("InProgress");
   */
  async getCasesByStatus(
    status: string,
    options: CaseDefinitionOptions = {}
  ): Promise<QueryResponse> {
    const { start, limit, selectedFields, sortOptions, expansions } = options;

    const query: EntityDataQueryRequest = {
      skip: start,
      top: limit,
      select:
        selectedFields || CaseDefinitionOperations.DEFAULT_SELECTED_FIELDS,
      filter: JSON.stringify({
        logicalOperator: 0, // AND
        queryFilters: [
          {
            fieldName: "CaseDefinitionId.Name",
            operator: "=",
            value: this.definitionName,
            typeName: "text",
          },
          {
            fieldName: "CurrentStateDefinitionId.Name",
            operator: "=",
            value: status,
            typeName: "text",
          },
        ],
        expansions: [
          {
            expandedField: "CaseDefinitionId",
            selectedFields: ["Id", "Name"],
          },
          {
            expandedField: "CurrentStateDefinitionId",
            selectedFields: ["Id", "Name"],
          },
        ],
        filterGroups: [],
      }),
      orderBy: sortOptions?.map(
        (sort) => `${sort.fieldName} ${sort.isDescending ? "desc" : "asc"}`
      ) || ["CreateTime desc"],
    };

    return this.entityService.queryByName("Cases", query, {
      expansionLevel: expansions?.length ? 1 : 0,
    });
  }
}

/**
 * Service for interacting with UiPath Cases
 */
export class CaseService extends BaseService {
  private readonly entityService: EntityService;
  private static readonly CASE_ENTITY_NAME = "Cases";

  constructor(config: Config, executionContext: ExecutionContext) {
    super(config, executionContext);
    this.entityService = new EntityService(config, executionContext);
  }

  /**
   * Get operations for a specific case definition
   * @param definitionName - Name of the case definition
   * @returns CaseDefinitionOperations - Object containing operations for this case definition
   * @example
   * // Get active cases for a specific definition
   * const activeCases = await caseService.definition("Auto Loan Application").getActiveCases();
   */
  definition(definitionName: string): CaseDefinitionOperations {
    return new CaseDefinitionOperations(this.entityService, definitionName);
  }

  /**
   * List all cases with pagination
   * @param options - Query options including pagination (skip/top) and expansionLevel
   * @returns Promise<QueryResponse>
   * @example
   * // Get first page of cases (10 items)
   * const cases = await caseService.list({ skip: 0, top: 10 });
   */
  async list(options: CaseOptions = {}): Promise<QueryResponse> {
    return this.entityService.list(CaseService.CASE_ENTITY_NAME, options);
  }
}
