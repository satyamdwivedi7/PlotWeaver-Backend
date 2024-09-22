const { Router } = require("express");
const router = Router();

const story = require("./stories.routes");
const user = require("./users.routes");

router.use("/stories", story);
router.use("/users", user);

module.exports = router;
