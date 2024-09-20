const { Router } = require("express");
const router = Router();

const {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory,
} = require("../app/controller/story-controller");

router.get("/view", getStories);
router.post("/create", createStory);
router.get("/:id", getStory);
router.put("/update-story/:id", updateStory);
router.delete("/delete-story/:id", deleteStory);

module.exports = router;
