import {Schema, model, models} from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: [true, 'Full name is required'],
    minLength: [4, 'Full name should be at least 4 characters long'],
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
  userType: {
    required: false,
    type: Schema.Types.String,
    enum: ['user', 'farmer'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  image: {
    type: Schema.Types.String,
    required: false,
  },
  resetPasswordToken: {
    type: String,
    required: false,
  },
  isOnBoarded: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const User = models.User || model('User', UserSchema);

export default User;