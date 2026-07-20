const express = require("express");
const router = express.Router();

const Test = require("../model/testModel");
const Blog = require("../model/blogModel");
const Contact = require("../model/contactModel");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");

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

// updates tests
router.post("/update-test/:id", async (req, res) => {
  try {
    const testId = req.params.id;
    const { title, description, testType, price, questions } = req.body;
    const testData = await Test.findByIdAndUpdate(
      testId,
      { title, description, testType, price, questions },
      { new: true, runValidators: true },
    );
    res.redirect("/view-all-tests");
  } catch (error) {
    res.status(500).json({ status: "fail", error: error.message });
  }
});

// delete tests Api
router.delete("/delete-test/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    await Test.findByIdAndDelete(userId);
    res.status(200).json({
      status: "success",
      message: "test deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
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
    res
      .status(200)
      .json({ status: "success", message: "blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "fail", error: error.message });
  }
});

// blog list api for json
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

// contact form submit api
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

// contact list for json response
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

// Login Request Handle
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // is this email exist in database or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid Email or Password");
    }

    // is user password and db hashed(it convert password to hashed) is same
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid Email or Password");
    }

    // if both upr condition is true then store the information in the session
    req.session.userId = user._id;
    req.session.userName = user.name;

    // if login success then redirect to the dashboard
    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).send("Server Error: " + error.message);
  }
});

//  Logout Handle 
router.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Logout Error:", err);
      return res.status(500).send("Logout karne me dikkat aayi.");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

// register
router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exist
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    // 2. Password ko hash (encrypt) karo taaki database me safe rahe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Database me save karo
    const newUser = new User({
      name,
      email,
      password: hashedPassword, 
    });

    await newUser.save();
    // res.status(201).json({ status: "success", message: "User registered successfully! " });
    res.redirect("/login");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
