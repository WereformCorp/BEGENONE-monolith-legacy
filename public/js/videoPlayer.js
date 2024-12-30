/* eslint-disable */
const channelLogoDefault = `https://begenone-images.s3.amazonaws.com/default-user-photo.jpg`;
const currentUrl = window.location.href;
const url = new URL(currentUrl);
const fullPath = url.pathname;
const currentVideoId = fullPath.split('/').pop();
console.log('Unique ID:', currentVideoId); // Output: 673f63768f13f439483ff73e

let watchedVideosIds = [];
if (!watchedVideosIds.includes(currentVideoId)) {
  watchedVideosIds.push(currentVideoId);
}

// Initialize Plyr for video elements
document
  .querySelectorAll('.sect-mid-vdoPlayer-video')
  .forEach((videoElement) => {
    new Plyr(videoElement, {
      controls: ['progress'],
      captions: { active: true },
      volume: 0.5, // Set default volume to 50%
      fullscreen: { enabled: false }, // Disable fullscreen
    });
  });

// Scroll-related functionality
let isScrolling = false;
let isFetching = false;
const videos = Array.from(document.querySelectorAll('.content-containers'));
console.log('Videos ARRAY:', videos);
let currentIndex = 0;

const scrollToElement = (element) => {
  if (!element || isScrolling) return;

  isScrolling = true;
  element.scrollIntoView({ behavior: 'smooth', block: 'end' });

  setTimeout(() => {
    window.scrollBy(0, 60);
    isScrolling = false;
  }, 800);
};

// Update URL with History API
const updateHistoryState = (videoId) => {
  const currentState = window.location.href;
  const newState = `/clipz/${videoId}`;
  if (currentState !== newState) {
    window.history.pushState({ videoId }, '', newState);
  }
};

// Load video details dynamically
const loadVideoDetails = async (videoId) => {
  try {
    const response = await axios.get(`/api/v1/videos/${videoId}`);
    const videoData = response.data.data;
    const availableVideos = videoData.filter(
      (video) => !watchedVideosIds.includes(video.id),
    );
    const videoToDisplay = availableVideos.slice(0, 1);
    // videoToDisplay.forEach((video) => {
    //   if (!videos.some((v) => v.dataset.videoId === video.id)) {
    //     const cloudFrontUrl = `https://dpz1evfcdl4g3.cloudfront.net/${video.video}`;
    //     renderHTML(video, cloudFrontUrl, logo);
    //   }
    // });
    videosToDisplay.forEach(async (video) => {
      const cloudFrontUrl = `https://dpz1evfcdl4g3.cloudfront.net`;
      const cloudFrontUrlVideo = `https://dpz1evfcdl4g3.cloudfront.net/${video.video}`;
      const getChannel = await axios.get(
        `/api/v1/channels/${video.channel._id}`,
      );
      console.log('Channel:', getChannel.data.data);

      let logo;
      if (video.channel)
        logo = `${cloudFrontUrl}/${getChannel.data.data.channelLogo}`;
      else logo = channelLogoDefault;

      console.log('Channel Logo:', logo);
      console.log('Channel Logo Url:', getChannel.data.data.channelLogo);
      renderHTML(video, cloudFrontUrlVideo, logo); // Render each video
      watchedVideosIds.push(video.id); // Mark as watched
    });
  } catch (error) {
    console.error('Error loading video details:', error);
  }
};

// Function to fetch and render videos
async function fetchAndRenderVideos() {
  try {
    isFetching = true;
    // Fetch new videos
    const response = await axios.get(`/api/v1/videos`);
    const videoData = response.data.data;

    // Filter and get 3 new videos
    const availableVideos = videoData.filter(
      (video) => !watchedVideosIds.includes(video.id),
    );
    const videosToDisplay = availableVideos.slice(0, 1);

    console.log('Videos to display:', videosToDisplay);

    if (videosToDisplay.length === 0) {
      console.log('No more videos to load.');
      isFetching = false;
      return;
    }

    const channelLogoUrl = document.querySelector('.channelLogo-url')
      ? document.querySelector('.channelLogo-url').value
      : null;

    videosToDisplay.forEach(async (video) => {
      const cloudFrontUrl = `https://dpz1evfcdl4g3.cloudfront.net`;
      const cloudFrontUrlVideo = `https://dpz1evfcdl4g3.cloudfront.net/${video.video}`;
      const getChannel = await axios.get(
        `/api/v1/channels/${video.channel._id}`,
      );
      console.log('Channel:', getChannel.data.data);

      let logo;
      if (video.channel)
        logo = `${cloudFrontUrl}/${getChannel.data.data.channelLogo}`;
      else logo = channelLogoDefault;

      console.log('Channel Logo:', logo);
      console.log('Channel Logo Url:', getChannel.data.data.channelLogo);
      renderHTML(video, cloudFrontUrlVideo, logo); // Render each video
      watchedVideosIds.push(video.id); // Mark as watched
    });

    initializePlyrForNewVideos(); // Initialize Plyr for new videos

    // Update videos array after new videos are added
    const newVideos = Array.from(
      document.querySelectorAll('.content-containers'),
    );

    // Calculate the new videos added
    const newVideosAdded = newVideos.length - videos.length;

    // Handle the case where videos array shrinks or no new videos are added
    if (newVideosAdded < 0) {
      console.warn(
        'New videos added count is negative, resetting the videos array.',
      );
      videos.length = 0; // Clear the videos array if the new count is negative
      videos.push(...newVideos); // Add the current DOM videos instead
    } else {
      // Only add new videos if the count is positive
      videos.push(...newVideos.slice(-newVideosAdded)); // Only add the newly fetched videos
    }

    // Update the currentIndex to the next video after fetch
    if (newVideosAdded > 0) {
      currentIndex = videos.length - newVideosAdded; // Set to the first of the newly loaded videos
      console.log('Current index:', currentIndex);
      scrollToElement(videos[currentIndex]); // Scroll to the new video
    }
    isFetching = false;
  } catch (error) {
    console.error('Error fetching videos:', error);
  }
}

// Handle scrolling between videos
window.addEventListener('wheel', async (event) => {
  // event.preventDefault();
  if (isScrolling || isFetching) return;

  if (event.deltaY > 0) {
    // Scroll down
    if (currentIndex < videos.length - 1) {
      currentIndex++;
      const nextVideo = videos[currentIndex];
      console.log('Next video:', nextVideo);
      const videoId = nextVideo.dataset.videoId;
      console.log('Next video ID:', videoId);
      updateHistoryState(videoId);
      scrollToElement(nextVideo);
    } else {
      // Reached the end, load more videos
      await fetchAndRenderVideos();

      const observerOptions = { root: null, threshold: 0.7 };
      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          console.log('Entry:', entry);
          const video = entry.target.querySelector('video');
          // Ensure that the element is actually a video tag
          console.log('Video:', video);
          if (entry.isIntersecting) {
            if (video.paused) {
              video.play(); // Play only after user interaction (e.g., scroll)
            }
          } else {
            video.pause();
          }
        });
      };

      const observer = new IntersectionObserver(
        observerCallback,
        observerOptions,
      );
      videos.forEach((videoElement) => observer.observe(videoElement));
    }
  } else if (event.deltaY < 0 && currentIndex > 0) {
    // Scroll up
    currentIndex--;
    const prevVideo = videos[currentIndex];
    const videoId = prevVideo.dataset.videoId;
    console.log('Previous video:', prevVideo);
    console.log('Previous video ID:', videoId);
    updateHistoryState(videoId);
    scrollToElement(prevVideo);
  }
});

// Listen for popstate events
window.addEventListener('popstate', (event) => {
  if (event.state && event.state.videoId) {
    console.log('Popstate event:', event.state);
    const videoId = event.state.videoId;
    const targetVideo = videos.find(
      (video) => video.dataset.videoId === videoId,
    );
    if (targetVideo) {
      scrollToElement(targetVideo);
    } else {
      loadVideoDetails(videoId);
    }
  }
});

// Intersection Observer for playback management
const observerOptions = { root: null, threshold: 0.7 };
const observerCallback = (entries) => {
  entries.forEach((entry) => {
    console.log('Entry:', entry);
    const video = entry.target.querySelector('video');
    // Ensure that the element is actually a video tag
    console.log('Video:', video);
    if (entry.isIntersecting) {
      if (video.paused) {
        video.play();
      }
    } else {
      video.pause();
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

videos.forEach((videoElement) => observer.observe(videoElement));

// Render HTML for new videos
const videoContainer = document.querySelector('.sect-mid-contentContainer');

function renderHTML(video, cloudFrontUrl, channelLogo) {
  // const pugHtml = `
  //   <div class="content-containers content-container-1" data-video-id="${video.id}">
  //     <section class="sect-ctntDtls-vdoContainer">
  //       <video class="sect-mid-vdoPlayer-video myVideo" id="video-${video.id}" autoplay loop muted>
  //         <source src="${cloudFrontUrl}" type="video/mp4">
  //       </video>
  //       <h4 class="sect-ctntDtls-vdoTitle-overlay">${video.title}</h4>
  //     </section>
  //     <div class="section-column-2">
  //       <h4 class="sect-ctntDtls-vdoTitle">${video.title}</h4>
  //       <section class="sect-ctntDtls-head">
  //         <div class="sect-ctntDtls-channelDetails">
  //           <input type="hidden" class="channelLogo-url" value="${video.channel ? channelLogo : ''}">
  //           <img class="sect-ctntDtls-chImage" src="${video.channel && channelLogo !== undefined && channelLogo !== '' && channelLogo !== null ? channelLogo : channelLogoDefault}" height="30px">
  //           <div class="sect-ctntDtls-chName_N_subCount">
  //             <h4 class="sect-ctntDtls-chName">${video.channel.name}</h4>
  //             <h4 class="sect-ctntDtls-subCount">
  //               <span>${video.channel.subscribersCount}</span> Subscribers
  //             </h4>
  //           </div>
  //         </div>
  //         <button class="sect-ctntDtls-subsBtn">Subscribe</button>
  //       </section>
  //       <section class="sect-ctntNav-n-mover">
  //         <section class="section-ctnt-nav sect-mid-vdoP-nav">
  //           <div class="sect-mid-vdoP-items sect-mid-vdoP-navLike">
  //             <div class="vdoPlayer-icon-imgs vdoP-likeIcon icon icon-thumbs-up-solid">
  //               <i class="fa-solid fa-thumbs-up"></i>
  //             </div>
  //             <h4 class="likesCount">Likes - ${video.likes || '0'}</h4>
  //           </div>
  //           <div class="sect-mid-vdoP-items sect-mid-vdoP-navDislike">
  //             <div class="vdoPlayer-icon-imgs vdoP-dislikeIcon icon icon-thumbs-down-solid">
  //               <i class="fa-solid fa-thumbs-down"></i>
  //             </div>
  //             <h4 class="dislikesCount">Dislike - ${video.dislikes || '0'}</h4>
  //           </div>
  //           <div class="sect-mid-vdoP-items sect-mid-vdoP-navComment">
  //             <div class="vdoPlayer-icon-imgs vdoP-commentIcon icon icon-comment-solid">
  //               <i class="fa-solid fa-comment"></i>
  //             </div>
  //             <h4 class="vidCommentText">Comments</h4>
  //           </div>
  //           <div class="sect-mid-vdoP-items sect-mid-vdoP-navShare">
  //             <div class="vdoPlayer-icon-imgs vdoP-shareIcon icon icon-share-nodes-solid">
  //               <i class="fa-solid fa-share"></i>
  //             </div>
  //             <h4 class="vidShareText">Share</h4>
  //           </div>
  //         </section>
  //         <section class="section-ctnt-mover">
  //           <div class="icon-clipz icon-up-solid sect-ctntMover-up">
  //             <i class="fa-solid fa-circle-up"></i>
  //           </div>
  //           <div class="icon-clipz icon-down-solid sect-ctntMover-dwn">
  //             <i class="fa-solid fa-circle-down"></i>
  //           </div>
  //         </section>
  //       </section>
  //     </div>

  //     <section class="ctnt-comments">
  //       <section class="ctnt-cmmnt-analytics">
  //         <h4 class="ctnt-cmmnt-count">
  //           <span class="ctnt-cmmnts-text">Comments:</span>
  //           <span class="ctnt-cmmnts-amount">${video.comments ? video.comments.length : '0'}</span>
  //         </h4>
  //         <i class="fa-solid fa-xmark"></i>
  //       </section>
  //       <section class="ctnt-cmmnt-inputbox">
  //         <form id="commentForm" class="ctnt-cmmnt-inputField">
  //           <textarea id="commentInput" type="text" placeholder="Type your comment..."></textarea>
  //           <button id="commentBtn" type="submit">
  //             <i class="fa-solid fa-paper-plane"></i>
  //           </button>
  //         </form>
  //       </section>
  //       <section class="ctnt-cmmnt-list">
  //         ${video.comments
  //           .map(
  //             (comment) => `
  //           <div class="ctnt-cmmnt-listItems ctnt-cmmnt-listItem-1">
  //             <div class="ctnt-cmmnt-accDtls_N_opts">
  //               ${
  //                 comment.channel && comment.channel.displayImage
  //                   ? `
  //                 <input type="hidden" class="hidden-channel-id" value="${comment.channel._id}">
  //                 <input type="hidden" class="hidden-channel-name" value="${comment.channel.name}">
  //                 <img class="ctnt-cmmnt-logo" src="/imgs/users/${comment.channel.displayImage}" />
  //               `
  //                   : `
  //                 <img class="ctnt-cmmnt-logo" src="${channelLogoDefault}" />
  //               `
  //               }
  //               <div class="ctnt-cmmnt-accDetails">
  //                 <h4 class="cmmnt-accDtls">${comment.channel ? comment.channel.name : 'Anonymous'}</h4>
  //                 <h6 class="cmmnt-date">${new Date(comment.time).toLocaleString('en-uk', { day: 'numeric', month: 'long', year: 'numeric' })}</h6>
  //               </div>
  //               <input type="hidden" value="${comment._id}" class="delete-comment-id">
  //              ${
  //                video.user === (comment.user && comment.user._id)
  //                  ? `<button class="delete-comment-btn" data-owner-id="${comment.user._id}">Delete Comment</button>`
  //                  : ''
  //              }
  //             </div>
  //             <h4 class="ctnt-cmmnt-textCmmnt">${comment.comment}</h4>
  //             <button class="ctnt-cmmnt-reply">Reply</button>
  //           </div>
  //         `,
  //           )
  //           .join('')}
  //       </section>
  //     </section>
  //   </div>
  // `;

  const pugHtml = `
    <div class="content-containers content-container-1" data-video-id="${video.id}">
      <section class="sect-ctntDtls-vdoContainer">
        <video class="sect-mid-vdoPlayer-video myVideo" id="video-${video.id}" autoplay loop muted>
          <source src="${cloudFrontUrl}" type="video/mp4">
        </video>
        <h4 class="sect-ctntDtls-vdoTitle-overlay">${video.title}</h4>
      </section>
      <div class="section-column-2">
        <h4 class="sect-ctntDtls-vdoTitle">${video.title}</h4>
        <section class="sect-ctntDtls-head">
          <div class="sect-ctntDtls-channelDetails">
            <input type="hidden" class="channelLogo-url" value="${video.channel ? channelLogo : ''}">
            <img class="sect-ctntDtls-chImage" src="${video.channel && channelLogo !== undefined && channelLogo !== '' && channelLogo !== null ? channelLogo : channelLogoDefault}" height="30px">
            <div class="sect-ctntDtls-chName_N_subCount">
              <h4 class="sect-ctntDtls-chName">${video.channel.name}</h4>
              <h4 class="sect-ctntDtls-subCount">
                <span>${video.channel.subscribersCount}</span> Subscribers
              </h4>
            </div>
          </div>
          <button class="sect-ctntDtls-subsBtn">Subscribe</button>
        </section>
        <section class="sect-ctntNav-n-mover">
          <section class="section-ctnt-nav sect-mid-vdoP-nav">
            <div class="sect-mid-vdoP-items sect-mid-vdoP-navLike">
              <div class="vdoPlayer-icon-imgs vdoP-likeIcon icon icon-thumbs-up-solid">
                <i class="fa-solid fa-thumbs-up"></i>
              </div>
              <h4 class="likesCount">Likes - ${video.likes || '0'}</h4>
            </div>
            <div class="sect-mid-vdoP-items sect-mid-vdoP-navDislike">
              <div class="vdoPlayer-icon-imgs vdoP-dislikeIcon icon icon-thumbs-down-solid">
                <i class="fa-solid fa-thumbs-down"></i>
              </div>
              <h4 class="dislikesCount">Dislike - ${video.dislikes || '0'}</h4>
            </div>
            <div class="sect-mid-vdoP-items sect-mid-vdoP-navComment">
              <div class="vdoPlayer-icon-imgs vdoP-commentIcon icon icon-comment-solid">
                <i class="fa-solid fa-comment"></i>
              </div>
              <h4 class="vidCommentText">Comments</h4>
            </div>
            <div class="sect-mid-vdoP-items sect-mid-vdoP-navShare">
              <div class="vdoPlayer-icon-imgs vdoP-shareIcon icon icon-share-nodes-solid">
                <i class="fa-solid fa-share"></i>
              </div>
              <h4 class="vidShareText">Share</h4>
            </div>
          </section>
          <section class="section-ctnt-mover">
            <div class="icon-clipz icon-up-solid sect-ctntMover-up">
              <i class="fa-solid fa-circle-up"></i>
            </div>
            <div class="icon-clipz icon-down-solid sect-ctntMover-dwn">
              <i class="fa-solid fa-circle-down"></i>
            </div>
          </section>
        </section>
      </div>

      <section class="ctnt-comments">
        <section class="ctnt-cmmnt-analytics">
          <h4 class="ctnt-cmmnt-count">
            <span class="ctnt-cmmnts-text">Comments:</span>
            <span class="ctnt-cmmnts-amount">${video.comments ? video.comments.length : '0'}</span>
          </h4>
          <i class="fa-solid fa-xmark"></i>
        </section>
        <section class="ctnt-cmmnt-inputbox">
          <form id="commentForm" class="ctnt-cmmnt-inputField">
            <textarea id="commentInput" type="text" placeholder="Type your comment..."></textarea>
            <button id="commentBtn" type="submit">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </section>
        <section class="ctnt-cmmnt-list">
          ${video.comments
            .map(
              (comment) => `
            <div class="ctnt-cmmnt-listItems ctnt-cmmnt-listItem-1">
              <div class="ctnt-cmmnt-accDtls_N_opts">
                ${
                  comment.channel && comment.channel.displayImage
                    ? `
                  <input type="hidden" class="hidden-channel-id" value="${comment.channel._id}">
                  <input type="hidden" class="hidden-channel-name" value="${comment.channel.name}">
                  <img class="ctnt-cmmnt-logo" src="/imgs/users/${comment.channel.displayImage}" />
                `
                    : `
                  <img class="ctnt-cmmnt-logo" src="${channelLogoDefault}" />
                `
                }
                <div class="ctnt-cmmnt-accDetails">
                  <h4 class="cmmnt-accDtls">${comment.channel ? comment.channel.name : 'Anonymous'}</h4>
                  <h6 class="cmmnt-date">${new Date(comment.time).toLocaleString('en-uk', { day: 'numeric', month: 'long', year: 'numeric' })}</h6>
                </div>
                <input type="hidden" value="${comment._id}" class="delete-comment-id">
              ${
                video.user === (comment.user && comment.user._id)
                  ? `<button class="delete-comment-btn" data-owner-id="${comment.user._id}">Delete Comment</button>`
                  : ''
              }
              </div>
              <h4 class="ctnt-cmmnt-textCmmnt">${comment.comment}</h4>
              <button class="ctnt-cmmnt-reply">Reply</button>
            </div>
          `,
            )
            .join('')}
        </section>
      </section>
    </div>
  `;
  videoContainer.insertAdjacentHTML('beforeend', pugHtml);
}

// Function to initialize Plyr for new videos added to the DOM
function initializePlyrForNewVideos() {
  document
    .querySelectorAll('.sect-mid-vdoPlayer-video')
    .forEach((videoElement) => {
      new Plyr(videoElement, {
        controls: ['progress'], // Only show progress control
        captions: { active: true }, // Enable captions
        volume: 0.5, // Set default volume to 50%
        fullscreen: { enabled: false }, // Disable fullscreen
      });

      // Prevent double-tap full screen
      let lastTap = 0;
      videoElement.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
          e.preventDefault(); // Prevent fullscreen on double-tap
        }
        lastTap = currentTime;
      });
    });
}

// Handle the up button for scrolling
document.addEventListener('click', (event) => {
  // Check if the clicked element is the "up" button or inside it
  if (event.target.closest('.sect-ctntMover-up')) {
    console.log('Up button clicked');
    if (currentIndex > 0) {
      currentIndex--;
      const prevVideo = videos[currentIndex];
      console.log('Scrolling to previous video:', prevVideo);
      const videoId = prevVideo.dataset.videoId;
      console.log('Previous video ID:', videoId);
      updateHistoryState(videoId);
      scrollToElement(prevVideo);

      const observerOptions = { root: null, threshold: 0.7 };
      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          console.log('Entry:', entry);
          const video = entry.target.querySelector('video');
          // Ensure that the element is actually a video tag
          console.log('Video:', video);
          if (entry.isIntersecting) {
            if (video.paused) {
              video.play(); // Play only after user interaction (e.g., scroll)
            }
          } else {
            video.pause();
          }
        });
      };

      const observer = new IntersectionObserver(
        observerCallback,
        observerOptions,
      );
      videos.forEach((videoElement) => observer.observe(videoElement));
    } else {
      console.log('No more videos to scroll up to.');
    }
  }

  // Check if the clicked element is the "down" button or inside it
  if (event.target.closest('.sect-ctntMover-dwn')) {
    console.log('Down button clicked');
    if (currentIndex < videos.length - 1) {
      currentIndex++;
      const nextVideo = videos[currentIndex];
      console.log('Scrolling to next video:', nextVideo);
      const videoId = nextVideo.dataset.videoId;
      console.log('Next video ID:', videoId);
      updateHistoryState(videoId);
      scrollToElement(nextVideo);
    } else {
      console.log('No more videos to scroll down to.');
      fetchAndRenderVideos();

      const observerOptions = { root: null, threshold: 0.7 };
      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          console.log('Entry:', entry);
          const video = entry.target.querySelector('video');
          // Ensure that the element is actually a video tag
          console.log('Video:', video);
          if (entry.isIntersecting) {
            if (video.paused) {
              video.play(); // Play only after user interaction (e.g., scroll)
            }
          } else {
            video.pause();
          }
        });
      };

      const observer = new IntersectionObserver(
        observerCallback,
        observerOptions,
      );
      videos.forEach((videoElement) => observer.observe(videoElement));
    }
  }
});

// const commentBtns = document.querySelector('.sect-mid-vdoP-navComment');
// const faXmark = document.querySelector('.fa-xmark');
// const ctntComments = document.querySelector('.ctnt-comments');

// const toggleCommentsVisibility = () => {
//   if (ctntComments.style.display !== 'flex') {
//     ctntComments.style.display = 'flex';
//     ctntComments.style.opacity = '0';
//     ctntComments.style.transform = 'translateX(20px)';
//     setTimeout(() => {
//       ctntComments.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
//       ctntComments.style.opacity = '1';
//       ctntComments.style.transform = 'translateX(0)';
//     }, 10);
//   } else {
//     ctntComments.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
//     ctntComments.style.opacity = '0';
//     ctntComments.style.transform = 'translateX(20px)';
//     setTimeout(() => {
//       ctntComments.style.display = 'none';
//     }, 500);
//   }
// };

// commentBtns.addEventListener('click', (e) => {
//   e.preventDefault();
//   toggleCommentsVisibility();
// });

// faXmark.addEventListener('click', (e) => {
//   e.preventDefault();
//   ctntComments.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
//   ctntComments.style.opacity = '0';
//   ctntComments.style.transform = 'translateX(20px)';
//   setTimeout(() => {
//     ctntComments.style.display = 'none';
//   }, 500);
// });
