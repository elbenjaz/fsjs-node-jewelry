import express from 'express';
import cors from 'cors';
import logger from './src/utils/logger.js';
import joyasRoutes from './routes/joyasRoutes.js';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(logger);

app.use("/", joyasRoutes);

app.listen(PORT, console.log(`Server running on port ${PORT}...`));
