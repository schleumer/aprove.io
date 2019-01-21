module.exports = {
  presets: [
    '@babel/react',
    '@babel/typescript',
    ['@babel/env', { modules: false }],
  ],
  plugins: [
    'babel-plugin-emotion',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-export-default-from',
  ],
  env: {
    production: {
      only: ['src'],
      plugins: ['lodash', 'transform-react-remove-prop-types'],
    },
  },
};
