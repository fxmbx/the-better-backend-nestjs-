import { Module } from '@nestjs/common';
import { typeormConfig } from '../controllers/typeorm.config';
import { Cats } from '../entities/cat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatRepository } from './cat.repository';
import { UserRepository } from './user.repository';
import { CampaignRepository } from './campaign.repository';
import { User } from '../entities/user.entity';
import { Campaign } from '../entities/campaign.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    TypeOrmModule.forFeature([Cats, User, Campaign]),
  ],
  providers: [CatRepository, UserRepository, CampaignRepository],
  exports: [CatRepository, UserRepository, CampaignRepository],
})
export class RepositoriesModule {}
