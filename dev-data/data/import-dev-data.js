const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const channelRouter = require('./routes/channelRoutes');
const cdmRouter = require('./routes/cdmRoutes');
const lvmRouter = require('./routes/lvmRoutes');
const svmRouter = require('./routes/svmRoutes');
const sponsorRouter = require('./routes/sponsorRoutes');
const storyRouter = require('./routes/storyRoutes');
const viewsRouter = require('./routes/viewsRoutes');
const marketRouter = require('./routes/marketRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const userRouter = require('./routes/userRoutes');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
    // useUnifiedTopology: true,
  })
  .then(() => console.log(`DB Connections Successfull! 🔥🔥`));

// READ JSON FILE
const channels = JSON.parse(
  fs.readFileSync(`${__dirname}/channel.json`, 'utf-8')
);

console.log(channels);
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
// );

// IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    // await Tour.create(tours);
    // await User.create(users, { validateBeforeSave: false });
    // await Review.create(reviews);
    console.log('Data Successfully Loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DATABASE
const deleteData = async () => {
  try {
    // await Tour.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();
    console.log('Data Successfully Deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  // importData();
} else if (process.argv[2] === '--delete') {
  // deleteData();
}
