import { ConflictException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { FilesService } from "src/common/files.service";
import { Files } from "src/identities/files.entity";
import { PropertyPageDto } from "./dto/property-page.dto";
import { IProperties } from "./interfaces/properties.interface";
import { IPropertyFilters } from "./interfaces/property-filters.interface";
import { Properties } from "./properties.entity";
import { PropertyImages } from "./property-images.entity";
const { Op } = require("sequelize");

@Injectable()
export class PropertiesRepository {

    constructor(
        @Inject('PROPERTIES_REPOSITORY')
        private propertiesDBRepository: typeof Properties,
        @Inject('PROPERTY_IMAGES_REPOSITORY')
        private propertyImagesDBRepository: typeof PropertyImages,
        @Inject('UPLOAD_FILES_REPOSITORY')
        private uploadFilesProviders: FilesService,
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
                totalPrice: property.totalTokens * property.tokenPrice,
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
                contractId: property.contractId,
            });

            let isMain = true;
            let imgCount = 0;

            const gFiles = await this.uploadFilesProviders.uploadBulk(files);

            for (let f of gFiles) {
                if (imgCount > 0) isMain = false;
                imgCount++;
                await this.setFiles(nProperty, f.name, isMain);
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

    async getAllProperties(propPage: PropertyPageDto): Promise<IProperties[]> {
        const { page } = propPage;
        let propLimit = 5;
        let propCount = page * propLimit - propLimit;
        return await this.propertiesDBRepository.findAll({ offset: propCount, limit: propLimit, include: { model: Files, through: { attributes: ['isMain'] } } });
    }

    async getPropertiesWithFilters(filters: IPropertyFilters): Promise<IProperties[]> {
        const {
            page,
            minPrice,
            maxPrice,
            bedroomsFrom,
            bedroomsTo,
            bathFrom,
            bathTo,
            totalUnitsFrom,
            totalUnitsTo,
            squareFeetFrom,
            squareFeetTo,
            sortBy,
            sortOrder,
        } = filters;

        let propLimit = 5;
        let propCount = page * propLimit - propLimit;

        let where = {};
        let order = [];

        if (minPrice && maxPrice) {
            where['totalPrice'] = { [Op.between]: [minPrice, maxPrice] };
        }

        if (bathFrom && bathTo) {
            where['bath'] = { [Op.between]: [bathFrom, bathTo] };
        }

        if (bedroomsFrom && bedroomsTo) {
            where['bedroom'] = { [Op.between]: [bedroomsFrom, bedroomsTo] };
        }

        if (totalUnitsFrom && totalUnitsTo) {
            where['totalUnits'] = { [Op.between]: [totalUnitsFrom, totalUnitsTo] };
        }

        if (squareFeetFrom && squareFeetTo) {
            where['squareFeet'] = { [Op.between]: [squareFeetFrom, squareFeetTo] };
        }

        if (sortOrder == 'descending') {
            order = [[sortBy, 'DESC']];
        } else if (sortOrder == 'ascending') {
            order = [[sortBy, 'ASC']];
        } else {
            order = [sortBy];
        }


        return await this.propertiesDBRepository.findAll({
            order,
            offset: propCount,
            limit: propLimit,
            where,
            include: { model: Files, attributes: ['name', 'url'], through: { attributes: ['isMain'] } }
        });
    }

    async deleteProperty(property: IProperties): Promise<void> {
        await this.uploadFilesProviders.delPropertyFilesDB(property);
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
                totalPrice: property.totalTokens * property.tokenPrice,
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
                contractId: property.contractId,
            }, { where: { id: id.id } });

            const gProperty = await this.getPropertyById(id);
            return gProperty;

        } catch (error) {
            throw new ConflictException(error.message);
        }
    }

}