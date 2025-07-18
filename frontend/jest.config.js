module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  roots: ['<rootDir>/src'],
  transformIgnorePatterns: [
    'node_modules/(?!(axios)/)',  // <-- Add axios here to transform it
  ],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: './frontend', outputName: 'frontend-test-results.xml' }]
  ]
};
