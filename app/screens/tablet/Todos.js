/**
 * @flow
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
  todos: Todo[],
  selectedTodo: ?Todo,
  editorOpen: boolean
}

export default class Todos extends Component<Props, State> {

  allTodos: Realm.Results<Todo>;

  constructor(props: Props) {
    super(props);
    this.allTodos = Database.getAllTodos();
    this.state = {
      todos: this.allTodos,
      selectedTodo: null,
      editorOpen: false
    };
  }

  componentDidMount() {
    this.allTodos.addListener(this._updateTodosFromDB);
    if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    const { editorOpen } = this.state;
    const { editorOpen: nextEditorOpen } = nextState;
    if (editorOpen !== nextEditorOpen) LayoutAnimation.easeInEaseOut();
  }

  componentWillUnmount() {
    this.allTodos.removeListener(this._updateTodosFromDB);
  }

  /** Database Handlers */

  _updateTodosFromDB = () => this.setState({ todos: this.allTodos });

  /** Button Handlers */

  _toggleItemSelection = (item: Todo): void => {
    const { selectedTodo } = this.state;
    if (selectedTodo && selectedTodo.UUID === item.UUID) return this.setState({ selectedTodo: null, editorOpen: false });
    this.setState({ selectedTodo: item, editorOpen: true });
  };

  _newTodo = () => this.setState({ selectedTodo: null, editorOpen: true });

  _onSubmit = (title: ?string, description: ?string, completed: boolean) => {
    const { selectedTodo } = this.state;

    if (selectedTodo && selectedTodo.UUID) {
      Database.write(() => {
        selectedTodo.title = title || 'Untitled';
        selectedTodo.description = description;
        selectedTodo.completed = completed;
      });
    } else {
      const nextTodo = Database.createNewTodo({ title, description, completed });
      this.setState({ selectedTodo: nextTodo });
    }
  };

  _deleteTodo = (todo: ?Todo) => {
    if (!(todo && todo.UUID)) return;
    Database.deleteTodoByUUID(todo.UUID);
    this.setState({ selectedTodo: null });
  };

  _onCancel = () => this.setState({ selectedTodo: null, editorOpen: false });

  /** Renderers */

  render() {
    const { selectedTodo, editorOpen } = this.state;
    const selectedUUID = selectedTodo && selectedTodo.isValid()
      ? new Set([selectedTodo.UUID])
      : new Set();

    return (
      <View style={ styles.container }>
        <View style={ { flex: 1, flexDirection: 'row' } }>
          <TodoList todos={ this.allTodos }
                    selectedUUIDs={ selectedUUID }
                    onItemSelect={ this._toggleItemSelection } />

          <View style={ styles.separator } />

          <View style={ [styles.editorContainer, !editorOpen && MARGIN_TO_HIDE_EDITOR] }>
            <TodoEditor todo={ selectedTodo }
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