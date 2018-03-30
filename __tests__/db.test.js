import { RealmDatabase }                                  from '../backend/db/RealmDatabase';
import { TestModel1, TestModel2, TestModel3, TestModel4 } from './mocks/models';

const schema = [TestModel1, TestModel2, TestModel3, TestModel4];
const randomPath = () => `./test_database/db${ Date.now() }.tests.realm`;
const randomDB = () => new RealmDatabase({ schema, path: randomPath() });

describe('RealmDatabase constructor', () => {

  let path = randomPath();
  beforeEach(() => path = randomPath());

  test('should create a db with params and empty schema', () => {
    const db = new RealmDatabase({ schema: [], path });
    expect(db).toBeTruthy();
    expect(db.modelClasses.length).toBe(0);
  });

  test('should create a db with params and non empty schema', () => {
    const db = new RealmDatabase({ schema, path });
    expect(db).toBeTruthy();
    expect(db.modelClasses.length).toBe(4);
  });

  test('should throw without params', () => {
    expect(() => new RealmDatabase()).toThrow();
  });

  test('should throw without schema in params', () => {
    expect(() => new RealmDatabase({ path })).toThrow();
  });

});

describe('RealmDatabase methods', () => {

  let db = randomDB();
  beforeEach(() => db = randomDB());

  test('beginTransaction should init transactions', () => {
    db.beginTransaction();
    expect(db.realm.isInTransaction).toBeTruthy();

    const sampleModel = db.realm.create('TestModel1', { name: 'John', irrelevantProperty: 3 });
    expect(sampleModel.name).toBe('John');
    expect(sampleModel.TestModels2).toBeTruthy();
    expect(sampleModel.TestModel3).toBe(null);
    expect(sampleModel.irrelevantProperty).toBe(undefined);
  });

  test('cancelTransaction should cancel a transaction', () => {
    db.beginTransaction();
    expect(db.realm.isInTransaction).toBeTruthy();

    const sampleModel = db.realm.create('TestModel1', { name: 'John' });
    expect(sampleModel.name).toBe('John');

    const allItems = db.realm.objects('TestModel1');
    expect(allItems.length).toBe(1);

    db.cancelTransaction();
    expect(db.realm.isInTransaction).toBeFalsy();
    expect(allItems.length).toBe(0);
  });

  test('commitTransaction should commit a transaction', () => {
    db.beginTransaction();
    expect(db.realm.isInTransaction).toBeTruthy();

    const sampleModel = db.realm.create('TestModel1', { name: 'John', irrelevantProperty: 3 });
    expect(sampleModel.name).toBe('John');

    db.commitTransaction();
    expect(db.realm.isInTransaction).toBeFalsy();
    expect(sampleModel.name).toBe('John');
    expect(sampleModel.TestModels2).toBeTruthy();
    expect(sampleModel.TestModel3).toBe(null);
    expect(sampleModel.irrelevantProperty).toBe(undefined);

    const allItems = db.realm.objects('TestModel1');
    expect(allItems.length).toBe(1);
  });

  test('write should run a transaction and return its return', () => {
    expect(db.realm.isInTransaction).toBeFalsy();

    const returnable = db.write(() => {
      expect(db.realm.isInTransaction).toBeTruthy();
      const sampleModel = db.realm.create('TestModel1', { name: 'John' });
      expect(sampleModel.name).toBe('John');
      return sampleModel;
    });

    expect(db.realm.isInTransaction).toBeFalsy();
    expect(returnable.name).toBe('John');
    const allItems = db.realm.objects('TestModel1');
    expect(allItems.length).toBe(1);

    expect(() => db.write(() => {
      expect(db.realm.isInTransaction).toBeTruthy();
      throw new Error('Threw inside RealmDatabase.write');
    })).toThrowError('Threw inside RealmDatabase.write');
    expect(db.realm.isInTransaction).toBeFalsy();
  });

  test('emptyDatabase should empty the whole database', () => {
    db.write(() => {
      db.realm.create('TestModel1', { name: 'John' });
      db.realm.create('TestModel1', { name: 'Mary' });
      db.realm.create('TestModel1', { name: 'Doe' });
      db.realm.create('TestModel2', { name: 'George' });
      db.realm.create('TestModel3', { name: 'Alex' });
    });

    const allModel1 = db.realm.objects('TestModel1');
    const allModel2 = db.realm.objects('TestModel2');
    const allModel3 = db.realm.objects('TestModel3');
    expect(allModel1.length).toBe(3);
    expect(allModel2.length).toBe(1);
    expect(allModel3.length).toBe(1);

    db.emptyDatabase();
    expect(allModel1.length).toBe(0);
    expect(allModel2.length).toBe(0);
    expect(allModel3.length).toBe(0);
  });

  test('deleteAll should delete passed models and their childModels', () => {
    db.write(() => {
      db.realm.create('TestModel1', { name: 'John' });
      db.realm.create('TestModel1', { name: 'Mary' });
      db.realm.create('TestModel1', { name: 'Doe' });
      db.realm.create('TestModel2', { name: 'George' });
      db.realm.create('TestModel3', { name: 'Alex' });
      db.realm.create('TestModel4', { name: 'Gary' });
      db.realm.create('TestModel4', { name: 'Jane' });
    });

    const allModel1 = db.realm.objects('TestModel1');
    const allModel2 = db.realm.objects('TestModel2');
    const allModel3 = db.realm.objects('TestModel3');
    const allModel4 = db.realm.objects('TestModel4');
    expect(allModel1.length).toBe(3);
    expect(allModel2.length).toBe(1);
    expect(allModel3.length).toBe(1);
    expect(allModel4.length).toBe(2);

    db.deleteAll(['TestModel1']);
    expect(allModel1.length).toBe(0);
    expect(allModel2.length).toBe(0);
    expect(allModel3.length).toBe(0);
    expect(allModel4.length).toBe(2);
  });

  test('deleteAllExcept should delete all but the passed models', () => {
    db.write(() => {
      db.realm.create('TestModel1', { name: 'John' });
      db.realm.create('TestModel1', { name: 'Mary' });
      db.realm.create('TestModel1', { name: 'Doe' });
      db.realm.create('TestModel2', { name: 'George' });
      db.realm.create('TestModel3', { name: 'Alex' });
      db.realm.create('TestModel4', { name: 'Gary' });
      db.realm.create('TestModel4', { name: 'Jane' });
    });

    const allModel1 = db.realm.objects('TestModel1');
    const allModel2 = db.realm.objects('TestModel2');
    const allModel3 = db.realm.objects('TestModel3');
    const allModel4 = db.realm.objects('TestModel4');
    expect(allModel1.length).toBe(3);
    expect(allModel2.length).toBe(1);
    expect(allModel3.length).toBe(1);
    expect(allModel4.length).toBe(2);

    db.deleteAllExcept(['TestModel1', 'TestModel4']);
    expect(allModel1.length).toBe(3);
    expect(allModel2.length).toBe(0);
    expect(allModel3.length).toBe(0);
    expect(allModel4.length).toBe(2);
  });
});