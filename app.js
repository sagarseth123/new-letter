//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");


const mongoose = require("mongoose");
mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        require: [1, "please enter a title"]
    },
    text: {
        type: String,
        require: [1, "please enter the content"]
    }
});
const News = mongoose.model("news", newsSchema);


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var posts = [];

app.get("/", function(req, res) {
    News.find({}, function(err, news) {
        if (err) {
            console.log("error");
        } else {
            res.render("home", { content: homeStartingContent, newtext: news });
        }
    });
});

app.get("/about", function(req, res) {
    res.render("about", { text: aboutContent });
});

app.get("/contact", function(req, res) {
    res.render("contact", { text: contactContent });
});

app.get("/compose", function(req, res) {
    News.find({}, function(err, news) {
        res.render("compose", { news: news });
    });

});

app.post("/delete", function(req, res) {
    var news_id = req.body.checkbox;
    News.findOneAndDelete({ _id: news_id }, function(err, item) {
        console.log("successfully deleted");
    });
    res.redirect("/compose");
});

app.get("/post/:title", function(req, res) {
    News.find({}, function(err, news) {
        news.forEach(function(post) {
            if (_.lowerCase(req.params.title) == _.lowerCase(post.title)) {
                res.render("post", {
                    heading: post.title,
                    content: post.text
                });
            };
        });
    });
});



app.post("/compose", function(req, res) {

    const news = new News({
        title: req.body.head,
        text: req.body.text
    });
    news.save();
    res.redirect("/");

});

app.post("/", function(req, res) {
    res.redirect("/compose");
    //res.sendFile(__dirname + "/views/compose.ejs");
});







app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});



// https://radiant-plains-64979.herokuapp.com