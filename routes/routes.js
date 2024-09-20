const { Router } = require("express");
const router = Router();

const { getStories, getStory, createStory, updateStory, deleteStory } = require("../app/controller/story-controller");

router.get("/stories", getStories);
router.get("/story/:id", getStory);
router.post("/story", createStory);
router.put("/story/:id", updateStory);
router.delete("/story/:id", deleteStory);

module.exports = router;