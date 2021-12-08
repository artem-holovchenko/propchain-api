import { PropertyImages } from "./property-images.entity";

export const propertyImagesProviders = [
    {
        provide: 'PROPERTY_IMAGES_REPOSITORY',
        useValue: PropertyImages,
    },
];