/* eslint-disable */
const videoLinkShareOverlay = document.querySelector(
  '.sect-video-linkshare-overlay',
);
// const videoLinkShare = document.querySelector('.sect-video-linkshare');
const navShareButton = document.querySelector('.sect-mid-vdoP-navShare');
const copyLinkSuccessFail = document.querySelector('.copyLink-success-fail');
const videoLinkShareH1 = document.querySelector('.sect-video-linkshare-h1');

navShareButton.addEventListener('click', (e) => {
  videoLinkShareOverlay.style.display = 'flex';
  videoLinkShare.style.display = 'flex';
  videoLinkShareH1.style.display = 'flex';
});

videoLinkShareOverlay.addEventListener('click', (e) => {
  videoLinkShareOverlay.style.display = 'none';
  videoLinkShare.style.display = 'none';
  videoLinkShareH1.style.display = 'none';
});

const videoLinkShare = document.querySelector('.sect-video-linkshare');

videoLinkShare.addEventListener('click', function (e) {
  e.preventDefault();
  const textToCopy = videoLinkShare.innerText;

  // Use the Clipboard API to write the text to the clipboard
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      alert(`Text copied to clipboard: ${textToCopy}`);
      // copyLinkSuccessFail.style.display = 'flex';
      // setTimeout(() => {
      //   copyLinkSuccessFail.style.display = 'none';
      // }, 1500);
      // Successfully copied to clipboard
      console.log('Text copied to clipboard:', textToCopy);
    })
    .catch((err) => {
      // Unable to copy to clipboard
      console.error('Could not copy text to clipboard:', err);
    });
});
