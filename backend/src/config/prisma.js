const { PrismaClient } = require('@prisma/client');
const config = require('../config/env');

const prisma = new PrismaClient({
  errorFormat: 'minimal',
});

module.exports = prisma;
