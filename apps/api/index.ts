import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import vaultRoutes from './routes/vault';
import consentRoutes from './routes/consent';
import auditRoutes from './routes/audit';
import prescriptionRoutes from './routes/prescriptions';
import aiRoutes from './routes/ai';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/consent', consentRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
