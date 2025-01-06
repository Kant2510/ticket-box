'use strict'
import JWT from 'jsonwebtoken';  // Importing the 'jsonwebtoken' package
import headerConfig from "../constants/header.config.js";
import KeyTokenService from '../services/keyToken.service.js';  // Importing the key token service
import ErrorResponses from "../core/error.response.js";  // Default import
import forwardError from '../utils/forwardError.js';  // Importing forwardError utility

// Access the HEADERS from the imported object
const { HEADERS } = headerConfig;

const { NotFoundRequest, UnauthorizedRequest } = ErrorResponses;  // Destructure from the imported object


const createTokenPair = (payload, publicKey, privateKey) => {

  // TODO: Create access token
  const accessToken = JWT.sign(payload, publicKey, {
    expiresIn: '2h',
  })

  // TODO: Create refresh token
  const refreshToken = JWT.sign(payload, privateKey, {
    expiresIn: '7 days',
  })

  return {
    accessToken,
    refreshToken
  }
}

// ! Old version
const authentication = forwardError(async (req, res, next) => {
  /**
   * 1. Check userId is existed
   * 2. get Access Token from header
   * 3. Verify Access Token
   * 4. Check Access Token is existed in DB
   * 5. check Access Token in keys Store
   */

  // TODO: Step 1: Check userId and accessToken is existed

  const userId = req.session.customer._id
  const accessToken = req.session.tokens.accessToken

  if (!userId || !accessToken) {
    throw new UnauthorizedRequest('Invalid Request')
  }

  // TODO: Step 2: Found key token
  const keyStore = await KeyTokenService.findKeyTokenByUserID(userId)
  console.log('keyStore::', keyStore)
  if (!keyStore) {
    throw new NotFoundRequest('Not found key token')
  }

  // TODO: Step 3: Verify Access Token
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)

    if (decodeUser.userId !== userId) {
      throw new UnauthorizedRequest('Invalid Request')
    }

    req.keyStore = keyStore
    req.user = decodeUser // payload = { userId, email }
    return next()
  } catch (error) {
    console.log('error', error)
    throw error
  }
})

// * New version
const authenticationV2 = forwardError(async (req, res, next) => {
  /**
   * 1. Check userId is existed
   * 2. get Access Token from header
   * 3. Verify Access Token
   * 4. Check Access Token is existed in DB
   * 5. check Access Token in keys Store
   */

  // TODO: Step 1: Check userId and accessToken is existed
  const { tokens, customer } = req.session || {};
  const refreshToken = tokens?.refreshToken;
  const userId = customer?._id;
  const accessToken = tokens.accessToken;
  console.log(customer)
  if (!userId || !accessToken) {
    return res.redirect('/login');
  }

  // TODO: Step 2: Found key token
  const keyStore = await KeyTokenService.findKeyTokenByUserID(userId)
  console.log('keyStore::', keyStore)
  if (!keyStore) {
    return res.redirect('/login');
  }

  //* In case refresh token
  if (refreshToken) {
    // TODO: Step 3.1: Verify Refresh Token

    const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)

    if (decodeUser.userId !== userId) {
      throw new UnauthorizedRequest('Invalid Request')
    }

    // TODO: Step 4: Attach keyStore, user, refreshToken to req
    req.keyStore = keyStore
    req.user = decodeUser // payload = { userId, email }
    req.refreshToken = refreshToken

    return next()
  }

  //* In case access token
  // TODO: Step 3.2: Verify Access Token
  const decodeUser = JWT.verify(accessToken, keyStore.publicKey)

  if (decodeUser.userId !== userId) {
    res.redirect('/login');
    throw new UnauthorizedRequest('Invalid Request')
  }

  // TODO: Step 4: Attach keyStore, user to req
  req.keyStore = keyStore
  req.user = decodeUser // payload = { userId, email }
  return next()
})

const verifyJWT = (token, keySecret) => {
  return JWT.verify(token, keySecret)
}
const ensureAuthen = (req, res, next) => {
  if (!req.session.customer) {
    return res.redirect('/login');
  }
  next();
};

export{
  createTokenPair,
  authentication,
  authenticationV2,
  verifyJWT,
    ensureAuthen
}