// Minimal mock for 'expo/build/winter' used by jest-expo setup
// It should install any globals expo expects; keep minimal to avoid errors.

globalThis.__expoTestEnvironment = true;

module.exports = {};
