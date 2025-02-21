import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'

// rollup.config.mjs
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript'
import nodePolyfills from 'rollup-plugin-polyfill-node';
const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/trustpath-device-intelligence-js-sdk.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/trustpath-device-intelligence-js-sdk.esm.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/trustpath-device-intelligence-js-sdk.umd.js',
        format: 'umd',
        sourcemap: true,
        name: 'TrustPath',
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      json(),
      terser(),
      nodePolyfills()
    ]
  }
];

export default config;
