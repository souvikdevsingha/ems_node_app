const Menu = require('../schemas/menuSchema')
const logger = require('../utilServices/logger')
class MenuController {
    async createMenu(req, res) {
        let menu = new Menu({
            menuHeadname : req.body.menuHeadname,
            allowedUser : req.body.allowedUser,
            submenu : req.body.submenu
        })

        menu.save().then(data=>{
            if(data){
                return res.status(200).json({
                    'success' : true,
                    'message' : "Menu Data Saved Successfully...!"
                })
            }else{
                return res.status(200).json({
                    'success' : false,
                    'message' : "Unable to Save Menu Data...!"
                })
            }
        }).catch(err=>{
            logger.error(`error while saving menu data ==>  ${err}`)
            return res.status(500).json({
                'success' : false,
                'message' : "Something Went Wrong...!"
            })
        })
    }

    async getMenu(req,res){
        let role = req.body.role
        Menu.find({allowedUser : {$in : [role]}}).then(data=>{
            if(!data || data.length == 0){
                return res.status(200).json({
                    'success':false,
                    'message':'No Record Found.',
                    data : []
                })
            }else{
                return res.status(200).json({
                    'success':true,
                    'message' : 'Data Fetched Successfull...!',
                    data : data
                })
            }
        }).catch(err=>{
            logger.error(`error while fetching menu data => ${err}`);
            return res.status(500).json({
                'success':true,
                'message' : 'Something went Wrong ...!',
                data : []
            })
        })
    }

    async getAllMenu(req,res){
        Menu.find({}).then(data=>{
            console.log('menudata',data)
            return res.status(200).json({
                success: true,
                data : data
            })
        }).catch(err=>{
            logger.error(`Error in getting data ${err}`)
        })
    }
}

module.exports = new MenuController();