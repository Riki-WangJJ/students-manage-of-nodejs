
var router = require("express").Router();
var handler = require("./handler");
var path = require("path");


router.get("/", handler.index);
router.get("/index", handler.index);

// 列表
router.get("/students", handler.students);

// 添加
router.get("/add", handler.addhtml);
router.post("/add", handler.add);

// 查看
router.use("/info", handler.info);

// 编辑
router.post("/edit", handler.edit);
router.use("/edit", handler.edithtml);

// 删除
router.use("/delete", handler.delete);


module.exports = router;