import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'
import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'
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
            const newUser = await User.create(payload)
            const otp = Math.floor(100000 + Math.random() * 900000)
            await Database.table('otp_codes').insert({otp_code:otp, user_id: newUser.id}) 
            await Mail.send((message) => {
                message
                  .from('admin@todoapi')
                  .to(request.input('email'))
                  .subject('Welcome Onboard!')
                  .htmlView('emails/otp_verifycation', {otp})
              })
             
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

    public async me({auth, response}:HttpContextContract){
        const user = auth.user

        return response.ok({
            message: user
        })
    }

    public async otpConfirmation ({request, response}:HttpContextContract){
        let email = request.input('email')
        let otp_code = request.input('otp_code')

        const user = await User.findBy('email', email)
        const otpCheck = await Database.query().from('otp_codes').where('otp_code', otp_code).first()

        if (user && otpCheck && user.id === otpCheck.user_id) {
            await Database.from('users').where('id', user.id).update({ isVerify: true })
            return response.status(200).json({message: "Verifikasi OTP Berhasil"})
        }else{
            return response.status(400).json({message: "Verifikasi OTP Gagal"})
        }
    }

    public async profile({auth, request, response}:HttpContextContract){
        
        const userData = auth.user
        const ProfileValidate = schema.create({
            bio: schema.string(),
            alamat: schema.string(),
        })

        await request.validate({
            schema: ProfileValidate
        })
        const alamat = request.input('alamat')
        const bio = request.input('bio')

        const dataProfile = {
            bio,
            alamat
        }
        await userData?.related('profile').updateOrCreate({}, dataProfile)

        return response.created({
            message: "berhasil"
        })
    }
}
