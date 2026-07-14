const express = require("express");
const router = express.Router();

const Test = require("../model/testModel");
const Blog = require("../model/blogModel");
const Contact = require("../model/contactModel");

// test add
router.post("/add-test", async (req, res) => {
  try {
    const { title, description, testType, price, questions } = req.body;

    // create new test document using model
    const newTest = new Test({
      title,
      description,
      testType,
      price: testType === "free" ? 0 : price,
      questions,
    });

    // Database me permanent save
    // res.status(200).json({
    //   message: "test created successfully",
    //   status: "success",
    //   data: newTest
    // })
    await newTest.save();
    res.redirect("/admin-api/manage-tests");
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
});

//get test list
router.get("/all-test", async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 }); // new tests show on the top
    res.status(200).json({
      status: "success",
      total: tests.length,
      data: tests,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", error: error.message });
  }
});

// BLOGS START FROM HERE

// Add blog redirection Api
router.post("/add-blog", async (req, res) => {
  try {
    const { title, content, image, author } = req.body;

    const newBlog = new Blog({
      title,
      content,
      image,
      author,
    });

    await newBlog.save();
    res.redirect("/manage-blogs");
    // res.status(201).json({
    //   status: "success",
    //   message: "Naya Blog article website par live ho chuka hai! 📝",
    //   data: newBlog,
    // });
  } catch (error) {
    res.status(500).json({ status: "fail", error: error.message });
  }
});

// Update blog redirection Api
router.post("/update-blog/:id", async (req, res) => {
  try {
    const { title, content, image, author } = req.body;
    const blogId = req.params.id;

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,

      { title, content, image, author },
      { new: true, runValidators: true },
    );
    res.redirect("/view-all-blogs");
  } catch (error) {
    res.status(500).json({ status: "fail", error: error.message });
  }
});

// Delete blog redirection Api
router.delete("/delete-blog/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    await Blog.findByIdAndDelete(blogId);
    res.status(200).json({status: "success", message: "blog deleted successfully"})
  } catch (error) {
    res.status(500).json({ status: "fail", error: error.message });
  }
});

// 4. GET: Saare Blogs ki list admin dashboard ke liye fetch karna
router.get("/all-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ status: "success", total: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({ status: "fail", error: error.message });
  }
});

//  USER MESSAGES FEED ROUTES (ADMIN)
// 6. POST: User jab contact form submit karega (Yeh data database me save hoga)
router.post("/submit-contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newContactMessage = new Contact({
      name,
      email,
      message,
    });

    await newContactMessage.save();
    res.status(201).json({
      status: "success",
      message: "Aapka message admin tak pahunch gaya hai! 📞",
      data: newContactMessage,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", error: error.message });
  }
});

// 5. GET: Users dwara bheje gaye saare contact messages ko padhna
router.get("/view-contacts", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      total: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", error: error.message });
  }
});

module.exports = router;
