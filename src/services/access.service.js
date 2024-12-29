'use strict';

// TODO: External modules
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer'; // Import nodemailer

// TODO: Internal modules
import customerModel from '../components/models/customer.model.js';
import KeyTokenService from './keytoken.service.js';
// Importing from auth.js
import { createTokenPair, verifyJWT } from '../middlewares/auth.js';

import { getObjectData, getRandomString } from '../utils/index.js';

import ErrorResponses from '../core/error.response.js';

const { NotFoundRequest, BadRequest, UnauthorizedRequest, ForbiddenRequest } = ErrorResponses;

import customerService from './customer.service.js';

const SALTY_ROUNDS = 10;

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new BadRequest('Password must contain at least one uppercase letter, one number, and one special character.');
  }
  return true;
};

// Function to send verification email
async function sendVerificationEmail(email, code) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'prairie2103@gmail.com', // Your email
      pass: 'zjcp skco jaqt qeub' // Your email password or app password
    }
  });

  const mailOptions = {
    from: 'prairie2103@gmail.com',
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is: ${code}`
  };

  try {
    console.log(`Attempting to send verification email to ${email}`);
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email. Please try again.');
  }
}

// Function to prompt user for verification code
async function promptUserForCode() {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    readline.question('Please enter the verification code sent to your email: ', (code) => {
      readline.close();
      resolve(code);
    });
  });
}

class AccessService {

  static async login({ email, password, refreshToken = null }) {
    // TODO: Step 1: Check email is existed
    if (user && email === 'admin@gmail.com') {
      return res.redirect('/admin');
    }
    const foundCustomer = await customerService.findByEmail({ email })
    if (!foundCustomer) {
      throw new NotFoundRequest('Shop is not registered')
    }

    // TODO: Step 2: Check password
    const match = await bcrypt.compare(password, foundCustomer.password);
    if (!match) {
      throw new UnauthorizedRequest('Authentication failed')
    }

    // TODO: Step 3: Create accessToken and refreshToken
    const privateKey = getRandomString(64)
    const publicKey = getRandomString(64)

    const tokenPayload = {
      userId: foundCustomer._id,
      email: foundCustomer.email,
    }
    const tokens = await createTokenPair(tokenPayload, publicKey, privateKey)

    // TODO: Step 4: Save key token
    await KeyTokenService.createKeyToken({
      userId: foundCustomer._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    })

    return {
      customer: getObjectData({ fields: ['_id', 'email'], object: foundCustomer }),
      tokens
    }

  }

  static async signUp({ email, password, confirm_password }) {
    console.log('Sign up process started for:', email);

    if (email === "" || password === "") {
      throw new BadRequest('Username or password cannot be empty');
    }

    if (!validatePassword(password) || password !== confirm_password) {
      throw new BadRequest('Confirm password does not match');
    }

    // Step 1: Check if email exists
    const holderShop = await customerService.findByEmail({ email });
    if (holderShop) {
      throw new BadRequest('Email already exists');
    }

    // Step 2: Generate verification code and send email
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    await sendVerificationEmail(email, verificationCode);

    console.log(`A verification code has been sent to ${email}. Please check your email.`);

    // Step 3: Instead of prompting for the code, redirect to the verification page
    return { redirect: '/verify' }; // Redirect to the verification page
  }

  static async logout(keyStore) {
    await KeyTokenService.removeKeyByID(keyStore._id)
    return true
  }

  static async refreshToken({ refreshToken }) {
    // TODO: check token is used
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)

    // TODO: Token maybe use by hacker
    if (foundToken) {
      const { userId } = verifyJWT(refreshToken, foundToken.privateKey)

      // TODO: Delete all token in keyStore
      await KeyTokenService.removeKeyByUserId(userId)

      throw new ForbiddenRequest('Something went wrong! Please login again')
    }

    // TODO: Check token is valid
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)

    if (!holderToken) {
      throw new UnauthorizedRequest('Invalid token')
    }

    const { userId, email } = verifyJWT(refreshToken, holderToken.privateKey)
    const foundShop = await customerService.findByEmail({ email })

    if (!foundShop) {
      throw new UnauthorizedRequest('Shop is not registered')
    }

    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

    // TODO: Update new refreshToken and refreshTokenUsed
    // TODO Atomistic update
    await KeyTokenService.findByIdAndModify(holderToken._id, { newRefreshToken: tokens.refreshToken, oldRefreshToken: refreshToken })

    return {
      customer: { userId, email },
      tokens
    }
  }

  static async refreshTokenV2({ refreshToken, user, keyStore }) {
    const { userId, email } = user

    // TODO: check token is used
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      // TODO: Delete all token in keyStore
      await KeyTokenService.removeKeyByUserId(userId)

      throw new ForbiddenRequest('Something went wrong! Please login again')
    }

    // TODO: Check token is valid
    if (keyStore.refreshToken !== refreshToken) throw new UnauthorizedRequest('Invalid token')

    const foundShop = await customerService.findByEmail({ email })

    if (!foundShop) {
      throw new UnauthorizedRequest('Shop is not registered')
    }

    const tokens = createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)

    // TODO: Update new refreshToken and refreshTokenUsed
    // TODO: Atomistic update
    await KeyTokenService.findByIdAndModify(keyStore._id, { newRefreshToken: tokens.refreshToken, oldRefreshToken: refreshToken })

    return {
      user,
      tokens
    }
  }

}

export default AccessService