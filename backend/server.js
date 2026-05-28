require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// DATABASE
connectDB().catch((err) => {
  console.error("MongoDB connection failed:", err.message);
});

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "https://bus-booking-frontend-virid.vercel.app",
  "https://funtravels.vercel.app",
  "https://sprinkler-daughter-exalted.ngrok-free.dev",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    const isVercelPreview =
      /^https:\/\/.*\.vercel\.app$/.test(origin);

    if (
      allowedOrigins.includes(origin) ||
      isVercelPreview
    ) {
      return callback(null, true);
    }

    return callback(
      new Error("Not allowed by CORS")
    );
  },

  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/buses", require("./routes/busRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

// ROOT
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Fun Travels API Running"
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// ERROR
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

// LOCAL ONLY
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;