const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Chapter Schema
const chapterSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Chapter = mongoose.model("Chapter", chapterSchema);

// Version Schema
const versionSchema = new Schema({
  story: { type: Schema.Types.ObjectId, ref: "Story", required: true },
  chapters: [{ type: Schema.Types.ObjectId, ref: "Chapter" }],
  timestamp: { type: Date, default: Date.now },
});

const Version = mongoose.model("Version", versionSchema);

// Story Schema
const storySchema = new Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  overallAuthor: { type: String },
  description: { type: String, required: true },
  versions: [{ type: Schema.Types.ObjectId, ref: "Version" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Story = mongoose.model("Story", storySchema);

module.exports = { Chapter, Version, Story };
