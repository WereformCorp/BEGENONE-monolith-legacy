const { formatDistanceToNow } = require('date-fns');

let urlPath;
if (process.env.NODE_ENV === 'production') {
  // Use the production domain
  urlPath = `https://begenone.com`;
  // eslint-disable-next-line no-else-return
} else if (process.env.NODE_ENV === 'development') {
  // Use the req object for development
  urlPath = `http://127.0.0.1:3000`;
}

console.log(urlPath);

// //////////////////////

const calculateTimeAgo = (videoTime) => {
  try {
    const secondsAgo = Math.floor((new Date() - new Date(videoTime)) / 1000);

    if (secondsAgo < 60) {
      return `${secondsAgo} seconds ago`;
    }
    if (secondsAgo < 3600) {
      const minutesAgo = Math.floor(secondsAgo / 60);
      return `${minutesAgo} minutes ago`;
    }
    if (secondsAgo < 86400) {
      const hoursAgo = Math.floor(secondsAgo / 3600);
      return `${hoursAgo} hours ago`;
    }
    if (secondsAgo < 604800) {
      const daysAgo = Math.floor(secondsAgo / 86400);
      if (daysAgo === 1) {
        return 'Yesterday';
      }
      if (daysAgo < 7) {
        return `${daysAgo} days ago`;
      }
    }

    // For cases where the time difference is larger than a week, use formatDistanceToNow
    return formatDistanceToNow(new Date(videoTime), { addSuffix: true });
  } catch (err) {
    console.log(`CALCULATION | URL PATH & TIME CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
};

module.exports = {
  urlPath,
  calculateTimeAgo,
};
