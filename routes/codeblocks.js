const express = require('express');
const router = express.Router();
const CodeBlock = require('../models/CodeBlock');

//Get all code blocks from db
router.get('/', async (req, res) => {
  const codeblocks = await CodeBlock.find();
  res.json(codeblocks);
});

//Get code block by ID
router.get('/:id', async (req, res) => {
  const codeblock = await CodeBlock.findById(req.params.id);
  res.json(codeblock);
});

module.exports = router;
