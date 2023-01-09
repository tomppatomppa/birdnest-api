import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema({
  pilotId: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  createdDt: String,
  email: String,
  lastSeen: String,
  drone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drone',
  },
})

export default mongoose.model('Pilot', schema)
