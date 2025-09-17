module.exports = {
  collectCoverageFrom: ['front/**/*.{js,ts,vue}', '!**/node_modules/**', '!**/*.d.ts'],
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/front/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^uuid$': require.resolve('uuid'),
    'vue3-flag-icons/styles': 'identity-obj-proxy',
  },
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(js|ts)$': 'babel-jest',
  },
  moduleFileExtensions: ['vue', 'js', 'ts', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(vuetify|@mdi/font|uuid|exceljs|vue-i18n|vue-debounce|@vue\/test-utils)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/front/**/*.spec.{js,ts}',
    '**/front/**/*.test.{js,ts}'
  ],
  globals: {
    'vue-jest': {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('v-')
      }
    }
  }
}
