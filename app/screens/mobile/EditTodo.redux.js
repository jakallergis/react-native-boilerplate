/**
 * @flow
 *
 * The same implementation as the EditTodo Screen
 * but using redux state and actions instead of
 * navigation state and actions
 */

import React, { Component }              from 'react';
import { StyleSheet, View }              from 'react-native';

/** Models / Types */
import type { StackNavigation }          from '../../../types/Navigation';
import type { ReduxActions, TodosState } from '../../../types/redux';

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
  navigation: StackNavigation<any>
}

export default class EditTodoRedux extends Component<Props> {

  /** Button Handlers */

  _onSubmit = (title: ?string, description: ?string, completed: boolean) => {
    const { screenProps: { actions, Todos: { currentTodo } } } = this.props;

    if (currentTodo && currentTodo.UUID) {
      const newTodo = Database.write(() => {
        currentTodo.title = title || 'Untitled';
        currentTodo.description = description;
        currentTodo.completed = completed;
        return currentTodo;
      });

      actions.selectTodo(newTodo);
    } else {
      const newTodo = Database.createNewTodo({ title, description, completed });
      actions.selectTodo(newTodo);
    }

    this.props.navigation.pop();
  };

  _deleteTodo = () => this.props.screenProps.actions.deleteTodo();

  _onCancel = () => {
    this.props.screenProps.actions.deleteTodo();
    this.props.navigation.pop();
  };

  /** Renderers */

  render() {
    const { screenProps: { Todos: { currentTodo } } } = this.props;

    return (
      <View style={ styles.container }>
        <TodoEditor todo={ currentTodo }
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