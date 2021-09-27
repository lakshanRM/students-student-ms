import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentInput } from './entities/create-student';
import { Student } from './entities/student.entity';
import { request, gql } from 'graphql-request';
import axios from 'axios';
@Injectable()
export class AppService {
  logger = new Logger('Student-MS : Service');
  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
  ) {}

  async findAll(): Promise<Student[]> {
    this.logger.log('Reading form Database.');
    return this.studentRepo.find();
  }

  async findOne(id: number): Promise<Student> {
    return this.studentRepo.findOneOrFail(id);
  }

  async remove(id: number): Promise<Student> {
    const student = await this.studentRepo.findOne(id);
    await this.studentRepo.remove(student);
    return student;
  }

  async create(createStudentInput: CreateStudentInput): Promise<Student> {
    const newStudent = this.studentRepo.create(createStudentInput);
    return this.studentRepo.save(newStudent);
  }

  async update(
    id: number,
    updateStudentInput: CreateStudentInput,
  ): Promise<Student> {
    const student = await this.studentRepo.findOne(id);
    student.firstname = updateStudentInput.firstname;
    student.lastname = updateStudentInput.lastname;
    student.dob = updateStudentInput.dob;
    student.age = updateStudentInput.age;
    student.email = updateStudentInput.email;
    return await this.studentRepo.save(student);
  }

  async createBulk(createStudentInputAry: CreateStudentInput[]) {
    const query = gql`
      mutation addStudents($students: AddStudentsInput!) {
        addStudents(input: $students) {
          clientMutationId
          integer
        }
      }
    `;

    return await axios.post('http://localhost:5000/graphql', {
      query: query,
      variables: {
        students: {
          students: createStudentInputAry,
        },
      },
    });
    // return await this.studentRepo.save(studnetsAry);
  }
}
