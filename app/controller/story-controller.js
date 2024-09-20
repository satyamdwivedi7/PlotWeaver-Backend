const Story = require("../../models/Stories");

module.exports.getStories = async (req, res) => {
    try {
        const stories = await Story.find();
        res.status(200).json(stories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getStory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        res.status(200).json(story);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.createStory = async (req, res) => {
    const story = new Story({
        title: req.body.title,
        content: req.body.content,
    });
}

module.exports.updateStory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        story.title = req.body.title;
        story.content = req.body.content;
        const updatedStory = await story.save();
        res.status(200).json(updatedStory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.deleteStory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        const deletedStory = await story.remove();
        res.status(200).json(deletedStory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}