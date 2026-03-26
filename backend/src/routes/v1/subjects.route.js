const express = require('express');
const prisma = require('../../config/prisma');
const asyncHandler = require('../../utils/asyncHandler');

const router = express.Router();

// GET /api/subjects - List all subjects with topics
router.get('/', asyncHandler(async (req, res) => {
  const subjects = await prisma.subject.findMany({
    include: {
      topics: {
        orderBy: { name: 'asc' },
      },
      children: true,
    },
    where: { parentId: null },
    orderBy: { name: 'asc' },
  });
  res.json({ subjects });
}));

// GET /api/subjects/:slug - Get subject with topics
router.get('/:slug', asyncHandler(async (req, res) => {
  const subject = await prisma.subject.findUnique({
    where: { slug: req.params.slug },
    include: {
      topics: { orderBy: { name: 'asc' } },
      children: {
        include: { topics: true },
      },
    },
  });

  if (!subject) {
    return res.status(404).json({ message: 'Subject not found' });
  }

  res.json({ subject });
}));

module.exports = router;
