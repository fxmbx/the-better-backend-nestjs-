import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IFileUploadInterface } from 'src/domain/adapter/file-upload.interface';
import { IUseCaseResponse } from 'src/domain/adapter/use.case.response.interface';
import { ILogger } from 'src/domain/logger/logger.interface';
import { ICampaign } from 'src/domain/repositories/campaignRepository.interface';

@Injectable()
export class CreateCampaignUseCases {
  constructor(
    private readonly campaignRepository: ICampaign,
    private readonly s3Upload: IFileUploadInterface,
    private readonly logger: ILogger,
  ) {}

  async createCampaign(
    userid: number,
    title: string,
    description: string,
    file: any,
  ): Promise<IUseCaseResponse> {
    const { originalname } = file;
    const uploadRes = await this.s3Upload.uploadFile(originalname, file.buffer);
    this.logger.log('UploadFile', `${uploadRes} uploaded to s3`);
    if (!uploadRes) {
      throw new HttpException('upload failed', HttpStatus.BAD_GATEWAY);
    }
    const data = {
      title,
      description,
      file_url: uploadRes,
    };

    const createCampaign = await this.campaignRepository.createCampaign(
      userid,
      data,
    );
    this.logger.log('CreateCampaign', `${data.title} campiagn created`);

    return {
      data: createCampaign,
    };
  }
}
