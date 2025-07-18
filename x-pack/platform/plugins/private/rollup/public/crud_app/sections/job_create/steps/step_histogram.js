/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@kbn/i18n-react';

import {
  EuiButtonEmpty,
  EuiDescribedFormGroup,
  EuiFieldNumber,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';

import { documentationLinks } from '../../../services/documentation_links';

import { FieldList } from '../../components';

import { FieldChooser, StepError, JobWizardStepAction } from './components';

export class StepHistogram extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    onFieldsChange: PropTypes.func.isRequired,
    fieldErrors: PropTypes.object.isRequired,
    hasErrors: PropTypes.bool.isRequired,
    areStepErrorsVisible: PropTypes.bool.isRequired,
    histogramFields: PropTypes.array.isRequired,
  };

  onSelectField = (field) => {
    const {
      fields: { histogram },
      onFieldsChange,
    } = this.props;

    onFieldsChange({ histogram: histogram.concat(field) });
  };

  onRemoveField = (field) => {
    const {
      fields: { histogram },
      onFieldsChange,
    } = this.props;

    onFieldsChange({ histogram: histogram.filter((histogramField) => histogramField !== field) });
  };

  render() {
    const { fields, histogramFields } = this.props;

    const { histogram } = fields;

    const columns = [
      {
        field: 'name',
        name: 'Field',
        sortable: true,
      },
    ];

    return (
      <Fragment>
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem grow={false}>
            <EuiTitle data-test-subj="rollupJobCreateHistogramTitle">
              <h2>
                <FormattedMessage
                  id="xpack.rollupJobs.create.stepHistogramTitle"
                  defaultMessage="Histogram (optional)"
                />
              </h2>
            </EuiTitle>

            <EuiSpacer size="s" />

            <EuiText>
              <p>
                <FormattedMessage
                  id="xpack.rollupJobs.create.stepHistogram.histogramDescription"
                  defaultMessage="Select the fields you want to bucket using numeric intervals."
                />
              </p>
            </EuiText>
          </EuiFlexItem>

          <JobWizardStepAction>
            <EuiButtonEmpty
              size="s"
              flush="right"
              href={documentationLinks.apis.createRollupJobsRequest}
              target="_blank"
              iconType="question"
              data-test-subj="rollupJobCreateHistogramDocsButton"
            >
              <FormattedMessage
                id="xpack.rollupJobs.create.stepHistogram.readDocsButtonLabel"
                defaultMessage="Histogram docs"
              />
            </EuiButtonEmpty>
          </JobWizardStepAction>
        </EuiFlexGroup>

        <EuiSpacer />

        <FieldList
          columns={columns}
          fields={histogram}
          onRemoveField={this.onRemoveField}
          emptyMessage={<p>No histogram fields added</p>}
          addButton={
            <FieldChooser
              buttonLabel={
                <FormattedMessage
                  id="xpack.rollupJobs.create.stepHistogram.fieldsChooserLabel"
                  defaultMessage="Add histogram fields"
                />
              }
              columns={columns}
              fields={histogramFields}
              selectedFields={histogram}
              onSelectField={this.onSelectField}
              dataTestSubj="rollupJobHistogramFieldChooser"
            />
          }
          dataTestSubj="rollupJobHistogramFieldList"
        />

        {this.renderInterval()}

        {this.renderErrors()}
      </Fragment>
    );
  }

  renderInterval() {
    const { fields, onFieldsChange, areStepErrorsVisible, fieldErrors } = this.props;

    const { histogram, histogramInterval } = fields;

    const { histogramInterval: errorHistogramInterval } = fieldErrors;

    if (!histogram.length) {
      return null;
    }

    return (
      <Fragment>
        <EuiSpacer size="xl" />

        <EuiDescribedFormGroup
          title={
            <EuiTitle size="s">
              <h3>
                <FormattedMessage
                  id="xpack.rollupJobs.create.stepHistogram.sectionHistogramIntervalTitle"
                  defaultMessage="Histogram interval"
                />
              </h3>
            </EuiTitle>
          }
          description={
            <FormattedMessage
              id="xpack.rollupJobs.create.stepHistogram.sectionHistogramIntervalDescription"
              defaultMessage="This is the interval of histogram buckets to be generated when rolling
                up, e.g. 5 will create buckets that are five units wide (0-5, 5-10, etc). Note that
                only one interval can be specified in the histogram group, meaning that all fields
                being grouped via the histogram must share the same interval."
            />
          }
          fullWidth
        >
          <EuiFormRow
            label={
              <FormattedMessage
                id="xpack.rollupJobs.create.stepHistogram.fieldHistogramIntervalLabel"
                defaultMessage="Interval"
              />
            }
            error={errorHistogramInterval}
            isInvalid={Boolean(areStepErrorsVisible && errorHistogramInterval)}
            fullWidth
          >
            <EuiFieldNumber
              value={!histogramInterval && histogramInterval !== 0 ? '' : Number(histogramInterval)}
              onChange={(e) => onFieldsChange({ histogramInterval: e.target.value })}
              isInvalid={Boolean(areStepErrorsVisible && errorHistogramInterval)}
              fullWidth
              data-test-subj="rollupJobCreateHistogramInterval"
            />
          </EuiFormRow>
        </EuiDescribedFormGroup>
      </Fragment>
    );
  }

  renderErrors = () => {
    const { areStepErrorsVisible, hasErrors } = this.props;

    if (!areStepErrorsVisible || !hasErrors) {
      return null;
    }

    return <StepError />;
  };
}
