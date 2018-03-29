/**
 * @flow
 *
 * Here we export all the models so that
 * we can access them all together wherever
 * we need them like "import { Todo } from '....../models'.
 *
 * @Note: We export a 'schema' array of models
 * because this is how we add them in the Realm
 * Database schema.
 */

import Todo from './Todo';

export {
  Todo
};

export const schema = [
  Todo
];