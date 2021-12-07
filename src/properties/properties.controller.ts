import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { PropertiesDto } from './dto/properties.dto';
import { IProperties } from './interfaces/properties.interface';
import { PropertyIdDto } from './dto/property-id.dto';


@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
    constructor(private propertiesService: PropertiesService) { }

    @Post('/addProperty')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    @UseInterceptors(FilesInterceptor('propertyImages', 2, { dest: 'src/assets/images' }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                propertyImages: {
                    type: 'string',
                    format: 'binary',
                },
                name: { type: 'string' },
                description: { type: 'string' },
                address: { type: 'string' },
                coordinates: { type: 'string' },
                totalTokens: { type: 'number' },
                tokenPrice: { type: 'number' },
                startDate: { type: 'date' },
                endDate: { type: 'date' },
                type: { type: 'string' },
                constructionYear: { type: 'number' },
                neighborhood: { type: 'string' },
                squareFeet: { type: 'number' },
                lotSize: { type: 'number' },
                totalUnits: { type: 'number' },
                bedroom: { type: 'number' },
                bath: { type: 'number' },
                rented: { type: 'number' },
                section8: { type: 'string' },
                contractId: { type: 'string' },
            },
        },
    })
    createProperty(@UploadedFiles() files: Array<Express.Multer.File>, @Body() propertiesDto: PropertiesDto): Promise<IProperties> {
        return this.propertiesService.createProperty(propertiesDto, files);
    }

    @Patch('/:id/editProperty')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    editProperty(@Param() propertyIdDto: PropertyIdDto, @Body() propertiesDto: PropertiesDto): Promise<IProperties> {
        return this.propertiesService.editProperty(propertyIdDto, propertiesDto);
    }

    @Delete('/:id/deleteProperty')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    deleteProperty(@Param() propertyIdDto: PropertyIdDto): Promise<void> {
        return this.propertiesService.deleteProperty(propertyIdDto);
    }

    @Get()
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    getAllProperties(): Promise<IProperties[]> {
        return this.propertiesService.getAllProperties();
    }
}
