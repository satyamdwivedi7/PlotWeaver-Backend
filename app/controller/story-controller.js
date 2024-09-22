const { Story, Version, Chapter } = require("../../models/Stories");

// Get all stories with populated versions
module.exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find().populate("versions");
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific story by ID with populated versions
module.exports.getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate({
      path: "versions",
      populate: {
        path: "chapters", // Nested population to get chapters within versions
      },
    });
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.status(200).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create a new story and its first version
module.exports.createStory = async (req, res) => {
  try {
    const story = await Story.create({
      title: req.body.title,
      genre: req.body.genre,
      overallAuthor: req.body.overallAuthor,
      description: req.body.description,
    });

    // Create the first version when a story is created
    const version = await Version.create({
      story: story._id,
      chapters: [], // Initial version will have no chapters
    });

    // Push the version to the story's versions array
    story.versions.push(version._id);
    await story.save();

    res.status(201).json(story);
    console.log("Story and initial version created successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Add a version to an existing story
module.exports.addVersion = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const version = await Version.create({
      story: story._id,
      chapters: [],
    });

    story.versions.push(version._id);
    await story.save();

    res.status(201).json(version);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a chapter in an existing version or start a new version
// Create a chapter in an existing version or start a new version
module.exports.createChapter = async (req, res) => {
  try {
    const { versionId, previousChapterId, title, content, author } = req.body;

    // Find the version by ID and populate its chapters
    const version = await Version.findById(versionId).populate("chapters");
    if (!version) {
      return res.status(404).json({ message: "Version not found" });
    }

    // Find the index of the previous chapter
    const previousChapterIndex = version.chapters.findIndex(
      (chapter) => chapter._id.toString() === previousChapterId
    );
    if (previousChapterIndex === -1) {
      return res.status(404).json({
        message: "Previous chapter not found in the specified version",
      });
    }

    const nextChapterIndex = previousChapterIndex + 1;

    // Check if there is any chapter after the selected chapter
    if (version.chapters[nextChapterIndex]) {
      // Create a new version from the current version up to the selected chapter
      const newVersion = new Version({
        story: version.story,
        chapters: version.chapters.slice(0, nextChapterIndex), // Copy up to Chapter 2
      });

      const newChapter = new Chapter({
        title,
        content,
        author,
        timestamp: new Date(),
      });

      // Add the new chapter to the new version
      newVersion.chapters.push(newChapter._id);
      await newChapter.save();
      await newVersion.save();

      // Add the new version to the story
      const story = await Story.findById(version.story);
      story.versions.push(newVersion._id);
      await story.save();

      return res.status(201).json(newVersion);
    } else {
      // If there are no more chapters after the selected one, just add the new chapter to the current version
      const newChapter = new Chapter({
        title,
        content,
        author,
        timestamp: new Date(),
      });

      version.chapters.push(newChapter._id);
      await newChapter.save();
      await version.save();

      return res.status(201).json(version);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all chapters for a specific version
module.exports.getChapters = async (req, res) => {
  try {
    const { versionId } = req.params;

    const version = await Version.findById(versionId).populate("chapters");
    if (!version) {
      return res.status(404).json({ message: "Version not found" });
    }

    res.status(200).json(version.chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update story details
module.exports.updateStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    story.title = req.body.title || story.title;
    story.genre = req.body.genre || story.genre;
    story.overallAuthor = req.body.overallAuthor || story.overallAuthor;
    story.description = req.body.description || story.description;

    const updatedStory = await story.save();
    res.status(200).json(updatedStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a specific chapter
module.exports.updateChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    chapter.title = req.body.title || chapter.title;
    chapter.content = req.body.content || chapter.content;
    chapter.author = req.body.author || chapter.author;

    const updatedChapter = await chapter.save();
    res.status(200).json(updatedChapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a story and its associated versions
module.exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    await Version.deleteMany({ story: story._id });

    res
      .status(200)
      .json({ message: "Story and its versions deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a chapter from a version
module.exports.deleteChapter = async (req, res) => {
  try {
    const version = await Version.findById(req.params.versionId);
    if (!version) {
      return res.status(404).json({ message: "Version not found" });
    }

    const chapterIndex = version.chapters.indexOf(req.params.chapterId);
    if (chapterIndex === -1) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    version.chapters.splice(chapterIndex, 1);
    await version.save();

    await Chapter.findByIdAndDelete(req.params.chapterId);

    res.status(200).json({ message: "Chapter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
