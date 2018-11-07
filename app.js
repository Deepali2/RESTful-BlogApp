const express = require("express"),
      bodyParser = require("body-parser"),
      methodOverride = require ("method-override"),
      mongoose = require("mongoose"),
      ejs = require("ejs"),
      ObjectId = require("mongodb").ObjectID;

const app = express();

//APP CONFIG
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'))
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/restful_blog_app", {useNewUrlParser: true});

//MONGOOSE MODEL CONFIG
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES
// Blog.create(
//   {
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1537215781824-73d7761029e1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6ae476497bd08d1b86d74bf2e561c132&auto=format&fit=crop&w=900&q=60",
//     body: "Make this wonderful looking yummy salad and get a flat tummy in the process",
    
//   }, function(err, blog) {
//     if (err) console.log("There was an error in creating the blog ", err);
//     else console.log("A new blog has been created: ", blog);
//   }
// )

//INDEX RESTFUL ROUTE
app.get("/blogs", function(req, res) {
  Blog.find({}, function(err, blogs) {
   if (err) console.log("Error in getting all the blogs: ", err);
   else res.render("index", {blogs: blogs});
  });  
});

//NEW ROUTE
app.get("/blogs/new", function(req, res) {
  res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res) { 
  Blog.create(req.body.blog, function(err, blog) {
    if (err) {
      console.log("There is an error in creating a new blog: ", err);
      res.render("new");
    }
    else {      
      res.redirect("/blogs");
    }
  });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
  Blog.find({"_id": ObjectId(req.params.id.substring(1))}, function(err, blog) {
    if (err){
      console.log("Error in getting the blog");
      res.redirect("/blogs");
    } 
    else res.render("show", {blog: blog});
  });
}); 

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
  Blog.find({"_id": ObjectId(req.params.id.substring(1))}, function(err, blog) {
    if (err){
      console.log("Error in getting the blog");
      res.redirect("/blogs");
    } 
    else res.render("edit", {blog: blog});
  });  
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {  
  Blog.findOneAndUpdate(ObjectId(req.params.id.substring(1)), req.body.blog, function(err, updatedBlog) {
    if (err) {
      console.log("There is an error in updating the blog: ");
      res.redirect("/blogs");
    }else {
      res.redirect(`/blogs/${req.params.id}`);
    }
  });
});

app.get("/", function(req, res) {
  res.redirect("/blogs");
});

app.get("*", function(req, res) {
  res.send("Hi! This route does not exist");
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});