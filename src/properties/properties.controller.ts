import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { PropertiesDto } from './dto/properties.dto';
import { IProperties } from './interfaces/properties.interface';
import { PropertyIdDto } from './dto/property-id.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { PropertyPageDto } from './dto/property-page.dto';
import { PropertyFilterDto } from './dto/property-filters.dto';


@ApiTags('properties')
@ApiBearerAuth()
@Controller('properties')
export class PropertiesController {
    constructor(private propertiesService: PropertiesService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    @ApiOkResponse({ type: PropertiesDto })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    getAllProperties(@Query() propPage: PropertyPageDto): Promise<IProperties[]> {
        return this.propertiesService.getAllProperties(propPage);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/filters')
    @ApiOkResponse({ type: PropertiesDto })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    getPropertiesWithFilters(@Query() filters: PropertyFilterDto): Promise<IProperties[]> {
        return this.propertiesService.getPropertiesWithFilters(filters);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Post('/addProperty')
    @ApiCreatedResponse({ type: PropertiesDto })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    @UseInterceptors(FilesInterceptor('propertyImages', 2, { dest: 'src/assets/images' }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                propertyImages: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary'
                    }
                },
                name: { example: 'property', type: 'string' },
                description: { example: 'description', type: 'string' },
                address: { example: 'address', type: 'string' },
                coordinates: { type: 'string' },
                totalTokens: { example: 1000, type: 'number' },
                tokenPrice: { example: 51.39, type: 'number' },
                startDate: { example: '2021-12-15', type: 'date' },
                endDate: { example: '2022-01-15', type: 'date' },
                type: { example: 'Single Family', type: 'string' },
                constructionYear: { example: 1952, type: 'number' },
                neighborhood: { example: 'Mount Olivet', type: 'string' },
                squareFeet: { example: 500, type: 'number' },
                lotSize: { example: 4.356, type: 'number' },
                totalUnits: { example: 8, type: 'number' },
                bedroom: { example: 1, type: 'number' },
                bath: { example: 1, type: 'number' },
                rented: { example: 54.27, type: 'number' },
                contractId: { type: 'string' },
            },
        },
    })
    createProperty(@UploadedFiles() files: Array<Express.Multer.File>, @Body() propertiesDto: PropertiesDto): Promise<IProperties> {
        return this.propertiesService.createProperty(propertiesDto, files);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Patch('/:id/editProperty')
    @ApiOkResponse({ type: PropertiesDto })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    editProperty(@Param() propertyIdDto: PropertyIdDto, @Body() propertiesDto: PropertiesDto): Promise<IProperties> {
        return this.propertiesService.editProperty(propertyIdDto, propertiesDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Delete('/:id/deleteProperty')
    @ApiOkResponse({ description: 'Property successfully deleted' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    deleteProperty(@Param() propertyIdDto: PropertyIdDto): Promise<void> {
        return this.propertiesService.deleteProperty(propertyIdDto);
    }
}
