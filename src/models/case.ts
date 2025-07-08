import { EntityDataQueryRequest } from './entity';

export interface QueryFilter {
  fieldName: string;
  operator: string;
  value: string;
  typeName: string;
}

export interface FilterGroup {
  logicalOperator: number;
  queryFilters: QueryFilter[];
  filterGroups: FilterGroup[];
}

export interface SortOption {
  fieldName: string;
  isDescending: boolean;
}

export interface Expansion {
  expandedField: string;
  selectedFields: string[];
}

export interface CaseQueryRequest extends EntityDataQueryRequest {
  entityId?: string;
  selectedFields?: string[];
  filterGroup: FilterGroup;
  sortOptions?: SortOption[];
  expansions?: Expansion[];
}

export interface CaseDefinitionOptions {
  selectedFields?: string[];
  start?: number;
  limit?: number;
  sortOptions?: SortOption[];
  expansions?: Expansion[];
} 