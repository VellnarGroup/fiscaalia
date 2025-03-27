export const ALL_PERMISSIONS = [
  'users:roles:write',
  'users:roles:delete',
  'roles:write',
  'clients:write',
  'clients:read',
  'clients:delete',
  'clients:edit-own',
] as const

export const PERMISSIONS = ALL_PERMISSIONS.reduce((acc, permission) => {
  acc[permission] = permission

  return acc
}, {} as Record<(typeof ALL_PERMISSIONS)[number], (typeof ALL_PERMISSIONS)[number]>)

export const USER_ROLE_PERMISSIONS = [
  PERMISSIONS['clients:write'],
  PERMISSIONS['clients:read'],
  PERMISSIONS['clients:delete'],
  PERMISSIONS['clients:edit-own'],
]

export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  DATABASE_USER: 'DATABASE_USER',
}
