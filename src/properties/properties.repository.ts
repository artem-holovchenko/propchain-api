import { ConflictException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { stringify } from "querystring";
import { Files } from "src/common/files.entity";
import { FilesService } from "src/common/files.service";
import { IUser } from "src/users/interfaces/user.interface";
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
            });

            const gFiles = await this.filesService.uploadFiles(files);

            let isMain = true;
            for (let i = 0; i < files.length; i++) {
                if (i > 0) { isMain = false; }
                await this.setFiles(nProperty, gFiles[i].id, isMain);
            }

            return nProperty;

        } catch (error) {
            throw new ConflictException(error.message);
        }
    }

    async setFiles(property: IProperties, file: string, isMain: boolean): Promise<void> {

        try {
            const fProperty = await this.getPropertyById(property);
            await this.propertyImagesDBRepository.create({ propertyId: fProperty.id, fileId: file, isMain: isMain });
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async getPropertyById(property: IProperties): Promise<IProperties> {
        return await this.propertiesDBRepository.findOne({ where: { id: property.id } });
    }

    async getAllProperties(): Promise<IProperties[]> {
        return await this.propertiesDBRepository.findAll({ include: { model: Files, through: { attributes: ['isMain'] } } });
    }

    async deleteProperty(property: IProperties): Promise<void> {
        await this.propertiesDBRepository.destroy({ where: { id: property.id } });
    }

    async editProperty(id: IProperties, property: IProperties): Promise<IProperties> {
        try {
            await this.propertiesDBRepository.update({
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
            }, { where: { id: id.id } });

            const gProperty = await this.getPropertyById(id);
            return gProperty;

        } catch (error) {
            throw new ConflictException(error.message);
        }
    }

}