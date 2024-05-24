/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { BehaviorSubject, Subscription } from 'rxjs';
import type { IUiSettingsClient } from '../../../../src/core/public';
import type { DataSourceManagementPluginSetup } from '../../../../src/plugins/data_source_management/public/plugin';

const getDSMDataSourceSelectionOption = (
  dataSourceSelection: ReturnType<
    DataSourceManagementPluginSetup['dataSourceSelection']['getSelectionValue']
  >
) => {
  const values = [...dataSourceSelection.values()];
  // Should use default index if multi data source selected
  if (values.length === 0 || values.length > 1 || values?.[0]?.length > 1) {
    return null;
  }
  return values[0][0];
};

export class DataSourceService {
  dataSourceId$ = new BehaviorSubject<string | null>(null);
  private uiSettings: IUiSettingsClient | null = null;
  private dataSourceManagement: DataSourceManagementPluginSetup | undefined | null = null;
  private dataSourceSelectionSubscription: Subscription | undefined;

  constructor() {}

  initDefaultDataSourceIdIfNeed() {
    if (!this.dataSourceManagement || this.dataSourceId$.getValue() !== null) {
      return;
    }
    const defaultDataSourceId = this.uiSettings?.get('defaultDataSource', null);
    if (defaultDataSourceId) {
      this.dataSourceId$.next(defaultDataSourceId);
      return;
    }
  }

  clearDataSourceId() {
    this.dataSourceId$.next(null);
  }

  getDataSourceQuery() {
    if (!this.dataSourceManagement) {
      return {};
    }
    const dataSourceId = this.dataSourceId$.getValue();
    if (dataSourceId === null) {
      throw new Error('No data source id');
    }
    if (dataSourceId === '') {
      return {};
    }
    return { dataSourceId };
  }

  setup({
    uiSettings,
    dataSourceManagement,
  }: {
    uiSettings: IUiSettingsClient;
    dataSourceManagement?: DataSourceManagementPluginSetup;
  }) {
    this.uiSettings = uiSettings;
    this.dataSourceManagement = dataSourceManagement;

    this.dataSourceSelectionSubscription = this.dataSourceManagement?.dataSourceSelection
      .getSelection$()
      .subscribe((dataSourceSelection) => {
        const selectedDataSourceOption = getDSMDataSourceSelectionOption(dataSourceSelection);
        this.dataSourceId$.next(selectedDataSourceOption?.id ?? null);
      });
    return {
      setDataSourceId: (newDataSourceId: string | null) => {
        this.dataSourceId$.next(newDataSourceId);
      },
    };
  }

  start() {
    return {
      setDataSourceId: (newDataSourceId: string | null) => {
        this.dataSourceId$.next(newDataSourceId);
      },
    };
  }

  public stop() {
    this.dataSourceSelectionSubscription?.unsubscribe();
    this.dataSourceId$.complete();
  }
}
