module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts'
  ],
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  testEnvironment: 'node',
  coverageDirectory: 'coverage'
}
