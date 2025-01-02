'use strict'

import { OkResponse } from '../core/success.response.js'
// import { BadRequestResponse } from '../core/error.response.js'
import accessService from '../services/access.service.js'

class AccessController {
    async getLogin(req, res) {
        res.render('login', { errorMessage: null })
    }
    async getSignUp(req, res) {
        res.render('signup', { errorMessage: null })
    }
    async getVerify(req, res) {
        res.render('verify', { errorMessage: null })
    }
    // TODO: API login
    async login(req, res) {
            try {
                const metadata = await accessService.login(req.body)
                // if(metadata && metadata.customer && metadata.tokens){
                req.session.customer = metadata.customer // Store user in session
                req.session.tokens = metadata.tokens
                //res.status(metadata.code).send({ message: 'Login successfully!' })
                res.redirect('/')
            } catch (error) {
                res.render('login', {errorMessage: error.message})
            }
    }

    // TODO: API signup
    async signUp(req, res) {
        try {
            const metadata = await accessService.signUp(req.body)

            req.session.email = metadata.email
            req.session.password = metadata.password
            req.session.verificationCode = metadata.verificationCode
            console.log('metadata:', metadata)
            if (metadata) {
                res.redirect('/verify')
            }
            else res.render('signup', { error: 'Email already existed' })
        } catch (error) {
            res.render('signup', { error: error.message })
        }
    }
    async verify(req, res){
        const code = req.body
        const email = req.session.email
        const password = req.session.password
        const verificationCode = req.session.verificationCode
        console.log('code:', code)
        console.log('verificationCode:', verificationCode)
        try{
            const metadata = await accessService.verify({email, password})
            if(metadata && metadata.customer && metadata.tokens){
                res.redirect('/login')
            }
        } catch(error){
            res.render('verify', {error: error.message})
        }
    }
    // TODO: API logout
    async logout(req, res, next) {
        new OkResponse({
            message: 'Logout successfully',
            metadata: await accessService.logout(req.keyStore), // keyStore is from middleware authentication
        }).send(res)
    }

    // TODO: API refresh token
    async refreshToken(req, res, next) {
        // new OkResponse({
        //   message: 'Refresh token successfully',
        //   metadata: await accessService.refreshToken(req.body)
        // }).send(res)

        // TODO: v2 optimize
        new OkResponse({
            message: 'Refresh token successfully',
            metadata: await accessService.refreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore,
            }), // middleware authenticationV2
        }).send(res)
    }
}

export default new AccessController()
