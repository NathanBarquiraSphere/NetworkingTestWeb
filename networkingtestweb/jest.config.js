/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  reporters: [
    "default",
    [
        "./node_modules/jest-html-reporter",
        {
          pageTitle: "Test Report",
          includeFailureMsg: true,
          includeSuiteFailure: true
        }
    ]
  ]
};