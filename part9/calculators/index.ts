import express from 'express';
import { calculateBmi } from './calculators/bmiCalculator';
import { exerciseCalculator } from './calculators/exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = req.query.height;
  const weight = req.query.weight;
  if (!height || !weight) {
    res.status(400).json({error:"parameters missing"});
  } else if (isNaN(Number(height)) || isNaN(Number(weight))) {
    res.status(400).json({error:"malformatted parameters"});
  }

  const bmi = calculateBmi(Number(height), Number(weight));

  res.json({ 
    height: height,
    weight: weight,
    bmi: bmi
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const target = req.body.target;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const values = req.body.daily_exercises;

  if (!target || !values) {
    res.status(400).json({error:"parameters missing"});
  } else if (isNaN(Number(target)) || !Array.isArray(values)) {
    res.status(400).json({error:"malformatted parameters"});
  } else if (values.some(n => isNaN(Number(n)))) {
    res.status(400).json({error:"malformatted parameters"});
  }

  const results = exerciseCalculator(target, values);
  res.send(results);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});