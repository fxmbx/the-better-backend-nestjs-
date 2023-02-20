import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  IPaginationMeta,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { CampaignM } from 'src/domain/model/campaign.model';
import { ICampaign } from 'src/domain/repositories/campaignRepository.interface';
import { FindOptionsWhere, FindManyOptions, Repository } from 'typeorm';
import { Campaign } from '../entities/campaign.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class CampaignRepository implements ICampaign {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepo: Repository<Campaign>,
    private userRepository: UserRepository,
  ) {}
  async createCampaign(id: number, data: CampaignM): Promise<CampaignM> {
    const post = await this.campaignRepo.findOne({
      where: { title: data.title },
    });
    if (post) {
      throw new HttpException('Post Exits', HttpStatus.CONFLICT);
    }
    const campaign = this.campaignRepo.create(data);
    campaign.owner = await this.userRepository.getUserByID(id);

    const res = await this.campaignRepo.save(campaign);
    return res;
  }
  async findAll(): Promise<CampaignM[]> {
    return await this.campaignRepo.find();
  }

  async findById(id: number): Promise<CampaignM> {
    const campaign = await this.campaignRepo.findOne({ where: { id } });
    if (!campaign) {
      throw new HttpException('Not Dound', HttpStatus.NOT_FOUND);
    }
    return campaign;
  }
  async paginate?(
    option: IPaginationOptions<IPaginationMeta>,
    searchOptions?: FindOptionsWhere<CampaignM> | FindManyOptions<CampaignM>,
  ): Promise<Pagination<CampaignM, IPaginationMeta>> {
    return await paginate(this.campaignRepo, option, searchOptions);
  }
}
