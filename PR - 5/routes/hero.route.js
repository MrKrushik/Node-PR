const express = require("express");

const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

 const upload = multer({ storage: storage });

const {
    heroFormPage,
    addHero,
    allHeroes,
    deleteHero,
    editHeroPage,
    updateHero,
    errorPage
} = require("../controllers/hero.controller");

router.get("/", heroFormPage);
router.post("/addHero", upload.single("hero_image"), addHero);
router.get("/allHeroes", allHeroes);
router.get("/editHero/:heroId", editHeroPage);
router.post("/updateHero", upload.single("hero_image"), updateHero);
router.get("/deleteHero", deleteHero);
router.get("/error", errorPage);

module.exports = router;
