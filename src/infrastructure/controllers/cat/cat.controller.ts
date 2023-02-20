import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUserGuard } from 'src/infrastructure/common/guards/auth.guard';
import { ValidateCreateCatPipe } from 'src/infrastructure/common/pipes/create-cat.pipe';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecases-proxy';
import { UseCasesProxyModule } from 'src/infrastructure/usecase-proxy/usecases-proxy.module';
import { catUseCases } from 'src/usecases/cats/create-cat.usecase';
import { CreateCatDto, GetCatByID } from './cat-dto.class';

@Controller('cats')
@ApiTags('cat')
@UseGuards(AuthUserGuard)
export class CatsController {
  constructor(
    @Inject(UseCasesProxyModule.CAT_USECASES_PROXY)
    private readonly catUseCaseProxy: UseCaseProxy<catUseCases>,
  ) {}

  @ApiOperation({ description: 'endpoint to create cat' })
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('create')
  async createCat(@Body(ValidateCreateCatPipe) data: CreateCatDto) {
    return await this.catUseCaseProxy
      .getInstance()
      .createCatUseCase(data.name, data.age, data.breed);
  }
  @ApiOperation({ description: 'endpoint to fetch a cat by its id' })
  @Get('cat')
  async getCat(@Query() dto: GetCatByID) {
    return await this.catUseCaseProxy.getInstance().getCatByID(dto.id);
  }
}
