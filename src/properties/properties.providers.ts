import { Properties } from "./properties.entity";

export const propertiesProviders = [
    {
        provide: 'PROPERTIES_REPOSITORY',
        useValue: Properties,
    },
];