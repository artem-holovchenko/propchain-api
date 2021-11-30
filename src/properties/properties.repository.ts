import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { stringify } from "querystring";
import { Files } from "src/common/files.entity";
import { FilesService } from "src/common/files.service";
import { IProperties } from "./interfaces/properties.interface";
import { Properties } from "./properties.entity";
import { PropertyImages } from "./property-images.entity";
const fs = require('fs');
const { promisify } = require('util');

@Injectable()
export class PropertiesRepository {

    constructor(
        @Inject('PROPERTIES_REPOSITORY')
        private propertiesDBRepository: typeof Properties,
        @Inject('PROPERTY_IMAGES_REPOSITORY')
        private propertyImagesDBRepository: typeof PropertyImages,
        @Inject('PROPERTY_FILES_REPOSITORY')
        private filesService: FilesService
    ) { }

    async createProperty(property: IProperties, files: Array<Express.Multer.File>): Promise<IProperties> {
        try {
            const result = await this.filesService.uploadFiles(files);

            const nProperty = await this.propertiesDBRepository.create({
                name: property.name,
                description: property.description,
                address: property.address,
                coordinates: property.coordinates,
                totalTokens: property.totalTokens,
                tokenPrice: property.tokenPrice,
                startDate: property.startDate,
                endDate: property.endDate,
                type: property.type,
                constructionYear: property.constructionYear,
                neighborhood: property.neighborhood,
                squareFeet: property.squareFeet,
                lotSize: property.lotSize,
                totalUnits: property.totalUnits,
                bedroom: property.bedroom,
                bath: property.bath,
                rented: property.rented,
                section8: property.section8,
                contractId: property.contractId,
                files: [{
                    name: result[0].public_id,
                    url: result[0].url,
                    PropertyImages: { isMain: true },
                }]
            },
                { include: Files });

            return nProperty;

        } catch (error) {
            throw new ConflictException(error.message);
        }
    }

    async getPropertyById(property: IProperties): Promise<IProperties> {
        return await this.propertiesDBRepository.findOne({ where: { name: property.id } });
    }

}