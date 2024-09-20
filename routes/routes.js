const { Router } = require("express");
const router = Router();

const story = require("./stories.routes");

router.use("/stories", story);

module.exports = router;
