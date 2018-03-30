afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  jest.resetAllMocks();
  jest.resetModuleRegistry();
});

global.__TESTS__ENABLED = true;
global.Reactotron = {
  clear: () => {},
  log: () => {},
  warn: () => {},
  error: () => {},
  display: () => {}
};