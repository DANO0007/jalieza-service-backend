import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>
  ){

  }
   async create(createUserDto: CreateUserDto) {
  // const User=this.UserRepository.create(createUserDto);
  // return await this.UserRepository.save(User);
  return this.UserRepository.save(createUserDto);
  }

  findOneByName(nombre_usuario: string){
    return this.UserRepository.findOneBy({nombre_usuario})

  }
   async findAll() {
    return await this.UserRepository.find();
  }

   async findOne(id: number) {
    return await this.UserRepository.findOneBy({id})
  }

   async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.UserRepository.update(id,updateUserDto)
  }

   async remove(id: number) {
   return await this.UserRepository.softDelete({id}); 
  }
}
