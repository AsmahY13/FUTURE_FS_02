const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// GET all leads with optional search
router.get('/', async (req, res) => {
    try {
        const { search, status } = req.query;
        let filter = {};
        
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (status) {
            filter.status = status;
        }
        
        const leads = await Lead.find(filter).sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET lead by ID
router.get('/:id', async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET lead statistics (summary with breakdowns)
router.get('/stats/summary', async (req, res) => {
    try {
        const totalLeads = await Lead.countDocuments();
        const newLeads = await Lead.countDocuments({ status: 'New' });
        const convertedLeads = await Lead.countDocuments({ status: 'Converted' });
        const lostLeads = await Lead.countDocuments({ status: 'Lost' });

        // Group by source
        const sourcesAgg = await Lead.aggregate([
            { $group: { _id: { $ifNull: ['$source', 'Unknown'] }, count: { $sum: 1 } } },
            { $project: { _id: 0, name: '$_id', count: 1 } }
        ]);

        // Group by status
        const statusesAgg = await Lead.aggregate([
            { $group: { _id: { $ifNull: ['$status', 'Unknown'] }, count: { $sum: 1 } } },
            { $project: { _id: 0, name: '$_id', count: 1 } }
        ]);

        const conversionRate = totalLeads > 0
            ? Math.round((convertedLeads / totalLeads) * 100)
            : 0;

        res.json({
            totalLeads,
            newOpportunities: newLeads,
            conversionRate,
            lostLeads,
            sources: sourcesAgg,
            statuses: statusesAgg
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create new lead
router.post('/', async (req, res) => {
    try {
        const { email, phone } = req.body;
        // Always check for duplicate email
        let duplicate = await Lead.findOne({ email });
        if (duplicate) {
            return res.status(409).json({ message: 'A lead with this email already exists.' });
        }
        // Only check for duplicate phone if phone is provided and not empty
        if (phone && phone.trim() !== '') {
            duplicate = await Lead.findOne({ phone });
            if (duplicate) {
                return res.status(409).json({ message: 'A lead with this phone already exists.' });
            }
        }
        const lead = new Lead(req.body);
        await lead.save();
        res.status(201).json(lead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update lead
router.put('/:id', async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Check if status is being updated
        const newStatus = req.body.status;
        if (newStatus && newStatus !== lead.status) {
            lead.statusHistory.push({
                previousStatus: lead.status,
                status: newStatus,
                changedAt: new Date(),
                changedBy: req.body.changedBy || 'System'
            });
            lead.status = newStatus;
        }

        // Update other fields
        Object.keys(req.body).forEach(key => {
            if (key !== 'status' && key !== 'statusHistory') {
                lead[key] = req.body[key];
            }
        });

        await lead.save();
        res.json(lead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE lead
router.delete('/:id', async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.json({ message: 'Lead deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST add note to lead
router.post('/:id/notes', async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        
        lead.notes.push({
            content: req.body.content
        });
        
        await lead.save();
        res.status(201).json(lead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// stats route moved earlier to include breakdowns

module.exports = router;