/**
 * @flow
 *
 * A Component that displays input fields to
 * edit or create an item.
 *
 * Accepts an optional item to edit (or create new
 * item in case of no item passed), and three methods
 * to handle submitting the inputs, deleting the item
 * or canceling the procedure.
 */

import React, { Component } from 'react';
import {
  StyleSheet, View, Text,
  TextInput, Switch, Button
}                           from 'react-native';

/** Models / Types */
import Todo                 from '../../../backend/db/models/Todo';

type Props = {
  todo: ?Todo,
  onSubmit: (title: ?string, description: ?string, completed: boolean) => void,
  onDeleteTodo: (todo: ?Todo) => void,
  onCancel: () => void
}

type State = {
  title: ?string,
  description: ?string,
  completed: boolean
}

export default class TodoEditor extends Component<Props, State> {

  static defaultProps = {
    onSubmit: () => {},
    onDeleteTodo: () => {},
    onCancel: () => {}
  };

  constructor(props: Props) {
    super(props);
    this.state = this._mapTodoToState(props.todo);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { todo } = this.props;
    const { todo: nextTodo } = nextProps;
    if (todo !== nextTodo) this.setState(this._mapTodoToState(nextTodo));
  }

  /** Input Handlers */

  _onTitleChange = (title: ?string) => this.setState({ title });
  _onDescriptionChange = (description: ?string) => this.setState({ description });

  /** Button Handlers */

  _onCompletedChange = (completed: boolean) => this.setState({ completed });

  _onSubmit = () => {
    const { title, description, completed } = this.state;
    this.props.onSubmit(title, description, completed);
  };

  _onCancel = () => this.props.onCancel();

  _onDelete = () => this.props.onDeleteTodo(this.props.todo);

  /** Generic Handlers */

  _mapTodoToState = (todo: ?Todo) => ({
    title: todo && todo.isValid() && todo.title || null,
    description: todo && todo.isValid() && todo.description || null,
    completed: todo && todo.isValid() ? todo.completed : false
  });

  /** Renderers */

  _renderTitle = () => {
    const { title } = this.state;

    return (
      <View style={ [styles.inputContainer, { maxHeight: 100 }] }>
        <Text style={ styles.title }>Title:</Text>
        <TextInput value={ title }
                   placeholder='Title'
                   onChangeText={ this._onTitleChange }
                   maxLength={ 100 }
                   multiline={ true }
                   style={ styles.inputText }
        />
      </View>
    );
  };

  _renderDescription = () => {
    const { description } = this.state;

    return (
      <View style={ [styles.inputContainer, { maxHeight: 300 }] }>
        <Text style={ styles.title }>Description:</Text>
        <TextInput value={ description }
                   placeholder='Description'
                   onChangeText={ this._onDescriptionChange }
                   maxLength={ 300 }
                   multiline={ true }
                   style={ styles.inputText }
        />
      </View>
    );
  };

  _renderCompletedToggle = () => {
    const { completed } = this.state;

    return (
      <View style={ styles.rowContainer }>
        <Text style={ styles.title }>Completed</Text>
        <View style={ { width: 16 } } />
        <Switch value={ completed } onValueChange={ this._onCompletedChange } />
      </View>
    );
  };

  _renderCreationDate = () => {
    const { todo } = this.props;

    return (
      <View style={ styles.rowContainer }>
        <Text style={ styles.title }>Creation Date</Text>
        <View style={ { width: 16 } } />
        <Text style={ styles.inputText }>
          { todo && todo.creationDate.toLocaleDateString('el-GR') || '' }
        </Text>
      </View>
    );
  };

  _renderEmpty = () => {
    return (
      <View style={ { flex: 1, alignItems: 'center', justifyContent: 'center' } }>
        <Text>The item is no longer valid.</Text>
        <Button title='Go Back' onPress={ this._onCancel } />
      </View>
    );
  };

  render() {
    const { todo } = this.props;
    if (todo && !todo.isValid()) return this._renderEmpty();

    return (
      <View style={ styles.container }>
        { this._renderTitle() }
        { this._renderDescription() }
        { this._renderCompletedToggle() }
        { !!todo && this._renderCreationDate() }

        <View style={ [styles.rowContainer, { justifyContent: 'center' }] }>
          <Button title={ !!todo ? 'Submit' : 'Create New Todo' } onPress={ this._onSubmit } />
          { !!todo && <Button title='Delete Todo' color='red' onPress={ this._onDelete } /> }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputContainer: {
    minHeight: 60,
    justifyContent: 'center',
    paddingVertical: 8
  },
  rowContainer: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center'
  },
  separator: {
    height: 2,
    backgroundColor: 'grey'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  inputText: {
    fontSize: 16,
    color: 'grey'
  }
});