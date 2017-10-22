/*
* Created by harirudhra on Sat 21 Jan 2017
*/

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var UserProfileSchema = new mongoose.Schema({
	user: {type:Schema.Types.ObjectId, ref:'User'},
	name:{type:String, default:null},
	gender:{type:String, enum:['MALE','FEMALE']},
	mobileNumber:{type:String, unique:true},
	emailVerification:{type:Boolean, default:false},
	mobileVerification:{type:Boolean, default:false},
	panVerification:{type:Boolean, default:false},
	pushNotification:{type:Boolean, default:true},
	emailNotification:{type:Boolean, default:true},
	smsNotification:{type:Boolean, default:true},
	createdOn:{type:Date, required: true},
	address:{
		line1:{type:String},
		line2:{type:String},
		city:{type:String},
		state:{type:Schema.Types.ObjectId, ref:'State'},
		pincode:{type:Number},
		country:{type:String, default:'India'}
	}
});

var UserProfile = mongoose.model('UserProfile', UserProfileSchema);
module.exports = UserProfile;