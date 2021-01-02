module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/test/utils/setup.ts'],
  testRegex: '(\\.|/)(test|spec)\\.ts?$',
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
}
