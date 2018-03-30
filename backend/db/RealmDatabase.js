/**
 * @flow
 *
 * This is an abstraction of the realm database
 * so that we can extend this and create multiple databases
 * with different schemas and logic each.
 *
 * This should be changed for optimizations only
 * and not for application specific logic like
 * query, create and update operations.
 */

import Realm       from 'realm';

/** Models / Types */
import RealmObject from './RealmObject';

export type RealmParams = {
  schema: any[],
  schemaVersion: number,
  path?: string,
  migration?: any,
}

export class RealmDatabase {
  _realmInstance: Realm;
  _modelClasses: any[];
  _path: ?string = null;

  constructor(realmParams: RealmParams) {
    const { schema, schemaVersion, path, migration } = realmParams;
    const params: RealmParams = { schema, schemaVersion };

    if (migration) params.migration = migration;
    if (path) {
      this.path = path;
      params.path = path;
    }

    this.realm = new Realm(params);
    this.modelClasses = params.schema.map((ModelClass: any) => ModelClass);
  }

  /** Transaction Handlers */

  /**
   * Opens the realm ready for a synchronous transaction
   * this is required for every time you need to change
   * a realm object. Use the write() method instead with a
   * callback transaction for better handling of the transaction
   * lifecycle.
   */
  beginTransaction = (): void => {
    if (!this.isInTransaction) this.realm.beginTransaction();
  };

  /**
   * Closes an open transaction so that the realm is ready
   * to start another transaction with a beginTransaction.
   * This is better to be used inside the catch block of a
   * try catch to make sure that an failed transaction
   * closes the transaction state of the realm.
   */
  cancelTransaction = (): void => {
    if (this.isInTransaction) this.realm.cancelTransaction();
  };

  /**
   * Commits an open transaction to the realm and throws
   * if everything goes wrong.
   */
  commitTransaction = (): void => {
    if (this.isInTransaction) this.realm.commitTransaction();
  };


  /**
   * We check if it is already in transaction because this
   * might be called when another part of the app is creating
   * a transaction so we want to make sure that if the newest
   * transaction fails, it will not cancel the older transaction
   */
  write = (transaction: () => any): any => {
    const alreadyInTransaction = this.isInTransaction;
    let returnable;

    try {
      if (!alreadyInTransaction) this.beginTransaction();
      returnable = transaction();
      if (!alreadyInTransaction) this.commitTransaction();

    } catch (error) {
      if (!alreadyInTransaction) this.cancelTransaction();
      this.handleErrors(error);
    }

    return returnable;
  };

  /** Transactions */

  /**
   * Empties the entire database
   */
  emptyDatabase = (): void => {
    this.write(() => this.realm.deleteAll());
  };

  /**
   * Deletes the entire collection of each model in
   * the models array
   * @param models {string[]} the models to delete
   */
  deleteAll = (models: string[]): void => {
    if (!(models && models.length)) return;

    this.write(() => {
      for (let i = 0, { length } = models; i < length; i++) {
        const model = models[i];
        const modelClass = this.modelClasses.find(({ schema }) => schema.name === model);
        if (!!modelClass) {
          this.deleteAll(modelClass.childModels);
          const modelObjects = this.realm.objects(model);

          this.realm.delete(modelObjects);
        }
      }
    });
  };

  /**
   * Deletes the collections of each model in this database
   * except from the ones specified in the models array
   * @param models {string[]} the models to skip deletion for
   */
  deleteAllExcept = (models: string[]): void => {
    if (!(models && models.length)) this.emptyDatabase();

    const modelsToDelete = this.modelClasses
      .map(({ schema }) => schema.name)
      .filter((type: string) => !models.includes(type));

    this.deleteAll(modelsToDelete);
  };

  /** Generic Handlers */

  handleErrors = (error: Error): void => {
    this.cancelTransaction();
    throw new Error(error);
  };

  /** Getters / Setters */

  /**
   * The actual instance of the realm database
   * this abstraction uses
   * @param db the Realm database
   */
  set realm(db: Realm) { this._realmInstance = db; }
  get realm(): Realm { return this._realmInstance; }

  /**
   * The location to save the database files.
   */
  set path(path: ?string) { this._path = path; }
  get path(): ?string { return this._path; }

  /**
   * A collection of classes that constitute the schema of this
   * database. This helps for methods like deleteAllExcept() and deleteAl()
   * @param classes
   * @returns {RealmObject[]}
   */
  set modelClasses(classes: (typeof RealmObject)[]) { return this._modelClasses = classes; }
  get modelClasses(): (typeof RealmObject)[] { return this._modelClasses; }

  /**
   * Boolean check to see if the realm is currently in a transaction
   * @returns {boolean}
   */
  get isInTransaction(): boolean { return this.realm.isInTransaction; }
}