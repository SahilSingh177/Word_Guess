const Pusher = require("pusher");
const express = require('express')
const app = express();
const cors = require("cors");
const port = 5000;
require("dotenv").config();

var userCount;

app.use(cors({
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200,
  credentials: true
}));
app.use(express.json());

const pusher = new Pusher({
  appId: process.env.APP_ID,
  key:  process.env.APP_KEY,
  secret: process.env.SECRET_KEY,
  cluster: process.env.CLUSTER,
  useTLS: true,
});
app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

// routes
app.get('/', (req, res) => {

  res.json({
    success: true
  });
});

app.post("/update", async (req, res) => {
  try {
    const atts = "subscription_count,user_count";
    const response = await pusher.trigger("client", "client-listening", {
      info: atts,
    });
    if (response.status === 200) {
      const body = await response.json();
      return res.status(200).json({
        success: true,
        user_count: userCount
      });
    }
  }
  catch (e) {
    return res.status(404).json({
      success: false
    });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))