import {
  IPaginationMeta,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, FindManyOptions } from 'typeorm';
import { CampaignM } from '../model/campaign.model';

export interface ICampaign {
  createCampaign(id: number, data: CampaignM): Promise<CampaignM>;
  findById(id: number): Promise<CampaignM>;
  paginate?(
    option: IPaginationOptions<IPaginationMeta>,
    searchOptions?: FindOptionsWhere<CampaignM> | FindManyOptions<CampaignM>,
  ): Promise<Pagination<CampaignM, IPaginationMeta>>;
}
