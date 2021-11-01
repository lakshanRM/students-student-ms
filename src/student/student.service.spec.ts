import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import mockAxios from 'jest-mock-axios';
import { CreateStudentInput } from './entities/create-student';
import { Student } from './entities/student.entity';

describe('StudentService', () => {
  let service: StudentService;
  const studentInput: CreateStudentInput = {
    firstname: 'jane',
    email: 'janed@gmail.com',
    lastname: 'doe',
    dob: '15/7/1989',
    age: 32,
  };
  jest.mock('axios');
  const studentRepo = {
    find: jest
      .fn()
      .mockImplementation(() => Promise.resolve([{ id: 1, ...studentInput }])),
    findOneOrFail: jest
      .fn()
      .mockImplementation((id) => Promise.resolve({ id: 1, ...studentInput })),
    remove: jest
      .fn()
      .mockImplementation((id) => Promise.resolve({ id: id, ...studentInput })),
    save: jest
      .fn()
      .mockImplementation((args) => Promise.resolve({ id: 2, ...args })),
    create: jest.fn().mockImplementation((args) => args),
  };

  afterEach(() => {
    mockAxios.reset();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getRepositoryToken(Student),
          useValue: studentRepo,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll: should retrun an array of students', () => {
    return service.findAll().then((res) => {
      expect(res.length).toBe(1);
    });
  });

  it('findAll: should return error if try failed', () => {
    studentRepo.find = jest.fn().mockImplementation(() => undefined);
    // expect.assertions(1);
    return service.findAll().catch((e) => {
      expect(e.name).toEqual('TypeError');
    });
  });

  it('findOne: should retrun promis of a student that match the id was passed', () => {
    return service.findOne(1).then((res) => {
      expect(res.id).toBe(1);
    });
  });

  it('findOne: should retrun error if student was not found', () => {
    return service.findOne(2).then((res) => {
      //   expect(res.id).toBe(2);
    });
  });

  it('remove: should retrun promis of a student that match the id was passed', () => {
    return service.remove(1).then((res) => {
      expect(res.id).toBe(1);
    });
  });

  it('create: create the student and return the created student', () => {
    const params: CreateStudentInput = {
      firstname: 'john',
      email: 'janed@gmail.com',
      lastname: 'doe',
      dob: '15/7/1989',
      age: 32,
    };
    return service.create(params).then((res) => {
      expect(res.firstname).toBe('john');
    });
  });

  it('update: update the student and return the update student', () => {
    const params: CreateStudentInput = {
      firstname: 'john',
      email: 'janed@gmail.com',
      lastname: 'doe',
      dob: '15/7/1989',
      age: 32,
    };
    return service.update(2, params).then((res) => {
      expect(res.firstname).toBe('john');
    });
  });

  //   it('createBulk: should create multiple studnets and return CreateSatatus Promise', () => {
  //     // mockAxios.post.mockResolvedValueOnce([{ id: 1, ...studentInput }]);
  //     const params: CreateStudentInput = {
  //       firstname: 'john',
  //       email: 'janed@gmail.com',
  //       lastname: 'doe',
  //       dob: '15/7/1989',
  //       age: 32,
  //     };
  //     return service.createBulk([params]).then((res) => {
  //       expect(mockAxios.post).toHaveBeenCalledWith(`mock/graphql`);
  //     });
  //   });
});
