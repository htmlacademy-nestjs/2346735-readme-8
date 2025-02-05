import { Controller, Get } from '@nestjs/common';
import { SharedService } from './shared.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('shared')
@Controller('shared')
export class SharedController {
  constructor(private readonly sharedService: SharedService) {}

  @Get()
  @ApiOperation({ summary: 'Get shared information' })
  getSharedInfo(): string {
    return this.sharedService.getHello();
  }
}
