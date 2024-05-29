const express = require('express');
const client = require('../database/database'); // Correctly import the client
const authenticateToken = require('../middleware/authenticateToken');

const DriverRouter = express.Router();

// Register driver
DriverRouter.post('/register/driver', async (req, res) => {
    try {
        const { driver_code, driver_name } = req.body;

        const insertUserQuery = 'INSERT INTO drivers (driver_code, driver_name) VALUES ($1, $2)';
        await client.query(insertUserQuery, [driver_code, driver_name]);

        res.status(201).json({ message: 'Driver registered successfully' });
    } catch (error) {
        console.error('Error registering Driver:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Display all drivers
DriverRouter.get('/displaydrivers', async (_req, res) => {
    try {
        const query = 'SELECT driver_id, driver_code, driver_name FROM drivers';
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error loading drivers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Display specific driver
DriverRouter.get('/displaydriver/:id', async (req, res) => {
    const driver_id = req.params.id;

    if (!driver_id) {
        return res.status(400).send({ error: true, message: 'Please provide driver_id' });
    }

    try {
        const query = 'SELECT driver_id, driver_code, driver_name FROM drivers WHERE driver_id = $1';
        const result = await client.query(query, [driver_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error displaying driver:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update driver
DriverRouter.put('/updatedriver/:id', async (req, res) => {
    try {
        const { driver_code, driver_name } = req.body;
        const driver_id = req.params.id;

        const updateUserQuery = 'UPDATE drivers SET driver_code = $1, driver_name = $2 WHERE driver_id = $3';
        await client.query(updateUserQuery, [driver_code, driver_name, driver_id]);

        res.status(200).json({ message: 'Driver updated successfully' });
    } catch (error) {
        console.error('Error updating driver:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete driver
DriverRouter.delete('/deletedriver/:id', async (req, res) => {
    try {
        const driver_id = req.params.id;

        const deleteUserQuery = 'DELETE FROM drivers WHERE driver_id = $1';
        await client.query(deleteUserQuery, [driver_id]);

        res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (error) {
        console.error('Error deleting driver:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = DriverRouter;
