module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '14',
        },
        modules: 'commonjs',
      },
    ],
  ],
  plugins: ['@babel/plugin-proposal-export-namespace-from'],
};
