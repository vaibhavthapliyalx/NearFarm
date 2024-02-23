import vine from '@vinejs/vine'

export const signupValidation = vine.object({
    name: vine.string().trim().minLength(2).maxLength(32),
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(20),
    createdAt: vine.string()
})

export const loginValidation = vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(20)
})

export const UserValidation = vine.object({
    name: vine.string().trim().minLength(2).maxLength(32),
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(20),
    userType: vine.string().trim().minLength(2).maxLength(32),
    createdAt: vine.string(),
    isOnBoarded: vine.boolean(),
    image: vine.string()
})