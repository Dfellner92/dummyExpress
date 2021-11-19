const express = require("express");
const expressDefend = require("express-defend");
const blacklist = require("express-blacklist");

const app = express();

const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Running");
});

// if 5 err in 1 min, blacklist IP

// app.use(function (err, req, res, next) {
//   console.log(err);
//   console.log("Here");
//   res.status(500).send({ error: handleError(err) });
// });

app.use(blacklist.blockRequests("blacklist.txt"));
app.use(
  expressDefend.protect({
    maxAttempts: 5, // (default: 5) number of attempts until "onMaxAttemptsReached" gets triggered
    dropSuspiciousRequest: true, // respond 403 Forbidden when max attempts count is reached
    consoleLogging: true, // (default: true) enable console logging
    logFile: "suspicious.log", // if specified, express-defend will log it's output here
    onMaxAttemptsReached: (ipAddress, url) => {
      console.log(blacklist.addAddress(ipAddress));
    },
  })
);

app.get("/test", (req, res) => {
  //throw new Error("BROKEN");
  res.send("ok");
});

app.listen(port, () => console.log("Server running"));
