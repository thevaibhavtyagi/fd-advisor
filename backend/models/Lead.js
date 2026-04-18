/**
 * Lead Model - Mongoose Schema for FD Booking Leads
 */

import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'],
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  panNumber: {
    type: String,
    required: [true, 'PAN number is required'],
    uppercase: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number'],
  },
  bankName: {
    type: String,
    required: [true, 'Bank name is required'],
    trim: true,
  },
  investmentAmount: {
    type: Number,
    required: [true, 'Investment amount is required'],
    min: [1000, 'Minimum investment is ₹1,000'],
    max: [10000000, 'Maximum investment is ₹1 crore'],
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0,
    max: 20,
  },
  tenureMonths: {
    type: Number,
    required: true,
    min: 1,
    max: 120,
  },
  maturityAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'mr'],
    default: 'en',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

leadSchema.index({ phoneNumber: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ timestamp: -1 });

leadSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;