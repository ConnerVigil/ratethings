const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static('public'));
const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/ratethings', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const topicSchema = new mongoose.Schema({
  name: String,
  count: Number,
});

topicSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
});

topicSchema.set('toJSON', {
  virtuals: true
});

const Topic = mongoose.model('Topic', topicSchema);


app.get('/api/topics', async (req, res) => {
  try {
    let topics = await Topic.find();
    res.send({topics: topics});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/topics', async (req, res) => {
    console.log("Name: ", req.body.name);
    console.log("Count: ", req.body.count);
    const topic = new Topic({
    name: req.body.name,
    count: req.body.count
  });
  try {
    await topic.save();
    console.log("Topic Posted: ", topic);
    res.send({topic:topic});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/topics/:id/:name/:count', async (req, res) => {
  try {
    const doc = await Topic.findOne({ _id: req.params.id });
    if (doc === undefined || doc === null) {
      res.sendStatus(404);
      return;
    }
    doc.count = req.params.count;
    await doc.save();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/topics/:id', async (req, res) => {
  try {
    await Topic.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


app.listen(3000, () => console.log('Server listening on port 3000!'));
