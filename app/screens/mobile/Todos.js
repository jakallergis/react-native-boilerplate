/**
 * @flow
 */

import React, { Component }              from 'react';
import { StyleSheet, View, Button }      from 'react-native';
import Realm                             from 'realm';

/** Models / Types */
import type { ReduxActions, TodosState } from '../../../types/redux';
import type { StackNavigation }          from '../../../types/Navigation';
import Todo                              from '../../../backend/db/models/Todo';

/** Components */
import TodoList                          from '../../components/Todo/TodoList';

/** Utilities */
import Database                          from '../../../backend/db/TodoDatabase';

type Props = {
  screenProps: {
    isTablet: boolean,
    Todos: TodosState,
    actions: ReduxActions
  },
  navigation: StackNavigation<any>
}

type State = {
  todos: Todo[],
  selectedUUIDs: Set<string>
}

export default class Todos extends Component<Props, State> {

  allTodos: Realm.Results<Todo>;

  constructor(props: Props) {
    super(props);
    this.allTodos = Database.getAllTodos();
    this.state = {
      todos: this.allTodos,
      selectedUUIDs: new Set()
    };
  }

  componentDidMount() {
    this.allTodos.addListener(this._updateTodosFromDB);
  }

  componentWillUnmount() {
    this.allTodos.removeListener(this._updateTodosFromDB);
  }

  /** Database Handlers */

  _updateTodosFromDB = () => this.setState({ todos: this.allTodos });

  /** Button Handlers */

  _toggleItemSelection = (item: Todo): void => {
    const { selectedUUIDs } = this.state;
    if (selectedUUIDs.has(item.UUID)) selectedUUIDs.delete(item.UUID);
    else selectedUUIDs.add(item.UUID);
    this.setState({ selectedUUIDs });
  };

  _goToEditTodo = (todo: ?Todo) => this.props.navigation.navigate('EditTodo', { todo });

  _completeSelected = () => {
    const { selectedUUIDs } = this.state;
    Database.write(() => selectedUUIDs.forEach(Database.updateTodoToCompletedByUUID));
    this._emptySelection();
    this._emptySelection();
  };

  _deleteSelected = () => {
    const { selectedUUIDs } = this.state;
    Database.write(() => selectedUUIDs.forEach(Database.deleteTodoByUUID));
    this._emptySelection();
  };

  /** Generic Handlers */

  _emptySelection = () => {
    const { selectedUUIDs } = this.state;
    selectedUUIDs.clear();
    this.setState({ selectedUUIDs });
  };

  /** Renderers */

  render() {
    const { selectedUUIDs } = this.state;
    return (
      <View style={ styles.container }>
        <TodoList todos={ this.allTodos }
                  selectedUUIDs={ selectedUUIDs }
                  onItemSelect={ this._toggleItemSelection }
                  onEditItem={ this._goToEditTodo } />
        <View style={ styles.buttonsBar }>
          <Button title='New' onPress={ () => this._goToEditTodo() } />
          { !!selectedUUIDs.size && <Button title='Delete' color='red' onPress={ this._deleteSelected } /> }
          { !!selectedUUIDs.size && <Button title='Complete' color='green' onPress={ this._completeSelected } /> }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonsBar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: 'rgb(200, 200, 200)'
  }
});