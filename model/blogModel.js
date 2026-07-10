const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
   type: String,
   required: true,
   default: '/images/default-blog.png'
  },
  author: {
    type: String,
    default: 'Admin'
  }
},{timestamps: true});

const blogSchemaModel = mongoose.model('Blog',blogSchema);

module.exports = blogSchemaModel;
