import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {

    public async register({request, response}:HttpContextContract){
        try {
              const newRegisterUser = schema.create({
                name: schema.string({},[
                    rules.unique({ table: 'users', column: 'name' })
                ]),
                email: schema.string({},[
                    rules.email(),
                    rules.unique({ table: 'users', column: 'email' })
                ]),
                password: schema.string({},[
                    rules.minLength(4)
                ]),
                role: schema.enum(['user', 'admin'] as const)
            })

            /**
             * Validate request body against the schema
             */
             const payload = await request.validate({ schema: newRegisterUser })
             
             await User.create(payload)

             return response.created({
                message: "Register Success"
             })
        } catch (error) {
            return response.unprocessableEntity({
                message: error
            })
        }
    }

    public async login({request, response, auth}: HttpContextContract){

        const newRegisterUser = schema.create({
                email: schema.string(),
                password: schema.string(),
            })

            /**
             * Validate request body against the schema
             */
        await request.validate({ schema: newRegisterUser })
        const email = request.input('email')
        const password = request.input('password')

        try {
            const token = await auth.use('api').attempt(email, password, {
                            expiresIn: '7 days'
                        })
            return response.ok({
                message: "Register Success",
                token
             })
        } catch {
            return response.unauthorized({
                message:'Invalid credentials'
            })
        }
    }
}
