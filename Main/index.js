// IT WORK FROM HERE!!! //////////////////
const fs = require("fs");
const http = require("http");
const url = require("url");

// const midNavCntnr = document.querySelector(".sect-mid-contentContainer");
const mainTempPage = fs.readFileSync(`index.html`, "utf-8");
const tempChannel = fs.readFileSync(
  `${__dirname}/templates/channel-page/chPg-temp.html`,
  "utf-8"
);

// const mainTempPage = fs.createReadStream(`index.html`);
// const tempChannel = fs.createReadStream(
//   `${__dirname}/templates/channel-page/chPg-temp.html`
// );

const server = http.createServer(async (req, res) => {
  const pathName = req.url;

  console.log(pathName);

  const output = await mainTempPage.replace("{%PAGE_TEMPLATE%}", tempChannel);

  if (
    pathName === "/" ||
    pathName === "/Main" ||
    pathName === "/Main/index.html"
  ) {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    res.end(output);
  }

  // if (pathName === "/" || pathName === "/overview") {
  // } else if (pathName === "/channel") {
  // } else if (pathName === "/playlists") {
  // } else if (pathName === "/videoplayer") {
  // } else if (pathName === "/subscription") {
  // } else if (pathName === "/notification") {
  // } else if (pathName === "/mini-movies") {
  // } else if (pathName === "/marketplace") {
  // } else if (pathName === "/merchandise") {
  // } else if (pathName === "/search") {
  // }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests from port 8000");
});

// IT WORK TILL HERE!!! //////////////////
