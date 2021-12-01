import { IdentityRejections } from "./identity-rejections.entity";

export const identityRejectionsProviders = [
    {
        provide: 'IDENTITY_REJECTIONS_REPOSITORY',
        useValue: IdentityRejections,
    },
];