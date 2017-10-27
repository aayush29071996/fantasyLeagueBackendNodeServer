/*
* Created by harirudhra on Sat 21 Jan 2017
*/

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var UserProfileSchema = new mongoose.Schema({
	user: {type:Schema.Types.ObjectId, ref:'User'},
	name:{type:String, default:null},
	username:{type:String, unique: true },
	gender:{type:String, enum:['MALE','FEMALE']},
	mobileNumber:{type:String, default:null},
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
		state:{type: String},
		pincode:{type:String, default:null},
		country:{type:String, default:'India'}
	}
});

var UserProfile = mongoose.model('UserProfile', UserProfileSchema);
module.exports = UserProfile;