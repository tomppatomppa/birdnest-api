import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema({
  name: {
    type: String,
  },
  protectedNests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Nest',
    },
  ],
})

export default mongoose.model('Bird', schema)
