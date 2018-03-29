/**
 * @flow
 *
 * This is where the bootstrapping of the application
 * begins. As a general rule of thumbs, this is where
 * you should put any initialization logic like creating
 * the app's root redux store, initializing database, http
 * clients, sockets, event emitters, you name it.
 */

import React, { Component } from 'react';
import { View }             from 'react-native';
import { Provider }         from 'react-redux';

/** Types */
import type { Store }       from 'redux';

/** Navigators */
import AppNavigator         from './app/navigators/common/AppNavigator';

/** Redux */
import { createReduxStore } from './app/redux/store';

/** Components */
import UIFreezer            from './app/components/ui/UIFreezer';

/** Globals */
const { Reactotron } = global;

type Props = {
  isTablet: boolean,
  rootTag: number
}

export default class App extends Component<Props> {

  store: Store<any>;

  constructor(props: Props) {
    super(props);
    Reactotron.clear();
    this.store = createReduxStore(props.isTablet);
  }

  render() {
    const { isTablet } = this.props;
    return (
      <Provider store={ this.store }>
        <View style={ { flex: 1 } }>
          <AppNavigator { ...{ isTablet } } />
          <UIFreezer />
        </View>
      </Provider>
    );
  }
}