/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { EuiFormRow, EuiIconTip, EuiSpacer } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n-react';
import React, { FC } from 'react';
import type { UserContentCommonSchema } from '@kbn/content-management-table-list-view-common';
import { ActivityView, ViewsStats } from '@kbn/content-management-content-insights-public';

/**
 * This component is used as an extension for the ContentEditor to render the ActivityView and ViewsStats inside the flyout without depending on them directly
 */
export const ContentEditorActivityRow: FC<{
  item: UserContentCommonSchema;
  entityNamePlural?: string;
}> = ({ item, entityNamePlural }) => {
  return (
    <EuiFormRow
      fullWidth
      label={
        <>
          <FormattedMessage
            id="contentManagement.tableList.contentEditor.activityLabel"
            defaultMessage="Activity"
          />{' '}
          <EuiIconTip
            type={'info'}
            iconProps={{ style: { verticalAlign: 'bottom' } }}
            content={
              <FormattedMessage
                id="contentManagement.tableList.contentEditor.activityLabelHelpText"
                defaultMessage="Activity data is auto-generated and cannot be updated."
              />
            }
          />
        </>
      }
    >
      <>
        <ActivityView item={item} entityNamePlural={entityNamePlural} />
        <EuiSpacer size={'s'} />
        <ViewsStats item={item} />
      </>
    </EuiFormRow>
  );
};
