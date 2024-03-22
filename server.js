require('dotenv').config();
const sequelize = require('./config/database');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

// Gunakan CORS untuk semua rute
app.use(cors());

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Sinkronisasi model dengan database
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Error syncing database', err));



const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/passwords');


app.use('/api/passwords', passwordRoutes)

app.use('/api/auth', authRoutes);

// sequelize.sync().then(() => {
//     app.listen(3000, () => {
//         console.log('Server is running on port 3000');
//     });
// });
