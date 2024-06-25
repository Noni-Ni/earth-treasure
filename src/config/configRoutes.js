// TODO import routers

const { homeRouter } = require("../controllers/home");
const { stoneRouter } = require("../controllers/stone");
const { userRouter } = require("../controllers/user");

function configRoutes(app){
     app.use(homeRouter);
     app.use( userRouter);
     app.use( stoneRouter);

     app.get('*', (req, res) => {
          res.render('404');
     })
     //TODO register routers
}

module.exports = { configRoutes };
