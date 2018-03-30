import { Todo as TodoModel } from '../../backend/db/models';

export class Todo {
  static schema = TodoModel.schema;
}

export class TestModel1 {
  static schema = {
    name: 'TestModel1',
    primaryKey: 'name',
    properties: {
      name: 'string',
      TestModels2: { type: 'list', objectType: 'TestModel2' },
      TestModel3: 'TestModel3'
    }
  };
  static childModels = ['TestModel2', 'TestModel3'];
}

export class TestModel2 {
  static schema = {
    name: 'TestModel2',
    properties: { name: 'string' }
  };
}

export class TestModel3 {
  static schema = {
    name: 'TestModel3',
    properties: { name: 'string' }
  };
}

export class TestModel4 {
  static schema = {
    name: 'TestModel4',
    properties: { name: 'string' }
  };
}