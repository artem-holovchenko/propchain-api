import { UserIdentities } from "./user-identities.entity";

export const userIdentitiesProviders = [
    {
        provide: 'USER_IDENTITIES_REPOSITORY',
        useValue: UserIdentities,
    },
];