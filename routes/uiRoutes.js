const express = require("express");
const router = express.Router();
const Text = require("../model/testModel");
const blog = require("../model/blogModel");
const Contact = require("../model/contactModel");

const { route } = require("./adminRoutes");

router.get("/dashboard", (req, res) => {
  res.render("admin/dashboard");
});

router.get("/manage-tests", (req, res) => {
  res.render("admin/manage-tests");
});

router.get("/view-all-tests", async (req, res) => {
  try {
    const tests = await Text.find().sort({ createdAt: -1 });
    res.render("admin/all-tests-list", { tests });
  } catch (error) {
    res.status(500).send("Error loading tests page: " + error.message);
  }
});

// blog form ui
router.get("/manage-blogs", (req, res) => {
  res.render("admin/manage-blogs");
});

// blog list ui
router.get("/view-all-blogs", async (req, res) => {
  try {
    const blogs = await blog.find().sort({ createdAt: -1 });
    res.render("admin/all-blogs-list", { blogs });
  } catch (error) {
    res.status(500).send("Error loading tests page: " + error.message);
  }
});

// blog update form blog ui
router.get("/manage-update-blogs/:id", async (req, res) => {
  const blogData = await blog.findById(req.params.id);
  if (!blogData) {
    return res.status(404).send("blog not found");
  }

  res.render("admin/update-blog", { blogData });
});



router.get("/view-contacts-list", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.render("admin/view-contacts", { contacts });
  } catch (error) {
    res.status(500).send("Error loading contact messages: " + error.message);
  }
});

module.exports = router;
