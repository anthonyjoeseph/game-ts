module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/test/setup.ts'],
  testRegex: '(\\.|/)(test|spec)\\.tsx?$',
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
}
