import express from 'express';
import movieRoutes from './routes/movies';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api/movies', movieRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
