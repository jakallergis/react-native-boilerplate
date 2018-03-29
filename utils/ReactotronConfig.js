// @flow

import Reactotron, {
  trackGlobalErrors,
  openInEditor,
  overlay,
  asyncStorage,
  networking
} from 'reactotron-react-native';

const setupReactotron = (): any => {
  if (!__DEV__) return {};
  Reactotron
    .configure({ name: 'React Native Boilerplate' })
    .useReactNative()
    .use(trackGlobalErrors())
    .use(openInEditor())
    .use(overlay())
    .use(asyncStorage())
    .use(networking({ ignoreUrls: /\/(symbolicate)$/ }))
    .connect();

  return Reactotron;
};

export default setupReactotron();