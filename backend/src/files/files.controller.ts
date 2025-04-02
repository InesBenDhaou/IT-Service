import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FileService } from './files.service';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('filesnames')
  @UseGuards(JwtAuthGuard)
  async getOriginalNames(
    @Query('uniqueNames') uniqueNames: string | string[],
  ): Promise<Record<string, string>> {
    let namesArray: string[];
    if (typeof uniqueNames === 'string') {
      namesArray = uniqueNames.split(',').map(name => name.trim());
    } else if (Array.isArray(uniqueNames)) {
      namesArray = uniqueNames;
    } else {
      throw new Error('The uniqueNames query parameter should be an array of strings.');
    }
    const originalNamesMap = await this.fileService.findOriginalNamesByUniqueNames(namesArray);
    const originalNames = Object.fromEntries(originalNamesMap);
    return originalNames;
  }
}

