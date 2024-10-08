/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { getJsDependencyPaths } from './get_js_dependency_paths';
import type { PluginInfo } from './get_plugin_bundle_paths';

describe('getJsDependencyPaths', () => {
  it('returns the correct list of paths', () => {
    const bundlePaths = new Map<string, PluginInfo>();
    bundlePaths.set('plugin1', {
      bundlePath: 'plugin1/bundle-path.js',
      publicPath: 'plugin1/public-path',
    });
    bundlePaths.set('plugin2', {
      bundlePath: 'plugin2/bundle-path.js',
      publicPath: 'plugin2/public-path',
    });

    expect(getJsDependencyPaths('/regular-bundle-path', bundlePaths)).toMatchInlineSnapshot(`
      Array [
        "/regular-bundle-path/kbn-ui-shared-deps-npm/kbn-ui-shared-deps-npm.dll.js",
        "/regular-bundle-path/kbn-ui-shared-deps-src/kbn-ui-shared-deps-src.js",
        "/regular-bundle-path/core/core.entry.js",
        "plugin1/bundle-path.js",
        "plugin2/bundle-path.js",
      ]
    `);
  });
});
