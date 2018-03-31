import { TodoDatabase } from '../backend/db/TodoDatabase';
import { Todo }         from './mocks/models';

const schema = [Todo];
const randomPath = () => `./test_database/db${ Date.now() }.tests.realm`;
const randomDB = () => new TodoDatabase(schema, randomPath());

describe('TodoDatabase', () => {
  let db = randomDB();
  beforeEach(() => db = randomDB());

  describe('constructor()', () => {
    let path = randomPath();
    beforeEach(() => path = randomPath());

    test('should create a db with params and empty schema', () => {
      const db = new TodoDatabase([], randomPath());
      expect(db).toBeInstanceOf(TodoDatabase);
      expect(db.modelClasses).toHaveLength(0);
    });

    test('should create a db with params and non empty schema', () => {
      const db = new TodoDatabase(schema, randomPath());
      expect(db).toBeInstanceOf(TodoDatabase);
      expect(db.modelClasses).toHaveLength(1);
    });

    test('should throw without params', () => {
      expect(() => new TodoDatabase()).toThrow();
    });

    test('should throw with falsy schema in params', () => {
      expect(() => new TodoDatabase(null)).toThrow();
    });
  });

  describe('randomString()', () => {
    test('should return a given sized string', () => {
      const string1 = db.randomString(1);
      const string2 = db.randomString(2);
      const string3 = db.randomString(3);
      const string3a = db.randomString(3);
      const string3b = db.randomString(3);
      expect(string1.length).toBe(1);
      expect(string2.length).toBe(2);
      expect(string3.length).toBe(3);
      expect(string3a.length).toBe(3);
      expect(string3b.length).toBe(3);
    });

    test('should return random strings', () => {
      expect.assertions(100);
      let prevString = db.randomString(4);
      for (let i = 0; i < 100; i++) {
        const string = db.randomString(4);
        expect(string).not.toBe(prevString);
        prevString = string;
      }
    });
  });

  describe('createNewTodo()', () => {
    describe('if no params passed', () => {
      test('should create a todo with random UUID', () => {
        const todo = db.createNewTodo();
        expect(todo.UUID).toEqual(expect.any(String));
      });

      test('should create a todo with title Untitled', () => {
        const todo = db.createNewTodo();
        expect(todo.title).toBe('Untitled');
      });

      test('should create a todo with completed false', () => {
        const todo = db.createNewTodo();
        expect(todo.title).toBe('Untitled');
      });

      test('should create a todo with creationDate at the time of creation', () => {
        const todo = db.createNewTodo();
        expect(todo.creationDate).toBeInstanceOf(Date);
      });
    });

    describe('if any params passed', () => {
      test('should throw if param of wrong type passed', () => {
        expect(() => db.createNewTodo({ title: 2 })).toThrow();
      });

      test('should create a new todo with the title passed', () => {
        const todo = db.createNewTodo({ title: 'Groceries' });
        expect(todo.title).toBe('Groceries');
      });

      test('should create a new todo with completed as passed', () => {
        const completeTodo = db.createNewTodo({ completed: true });
        const incompleteTodo = db.createNewTodo({ completed: false });
        expect(completeTodo.completed).toBe(true);
        expect(incompleteTodo.completed).toBe(false);
      });

      test('should create a new todo with creationDate as passed', () => {
        const now = new Date();
        const todo = db.createNewTodo({ creationDate: now });
        expect(todo.creationDate).toMatchObject(now);
      });

      test('should create a new todo or update an existing', () => {
        const firstTodo = db.createNewTodo();
        expect(firstTodo.title).toBe('Untitled');
        const secondTodo = db.createNewTodo({ UUID: firstTodo.UUID, title: 'Updated Todo' });
        expect(firstTodo.title).toBe('Updated Todo');
        expect(firstTodo).toMatchObject(secondTodo);
      });
    });
  });

  describe('getAllTodos()', () => {
    test('should fetch all todos', () => {
      const allTodos = db.getAllTodos();
      expect(allTodos).toHaveLength(0);
      db.createNewTodo({ UUID: 'test1-UUID', title: 'test1' });
      db.createNewTodo({ UUID: 'test2-UUID', title: 'test2' });
      expect(allTodos).toHaveLength(2);
    });
  });

  describe('getTodoByUUID()', () => {
    const testUUID = 'test-UUID';

    test('should fetch the todo', () => {
      db.createNewTodo({ UUID: testUUID });
      const todo = db.getTodoByUUID(testUUID);
      expect(todo.UUID).toBe(testUUID);
    });

    test('should return undefined if not found', () => {
      const todo = db.getTodoByUUID(testUUID);
      expect(todo).toBe(undefined);
    });

    test('should return undefined if no UUID passed', () => {
      const todo = db.getTodoByUUID();
      expect(todo).toBe(undefined);
    });

    test('should throw if UUID of wrong type passed', () => {
      expect(() => db.getTodoByUUID(2)).toThrow();
    });
  });

  describe('getCompleteTodos()', () => {
    test('should get only completed todos', () => {
      db.createNewTodo({ completed: true });
      db.createNewTodo({ completed: true });
      db.createNewTodo({ completed: true });
      db.createNewTodo({ completed: false });
      db.createNewTodo({ completed: false });
      db.createNewTodo({ completed: false });
      db.createNewTodo({ completed: false });

      expect.assertions(4);
      const todos = db.getCompleteTodos();
      expect(todos).toHaveLength(3);
      todos.forEach(todo => expect(todo.completed).toBe(true));
    });
  });

  describe('getIncompleteTodos()', () => {
    test('should get only incomplete todos', () => {
      db.createNewTodo({ completed: true });
      db.createNewTodo({ completed: true });
      db.createNewTodo({ completed: true });
      db.createNewTodo({ completed: false });
      db.createNewTodo({ completed: false });
      db.createNewTodo({ completed: false });
      db.createNewTodo({ completed: false });

      expect.assertions(5);
      const todos = db.getIncompleteTodos();
      expect(todos).toHaveLength(4);
      todos.forEach(todo => expect(todo.completed).toBe(false));
    });
  });

  describe('deleteTodoByUUID()', () => {
    test('should delete a todo by UUID', () => {
      const todo = db.createNewTodo();
      expect(todo.title).toBe('Untitled');

      db.deleteTodoByUUID(todo.UUID);
      expect(() => todo.title)
        .toThrow('Accessing object of type Todo which has been invalidated or deleted');
    });

    test('should call getTodoByUUID()', () => {
      const spy = jest.spyOn(db, 'getTodoByUUID');
      const todo = db.createNewTodo();
      const UUID = todo.UUID;
      db.deleteTodoByUUID(UUID);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toBeCalledWith(UUID);
      spy.mockRestore();
    });

    test('should call write()', () => {
      const todo = db.createNewTodo();
      const spy = jest.spyOn(db, 'write');
      const UUID = todo.UUID;
      db.deleteTodoByUUID(UUID);
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    test('should do nothing if UUID not found', () => {
      const getTodoByUUID = jest.spyOn(db, 'getTodoByUUID');
      const write = jest.spyOn(db, 'write');
      const UUID = 'just a UUID';
      db.deleteTodoByUUID(UUID);
      expect(getTodoByUUID).toHaveBeenCalledTimes(1);
      expect(getTodoByUUID).toBeCalledWith(UUID);
      expect(write).not.toBeCalled();
    });

    test('should throw if UUID of wrong type passed', () => {
      expect(() => db.deleteTodoByUUID(2)).toThrow();
    });
  });

  describe('updateTodoToCompletedByUUID()', () => {
    test('should update a todo\'s completed property to true', () => {
      const todo = db.createNewTodo();
      expect(todo.completed).toBe(false);

      db.updateTodoToCompletedByUUID(todo.UUID);
      expect(todo.completed).toBe(true);
    });

    test('should call getTodoByUUID()', () => {
      const spy = jest.spyOn(db, 'getTodoByUUID');
      const todo = db.createNewTodo();
      const UUID = todo.UUID;
      db.updateTodoToCompletedByUUID(UUID);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toBeCalledWith(UUID);
      spy.mockRestore();
    });

    test('should call write()', () => {
      const todo = db.createNewTodo();
      const spy = jest.spyOn(db, 'write');
      const UUID = todo.UUID;
      db.updateTodoToCompletedByUUID(UUID);
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    test('should do nothing if UUID not found', () => {
      const getTodoByUUID = jest.spyOn(db, 'getTodoByUUID');
      const write = jest.spyOn(db, 'write');
      const UUID = 'just a UUID';
      db.updateTodoToCompletedByUUID(UUID);
      expect(getTodoByUUID).toHaveBeenCalledTimes(1);
      expect(getTodoByUUID).toBeCalledWith(UUID);
      expect(write).not.toBeCalled();
    });

    test('should throw if UUID of wrong type passed', () => {
      expect(() => db.updateTodoToCompletedByUUID(2)).toThrow();
    });
  });
});