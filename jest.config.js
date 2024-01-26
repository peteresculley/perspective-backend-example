/** @type {import("ts-jest").JestConfigWithTsJest} */

module.exports = {
    ...require('@shelf/jest-mongodb/jest-preset'),
    verbose: true,
    preset: 'ts-jest',
    silent: false,
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    watchPathIgnorePatterns: ['globalConfig'],
};
