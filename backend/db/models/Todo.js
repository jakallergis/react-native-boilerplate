/**
 * @flow
 *
 * The implementation of the Todo Model.
 * Here we could add methods, getters, and setters
 * to use with our models.
 *
 * @Note: Any properties that are not in the
 * schema will be ignored upon creation in the
 * Realm. Only methods and getters/setters
 * that you define here will be available.
 */

/** Utilities */
import RealmObject from '../RealmObject';

export default class Todo extends RealmObject {
  static schema = {
    name: 'Todo',
    primaryKey: 'UUID',
    properties: {
      UUID: 'string',
      title: 'string',
      description: 'string?',
      creationDate: 'date',
      completed: { type: 'bool', optional: true, default: false }
    }
  };

  UUID: string;
  title: string;
  description: ?string;
  creationDate: Date;
  completed: boolean;
}
