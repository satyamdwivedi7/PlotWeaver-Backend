const { Router } = require("express");
const router = Router();

const {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory,
  createChapter,
  getChapters,
} = require("../app/controller/story-controller");

router.get("/view", getStories);
router.post("/create", createStory);
router.get("/:id", getStory);
router.put("/update-story/:id", updateStory);
router.delete("/delete-story/:id", deleteStory);

// New routes for chapters
router.post("/create-chapter", createChapter);
router.get("/version/:versionId/chapters", getChapters);

module.exports = router;
