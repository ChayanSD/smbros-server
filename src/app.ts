import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import registrationRoutes from './routes/registration.routes';

const app = express();

app.use(express.json());

// Routes
app.use('/api/user', registrationRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
