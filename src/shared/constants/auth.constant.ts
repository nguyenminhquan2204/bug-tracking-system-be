export const REQUEST_USER_KEY = 'user';

export const REQUEST_ROLE_PERMISSIONS = 'role_permissions'

export const AuthType = {
   Bearer: 'Bearer',
   None: 'None',
   PaymentApiKey: 'PaymentApiKey'
} as const;

export type AuthTypeType = (typeof AuthType)[keyof typeof AuthType];

export const ConditionGuard = {
   AND: 'AND',
   OR: 'OR'
} as const;

export type ConditionGuardType = (typeof ConditionGuard)[keyof typeof ConditionGuard];
