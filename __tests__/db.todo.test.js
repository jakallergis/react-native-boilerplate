import { TodoDatabase } from '../backend/db/TodoDatabase';
import { Todo }         from './mocks/models';

const schema = [Todo];
const randomPath = () => `./test_database/db${ Date.now() }.tests.realm`;
const randomDB = () => new TodoDatabase(schema, randomPath());

describe('TodoDatabase constructor', () => {
  let path = randomPath();
  beforeEach(() => path = randomPath());

  test('should create a db with params and empty schema', () => {
    const db = new TodoDatabase([], randomPath());
    expect(db).toBeTruthy();
    expect(db.modelClasses.length).toBe(0);
  });

  test('should create a db with params and non empty schema', () => {
    const db = new TodoDatabase(schema, randomPath());
    expect(db).toBeTruthy();
    expect(db.modelClasses.length).toBe(1);
  });

  test('should throw without params', () => {
    expect(() => new TodoDatabase()).toThrow();
  });

  test('should throw with falsy schema in params', () => {
    expect(() => new TodoDatabase(null)).toThrow();
  });
});

describe('TodoDatabase methods', () => {

  let db = randomDB();
  beforeEach(() => db = randomDB());

  test('createNewTodo should create new todos', () => {
    const now = new Date();
    const todo = db.createNewTodo({ creationDate: now });
    expect(typeof todo.UUID).toBe('string');
    expect(todo.title).toBe('Untitled');
    expect(todo.description).toBe(null);
    expect(todo.creationDate.getTime()).toBe(now.getTime());
  });

  test('createNewTodo inserts or updates', () => {
    const firstTodo = db.createNewTodo();
    expect(firstTodo.title).toBe('Untitled');

    const secondTodo = db.createNewTodo({ UUID: firstTodo.UUID, title: 'Updated Todo' });
    expect(firstTodo.title).toBe('Updated Todo');
    expect(secondTodo.title).toBe('Updated Todo');
  });

  test('createNewTodo should throw on invalid property types', () => {
    expect(() => db.createNewTodo({ title: 2 })).toThrow();
  });

  test('getAllTodos should fetch all todos', () => {
    const allTodos = db.getAllTodos();
    expect(allTodos.length).toBe(0);

    db.createNewTodo({ UUID: 'test1-UUID', title: 'test1' });
    db.createNewTodo({ UUID: 'test2-UUID', title: 'test2' });

    expect(allTodos.length).toBe(2);
  });

  test('getTodoByUUID should get a todo by its UUID', () => {
    const testUUID = 'test-UUID';
    db.createNewTodo({ UUID: testUUID });

    const todo = db.getTodoByUUID(testUUID);
    expect(todo.UUID).toBe(testUUID);
    expect(todo.title).toBe('Untitled');

    expect(db.getTodoByUUID('1')).toBe(undefined);
    expect(db.getTodoByUUID()).toBe(undefined);
  });

  test('getCompleteTodos should return complete todos', () => {
    db.createNewTodo({ completed: true });
    db.createNewTodo({ completed: true });
    db.createNewTodo({ completed: true });
    db.createNewTodo({ completed: false });
    db.createNewTodo({ completed: false });
    db.createNewTodo({ completed: false });

    const allCompleteTodos = db.getCompleteTodos();
    expect(allCompleteTodos.length).toBe(3);
    allCompleteTodos.forEach((todo) => expect(todo.completed).toBe(true));
  });

  test('getIncompleteTodos should return incomplete todos', () => {
    db.createNewTodo({ completed: true });
    db.createNewTodo({ completed: true });
    db.createNewTodo({ completed: true });
    db.createNewTodo({ completed: false });
    db.createNewTodo({ completed: false });
    db.createNewTodo({ completed: false });

    const allIncompleteTodos = db.getIncompleteTodos();
    expect(allIncompleteTodos.length).toBe(3);
    allIncompleteTodos.forEach((todo) => expect(todo.completed).toBe(false));
  });

  test('deleteTodoByUUID should delete a todo by UUID', () => {
    const todo = db.createNewTodo();
    expect(todo.title).toBe('Untitled');

    db.deleteTodoByUUID(todo.UUID);
    expect(() => todo.title).toThrowError('Accessing object of type Todo which has been invalidated or deleted');
  });

  test('updateTodoToCompletedByUUID should complete a todo by UUID', () => {
    const todo = db.createNewTodo();
    expect(todo.completed).toBe(false);

    db.updateTodoToCompletedByUUID(todo.UUID);
    expect(todo.completed).toBe(true);
  });

  test('randomString should create a given sized random string', () => {
    const string1 = db.randomString(1);
    expect(string1.length).toBe(1);

    const string2 = db.randomString(2);
    expect(string2.length).toBe(2);

    const string3 = db.randomString(3);
    expect(string3.length).toBe(3);

    const string3a = db.randomString(3);
    expect(string3a.length).toBe(3);

    const string3b = db.randomString(3);
    expect(string3b.length).toBe(3);

    expect(string3 === string3a).toBeFalsy();
    expect(string3 === string3b).toBeFalsy();
    expect(string3a === string3b).toBeFalsy();
  });
});