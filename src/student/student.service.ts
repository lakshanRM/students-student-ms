import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { gql } from 'graphql-request';
import axios from 'axios';
import { Student } from './entities/student.entity';
import { CreateStudentInput } from './entities/create-student';

export interface CreatedStatus {
  status: string;
}

@Injectable()
export class StudentService {
  logger = new Logger(StudentService.name);
  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
  ) {}

  async findAll(): Promise<Student[]> {
    try {
      return await this.studentRepo.find();
    } catch (err) {
      this.logger.log('Error while reading data error=>' + err);
      throw new InternalServerErrorException(`Server error, ${err}`);
    }
  }

  async findOne(id: number): Promise<Student> {
    try {
      const student = await this.studentRepo.findOneOrFail(id);
      if (!student) {
        throw new HttpException(
          'Could not find a studnet with the id=>' + id,
          400,
        );
      }
      return student;
    } catch (err) {
      this.logger.log('Error while reading data error=>' + err);
      throw new InternalServerErrorException(`Server error, ${err}`);
    }
  }

  async remove(id: number): Promise<Student> {
    try {
      const student = await this.findOne(id);
      await this.studentRepo.remove(student);
      return student;
    } catch (err) {
      this.logger.log('Error while reading data error=>' + err);
      throw new InternalServerErrorException(`Server error, ${err}`);
    }
  }

  async create(createStudentInput: CreateStudentInput): Promise<Student> {
    try {
      const newStudent = this.studentRepo.create(createStudentInput);
      return await this.studentRepo.save(newStudent);
    } catch (err) {
      this.logger.log('Error while creating student error=>' + err);
      throw new InternalServerErrorException(`Server error, ${err}`);
    }
  }

  async update(
    id: number,
    updateStudentInput: CreateStudentInput,
  ): Promise<Student> {
    try {
      const student = await this.findOne(id);
      const fields = ['firstname', 'lastname', 'dob', 'age', 'email'];
      fields.forEach((f) => {
        student[f] = updateStudentInput[f];
      });
      return await this.studentRepo.save(student);
    } catch (err) {
      //   this.logger.log('Error while updating student error=> ' + err);
      throw new InternalServerErrorException(
        `Error while updating student error=>, ${err}`,
      );
    }
  }

  async createBulk(
    createStudentInputAry: CreateStudentInput[],
  ): Promise<CreatedStatus> {
    const query = gql`
      mutation addStudents($students: AddStudentsInput!) {
        addStudents(input: $students) {
          integer
        }
      }
    `;

    try {
      const status = await axios.post(process.env.POSTGRAPHILE_URL, {
        query: query,
        variables: {
          students: {
            students: createStudentInputAry,
          },
        },
      });

      if (status.status == 200) {
        return Promise.resolve({ status: 'success' });
      } else {
        this.logger.log('Error while creating students error=>' + status);
        throw new InternalServerErrorException(`Server error, ${status}`);
      }
    } catch (err) {
      this.logger.log(
        'Error communicating with postgraphile server, error=>' + err,
      );
      throw new HttpException(
        `Unexpected error in communication with db server, ${err}`,
        400,
      );
    }
    // return await this.studentRepo.save(studnetsAry);
  }
}
