import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateStudentInput } from './entities/create-student';
import { Student } from './entities/student.entity';

describe('AppController', () => {
  let appController: AppController;
  const student = new Student();
  student.id = 1;
  student.firstname = 'john';
  student.lastname = 'doe';
  student.email = 'johnd@gmail.com';
  student.dob = '12/7/1989';
  student.age = 32;

  const appServiceMock = {
    findAll: jest.fn().mockImplementation(() => Promise.resolve([student])),
    findOne: jest.fn().mockImplementation((id) => {
      const s = { ...student };
      s.id = id;
      return Promise.resolve(s);
    }),
    remove: jest.fn().mockImplementation((id) => {
      const s = { ...student };
      s.id = id;
      return Promise.resolve(s);
    }),

    create: jest.fn().mockImplementation((newStudent) => {
      const s = { ...newStudent };
      s.id = 2;
      return Promise.resolve(s);
    }),

    update: jest.fn().mockImplementation((id, student) => {
      const s = { ...student };
      s.id = id;
      return Promise.resolve(s);
    }),

    createBulk: jest.fn().mockImplementation((students) => {
      return Promise.resolve({ status: 'success' });
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: appServiceMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('find: should return array of students', () => {
      return appController.find().then((students) => {
        expect(students.length).toBe(1);
      });
    });

    it('findOne: should return correct student', () => {
      return appController.findOne(1).then((students) => {
        expect(students.id).toBe(1);
      });
    });

    it('remove: should delete and return deleted student', () => {
      return appController.delete(1).then((students) => {
        expect(students.id).toBe(1);
      });
    });

    it('create: should create and return created student', () => {
      const student: CreateStudentInput = {
        firstname: 'jane',
        email: 'janed@gmail.com',
        lastname: 'doe',
        dob: '15/7/1989',
        age: 32,
      };
      return appController.cerate(student).then((students) => {
        expect(students.firstname).toBe('jane');
      });
    });

    it('update: should update and return updated student', () => {
      const stud: CreateStudentInput = {
        firstname: 'jane',
        email: 'janed@gmail.com',
        lastname: 'doe',
        dob: '15/7/1989',
        age: 32,
      };
      return appController.update({ id: 1, student: stud }).then((students) => {
        expect(students.firstname).toBe('jane');
      });
    });

    it('createBulk: should create multiple studens', () => {
      const stud: CreateStudentInput[] = [
        {
          firstname: 'jane',
          email: 'janed@gmail.com',
          lastname: 'doe',
          dob: '15/7/1989',
          age: 32,
        },
      ];
      return appController.cerateBulk(stud).then((res) => {
        expect(res.status).toBe('success');
      });
    });
  });
});
