/**
 * @flow
 *
 * The base class to extend by all of our Models.
 *
 * Extending this class is required for EVERY model
 * you want to create for the Realm db because of the
 * implementation of our RealmDatabase class where
 * methods like deleteAll() and deleteAllExcept()
 * rely on getters from this class.
 */

import Realm from 'realm';

/** Globals */
const { Reactotron } = global;

export default class RealmObject extends Realm.Object {

  /**
   * This is an array of model names that are considered
   * child models to a model overriding this.
   *
   * @example Lets say we have a User model and a UserQuotes model
   * and the User has a quotes property which is a list of UserQuotes.
   * If you want to delete all Users, then it only makes sense that you want
   * to delete the UserQuotes as well. So instead of deleting both the
   * models independently you can do a RealmDatabase.deleteAll(['User'])
   * and the method will go through the childModels defined in the User
   * class and delete those models as well.
   *
   * @type {Array} the Model names that are considered children to a Model A and you would
   * like to be deleted as well when you use methods like RealmDatabase.deleteAll(['A'])
   */
  static childModels: string[] = [];

  /**
   * This is to handle circular objects when trying to
   * log items with tools like Reactotron.
   * @param totalDepth the total levels deep to go for nested objects.
   * @param currentLevel the level to start from
   */
  flattened = (totalDepth: number = 4, currentLevel: number = 0): any => {
    if (!__DEV__) throw new Error('RealmObject: flattened() should be used only for debugging');

    const depthReached = currentLevel >= totalDepth;

    const prototype = Object.getPrototypeOf(this);
    const prototypeProperties = Object.getOwnPropertyNames(prototype);
    const schemaProperties = Object.getOwnPropertyNames(this.schema.properties);
    const result = {};

    for (let i = 0, { length } = prototypeProperties; i < length; i++) {
      const name = prototypeProperties[i];
      try {
        if (!depthReached && !schemaProperties.includes(name) && !!this[name]) {
          if (this[name].flattened) {
            result[name] = this[name].flattened(totalDepth, currentLevel + 1);
          } else {
            result[name] = this[name];
          }
        }
      } catch (e) {
        Reactotron.display({
          name: 'ERROR: flatten()',
          preview: e.message,
          value: e.message,
          important: true
        });
      }
    }

    for (let i = 0, { length } = schemaProperties; i < length; i++) {
      const name = schemaProperties[i];
      const schemaProperty = this.schema.properties[name];

      let property = this[name];
      if (['list', 'linkingObjects'].includes(schemaProperty.type)) {
        depthReached
          ? property = `${ schemaProperty.objectType }[]`
          : property = property.map((item) => item.flattened(totalDepth, currentLevel + 1)).filter(Boolean);
      }
      else if (property && property.schema) property = property.flattened(totalDepth, currentLevel + 1);

      result[name] = property;
    }

    return result;
  };

  /**
   * These are required to help us know the type of a realm object at runtime.
   *
   * If we were to use the Class.name property we would not get what we expected
   * because of the name mangling that takes place upon bundling the js code.
   * So since Realm requires as to define schemas as statics and give a name
   * property to each schema, it's only logical to get the name of an object
   * from its schema definition.
   * @return {string} the actual name of an object
   */
  get schema(): Realm.ObjectSchema { return this.objectSchema(); }
  get type(): string { return this.schema.name; }
}