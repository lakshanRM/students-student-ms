import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateStudentInput } from './entities/create-student';
import { Student } from './entities/student.entity';
import { CreatedStatus, StudentService } from './student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @MessagePattern('find')
  async find(): Promise<Student[]> {
    return await this.studentService.findAll();
  }

  @MessagePattern('findOne')
  async findOne(id: number): Promise<Student> {
    return await this.studentService.findOne(id);
  }

  @MessagePattern('delete')
  async delete(id: number): Promise<Student> {
    return await this.studentService.remove(id);
  }

  @MessagePattern('create')
  async cerate(student: CreateStudentInput): Promise<Student> {
    return await this.studentService.create(student);
  }

  @MessagePattern('createBulk')
  async cerateBulk(students: CreateStudentInput[]): Promise<CreatedStatus> {
    return await this.studentService.createBulk(students);
  }

  @MessagePattern('update')
  async update(data: {
    id: number;
    student: CreateStudentInput;
  }): Promise<Student> {
    return await this.studentService.update(data.id, data.student);
  }
}
