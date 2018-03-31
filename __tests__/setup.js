global.__TESTS__ENABLED = true;
global.Reactotron = {
  clear: () => {},
  log: () => {},
  warn: () => {},
  error: () => {},
  display: () => {}
};

/** Mocks */
jest.mock('../backend/db/RealmObject', () => jest.fn());

/** Setup */
beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  jest.resetAllMocks();
  jest.resetModuleRegistry();
});