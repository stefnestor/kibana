/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { throwError, of } from 'rxjs';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mountWithIntl } from '@kbn/test-jest-helpers';
import type { ReactWrapper } from 'enzyme';
import { findTestSubject } from '@elastic/eui/lib/test';
import type { DocProps } from './doc';
import { Doc } from './doc';
import { dataViewMock } from '@kbn/discover-utils/src/__mocks__';
import { setUnifiedDocViewerServices } from '@kbn/unified-doc-viewer-plugin/public/plugin';
import { mockUnifiedDocViewerServices } from '@kbn/unified-doc-viewer-plugin/public/__mocks__';
import type { UnifiedDocViewerServices } from '@kbn/unified-doc-viewer-plugin/public/types';
import { createDiscoverServicesMock } from '../../../__mocks__/services';
import { DiscoverTestProvider } from '../../../__mocks__/test_provider';

const services = createDiscoverServicesMock();
const mockSearchApi = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

const waitForPromises = async () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve));
  });

/**
 * this works but logs ugly error messages until we're using React 16.9
 * should be adapted when we upgrade
 */
async function mountDoc(update = false) {
  const props = {
    id: '1',
    index: 'index1',
    dataView: dataViewMock,
    referrer: 'mock-referrer',
  } as DocProps;
  let comp!: ReactWrapper;
  setUnifiedDocViewerServices({
    ...mockUnifiedDocViewerServices,
    data: {
      search: {
        search: mockSearchApi,
      },
    },
  } as unknown as UnifiedDocViewerServices);
  await act(async () => {
    comp = mountWithIntl(
      <DiscoverTestProvider services={services}>
        <Doc {...props} />
      </DiscoverTestProvider>
    );
    if (update) comp.update();
  });
  if (update) {
    await waitForPromises();
    comp.update();
  }
  return comp;
}

describe('Test of <Doc /> of Discover', () => {
  test('renders loading msg', async () => {
    const comp = await mountDoc();
    expect(findTestSubject(comp, 'doc-msg-loading').length).toBe(1);
  });

  test('renders notFound msg', async () => {
    mockSearchApi.mockImplementation(() => throwError({ status: 404 }));
    const comp = await mountDoc(true);
    expect(findTestSubject(comp, 'doc-msg-notFound').length).toBe(1);
  });

  test('renders error msg', async () => {
    mockSearchApi.mockImplementation(() => throwError({ error: 'something else' }));
    const comp = await mountDoc(true);
    expect(findTestSubject(comp, 'doc-msg-error').length).toBe(1);
  });

  test('renders elasticsearch hit ', async () => {
    mockSearchApi.mockImplementation(() =>
      of({ rawResponse: { hits: { total: 1, hits: [{ _id: 1, _source: { test: 1 } }] } } })
    );
    const comp = await mountDoc(true);
    expect(findTestSubject(comp, 'doc-hit').length).toBe(1);
  });
});
