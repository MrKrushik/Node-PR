const Hero = require("../models/hero.model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Add Hero Page
const heroFormPage = (req, res) => {
    res.render("heroForm");
};

// Insert Hero
const addHero = async (req, res) => {
    try {
        if (req.file) {
            req.body.hero_image = req.file.filename;
        }
        // console.log(req.body.hero_image);
        await Hero.create(req.body);
        res.redirect("/hero/allHeroes");
    } catch (err) {
        console.log(err);
        res.redirect("/hero/error");
    }
};

// All Heroes
const allHeroes = async (req, res) => {
    try {
        const heroes = await Hero.find();
        res.render("allHeroes", { heroes });
    } catch (err) {
        console.log(err);
        res.redirect("/hero/error");
    }
};

// Delete Hero
const deleteHero = async (req, res) => {
    try {
        console.log(req.query);

        const deletedHero = await Hero.findByIdAndDelete(req.query.heroId);

        console.log("Deleted Hero :", deletedHero);

        if (deletedHero && deletedHero.hero_image) {
            const imagePath = path.join(
                __dirname,
                "..",
                "uploads",
                deletedHero.hero_image
            );

            fs.unlink(imagePath, (err) => { });
        }

        if (deletedHero) {
            console.log("Hero deleted successfully... maja aa gaya😊😊");
        } else {
            console.log("Hero deletion failed... sorry!!!🤦‍♂️🤦‍♂️");
        }

        return res.redirect("/hero/allHeroes");

    } catch (err) {
        console.log(err);
        return res.redirect("/hero/error");
    }
};


// Edit Hero
const editHeroPage = async (req, res) => {
    try {
        console.log(req.params);

        const hero = await Hero.findById(req.params.heroId);

        console.log(hero);

        if (hero) {
            return res.render("updateHero", { hero });
        } else {
            return res.redirect("/hero/allHeroes");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("/hero/error");
    }
};


// Update Hero
const updateHero = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.file);

        if (req.file) {
            const heroData = await Hero.findById(req.body.hero_id);
            if (heroData && heroData.hero_image) 
                {
                const oldImagePath = path.join(
                    __dirname,
                    "..",
                    "uploads",
                    heroData.hero_image
                );

                fs.unlink(oldImagePath, (err) => { });
            }
            req.body.hero_image = req.file.filename;

            const updatedHero = await Hero.findByIdAndUpdate(
                req.body.hero_id,
                req.body,
                { new: true }
            );

            console.log("Updated Hero :", updatedHero);

        } else {
            const updatedHero = await Hero.findByIdAndUpdate(
                req.body.hero_id,
                req.body,
                { new: true }
            );

            console.log("Updated Hero :", updatedHero);
        }

        return res.redirect("/hero/allHeroes");

    } catch (err) {
        console.log(err);
        return res.redirect("/hero/error");
    }
};

const errorPage = (req, res) => {
    res.render("error"); 
};

module.exports = {
    heroFormPage,
    addHero,
    allHeroes,
    deleteHero,
    editHeroPage,
    updateHero,
    errorPage
};
