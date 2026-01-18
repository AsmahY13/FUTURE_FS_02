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

// POST create new lead
router.post('/', async (req, res) => {
    try {
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
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
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

// GET lead statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const totalLeads = await Lead.countDocuments();
        const newLeads = await Lead.countDocuments({ status: 'New' });
        const convertedLeads = await Lead.countDocuments({ status: 'Converted' });
        const lostLeads = await Lead.countDocuments({ status: 'Lost' });
        
        const conversionRate = totalLeads > 0 
            ? Math.round((convertedLeads / totalLeads) * 100) 
            : 0;
        
        res.json({
            totalLeads,
            newOpportunities: newLeads,
            conversionRate,
            lostLeads
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;