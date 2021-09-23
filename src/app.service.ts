import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentInput } from './entities/create-student';
import { Student } from './entities/student.entity';

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
    student.firstName = updateStudentInput.firstName;
    student.lastName = updateStudentInput.lastName;
    student.dob = updateStudentInput.dob;
    student.age = updateStudentInput.age;
    student.email = updateStudentInput.email;
    return await this.studentRepo.save(student);
  }

  async createBulk(
    createStudentInputAry: CreateStudentInput[],
  ): Promise<Student[]> {
    const studnetsAry: any = [];
    createStudentInputAry.forEach((student) => {
      studnetsAry.push(this.studentRepo.create(student));
    });

    return await this.studentRepo.save(studnetsAry);
  }
}
