import { RealmDatabase }                                  from '../backend/db/RealmDatabase';
import { TestModel1, TestModel2, TestModel3, TestModel4 } from './mocks/models';

const schema = [TestModel1, TestModel2, TestModel3, TestModel4];
const randomPath = () => `./test_database/db${ Date.now() }.tests.realm`;
const randomDB = () => new RealmDatabase({ schema, path: randomPath() });

describe('RealmDatabase', () => {
  describe('Methods', () => {
    describe('constructor()', () => {

      let path = randomPath();
      beforeEach(() => path = randomPath());

      test('should create a db with params and empty schema', () => {
        const db = new RealmDatabase({ schema: [], path });
        expect(db).toBeInstanceOf(RealmDatabase);
        expect(db.modelClasses).toHaveLength(0);
      });

      test('should create a db with params and non empty schema', () => {
        const db = new RealmDatabase({ schema, path });
        expect(db).toBeInstanceOf(RealmDatabase);
        expect(db.modelClasses).toHaveLength(4);
      });

      test('should throw without params', () => {
        expect(() => new RealmDatabase()).toThrow();
      });

      test('should throw without schema in params', () => {
        expect(() => new RealmDatabase({ path })).toThrow();
      });
    });

    describe('beginTransaction()', () => {
      const db = randomDB();

      test('should not be in transaction before calling it', () => {
        expect(db.realm.isInTransaction).toBe(false);
      });

      test('should not be able to create objects before calling it', () => {
        expect(() => db.realm.create('TestModel1', { name: 'John' }))
          .toThrowError('Cannot modify managed objects outside of a write transaction.');
      });

      test('should be in transaction after calling it', () => {
        db.beginTransaction();
        expect(db.realm.isInTransaction).toBe(true);
      });

      test('should be able to create objects after calling it', () => {
        db.beginTransaction();
        const testModel = db.realm.create('TestModel1', { name: 'John' });
        expect(testModel).toMatchObject({
          name: 'John',
          TestModels2: {},
          TestModel3: null
        });
      });
    });

    describe('cancelTransaction()', () => {
      const db = randomDB();
      beforeEach(() => db.beginTransaction());

      test('should be in transaction before calling it', () => {
        expect(db.realm.isInTransaction).toBe(true);
      });

      test('should not be in transaction after calling it', () => {
        db.cancelTransaction();
        expect(db.realm.isInTransaction).toBe(false);
      });

      test('should cancel object creation', () => {
        const allItems = db.realm.objects('TestModel1');
        expect(allItems).toHaveLength(0);

        db.realm.create('TestModel1', { name: 'John' });
        expect(allItems).toHaveLength(1);

        db.cancelTransaction();
        expect(allItems).toHaveLength(0);
      });
    });

    describe('commitTransaction()', () => {
      const db = randomDB();
      beforeEach(() => db.beginTransaction());

      test('should be in transaction before calling it', () => {
        expect(db.realm.isInTransaction).toBe(true);
      });

      test('should not be in transaction after calling it', () => {
        db.commitTransaction();
        expect(db.realm.isInTransaction).toBe(false);
      });

      test('should save object creation', () => {
        const allItems = db.realm.objects('TestModel1');
        expect(allItems).toHaveLength(0);

        const testModel = db.realm.create('TestModel1', { name: 'John' });
        expect(allItems).toHaveLength(1);

        db.commitTransaction();
        expect(allItems).toHaveLength(1);
        expect(testModel).toMatchObject({
          name: 'John',
          TestModels2: {},
          TestModel3: null
        });
      });
    });

    describe('write()', () => {
      let db = randomDB();
      beforeEach(() => db = randomDB());

      test('should throw if no transaction passed', () => {
        expect(() => db.write()).toThrow();
      });

      test('should call beginTransaction()', () => {
        const spy = jest.spyOn(db, 'beginTransaction');
        db.write(() => {});
        expect(spy).toHaveBeenCalledTimes(1);
        spy.mockRestore();
      });

      test('should call commitTransaction()', () => {
        const spy = jest.spyOn(db, 'commitTransaction');
        db.write(() => {});
        expect(spy).toHaveBeenCalledTimes(1);
        spy.mockRestore();
      });

      test('should call cancelTransaction() on throw', () => {
        const spy = jest.spyOn(db, 'cancelTransaction');
        expect(() => db.write()).toThrow();
        expect(spy).toHaveBeenCalledTimes(2);
        spy.mockRestore();
      });

      test('should call the transaction', () => {
        const transaction = jest.fn();
        db.write(transaction);
        expect(transaction).toHaveBeenCalledTimes(1);
      });

      test('should be able to create objects', () => {
        const allItems = db.realm.objects('TestModel1');
        expect(allItems).toHaveLength(0);

        db.write(() => {
          db.realm.create('TestModel1', { name: 'John' });
          db.realm.create('TestModel1', { name: 'Doe' });
        });

        expect(allItems).toHaveLength(2);
      });

      test('should return from the transaction', () => {
        const returnable = db.write(() => db.realm.create('TestModel1', { name: 'John' }));
        expect(returnable).toMatchObject({
          name: 'John',
          TestModels2: {},
          TestModel3: null
        });
      });
    });

    describe('emptyDatabase()', () => {

      let db = randomDB();
      beforeEach(() => {
        db = randomDB();
        db.write(() => {
          db.realm.create('TestModel1', { name: 'John' });
          db.realm.create('TestModel1', { name: 'Mary' });
          db.realm.create('TestModel1', { name: 'Doe' });
          db.realm.create('TestModel2', { name: 'George' });
          db.realm.create('TestModel3', { name: 'Alex' });
        });
      });

      test(' should empty the database', () => {
        db.emptyDatabase();
        const allModel1 = db.realm.objects('TestModel1');
        const allModel2 = db.realm.objects('TestModel2');
        const allModel3 = db.realm.objects('TestModel3');
        expect(allModel1).toHaveLength(0);
        expect(allModel2).toHaveLength(0);
        expect(allModel3).toHaveLength(0);
      });
    });

    describe('deleteAll()', () => {
      let db = randomDB();
      beforeEach(() => {
        db = randomDB();
        db.write(() => {
          db.realm.create('TestModel1', { name: 'John' });
          db.realm.create('TestModel1', { name: 'Mary' });
          db.realm.create('TestModel1', { name: 'Doe' });
          db.realm.create('TestModel2', { name: 'George' });
          db.realm.create('TestModel3', { name: 'Alex' });
          db.realm.create('TestModel4', { name: 'Jak' });
        });
      });

      test('should delete the passed models', () => {
        const allModel1 = db.realm.objects('TestModel1');
        const allModel2 = db.realm.objects('TestModel2');
        const allModel3 = db.realm.objects('TestModel3');
        const allModel4 = db.realm.objects('TestModel4');

        db.deleteAll(['TestModel2', 'TestModel3']);
        expect(allModel1).toHaveLength(3);
        expect(allModel2).toHaveLength(0);
        expect(allModel3).toHaveLength(0);
        expect(allModel4).toHaveLength(1);
      });

      test('should delete the childModels even if not specified', () => {
        const allModel1 = db.realm.objects('TestModel1');
        const allModel2 = db.realm.objects('TestModel2');
        const allModel3 = db.realm.objects('TestModel3');
        const allModel4 = db.realm.objects('TestModel4');

        db.deleteAll(['TestModel1']);
        expect(allModel1).toHaveLength(0);
        expect(allModel2).toHaveLength(0);
        expect(allModel3).toHaveLength(0);
        expect(allModel4).toHaveLength(1);
      });
    });

    describe('deleteAllExcept()', () => {
      let db = randomDB();
      beforeEach(() => {
        db = randomDB();
        db.write(() => {
          db.realm.create('TestModel1', { name: 'John' });
          db.realm.create('TestModel1', { name: 'Mary' });
          db.realm.create('TestModel1', { name: 'Doe' });
          db.realm.create('TestModel2', { name: 'George' });
          db.realm.create('TestModel3', { name: 'Alex' });
          db.realm.create('TestModel4', { name: 'Jak' });
        });
      });

      test('should call emptyDatabase() if no passed models', () => {
        const spy = jest.spyOn(db, 'emptyDatabase');
        db.deleteAllExcept();
        expect(spy).toHaveBeenCalledTimes(1);
      });

      test('should empty the database if no passed models', () => {
        const allModel1 = db.realm.objects('TestModel1');
        const allModel2 = db.realm.objects('TestModel2');
        const allModel3 = db.realm.objects('TestModel3');
        const allModel4 = db.realm.objects('TestModel4');

        db.deleteAllExcept();
        expect(allModel1).toHaveLength(0);
        expect(allModel2).toHaveLength(0);
        expect(allModel3).toHaveLength(0);
        expect(allModel4).toHaveLength(0);
      });

      test('should delete all but the passed models', () => {
        const allModel1 = db.realm.objects('TestModel1');
        const allModel2 = db.realm.objects('TestModel2');
        const allModel3 = db.realm.objects('TestModel3');
        const allModel4 = db.realm.objects('TestModel4');

        db.deleteAllExcept(['TestModel1', 'TestModel4']);
        expect(allModel1).toHaveLength(3);
        expect(allModel2).toHaveLength(0);
        expect(allModel3).toHaveLength(0);
        expect(allModel4).toHaveLength(1);
      });
    });
  });

  describe('Operations', () => {
    describe('Creation', () => {
      let db = randomDB();
      beforeEach(() => db = randomDB());

      test('should ignore non-schema properties', () => {
        const item = db.write(() => db.realm.create('TestModel1', { name: 'John', irrelevantProperty: 3 }));
        expect(item.irrelevantProperty).toBe(undefined);
      });
    });
  });
});