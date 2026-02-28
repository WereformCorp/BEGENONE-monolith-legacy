/**
 * @fileoverview Application entry point and process lifecycle manager
 * @module server
 * @layer Infrastructure
 *
 * @description
 * Bootstraps the application by loading environment variables, establishing the
 * MongoDB connection, and starting the Express HTTP server. Registers global
 * process-level handlers for uncaught exceptions and unhandled promise rejections
 * to ensure graceful shutdown on fatal errors.
 *
 * @dependencies
 * - Upstream: Node.js runtime (invoked via npm start)
 * - Downstream: ./config.env (environment), ./app (Express application), mongoose (database)
 *
 * @design
 * Environment configuration is loaded before the Express app is required so that all
 * downstream modules have access to process.env at require-time. The uncaughtException
 * handler is registered first to catch synchronous errors during module initialization.
 * The unhandledRejection handler performs a graceful server close before exiting, allowing
 * in-flight requests to complete.
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTIONS! 💥 Shutting Down...');
  console.log(err.name, err.message, err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`DB Connections Successfull! 🔥🔥`));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting Down...');
  console.log(`⭕⭕⭕ FULL ERROR ⭕⭕⭕`, err);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
