module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  roots: ['<rootDir>/src'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: './frontend', outputName: 'frontend-test-results.xml' }]
  ]
};
