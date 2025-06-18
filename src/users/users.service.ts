import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuarios)
    private readonly UserRepository: Repository<Usuarios>
  ){

  }
   async create(createUserDto: CreateUserDto) {
  // const User=this.UserRepository.create(createUserDto);
  // return await this.UserRepository.save(User);
  return this.UserRepository.save(createUserDto);
  }

  findOneByName(email: string){
    return this.UserRepository.findOneBy({email})

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
