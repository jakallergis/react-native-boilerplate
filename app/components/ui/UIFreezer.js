/**
 * @flow
 *
 * This component when visible, creates a fullscreen
 * modal that renders the ui untouchable and shows
 * an indicator to show something internal is going on.
 * it is connected to redux by default because im only
 * using it in the root App.js component, but you could
 * use just the class passing it a UIFrozen prop wherever
 * you'ld like.
 */

import React, { Component }                           from 'react';
import { StyleSheet, View, Modal, ActivityIndicator } from 'react-native';
import { connect }                                    from 'react-redux';

/** Models / Types */
import type { ReduxState }                            from '../../../types/redux';

type Props = { UIFrozen: boolean }
const mapStateToProps = ({ UIFrozen }: ReduxState) => ({ UIFrozen });

export class UIFreezer extends Component<Props> {
  render() {
    const { UIFrozen } = this.props;
    return (
      <Modal visible={ UIFrozen }
             animationType='fade'
             transparent={ true }
             onRequestClose={ () => {} }>

        <View style={ styles.container }>
          <ActivityIndicator animating={ true }
                             color='white'
                             size='large' />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(47, 54, 64,0.7)'
  }
});

export default connect(mapStateToProps)(UIFreezer);