import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/infrastructure/common/decorator/get-user.decorator';
import { imageFileFilter } from 'src/infrastructure/common/filters/filefiler';
import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecases-proxy';
import { UseCasesProxyModule } from 'src/infrastructure/usecase-proxy/usecases-proxy.module';
import { CreateCampaignUseCases } from 'src/usecases/campaign/create.campaign.usecases';
import { CreateCampignDto } from './campaign-dto.class';

@Controller('campaign')
export class CampiagnController {
  constructor(
    @Inject(UseCasesProxyModule.CREATE_CAMPAIGN_USECASES_PROXY)
    private readonly createCampaignUseCaseProxy: UseCaseProxy<CreateCampaignUseCases>,
  ) {}

  @Post('/upload-campaign')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
    }),
  )
  @UseGuards(JwtAuthGuard)
  async uploadCampaign(
    @GetCurrentUser('id') userId: number,
    @Body() body: CreateCampignDto,
    @UploadedFile() file: any,
  ) {
    if (!file || file.fileValidationError) {
      throw new HttpException(
        'File required [image required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.createCampaignUseCaseProxy
      .getInstance()
      .createCampaign(userId, body.title, body.description, file);
  }
}
