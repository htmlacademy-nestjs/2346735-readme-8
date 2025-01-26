import { Schema, Document } from 'mongoose'

export const SubscriptionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subscribedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
})

export interface Subscription extends Document {
  user: string
  subscribedTo: string
  createdAt: Date
}