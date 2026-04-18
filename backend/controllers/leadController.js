/**
 * Lead Controller - Handle FD Booking Leads
 * Production Version
 */

import Lead from '../models/Lead.js';
import dotenv from 'dotenv';
dotenv.config();

export async function createLead(req, res) {
  try {
    const {
      phoneNumber, fullName, panNumber, bankName,
      investmentAmount, interestRate, tenureMonths, maturityAmount, language = 'en',
    } = req.body;

    const errors = [];
    if (!phoneNumber) errors.push('Phone number is required');
    if (!fullName) errors.push('Full name is required');
    if (!panNumber) errors.push('PAN number is required');
    if (!bankName) errors.push('Bank name is required');
    if (!investmentAmount) errors.push('Investment amount is required');

    if (errors.length > 0) return res.status(400).json({ success: false, errors });

    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid 10-digit Indian mobile number' });
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
      return res.status(400).json({ success: false, error: 'Please enter a valid PAN number' });
    }

    const lead = await Lead.create({
      phoneNumber,
      fullName,
      panNumber: panNumber.toUpperCase(),
      bankName,
      investmentAmount: Number(investmentAmount),
      interestRate: Number(interestRate) || 0,
      tenureMonths: Number(tenureMonths) || 12,
      maturityAmount: Number(maturityAmount) || investmentAmount,
      language,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      data: {
        id: lead._id,
        phoneNumber: lead.phoneNumber,
        fullName: lead.fullName,
        bankName: lead.bankName,
        investmentAmount: lead.investmentAmount,
        status: lead.status,
        message: 'Booking confirmed! Our team will contact you within 24 hours.',
      },
    });

  } catch (error) {
    console.error('[Lead Controller] Error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, errors: Object.values(error.errors).map(e => e.message) });
    }
    return res.status(500).json({ success: false, error: 'Failed to create booking in database' });
  }
}

export async function getLeadByPhone(req, res) {
  try {
    const { phoneNumber } = req.params;
    const lead = await Lead.findOne({ phoneNumber }).sort({ timestamp: -1 });

    if (!lead) return res.status(404).json({ success: false, error: 'No booking found' });
    return res.json({ success: true, data: lead });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch booking' });
  }
}

export default { createLead, getLeadByPhone };