const express = require("express");
app = express();
const mongoose = require("mongoose");
const path = require("path");
const Text = require("./models/text");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
require("dotenv").config();
mongoose.set("strictQuery", false);
mongoose
  .connect(`${process.env.MONGO_URI}`, {
    dbName: `${process.env.DB_NAME}`,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/gettext", async (req, res, next) => {
  try {
    let text;
    if (req.query.value == `${process.env.SECRET}`) {
      text = await Text.find().sort({ pin: -1, created: -1 });
    } else {
      text = await Text.find({ hidden: false }).sort({ pin: -1, created: -1 });
    }

    const newText = [];
    text.forEach((item) => {
      let newItem = {
        _id: item._id,
        text: item.text,
        important: item.important,
        pin: item.pin,
        hidden: item.hidden,
      }; // create a copy of the item to modify its properties

      let itemHour = dayjs(item.created.toString()).utc().local().hour();
      let itemMinute = dayjs(item.created.toString()).utc().local().minute();
      let itemDay = dayjs(item.created.toString()).utc().local().date();
      let itemMonth = dayjs(item.created.toString()).utc().local().month();
      let itemYear = dayjs(item.created.toString()).utc().local().year();
      let currentHour = dayjs().local().hour();
      let currentMinute = dayjs().local().minute();
      let currentDay = dayjs().local().date();
      let currentMonth = dayjs().local().month();
      let currentYear = dayjs().local().year();
      if (
        itemYear === currentYear &&
        itemMonth === currentMonth &&
        itemDay === currentDay &&
        itemHour === currentHour &&
        itemMinute === currentMinute
      ) {
        newItem.created = "Just now";
      } else if (
        itemYear === currentYear &&
        itemMonth === currentMonth &&
        itemDay === currentDay &&
        itemHour === currentHour
      ) {
        newItem.created = `${currentMinute - itemMinute} min. ago`;
      } else if (
        itemYear === currentYear &&
        itemMonth === currentMonth &&
        itemDay === currentDay
      ) {
        newItem.created = `${currentHour - itemHour} hours ago`;
      } else if (itemYear === currentYear && itemMonth === currentMonth) {
        newItem.created = `${currentDay - itemDay} days ago`;
      } else if (itemYear === currentYear) {
        newItem.created = `${currentMonth - itemMonth} months ago`;
      } else if (itemYear !== currentYear) {
        newItem.created = `${currentYear - itemYear} years ago`;
      }
      newText.push(newItem); // add the updated item to the new array
    });

    res.json(newText); // send the new array as the response
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.post("/addtext", async (req, res, next) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({ msg: "Please enter text" });
    }

    if (req.body.text.trim() == `${process.env.SECRET}`) {
      try { 
        res.json({ status: "success", secret: `${process.env.SECRET}` });
      } catch (err) {
        res.status(500).json({ msg: "Server error" });
      }
      return;
    } else if (req.body.text.includes(`${process.env.SECRET}=`)) {
  
      let text = req.body.text.replace(`${process.env.SECRET}=`, "");
  console.log(text)
      req.body.text = text;
      req.body.hidden = true;
    }else if(req.body.text == `${process.env.SECRET}:removeall`){
      let text = await Text.deleteMany({hidden:true});
    res.json(text);
    return;
    }


    const text = new Text(req.body);
    await text.save();
    res.json(text);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.get("/deletetext", async (req, res, next) => {
  try {
    const text = await Text.deleteMany({hidden:false});

    res.json(text);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.post("/deleteone", async (req, res, next) => {
  try {
    const text = await Text.findByIdAndDelete(req.body.id);
    res.json(text);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
app.post("/important", async (req, res, next) => {
  try {
    let text = await Text.findById(req.body.id);
    if (text.important) {
      text = await Text.findByIdAndUpdate(
        req.body.id,
        { important: false },
        { new: true }
      );
      res.json(text);
    } else {
      text = await Text.findByIdAndUpdate(
        req.body.id,
        { important: true },
        { new: true }
      );
      res.json(text);
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
app.post("/pintop", async (req, res, next) => {
  try {
    let item = await Text.findById(req.body.id);

    if (item.pin) {
      let response = await Text.findByIdAndUpdate(
        req.body.id,
        { pin: false },
        { new: true }
      );

      res.json(response);
    } else {
      let response = await Text.findByIdAndUpdate(
        req.body.id,
        { pin: true, created: Date.now() },
        { new: true }
      );

      res.json(response);
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.listen(9003, () => {
  console.log("server is started");
});
