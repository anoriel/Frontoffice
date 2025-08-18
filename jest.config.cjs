module.exports = {
  collectCoverageFrom: ['src/**/*.js', '!**/node_modules/**'],
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(vuetify|@mdi/font)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}
