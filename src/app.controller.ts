import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
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
  async delete(id: number) {
    return await this.appService.remove(id);
  }

  @MessagePattern('create')
  async cerate(student: CreateStudentInput) {
    return await this.appService.create(student);
  }

  @MessagePattern('createBulk')
  async cerateBulk(students: CreateStudentInput[]) {
    return await this.appService.createBulk(students);
  }

  @MessagePattern('update')
  async update(data: any) {
    return await this.appService.update(data.id, data.student);
  }
}
