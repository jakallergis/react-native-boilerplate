/**
 * @flow
 */

import React, { Component }              from 'react';
import { StyleSheet, View }              from 'react-native';

/** Models / Types */
import type { StackNavigation }          from '../../../types/Navigation';
import type { ReduxActions, TodosState } from '../../../types/redux';
import Todo                              from '../../../backend/db/models/Todo';

/** Components */
import TodoEditor                        from '../../components/Todo/TodoEditor';

/** Utilities */
import Database                          from '../../../backend/db/TodoDatabase';

type Props = {
  screenProps: {
    isTablet: boolean,
    Todos: TodosState,
    actions: ReduxActions
  },
  navigation: StackNavigation<{ todo: ?Todo }>
}

export default class EditTodo extends Component<Props> {

  /** Button Handlers */

  _onSubmit = (title: ?string, description: ?string, completed: boolean) => {
    const { navigation: { state: { params } } } = this.props;
    const { todo } = params || {};

    if (todo && todo.UUID) {
      Database.write(() => {
        todo.title = title || 'Untitled';
        todo.description = description;
        todo.completed = completed;
      });
    } else {
      Database.createNewTodo({ title, description, completed });
    }

    this.props.navigation.pop();
  };

  _deleteTodo = (todo: ?Todo) => {
    if (!(todo && todo.UUID)) return;
    Database.deleteTodoByUUID(todo.UUID);
    this.props.navigation.pop();
  };

  _onCancel = () => this.props.navigation.pop();

  /** Renderers */

  render() {
    const { navigation: { state: { params } } } = this.props;
    const { todo } = params || {};

    return (
      <View style={ styles.container }>
        <TodoEditor todo={ todo }
                    onSubmit={ this._onSubmit }
                    onDeleteTodo={ this._deleteTodo }
                    onCancel={ this._onCancel } />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24
  }
});