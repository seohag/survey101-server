module.exports = {
  testEnvironment: "node",
  collectCoverageFrom: ["./src/**/*.js"],
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["./src/spec/setup.js"],
};
