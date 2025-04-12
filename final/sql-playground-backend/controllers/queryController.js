const connectMySQL = require('../db');
const QueryHistory = require('../models/QueryHistory');

// @desc Execute SQL query
// @route POST /api/query/execute
// @access Protected (recommend to use JWT later)
exports.executeQuery = async (req, res) => {
  const { query } = req.body;
  const userId = req.user.userId; // Ensure userId is available from authMiddleware

  try {
    const connection = await connectMySQL();
    const [rows] = await connection.execute(query);

    // Save query to history
    const newHistory = new QueryHistory({ userId, query });
    await newHistory.save();

    res.status(200).json({
      success: true,
      result: rows,
    });

    await connection.end(); // Close the connection after query
  } catch (err) {
    console.error('❌ SQL Execution Error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Save query to history
exports.saveQueryHistory = async (req, res) => {
  const { query } = req.body;
  const userId = req.user.userId;

  try {
    const newHistory = new QueryHistory({ userId, query });
    await newHistory.save();
    res.status(201).json({ success: true, message: 'Query saved to history' });
  } catch (err) {
    console.error('❌ Error saving query history:', err.message);
    res.status(500).json({ success: false, error: 'Failed to save query history' });
  }
};

// Fetch query history
exports.getQueryHistory = async (req, res) => {
  const userId = req.user.userId;

  try {
    console.log('Fetching query history for userId:', userId); // Debug log
    const history = await QueryHistory.find({ userId }).sort({ createdAt: -1 });
    console.log('Query history fetched:', history); // Debug log
    res.status(200).json({ success: true, history });
  } catch (err) {
    console.error('❌ Error fetching query history:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch query history' });
  }
};

// Fetch all queries
exports.getAllQueries = async (req, res) => {
  try {
    const history = await QueryHistory.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, history });
  } catch (err) {
    console.error('❌ Error fetching all queries:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch all queries' });
  }
};

// Clear query history
exports.clearQueryHistory = async (req, res) => {
  const userId = req.user.userId;

  try {
    await QueryHistory.deleteMany({ userId });
    res.status(200).json({ success: true, message: 'Query history cleared successfully' });
  } catch (err) {
    console.error('❌ Error clearing query history:', err.message);
    res.status(500).json({ success: false, error: 'Failed to clear query history' });
  }
};
