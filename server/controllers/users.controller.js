const usersModel = require('../models').usersModel
const generateToken = require('../helpers').generateToken
const getToken = require('../helpers').getToken
const jwt = require('jwt-simple')

const usersController = {}

usersController.GETALLEMPLOYEES = (req, res) => {
  usersModel.getAllEmployeesCompanyId(req.params)
    .then(response => {
      res.send(response)
    })
    .catch(err => {
      console.log('error in GETALLEMPLOYEES usersController', err)
      return err
    })
}

usersController.SIGNIN = (req, res) => {
  const encodedCredentials = req.headers['authorization']
  let decoded = new Buffer(encodedCredentials, 'base64').toString().split(':')
  let email = decoded[0]
  let password = decoded[1]
  usersModel.signin(email, password)
    .then((response) => {
      if (response.success) {
        const token = generateToken(response.userId)
        res.status(200).json({
          response: response,
          token: token
        })
      } else if (response.message === 'incorrect password') {
        res.status(200).json({
          response: response
        })
      } else if (response.message === 'user not found') {
        res.status(200).json({
          response: response
        })
      }
    })
    .catch((err) => {
      res.status(500).json({
        response: err
      })
    })
}

usersController.SIGNUP = (req, res) => {
  const user = req.body.user
  usersModel.signup(user)
    .then((response) => {
      if (response.success) {
        const token = generateToken(response.userId)
        res.status(200).json({
          response: response,
          token: token
        })
      } else {
        res.status(200).json({
          response: response
        })
      }
    })
}

usersController.GET_EMPLOYEES = (req, res) => {
  const companyId = req.params.companyId
  usersModel.getEmployeesByCompany(companyId)
    .then((response) => {
      res.status(200).json({
        response: response
      })
    })
    .catch((err) => {
      res.status(500).json({
        response: err
      })
    })
}

usersController.ADD_USER_TO_COMPANY = (req, res) => {
  const userId = req.body.userId
  const companyId = req.body.companyId
  const isAdmin = req.body.isAdmin
  let getUserAssociations = false
  const token = getToken(req.headers)
  const decoded = jwt.decode(token, process.env.JWT_TOKEN_SECRET)
  if (decoded.userId === Number(userId)) {
    console.log('setting getuserassociations to true')
    getUserAssociations = true
  }
  usersModel.addUserToCompany(userId, companyId, isAdmin, getUserAssociations)
    .then((response) => {
      res.status(200).json({
        response: response
      })
    })
    .catch((err) => {
      res.status(500).json({
        response: err
      })
    })
}

usersController.REMOVE_USER_FROM_COMPANY = (req, res) => {
  const userId = req.query.userId
  const companyId = req.query.companyId
  usersModel.removeUserFromCompany(userId, companyId)
    .then((response) => {
      res.status(200).json({
        response: response
      })
    })
    .catch((err) => {
      res.status(500).json({
        response: err
      })
    })
}

usersController.GET_USER_DETAILS = (req, res) => {
  const userId = req.query.userId || null
  const userEmail = req.query.email || null
  usersModel.getUserDetails(userId, userEmail)
    .then((response) => {
      res.status(200).json({
        response: response
      })
    })
    .catch((err) => {
      res.status(500).json({
        response: err
      })
    })
}

usersController.UPDATE_USER_INFO = (req, res) => {
  const userId = req.params.userId
  const userData = req.body
  usersModel.updateUserInfo(userId, userData)
    .then((response) => {
      res.status(200).json({
        response: response
      })
    })
    .catch((err) => {
      res.status(500).json({
        response: err
      })
    })
}

module.exports = usersController
