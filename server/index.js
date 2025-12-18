import express from 'express';
import connectDB from './db/dbConfig.js';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import commentRoute from './routes/commentRoute.js';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
connectDB()

app.use(cors())

// Routes
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoute);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Global error handler for upload errors
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  
  if (err.name === 'MulterError') {
    return res.status(400).json({ 
      message: "Upload error", 
      error: err.message 
    });
  }
  
  if (err.message.includes('CLOUDINARY')) {
    return res.status(500).json({ 
      message: "Cloudinary upload failed", 
      error: err.message 
    });
  }
  
  res.status(500).json({ 
    message: "Server error", 
    error: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

