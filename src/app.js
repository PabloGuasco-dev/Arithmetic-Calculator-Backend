const express = require('express');
const app = express();
const swaggerSetup = require('./swagger');

app.use(express.json());

const userRoutes = require('./src/routes/userRoute');
const recordRoutes = require('./src/routes/recordRoute');
const operationRoutes = require('./src/routes/operation');

app.use('/api', userRoutes);
app.use('/api', recordRoutes);
app.use('/api', operationRoutes);

swaggerSetup(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});