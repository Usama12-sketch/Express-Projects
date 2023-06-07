const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors({
  origin: ['http://localhost:3000',"chat-socket13-0-d1xp5x7gs-chodarykhan115-gmailcom.vercel.app", `${process.env.URL}` ,"https://chat-socket13-0-ip6j.vercel.app/", "https://chat-socket13-0.vercel.app/"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' }); 
});


app.use('/api', require('./routes/api.route'));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
