const UserSchema = require('../schemas/userScmema')
const constvar = require('../constantVariable/constant')
var jsonWebToken = require('jsonwebtoken');
const tokenSchema = require('../schemas/tokenSchema')
const logger = require('../utilServices/logger')
const userInfo = require('../schemas/userInformationSchema')
class UtilService {

    async getUniqueId(){
        let uniqueID;
        let isUnique = false;
        while(!isUnique){
            const min = 1000000000; 
            const max = 9999999999;
            uniqueID = Math.floor(Math.random() * (max - min + 1)) + min;

            const existingDocument = await UserSchema.findOne( { 'userId':uniqueID } );
            if (!existingDocument) {
                isUnique=true;
            }
        }
        return uniqueID;
    }

    async checkUserExists(username){
        let userExists =await UserSchema.findOne({'username': username});
        let isUserExists = false
        if(userExists){
            isUserExists = true
        }
        return isUserExists;
    }

    async checkValidUserName(username){
        return /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]*$/.test(username);
    }

    async checkIsNumeric(username){
        return /^\d+$/.test(username);
    }

    async getUeseData(searchData,searchKey){
        const query={}
        query[searchKey]= searchData
        let data = await UserSchema.findOne(query);
        if(data){
            return data
        }else return {}
        // await UserSchema.findOne(query).then((data)=>{
        //     if(data){
        //         return data;
        //     }else{
        //         return {}
        //     }
        // }).catch(err=>{
        //     logger.error('application crashed due to fetching data'+err)
        //     return {}
        // })
        
    }

    async generateToken(){
        let secret = constvar.constant_variable.token_secret
        let tokendata = {
            secretData : constvar.constant_variable.tokenData
        }
        let token = jsonWebToken.sign(tokendata,secret,{
            expiresIn:'2h'
        })
        return token;
    }

    async storeToken(token,timetoexpire) {
        let isTokenSaved = false;
        let token_data = new tokenSchema({
            token : token,
            createdAt : new Date(),
            validTill : timetoexpire
        })
        await token_data.save().then(data=>{
            if(data){
                isTokenSaved = true;
            }else{
                isTokenSaved=false
            }
        }).catch(err=>{
            console.log("Error in saving the token")
            isTokenSaved = false
        })
        return isTokenSaved;
    }

    async getUserDetailData(searchQuery){
        let data;
        try{
            data = await UserSchema.find(searchQuery)
            //console.log(data)
        }catch(err){
            console.log('innnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn')
            logger.error(`Error in getting user detail ${err}`)
            data = []
        }
        return data
    }

    async getUserInfoData(userId){
        let data;
        try{
            data = await userInfo.find({userId:userId})
            //('fetch data successs')
        }catch(err){
            console.log('innnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn')
            logger.error(`Error in getting user detail ${err}`)
            data = []
        }
        return data
    }

    async updateUserInfo(user,id){
        let updateFlag = false
        console.log(id)
        await userInfo.updateOne({_id : id},{$set : {
            assignedDate : user.assignedDate,
            assignedBy : user.assignedBy,
            repoterName : user.repoterName,
            reporterId : user.reporterId,
            rolecode : user.rolecode,
            designation : user.designation
        }}).then((result)=>{
            if(result){
                updateFlag = true
            }else{
                updateFlag = false
            }
        }).catch(err=>{
            logger.error(`Error in updating user info ${err}`)
            updateFlag = false
        })

        return updateFlag;
    }

}

module.exports = new UtilService();

//"mongodb://localhost:27017/Emp_Profile"
//"mongodb+srv://ithub:ithub1234@cluster0.j1reyqx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"