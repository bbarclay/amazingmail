import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(userId: string): Promise<Team[]> {
    return this.teamsRepository
      .createQueryBuilder('team')
      .innerJoin('team.users', 'user', 'user.id = :userId', { userId })
      .getMany();
  }

  async create(createTeamDto: CreateTeamDto, userId: string): Promise<Team> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    const team = this.teamsRepository.create({
      name: createTeamDto.name,
      users: [user],
    });
    return this.teamsRepository.save(team);
  }
}
