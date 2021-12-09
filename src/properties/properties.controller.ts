import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
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

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
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

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Patch('/:id/editProperty')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    editProperty(@Param() propertyIdDto: PropertyIdDto, @Body() propertiesDto: PropertiesDto): Promise<IProperties> {
        return this.propertiesService.editProperty(propertyIdDto, propertiesDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Delete('/:id/deleteProperty')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    deleteProperty(@Param() propertyIdDto: PropertyIdDto): Promise<void> {
        return this.propertiesService.deleteProperty(propertyIdDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Get()
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    getAllProperties(@Body()propPage: PropertyPageDto): Promise<IProperties[]> {
        return this.propertiesService.getAllProperties(propPage);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.User)
    @Get('/filters')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    getPropertiesWithFilters(@Body()filters: PropertyFilterDto): Promise<IProperties[]> {
        return this.propertiesService.getPropertiesWithFilters(filters);
    }
}
