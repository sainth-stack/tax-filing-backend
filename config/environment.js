const PORT = 4000

const DATABASE_URL = `mongodb+srv://prashanth:BnHRQrqZHdnosfEe@cluster0.cpydc.mongodb.net/tax-filing?retryWrites=true&w=majority`;

//const DATABASE_URL = "mongodb://localhost:27017/talentSpotifyDB"

const JWT_SECRET = "$2a$12$e9HMflla.nPm9t8LOopEdeTYD.fmAYbxQ4p6XbLNylKRgcDEMXPba"

module.exports = {
  PORT,
  DATABASE_URL,
  JWT_SECRET
}