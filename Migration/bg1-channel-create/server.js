const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTIONS! 💥 Shutting Down...');
  console.log(err.name, err.message, err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const dbConfig = {
  connectionString:
    'mongodb+srv://danlyo:3ymaHycjnHK3mNsD@cluster0.qe1galg.mongodb.net/', // FOR DANLYO
  options: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
};

mongoose
  .connect(dbConfig.connectionString, dbConfig.options)
  .then(() => console.log(`DB Connections Successfull! 🔥🔥`));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting Down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
