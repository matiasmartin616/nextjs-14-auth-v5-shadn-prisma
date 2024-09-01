
/**
 * 
 * Routes that are going to be PUBLIC
 * @type {string[]}
 */
export const publicRoutes = [
    "/"
]

/**
 * Public routes related to authentication
 * @type {string[]}
 */
export const authRoutes = [
    "/",    
    "/auth/verification",
    "/auth/new-pass",
    "/auth/reset-password"
]
/**
 * /api/auth has to be public in order to register or login
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth"

/**
 * Default redirect, this is not public
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard"

export const DEFAULT_LOGIN = "/"