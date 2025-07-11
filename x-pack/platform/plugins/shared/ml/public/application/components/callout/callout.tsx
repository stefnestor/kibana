/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { FC } from 'react';
import React from 'react';
import { EuiCallOut, EuiLink, EuiSpacer } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n-react';
import type { CalloutMessage } from '@kbn/ml-validators';
import { VALIDATION_STATUS } from '@kbn/ml-validators';

export const defaultIconType = 'question';

const statusToEuiColor = (status: VALIDATION_STATUS) => {
  switch (status) {
    case VALIDATION_STATUS.INFO:
      return 'primary';
    case VALIDATION_STATUS.ERROR:
      return 'danger';
    default:
      return status;
  }
};

export const statusToEuiIconType = (status: VALIDATION_STATUS) => {
  switch (status) {
    case VALIDATION_STATUS.INFO:
      return 'info';
    case VALIDATION_STATUS.ERROR:
      return 'cross';
    case VALIDATION_STATUS.SUCCESS:
      return 'check';
    case VALIDATION_STATUS.WARNING:
      return 'warning';
    default:
      return status;
  }
};

const Link: FC<{ url: string }> = ({ url }) => (
  <EuiLink href={url} target="_BLANK">
    <FormattedMessage id="xpack.ml.validateJob.learnMoreLinkText" defaultMessage="Learn more" />
  </EuiLink>
);

const Message: FC<Pick<CalloutMessage, 'text' | 'url'>> = ({ text, url }) => (
  <>
    {text} {url && <Link url={url} />}
  </>
);

export const Callout: FC<CalloutMessage> = ({ heading, status, text, url }) => (
  <>
    <EuiCallOut
      data-test-subj={`mlValidationCallout ${status}`}
      // @ts-ignore
      color={statusToEuiColor(status)}
      size="s"
      title={heading || <Message text={text} url={url} />}
      iconType={status ? statusToEuiIconType(status) : defaultIconType}
    >
      {heading && <Message text={text} url={url} />}
    </EuiCallOut>
    <EuiSpacer size="m" />
  </>
);
