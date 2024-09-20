const Story = require("../../models/Stories");

module.exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find();
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.status(200).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.createStory = async (req, res) => {
  try {
    const story = await Story.create({
      title: req.body.title,
      content: req.body.content,
      genre: req.body.genre, 
      author: req.body.author,
    });
    res.status(201).json(story).then(console.log("Story created successfully"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Update the story fields
    story.title = req.body.title || story.title;
    story.content = req.body.content || story.content;
    story.author = req.body.author || story.author;
    story.genre = req.body.genre || story.genre;
    
    const updatedStory = await story.save();
    res.status(200).json(updatedStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    await story.remove();
    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
