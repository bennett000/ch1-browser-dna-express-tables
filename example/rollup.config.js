const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  input: './dist/client.js',
  output: {
    file: './dist/bundle.js',
    format: 'iife',
    name: 'browserDna'
  },
  plugins: [resolve({ modulesOnly: true }), commonjs()]
};
