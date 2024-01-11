const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Channel = require(`../../models/channelModel`);
const Comment = require('../../models/commentModel');
const Wire = require('../../models/wireModel');
const Product = require('../../models/productModel');
const Review = require('../../models/reviewsModel');
const Sponsor = require('../../models/sponsorsModel');
const Story = require('../../models/storyModel');
const User = require('../../models/userModel');
const Video = require('../../models/videoModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`DB Connections Successfull! 🔥🔥`));

// READ JSON FILE
const channel = JSON.parse(
  fs.readFileSync(`${__dirname}/channel.json`, 'utf-8'),
);
const comment = JSON.parse(
  fs.readFileSync(`${__dirname}/comment.json`, 'utf-8'),
);
const wire = JSON.parse(fs.readFileSync(`${__dirname}/wire.json`, 'utf-8'));
const product = JSON.parse(
  fs.readFileSync(`${__dirname}/product.json`, 'utf-8'),
);
const review = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);
const sponsor = JSON.parse(
  fs.readFileSync(`${__dirname}/sponsor.json`, 'utf-8'),
);
const story = JSON.parse(fs.readFileSync(`${__dirname}/story.json`, 'utf-8'));
const user = JSON.parse(fs.readFileSync(`${__dirname}/user.json`, 'utf-8'));
const video = JSON.parse(fs.readFileSync(`${__dirname}/video.json`, 'utf-8'));

// IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    await Channel.create(channel);
    await Comment.create(comment);
    await Wire.create(wire);
    await Product.create(product);
    await Review.create(review);
    await Sponsor.create(sponsor);
    await Story.create(story);
    await Video.create(video);
    await User.create(user);
    console.log('Data Successfully Loaded!');
  } catch (err) {
    console.log(err, err.message);
  }
  process.exit();
};

// DELETE ALL DATA FROM DATABASE
const deleteData = async () => {
  try {
    await Channel.deleteMany(channel);
    await Comment.deleteMany(comment);
    await Wire.deleteMany(wire);
    await Product.deleteMany(product);
    await Review.deleteMany(review);
    await Sponsor.deleteMany(sponsor);
    await Story.deleteMany(story);
    await Video.deleteMany(video);
    await User.deleteMany(user);
    console.log('Data Successfully Deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
