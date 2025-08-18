module.exports = {
  collectCoverageFrom: ['front/**/*.{js,ts}', '!**/node_modules/**'],
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/front/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(js|ts)$': 'babel-jest',
  },
  moduleFileExtensions: ['vue', 'js', 'ts', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(vuetify|@mdi/font)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}
