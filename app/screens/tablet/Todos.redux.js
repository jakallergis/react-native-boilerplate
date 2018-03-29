/**
 * @flow
 *
 * The same implementation as the Todos Screen
 * but using redux state and actions instead of
 * navigation state and actions
 */

import React, { Component }              from 'react';
import {
  StyleSheet, View, Button, Platform,
  LayoutAnimation, Dimensions, UIManager
}                                        from 'react-native';
import Realm                             from 'realm';

/** Models / Types */
import type { ReduxActions, TodosState } from '../../../types/redux';
import type { StackNavigation }          from '../../../types/Navigation';
import Todo                              from '../../../backend/db/models/Todo';

/** Components */
import TodoList                          from '../../components/Todo/TodoList';
import TodoEditor                        from '../../components/Todo/TodoEditor';

/** Utilities */
import Database                          from '../../../backend/db/TodoDatabase';

/** Layout Constants */
const { width } = Dimensions.get('window');
const GUTTER = 24;
const EDITOR_FLEX = 2;
const MARGIN_TO_HIDE_EDITOR = { marginRight: -(width * EDITOR_FLEX) - (GUTTER * 2) };

type Props = {
  screenProps: {
    isTablet: boolean,
    Todos: TodosState,
    actions: ReduxActions
  },
  navigation: StackNavigation<any>
}

type State = {
  todos: Todo[]
}

export default class TodosRedux extends Component<Props, State> {

  allTodos: Realm.Results<Todo>;

  constructor(props: Props) {
    super(props);
    this.allTodos = Database.getAllTodos();
    this.state = { todos: this.allTodos };
  }

  componentDidMount() {
    this.allTodos.addListener(this._updateTodosFromDB);
    if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentWillUpdate(nextProps: Props) {
    const { editorOpen } = this.props.screenProps.Todos;
    const { editorOpen: nextEditorOpen } = nextProps.screenProps.Todos;
    if (editorOpen !== nextEditorOpen) LayoutAnimation.easeInEaseOut();
  }

  componentWillUnmount() {
    this.allTodos.removeListener(this._updateTodosFromDB);
  }

  /** Database Handlers */

  _updateTodosFromDB = () => this.setState({ todos: this.allTodos });

  /** Button Handlers */

  _toggleItemSelection = (item: Todo): void => {
    const { screenProps: { actions, Todos: { currentTodo } } } = this.props;
    if (currentTodo && currentTodo.UUID === item.UUID) return actions.deselectTodo();
    actions.selectTodo(item);
  };

  _newTodo = () => this.props.screenProps.actions.newTodo();

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
  };

  _deleteTodo = () => this.props.screenProps.actions.deleteTodo();

  _onCancel = () => this.props.screenProps.actions.deselectTodo();

  /** Renderers */

  render() {
    const { screenProps: { Todos: { currentTodo, editorOpen } } } = this.props;
    const selectedUUID = currentTodo && currentTodo.isValid()
      ? new Set([currentTodo.UUID])
      : new Set();

    return (
      <View style={ styles.container }>
        <View style={ { flex: 1, flexDirection: 'row' } }>
          <TodoList todos={ this.allTodos }
                    selectedUUIDs={ selectedUUID }
                    onItemSelect={ this._toggleItemSelection } />

          <View style={ styles.separator } />

          <View style={ [styles.editorContainer, !editorOpen && MARGIN_TO_HIDE_EDITOR] }>
            <TodoEditor todo={ currentTodo }
                        onSubmit={ this._onSubmit }
                        onDeleteTodo={ this._deleteTodo }
                        onCancel={ this._onCancel } />
          </View>
        </View>

        <View style={ styles.buttonsBar }>
          <Button title='New' onPress={ this._newTodo } />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    width: 1,
    backgroundColor: 'rgb(200, 200, 200)'
  },
  editorContainer: {
    flex: EDITOR_FLEX,
    padding: GUTTER
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