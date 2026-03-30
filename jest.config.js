/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/__tests__/unit/**/*.test.ts'],
    moduleNameMapper: { '^@src/(.*)$': '<rootDir>/src/$1' },
    moduleDirectories: ['node_modules', 'src'],
    testTimeout: 15000,
    verbose: true,
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
};
