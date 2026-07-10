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

// 3. POST: Naya Educational Blog website par publish karna
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
    res.redirect("/admin-api/manage-blogs");
    // res.status(201).json({
    //   status: "success",
    //   message: "Naya Blog article website par live ho chuka hai! 📝",
    //   data: newBlog,
    // });
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

// ==========================================
// 🎨 ADMIN UI VIEWS RENDERING ROUTES
// ==========================================

// 7. GET: Real Admin Dashboard Page ko Render karna
router.get("/dashboard", (req, res) => {
  res.render("admin/dashboard");
});

// admin/manage-tests
router.get("/manage-tests", (req, res) => {
  res.render("admin/manage-tests");
});


// 2. NAYA ROUTE: Alag se HTML list page render karne ke liye
router.get("/view-all-tests", async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });

    // Express automatic Status 200 ke sath ye page render karega
    res.render("admin/all-tests-list", { tests });
  } catch (error) {
    // Agar database fail hua, toh Status 500 bhejenge
    res.status(500).send("Error loading tests page: " + error.message);
  }
});






// BLOG ROUTER START FROM HERE
router.get("/manage-blogs",(req,res)=>{
  res.render("admin/manage-blogs");
})

// 11. GET: Saare Blogs ki HTML list page render karna
router.get("/view-all-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    // Express automatic Status 200 ke sath ye page render karega
    res.render("admin/all-blogs-list", { blogs });
  } catch (error) {
    res.status(500).send("Error loading blogs page: " + error.message);
  }
});



// 12. GET: Users dwara bheje gaye saare contact messages ka HTML page render karna
router.get("/view-contacts-list", async (req, res) => {
  try {
    // Database se saare messages uthao (newest first)
    const messages = await Contact.find().sort({ createdAt: -1 });
    
    // Express 'admin/view-contacts' EJS file ko render karega aur data pass karega
    res.render("admin/view-contacts", { messages });
  } catch (error) {
    res.status(500).send("Error loading contact messages: " + error.message);
  }
});

module.exports = router;
