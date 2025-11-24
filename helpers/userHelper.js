// Helper for managing User lifecycle with Prisma and Auth0 (express-openid-connect)

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Ensure a User record exists for the given Auth0 user (req.oidc.user).
 * Creates or updates the user based on the Auth0 subject (sub).
 * @param {import('express-openid-connect').UserinfoResponse} oidcUser
 * @returns {Promise<import('@prisma/client').User>}
 */
export async function ensureUser(oidcUser) {
    if (!oidcUser || !oidcUser.sub) {
        throw new Error('Cannot ensure user without a valid Auth0 sub')
    }

    const { sub, email, name, picture } = oidcUser

    const user = await prisma.user.upsert({
        where: { sub },
        update: {
            email: email || null,
            name: name || null,
            picture: picture || null
        },
        create: {
            sub,
            email: email || null,
            name: name || null,
            picture: picture || null
        }
    })

    return user
}
