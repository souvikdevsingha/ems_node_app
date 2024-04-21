
const { check, validationResult } = require('express-validator');
const responsebuilder = require('../response/responseBuilder');
const passwordEncrypt = require('../security/encryptDecryptPass')
const UserSchema = require('../schemas/userScmema');
const utilService = require('../utilServices/utilService');
const encryptDecryptPass = require('../security/encryptDecryptPass');
const { constant_variable } = require('../constantVariable/constant');
const userInfo = require('../schemas/userInformationSchema')
const logger = require('../utilServices/logger')
const user = require('../schemas/userScmema')
class UserController {
    async saveUserData(req, res) {
        console.log('in controller')
        let err = validationResult(req);
        //console.log(err)
        if (!err.isEmpty()) {
            return res.status(200).send({
                'success': false,
                'message': 'Invalid data',
                'errors': responsebuilder.validationResponseBuilder(err.errors)
            })
        } else {
            let pass = await passwordEncrypt.encryptPassword(req.body.password);
            let userID = await utilService.getUniqueId();

            let valid_Username = await utilService.checkValidUserName(req.body.username);
            if (valid_Username == false) {
                return res.status(200).send({
                    'success': false,
                    'message': 'Format of Username is not valid!...',
                    'errors': [{
                        "username": "Username must conatin only alphabets and numbers(ex : abc123)!"
                    }]
                })
            }

            let user = new UserSchema({
                username: req.body.username,
                email: req.body.email,
                password: pass,
                role: req.body.role,
                haveAllPermission: req.body.haveAllPermission,
                userId: userID,
                name: req.body.name,
            })
            let isUserExists = await utilService.checkUserExists(req.body.username);
            if (isUserExists == true) {
                return res.status(200).send({
                    'success': false,
                    'message': 'User Already Exists Enter Another username',
                    'errors': [{
                        "username": "Username already exists."
                    }]
                })
            }
            user.save().then(data => {
                if (data) {
                    return res.status(200).send({
                        'success': true,
                        'message': 'Data Saved Successfully!...',
                        'errors': []
                    })
                } else {
                    return res.status(200).send({
                        'success': false,
                        'message': 'Data Not Saved Successfully!...',
                        'errors': []
                    })
                }
            }).catch(err => {
                logger.error('application Crashed while saving userdata ' + err)
                return res.status(200).send({
                    'success': false,
                    'message': 'Something Went Wrong!...',
                    'errors': []
                })
            })
        }
    }

    async userLogin(req, res) {
        const { searchvalue, password } = req.body;
        let isUsername = await utilService.checkValidUserName(searchvalue);
        let isUserId = await utilService.checkIsNumeric(searchvalue);
        let isOthers = (isUsername == false && isUserId == false) ? true : false;
        if (isOthers) {
            return res.status(200).send({
                'success': false,
                'message': 'Login Parameters are wrong...!',
                'errors': []
            })
        }
        let userData;
        if (isUsername) {
            userData = await utilService.getUeseData(searchvalue, "username");
        }

        if (isUserId) {
            userData = await utilService.getUeseData(searchvalue, 'userId');
        }
        let isPasswordMatched = false;
        console.log(Object.keys(userData).length)
        if (Object.keys(userData).length > 0) {
            isPasswordMatched = await encryptDecryptPass.verifyPassword(password, userData.password)
            if (!isPasswordMatched) {
                return res.status(200).send({
                    'success': false,
                    'message': 'Login Failed Due To Wrong Password...!',
                    'data': []
                })
            } else {
                let token = await utilService.generateToken();
                let isTokenSaved = await utilService.storeToken(token, '120min')
                if (isTokenSaved) {
                    return res.status(200).send({
                        'success': true,
                        'message': 'Login Successfull .....!',
                        'data': [{
                            token: token,
                            expirein: '120 min',
                            username: userData.username,
                            email: userData.email,
                            userid: userData.userId,
                            name: userData.name,
                            role: userData.role
                        }]
                    })
                } else {
                    return res.status(200).send({
                        'success': false,
                        'message': 'Something Went Wrong While login....',
                        'data': []
                    })
                }
            }
        } else {
            return res.status(200).send({
                'success': false,
                'message': 'User Data Not Found ',
                'data': []
            })
        }
    }

    async getUserData(req, res) {
        const { userid, username, role } = req.body;
        let query = {}
        if (userid) { query['userId'] = userid }
        if (username) { query['username'] = username }
        if (role) { query['role'] = role }
        let data = await utilService.getUserDetailData(query)
        // console.log(data)
        if (data && data.length > 0) {
            // console.log(data)
            let responseData = []
            data.forEach(element => {
                let obj = {
                    username: element.username,
                    email: element.email,
                    role: element.role,
                    haveAllPermission: element.haveAllPermission,
                    userId: element.userId,
                    name: element.name
                }
                responseData.push(obj)
            });
            return res.status(200).json({ 'success': true, 'message': 'Successfully Get User Detail', 'data': responseData })
        } else {
            return res.status(200).send({ 'success': false, 'message': 'No User found', 'data': [] })
        }
    }

    async assignUserDesignation(req, res) {
        let err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).send({
                'status': false,
                'message': 'BAD Request',
                'errors': responsebuilder.validationResponseBuilder(err.errors)
            })
        }
        let query = {}
        let userdata;
        query['userId'] = req.body.userid;
        try {
            userdata = await utilService.getUserDetailData(query)
        } catch (e) {
            logger.error('error in req = > ', +e)
        }
        if (!userdata) {
            return res.status(200).send({
                "success": false,
                "message": "Invalid User Id",
            })
        } else {
            if (!constant_variable.designation.includes(req.body.rolecode)) {
                return res.status(200).send({
                    'success': false,
                    'message': 'Invalid Designation Code',
                })
            } else {
                let infodata= await utilService.getUserInfoData(req.body.userId)
                let userDTL = new userInfo({
                    designation: req.body.designation,
                    userId: req.body.userId,
                    role: req.body.role,
                    assignedDate: new Date(),
                    assignedBy: req.body.assignedBy,
                    repoterName: req.body.repoterName,
                    reporterId: req.body.reporterId,
                    rolecode: req.body.rolecode
                })
                console.log(infodata)
                if(infodata.length>0){
                    let flag = await utilService.updateUserInfo(userDTL,infodata[0]['_id'])
                    console.log(flag)
                    if(flag){
                        return res.status(200).json({
                            success: true,
                            message: "User Designation Update Successfully"
                        })
                    }
                }
                console.log('in')
                userDTL.save().then(data => {
                    if (data) {
                        return res.status(200).json({
                            success: true,
                            message: "User Designation Assigned Successfully"
                        })
                    } else {
                        return res.status(200).json({
                            'succes': false,
                            'message': 'Something Went wrong'
                        });
                    }
                }).catch(err => {
                    logger.error('application Crashed while pushing designation ' + err)
                    return res.status(500).json({
                        'status': false,
                        'message': 'Internal Error Occured'
                    })
                })
            }
        }
    }

    async getPerticularUserData(req, res) {
        let userId = req.body.userid
        let data;
        try {
            data = await user.find({ userId: { $not: { $eq: userId } } })
            if (data) {
                let userdata = []
                data.forEach(val => {
                    let obj = {
                        _id: val._id,
                        username: val.username,
                        email: val.email,
                        role: val.role,
                        userId: val.userId,
                        name: val.name
                    }
                    userdata.push(obj)
                })
                return res.status(200).send({
                    success: true,
                    message: 'Details Fetch sccessfully....',
                    data: userdata
                })
            } else {
                return res.status(200).send({
                    success: false,
                    message: 'Unable to fetch details.....',
                    data: []
                })
            }
        } catch (err) {
            logger.error('application break ++++' + err)
            return res.status(200).send({
                success: false,
                message: 'Something went wrong.....',
                data: []
            })
        }
    }
}

module.exports = new UserController();