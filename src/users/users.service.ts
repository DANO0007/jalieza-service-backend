import { Injectable, NotFoundException } from '@nestjs/common';
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
  const { username, email, password, role_id } = createUserDto;

  const user = this.UserRepository.create({
    username,
    email,
    password,
    role: { id: role_id }, // 👈 aquí está la clave
  });

  return await this.UserRepository.save(user);
}


  findOneByName(email: string){
    return this.UserRepository.findOneBy({email})

  }
   async findAll() {
    return await this.UserRepository.find();
  }

   async findOne(id: number) {
    const user  = await  this.UserRepository.findOneBy({id})
    if(!user){
       throw new NotFoundException(`user with id ${id} not found`);
    }
    return user;
  }

   async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.UserRepository.update(id,updateUserDto)
  }

   async remove(id: number) {
   return await this.UserRepository.softDelete({id}); 
  }
}
