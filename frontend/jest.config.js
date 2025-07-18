module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  roots: ['<rootDir>/src'],  // Ensures tests in /src are discovered
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: './frontend', outputName: 'frontend-test-results.xml' }]
  ]
};
