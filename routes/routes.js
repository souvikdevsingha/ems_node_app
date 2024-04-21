const express = require('express'),
    router = express.Router();
const validators = require('../validators/validators');
const usercontroller = require('../controller/userController');
const userController = require('../controller/userController');
const menuController = require('../controller/menuController');
const auth = require('../middleware/authInspector')
router.get('/welcome', (req, res) => {
    res.send({
        message : 'Welcome to our API'
    })
})
router.post('/createUser',validators.validateUserReq(),usercontroller.saveUserData)
router.post('/login',userController.userLogin)
router.post('/getUserData',auth,userController.getUserData)
router.post('/assignedRole',auth,validators.validateUserInfoReq(),userController.assignUserDesignation)
router.post('/fetchData',auth,userController.getPerticularUserData)
router.post('/createMenu',auth,menuController.createMenu)
router.post('/getMenu',auth,menuController.getMenu)
router.get('/getAllMenu',menuController.getAllMenu)

module.exports = router;
