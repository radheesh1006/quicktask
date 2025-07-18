module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: './', outputName: 'frontend-test-results.xml' }]
  ]
};
