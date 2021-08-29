import { getOrganisationRelations, postOrganisations } from './OrganisationController'
import { checkParamPresent } from '../../../middleware/requestChecks';

export default [
    {
        path: '/api/v1/organisation',
        method: 'post',
        cache: false,
        handler: [
            postOrganisations
        ]
    },
    {
        path: '/api/v1/organisation',
        method: 'get',
        cache: true,
        handler: [
            checkParamPresent(`name`),
            getOrganisationRelations
        ]
    }
]