export const apiErrorCodes = {
  authInvalidToken: 'Invalid auth token',
  requiresAuth: 'This resource requires authentication',
  authMissingPermissions:
    'The user does not have access to this resource or action',
  authInvalidInput: 'Invalid credentials have been supplied',
  authEmailNotVerified: 'Email address not verified',
  notFound: 'Resource could not be found',
  invalid: 'The request was invalid',
  removeLastAdmin: 'You cannot remove last admin member of an organisation',
  cantChangeType: 'Type of resource cannot be changed after creation',
} as const;

export type ApiErrorCodes = keyof typeof apiErrorCodes;
