const { Router } = require("express");
const { getRecent, getAll, getById } = require("../services/stone");

const homeRouter = Router();

homeRouter.get('/', async (req, res) => {
    
    const stones = await getRecent();
    res.render('home', { stones});
});
homeRouter.get('/catalog', async (req, res) => {
    
    const stones = await getAll();
    res.render('catalog', { stones});
});
homeRouter.get('/catalog/:id', async (req, res) => {
    
    const stone = await getById(req.params.id);

    if(!stone){
        res.render('404');
        return;
    }
    const isOwner = req.user?._id == stone.author.toString();
    const hasLiked = Boolean(stone.likedList.find(l => req.user?._id == l.toString()));
    res.render('details', { stone, isOwner, hasLiked});
});
homeRouter.get('/search', async (req, res) => {
    
    const stones = await getAll();
    res.render('search', { stones});
});

homeRouter.post('/search', async (req, res) => {
    let search = req.body.search;

    let stones = await getAll();
    if (search) {

        stones = stones.filter((el) => el.name.toLowerCase().includes(search.toLowerCase()));
    }
    res.render('search', { stones});
});
module.exports = { homeRouter }