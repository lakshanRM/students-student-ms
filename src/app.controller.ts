import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService, CreatedStatus } from './app.service';
import { CreateStudentInput } from './entities/create-student';
import { Student } from './entities/student.entity';

@Controller('students')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('find')
  async find(): Promise<Student[]> {
    return await this.appService.findAll();
  }

  @MessagePattern('findOne')
  async findOne(id: number): Promise<Student> {
    return await this.appService.findOne(id);
  }

  @MessagePattern('delete')
  async delete(id: number): Promise<Student> {
    return await this.appService.remove(id);
  }

  @MessagePattern('create')
  async cerate(student: CreateStudentInput): Promise<Student> {
    return await this.appService.create(student);
  }

  @MessagePattern('createBulk')
  async cerateBulk(students: CreateStudentInput[]): Promise<CreatedStatus> {
    return await this.appService.createBulk(students);
  }

  @MessagePattern('update')
  async update(data: {
    id: number;
    student: CreateStudentInput;
  }): Promise<Student> {
    return await this.appService.update(data.id, data.student);
  }
}
