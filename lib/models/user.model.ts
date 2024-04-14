/**
 * @fileoverview This file contains the user model.
 * This model is used to define the user schema and the user model.
 */
import { UserRole } from '@/shared/constants';
import mongoose, {Schema, model, models, mongo} from 'mongoose';
import CartItemSchema from './cart.model';

const UserSchema = new Schema({
  id: {
    type: Schema.Types.String,
    required: false,
  },
  name: {
    type: Schema.Types.String,
    required: false,
    maxLength: [32, 'Full name should not be more than 32 characters long'],
  },
  email: {
    type: Schema.Types.String,
    required: [true, 'Email is required'],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email'],
    unique: true,
    trim: true,
  },
  password: {
    type: Schema.Types.String,
    required: false,
  },
  username: {
    type: Schema.Types.String,
    required: false,
  },
  isOnBoarded: {
    type: Schema.Types.Boolean,
    required: false,
    default: false,
  },
  bio: {
    type: Schema.Types.String,
    required: false,
    maxLength: [100, 'Bio should not be more than 100 characters long'],
  },
  age: {
    type: Schema.Types.Number,
    required: false,
    max: [100, 'You should not be more than 100 years old to use this platform'],
  },
  role: {
    required: false,
    type: Schema.Types.String,
    enum: [UserRole.CONSUMER, UserRole.FARMER],
    default: UserRole.CONSUMER,
  },
  prevOrders: {
    type: [Schema.Types.String],
    required: false,
  },
  cart: {
    type: [CartItemSchema],
    required: false,
  },
  image: {
    type: Schema.Types.String,
    required: false,
  },
  joinDate: {
    type: Schema.Types.String,
    required: false,
  },
  resetPasswordToken: {
    type: Schema.Types.String,
    required: false,
  },
  documents: {
    type: [Schema.Types.String],
    required: false,
  },
  contactDetails: {
    email: {
      type: Schema.Types.String,
      required: false,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email'],
    },
    phone: {
      type: Schema.Types.String,
      required: false,
      maxLength: [15, 'Phone number should not be more than 15 characters long'],
    },
    address: {
      type: Schema.Types.String,
      required: false,
      maxLength: [70, 'Address should not be more than 70 characters long'],
    },
  },
  isVerified: {
    type: Schema.Types.Boolean,
    required: false,
    default: false,
  },
  likedReviews: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  roleSpecificData: {
    type: Schema.Types.Mixed,
    required: false,
  }
});

const User = models.User || model('User', UserSchema);

export default User;