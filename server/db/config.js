const Sequelize = require('sequelize')

const db = new Sequelize('postgres://ffkgdwnz:DwIxYC_uxOROnlYvKEwt3KH57rUQzqDw@elmer.db.elephantsql.com:5432/ffkgdwnz')

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.log('Unable to connect to the database:', err)
  })

module.exports = db
