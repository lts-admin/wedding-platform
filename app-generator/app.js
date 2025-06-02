const express = require('express');
const cors = require('cors');
const generateAppRoute = require('./routes/generateApp');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://wedding-platform-zeta.vercel.app', 'https://master.d23l4mo9odzywu.amplifyapp.com/'],
  methods: ['POST'],
}));

app.use(express.json());

app.use('/api/generate-app', generateAppRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

