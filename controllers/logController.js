const Express = require('express');
const router = Express.Router();
let validateToken = require("../middleware/validate-token");
const { LogModel } = require("../models");

/*
=========================================
Create log
=========================================
*/

router.post("/create", validateToken, async(req, res) => {
    const { description, definition, result } = req.body.log;;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
=========================================
Get all user logs
=========================================
*/

router.get('/mine', validateToken, async(req, res) => {
    const { id } = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
=========================================
Get user log by id
=========================================
*/

router.get('/:id', validateToken, async(req, res) => {
    const { id } = req.params;
    try {
        const results = await LogModel.findAll({
            where: { id: id }
        });
        res.status(200).json(
            results
        );
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
});

/*
=========================================
Update log
=========================================
*/

router.put('/update/:id', validateToken, async(req, res) => {
    const { description, definition, result } = req.body.log;
    const logId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: logId,
            owner_id: userId
        }
    };

    console.log(logId, userId);

    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    };

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json({
            message: 'Log entry updated',
            update
        });
    } catch (err) {
        res.status(500).json({
            message: 'Something went wrong!',
            error: err
        });
    }
});

/*
=========================================
Delete log
=========================================
*/

router.delete('/delete/:id', validateToken, async(req, res) => {
    const userId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
                owner_id: userId
            }
        };

        await LogModel.destroy(query);
        res.status(200).json({ message: 'Log entry removed' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;