module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    setupFilesAfterEnv: ['./jest.setup.ts'],
};
  