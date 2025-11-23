module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    "node_modules/(?!(react-native" +
      "|@react-native" +
      "|react-native-web" +
      "|expo" +
      "|expo-.*" +
      "|@expo" +
      "|@expo/.*" +
      "|@react-navigation" +
      "|expo-modules-core" +
      ")/)"
  ],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^expo-modules-core/build/Refs$": "<rootDir>/jest-mocks/expo-modules-core-Refs.js",
    "^expo-modules-core/build/web/index.web$": "<rootDir>/jest-mocks/expo-modules-core-web.js",
    "^expo/build/winter$": "<rootDir>/jest-mocks/expo-build-winter.js"
  }
};
