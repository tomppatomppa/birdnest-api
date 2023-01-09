import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema({
  serialNumber: {
    type: String,
    unique: true,
  },
  model: {
    type: String,
  },
  manufacturer: {
    type: String,
  },
  mac: {
    type: String,
  },
  ipv4: {
    type: String,
  },
  ipv6: {
    type: String,
  },
  firmware: {
    type: String,
  },
  positionY: {
    type: String,
  },
  positionX: {
    type: String,
  },
  altitude: {
    type: String,
  },
  snapshotTimestamp: {
    type: String,
  },
  confirmedDistance: {
    type: Number,
  },
})

export default mongoose.model('Drone', schema)
