import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema({
  positionX: Number,
  positionY: Number,
  url: String,
  noFlyZoneMeters: Number,
  violations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pilot',
    },
  ],
})

export default mongoose.model('Nest', schema)
