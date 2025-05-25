const express = require('express');
const cors = require('cors');
const generateAppRoute = require('./routes/generateApp');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // ✅ Allow requests from your Next.js dev server
  methods: ['POST'],               // Optional: restrict to POST
}));

app.use(express.json());

app.use('/api/generate-app', generateAppRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

