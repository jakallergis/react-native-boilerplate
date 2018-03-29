/**
 * @flow
 *
 * A Component that displays a provided list of Todos.
 *
 * Accepts the list of todos, a Set with the UUIDs
 * of the selected ones, and two methods to pass to
 * a TodoItem - for selecting and for editing an item.
 */

import React, { Component }           from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

/** Models / Types */
import Todo                           from '../../../backend/db/models/Todo';
import TodoItem                       from './TodoItem';

type Props = {
  todos: Todo[],
  selectedUUIDs: Set<string>,
  onItemSelect: (item: Todo) => void,
  onEditItem?: (item: Todo) => void
}

export default class TodoList extends Component<Props> {

  constructor(props: Props) {
    super(props);
  }

  /** FlatList Handlers */

  _keyExtractor = (todo: Todo) => todo.UUID;

  /** Renderers */

  _renderItem = ({ item }) => {
    const { selectedUUIDs } = this.props;
    return <TodoItem todo={ item }
                     onEdit={ this.props.onEditItem }
                     onSelect={ this.props.onItemSelect }
                     isSelected={ selectedUUIDs.has(item.UUID) } />;
  };

  render() {
    const { todos, selectedUUIDs } = this.props;
    return (
      <View style={ styles.container }>
        <FlatList data={ todos }
                  extraData={ [...selectedUUIDs] }
                  renderItem={ this._renderItem }
                  keyExtractor={ this._keyExtractor } />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});