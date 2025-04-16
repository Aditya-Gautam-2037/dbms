const express = require('express');
const router = express.Router();
const { executeQuery, saveQueryHistory, getQueryHistory, getAllQueries, clearQueryHistory } = require('../controllers/queryController');
const authMiddleware = require('../middlewares/authMiddleware');

// Example route to run SQL queries
router.post('/run-query', authMiddleware, executeQuery);
router.post('/save-query-history', authMiddleware, saveQueryHistory);
router.get('/query-history', authMiddleware, (req, res, next) => {
    console.log('Fetching query history for user:', req.user); // Debug log
    getQueryHistory(req, res, next);
});
router.get('/all-queries', authMiddleware, (req, res, next) => {
    console.log('Fetching all queries'); // Debug log
    getAllQueries(req, res, next);
});
router.delete('/query-history/clear', authMiddleware, clearQueryHistory);

module.exports = router;
