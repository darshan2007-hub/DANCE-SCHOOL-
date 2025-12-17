const Query = require('../models/Query');

/**
 * CREATE QUERY (Frontend → MongoDB)
 */
exports.createQuery = async (req, res) => {
  try {
    console.log("🔍 CREATE QUERY - Request received");
    console.log("📋 Headers:", req.headers);
    console.log("📦 Body:", req.body);
    console.log("🔗 MongoDB connection state:", require('mongoose').connection.readyState);

    const { name, email, phone, subject, message } = req.body;

    // 🔒 Enhanced validation
    if (!name || !email || !subject || !message) {
      console.log("❌ Validation failed - missing required fields");
      return res.status(400).json({
        success: false,
        message: "Name, email, subject, and message are required",
        received: { name: !!name, email: !!email, subject: !!subject, message: !!message }
      });
    }

    console.log("✅ Validation passed, creating query...");
    
    const queryData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : undefined,
      subject: subject.trim(),
      message: message.trim()
    };
    
    console.log("📝 Query data to save:", queryData);

    const query = await Query.create(queryData);
    
    console.log("🎉 Query saved successfully:", query._id);

    res.status(201).json({
      success: true,
      message: 'Query submitted successfully',
      query
    });

  } catch (error) {
    console.error("🔥 CREATE QUERY ERROR:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * GET ALL QUERIES (Admin)
 */
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find()
      .populate('respondedBy', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      queries
    });

  } catch (error) {
    console.error("GET QUERIES ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SINGLE QUERY BY ID (Admin)
 */
exports.getQueryById = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id)
      .populate('respondedBy', 'username');

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    res.json({
      success: true,
      query
    });

  } catch (error) {
    console.error("GET QUERY ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * RESPOND TO QUERY (Admin)
 */
exports.respondToQuery = async (req, res) => {
  try {
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Response message is required"
      });
    }

    const query = await Query.findByIdAndUpdate(
      req.params.id,
      {
        response,
        status: 'responded',
        respondedBy: req.admin.id,
        respondedAt: new Date()
      },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    res.json({
      success: true,
      message: 'Response sent successfully',
      query
    });

  } catch (error) {
    console.error("RESPOND QUERY ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE QUERY (Admin)
 */
exports.deleteQuery = async (req, res) => {
  try {
    const query = await Query.findByIdAndDelete(req.params.id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    res.json({
      success: true,
      message: 'Query deleted successfully'
    });

  } catch (error) {
    console.error("DELETE QUERY ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};
