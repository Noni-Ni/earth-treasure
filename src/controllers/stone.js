const { Router } = require("express");
//const { getRecent } = require("../services/stone");
const { body, validationResult } = require('express-validator');
const { isUser } = require("../middlewares/guards");
const { create, getById, update, deleteById, likeStone } = require("../services/stone");
const { parseError } = require("../utils");

const stoneRouter = Router();

stoneRouter.get('/create', isUser(), async (req, res) => {


    res.render('create');
});
stoneRouter.post('/create', isUser(),
    body('name').trim().isLength({ min: 2 }).withMessage('Name should be at least 2 characters'),
    body('category').trim().isLength({ min: 3 }).withMessage('Category should be at least 3 characters'),
    body('color').trim().isLength({ min: 2 }).withMessage('Color should be at least 2 characters'),
    body('formula').trim().isLength({ min: 3, max: 30 }).withMessage('Formula should be between 3 and 30 characters'),
    body('location').trim().isLength({ min: 5, max: 15 }).withMessage('Location should be between 5 and 15 characters'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description should be a minimum of 10 characters long'),
    body('image').trim().isURL({ require_tld: false }).withMessage('Stone Image should start with http:// or https://'),
    async (req, res) => {


        try {
            const result = validationResult(req);

            if (result.errors.length) {
                throw result.errors;
            }

            const stone = await create(req.body, req.user._id);

            res.redirect('/catalog');
        } catch (err) {
            res.render('create', { data: req.body, errors: parseError(err).errors });
            return;
        }

        res.render('create');
    });
stoneRouter.get('/edit/:id', isUser(), async (req, res) => {
    const stone = await getById(req.params.id);
    if (!stone) {
        res.render('404');
        return;
    }
    const isOwner = req.user._id == stone.author.toString();
    if (!isOwner) {
        res.redirect('/login');
        return;
    }
    res.render('edit', { data: stone });
});
stoneRouter.post('/edit/:id', isUser(),
    body('name').trim().isLength({ min: 2 }).withMessage('Name should be at least 2 characters'),
    body('category').trim().isLength({ min: 3 }).withMessage('Category should be at least 3 characters'),
    body('color').trim().isLength({ min: 2 }).withMessage('Color should be at least 2 characters'),
    body('formula').trim().isLength({ min: 3, max: 30 }).withMessage('Formula should be between 3 and 30 characters'),
    body('location').trim().isLength({ min: 5, max: 15 }).withMessage('Location should be between 5 and 15 characters'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description should be a minimum of 10 characters long'),
    body('image').trim().isURL({ require_tld: false }).withMessage('Stone Image should start with http:// or https://'),
    async (req, res) => {
        const stoneId = req.params.id;
        const userId = req.user._id;

        try {
            const result = validationResult(req);

            if (result.errors.length) {
                throw result.errors;
            }

            const stone = await update(stoneId, req.body, userId);


            res.redirect('/catalog/' + stoneId);
        } catch (err) {
            res.render('edit', { data: req.body, errors: parseError(err).errors });
            return;
        }


    });
stoneRouter.get('/like/:id', isUser(), async (req, res) => {
    const stoneId = req.params.id;
    const userId = req.user._id;

    try {


        await likeStone(stoneId, userId);
        res.redirect('/catalog/' + stoneId);

        
    } catch (err) {

        res.redirect('/');
        return;
    }


})
stoneRouter.get('/delete/:id', isUser(), async (req, res) => {
    const stoneId = req.params.id;
    const userId = req.user._id;

    try {


        await deleteById(stoneId, userId);


        res.redirect('/');
    } catch (err) {

        res.redirect('/catalog/' + stoneId);
        return;
    }


})
module.exports = { stoneRouter }