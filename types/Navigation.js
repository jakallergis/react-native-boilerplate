// @flow

export type NavigationState<T> = {
  key: string,
  isTransitioning?: boolean,
  index: number,
  routes: RouteState<T>[]
}

export type RouteState<T> = {
  params: T,
  key: ?string,
  routeName: string
}

export type NavigationAction = {}

export type NavigationEvent =
  | 'willBlur'
  | 'willFocus'
  | 'didFocus'
  | 'didBlur'

export type Navigate = (routeName: string,
                        params?: Object,
                        action?: NavigationAction,
                        key?: string) => void

export type AddListener = (NavigationEvent, (...any) => any) => void
export type popRouteAction = (n?: number) => void;
export type pushRouteAction = (routeName: string, params?: Object, action?: NavigationAction, key?: string) => void;

export type Navigation<T> = {
  state: RouteState<T>,
  navigate: Navigate,
  goBack: (screenKey: string) => void,
  addListener: AddListener,
  setParams: (params: Object) => void,
  getParam: (param: string, fallback: any) => any,
  dispatch: (action: NavigationAction) => void,
}

export type StackNavigation<T> = {
  state: RouteState<T>,
  navigate: Navigate,
  goBack: (screenKey: string) => void,
  addListener: AddListener,
  setParams: (params: Object) => void,
  getParam: (param: string, fallback: any) => any,
  dispatch: (action: NavigationAction) => void,
  push: pushRouteAction,
  pop: popRouteAction,
  popToTop: () => void,
  replace: (routeName: string, params?: Object, action?: NavigationAction) => void
};

