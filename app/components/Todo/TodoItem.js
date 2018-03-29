/**
 * @flow
 *
 * A Component that displays a provided Todos item.
 *
 * Accepts the actual item, an isSelected prop to
 * display selection state, and to methods for selecting
 * and editing the item.
 */

import React, { Component }                         from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

/** Models / Types */
import Todo                                         from '../../../backend/db/models/Todo';

type Props = {
  todo: Todo,
  isSelected: boolean,
  onSelect: (item: Todo) => void,
  onEdit: ?(item: Todo) => void
}

export default class TodoItem extends Component<Props> {

  /** Button Handlers */

  _onEdit = () => this.props.onEdit && this.props.onEdit(this.props.todo);
  _onSelect = () => this.props.onSelect(this.props.todo);

  /** Renderers */

  render() {
    const { todo, isSelected, onEdit } = this.props;
    const { completed } = todo;

    return (
      <View style={ styles.container }>
        <TouchableOpacity onPress={ this._onSelect } activeOpacity={ 0.5 } disabled={ onEdit && todo.completed }
                          style={ [styles.selectButton, isSelected && styles.selectedButton] }>

          <Text numberOfLines={ 2 } style={ [styles.title, completed && styles.completedText] }>
            { todo.title }
          </Text>
          <Text numberOfLines={ 2 } style={ styles.description }>{ todo.description }</Text>
        </TouchableOpacity>

        { !!onEdit && <View style={ styles.separator } /> }

        { !!onEdit && (
          <TouchableOpacity onPress={ this._onEdit } style={ styles.editButton }>
            <Text style={ styles.title }>Edit</Text>
          </TouchableOpacity>
        ) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgb(200, 200, 200)'
  },
  separator: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgb(200, 200, 200)'
  },
  selectButton: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    alignSelf: 'stretch'
  },
  selectedButton: {
    backgroundColor: '#dcdde1'
  },
  editButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  description: {
    fontSize: 16,
    color: 'grey'
  },
  selectedText: {
    color: 'white'
  },
  completedText: {
    color: 'grey',
    textDecorationLine: 'line-through'
  }
});