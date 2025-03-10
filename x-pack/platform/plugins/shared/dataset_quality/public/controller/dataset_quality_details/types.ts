/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Observable } from 'rxjs';
import {
  DatasetQualityDetailsControllerStateService,
  QualityIssuesTableConfig,
  WithDefaultControllerState,
} from '../../state_machines/dataset_quality_details_controller';

type QuaityIssuesTableSortOptions = Omit<QualityIssuesTableConfig['table']['sort'], 'field'> & {
  field: string;
};

export type DatasetQualityIssuesTableOptions = Partial<
  Omit<QualityIssuesTableConfig['table'], 'sort'> & {
    sort?: QuaityIssuesTableSortOptions;
  }
>;

export type DatasetQualityDetailsPublicState = WithDefaultControllerState;

// This type is used by external consumers where it enforces datastream to be
// a must and everything else can be optional. The table inside the
// degradedFields must accept field property as string
export type DatasetQualityDetailsPublicStateUpdate = Partial<
  Pick<
    WithDefaultControllerState,
    | 'timeRange'
    | 'breakdownField'
    | 'showCurrentQualityIssues'
    | 'expandedQualityIssue'
    | 'qualityIssuesChart'
  >
> & {
  dataStream: string;
} & {
  qualityIssues?: {
    table?: DatasetQualityIssuesTableOptions;
  };
};

export interface DatasetQualityDetailsController {
  state$: Observable<DatasetQualityDetailsPublicState>;
  service: DatasetQualityDetailsControllerStateService;
}
