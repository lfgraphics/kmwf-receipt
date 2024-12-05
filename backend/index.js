const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const cookieParser = require("cookie-parser");


const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.137.1:3000",
  "https://kmwf-receipt.vercel.app" // Production frontend URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman or server-side requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Enable credentials
  })
);

app.use(cookieParser());

app.use(bodyParser.json());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connected to MongoDB Atlas")).catch(err => console.log(err));

// Routes
const receiptRoutes = require("./src/routes/receipt");
const authRoutes = require("./src/routes/auth")

app.use('/auth', authRoutes);
app.use("/receipts", receiptRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
