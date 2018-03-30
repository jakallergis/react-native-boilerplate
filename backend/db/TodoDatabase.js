/**
 * @flow
 *
 * This is the actual database that extends
 * the RealmDatabase abstraction and will contain
 * the initialization logic and operations like
 * getting, creating and updating models. This is
 * what you import from other modules when you
 * need database operations.
 *
 * This is a sample implementation with minimal
 * functionality, but you could extend it with an
 * HTTP mapper to map objects from HTTP Responses
 * to the actual schemas you create for this database
 */

import Realm                from 'realm';

/** Models / Types */
import type { RealmParams } from './RealmDatabase';
import { schema, Todo }     from './models';

/** Utilities */
import { RealmDatabase }    from './RealmDatabase';

export class TodoDatabase extends RealmDatabase {

  /**
   * I'm not adding any migration strategies so whenever
   * i make a breaking change, like adding a model or changing
   * a schema property, and don't want to uninstall/reinstall
   * the application in order to test it will just increment the
   * schemaVersion and deleteRealmIfMigrationNeeded will take care
   * of emptying the database without complains. When an app goes
   * live though, you should use migration strategies every time you
   * make breaking changes otherwise your users will have to uninstall
   * the app and reinstall it every time you publish such an update
   */
  constructor(schema: any[], path?: string) {
    const params: RealmParams = { schema, schemaVersion: 0, path, deleteRealmIfMigrationNeeded: true };
    super(params);
  }

  /** Realm Getters */

  getAllTodos = (): Realm.Results<Todo> => this.realm.objects('Todo');

  /** Database Getters */
  getTodoByUUID = (UUID: ?string): ?Todo => this.realm.objectForPrimaryKey('Todo', UUID || '');
  getCompleteTodos = (): Realm.Results<Todo> => this.getAllTodos().filtered('completed == true');
  getIncompleteTodos = (): Realm.Results<Todo> => this.getAllTodos().filtered('completed == false');

  /** Creators */

  createNewTodo = ({ title = 'Untitled', completed = false, ...todo }: any = {}): Todo => {
    if (!title) title = 'Untitled';
    const UUID = `${ this.randomString(4) }-${ this.randomString(4) }-${ this.randomString(4) }-${ this.randomString(4) }`;
    const creationDate = new Date();

    const writeableTodo = { UUID, title, completed, creationDate, ...todo };

    return this.write(() => {
      return this.realm.create('Todo', writeableTodo, true); // Create or Update
    });
  };

  /** Deleters */

  deleteTodoByUUID = (UUID: string): void => {
    const todo = this.getTodoByUUID(UUID);
    if (!(todo && todo.UUID)) return;
    this.write(() => this.realm.delete(todo));
  };

  /** Updaters */

  updateTodoToCompletedByUUID = (UUID: string): void => {
    const todo = this.getTodoByUUID(UUID);
    if (!(todo && todo.UUID)) return;
    this.write(() => todo.completed = true);
  };

  /** Generic Helpers */

  randomString = (size: number = 0) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let indexMap = [];
    for (let i = 0; i < Math.max(1, size); i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      indexMap.push(randomIndex);
    }

    return indexMap.map(index => chars[index]).join('');
  };
}

/**
 * For the purposes of the boilerplate's demo
 * and in most cases you would want your db to
 * be a singleton. However we do export the class
 * itself as well for better use with unit tests.
 */
export default new TodoDatabase(schema);