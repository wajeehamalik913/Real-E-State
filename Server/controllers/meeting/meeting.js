const Meeting = require('../../model/schema/meeting');
const mongoose = require('mongoose');

// Add a new meeting
const add = async (req, res) => {
    try {
        const data = req.body;
        const meeting = new Meeting({ ...data });
        await meeting.save();
        res.status(201).json({ message: 'Meeting created successfully', meeting });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create meeting', error: err.message });
    }
};

// Get all meetings (with optional filters)
const index = async (req, res) => {
    try {
        const filter = { deleted: false, ...req.query };
        const meetings = await Meeting.find(filter).sort({ dateTime: -1 });
        res.status(200).json(meetings);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve meetings', error: err.message });
    }
};

// Get a single meeting
const view = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
        res.status(200).json(meeting);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve meeting', error: err.message });
    }
};

// Soft delete one meeting
const deleteData = async (req, res) => {
    try {
        const result = await Meeting.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
        if (!result) return res.status(404).json({ message: 'Meeting not found' });
        res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete meeting', error: err.message });
    }
};

// Delete many meetings
const deleteMany = async (req, res) => {
    try {
        const ids = req.body; // array of IDs
        const result = await Meeting.updateMany(
            { _id: { $in: ids }, deleted: { $ne: true } },
            { $set: { deleted: true } }
        );
        res.status(200).json({ message: 'Meetings deleted successfully', result });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete meetings', error: err.message });
    }
};

module.exports = { add, index, view, deleteData, deleteMany };
