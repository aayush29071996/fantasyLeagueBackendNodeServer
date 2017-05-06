/*
 * Created by harirudhra on Sat 15 Apr 2017
*/

var User = require('../models/User');
var Category = require('../models/Category');
var Story = require('../models/Story');
var StoryCoverPicture = require('../models/StoryCoverPicture');

var Season = require('../models/Football/Season');
var Match = require('../models/Football/Match');

var cheerio = require('cheerio');
var moment = require('moment');
var request = require('request');
var moment = require('moment');
var nodemailer = require('nodemailer');

var Codes = require('../Codes');
var Validation = require('./Validation');
 
var APIkey = 'EyTtWbGs9ZnUYam1xB63iXoJ4EZ4TuTKGmQaebB1tpsrxq5VcdQ3gPVgjMyz';
 
var baseUrl = "http://localhost:9000/";
//var num = 3;

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '', // Your email id
        pass: '' // Your password
    }
});


exports.createCategory = function(req, res){

	var newCategory = new Category;
	newCategory.name = req.body.name;
	newCategory.save(function(categorySaveErr, savedcategory){
    	if (categorySaveErr) {
            res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Validation.validatingErrors(categorySaveErr)
            });
            return;
        } 
        if(savedcategory){
        	res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: savedcategory._id,
	            error: ''
    		});
			return;
        	}
    	});
}


exports.getCategories = function(req, res){

	Category.find({}).exec(function(categoriesErr, categories){
		if(categoriesErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
        	return;
		}

		if(categories == null){
			res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: '',
	            error: Codes.errorMsg.CT_NO
	        });
	        return;
		}	

        if(categories){
        	res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: categories,
	            error: ''
    		});
			return;
		}
	});	
}




exports.saveStory = function(req, res){
	
	// Recognize Cover Picture from Content
	var pictureURI;
	var images = cheerio('img', req.body.content);
	if(images[0] != undefined)
		pictureURI = images[0].attribs.src;
	else
		pictureURI = "";
	// 
	
	// Parse Teaser Content
	var teaserContent;
	var ptags = cheerio('p', req.body.content);
	if(ptags[0].children[0].data != undefined){
		if(ptags[0].children[0].data.length>80)
			teaserContent = ptags[0].children[0].data.slice(0,80) + "...";
		else
			teaserContent = ptags[0].children[0].data;
	}
	else
		teaserContent = "";
	// 
	
	// Parse Title Teaser
	var titleTeaser;
	if(req.body.title.length>51)
		titleTeaser = req.body.title.slice(0,51) + "...";
	else
		titleTeaser = req.body.title;
	// 
	
	
	var newStory = new Story;
	newStory.user = req.body.userid;
	newStory.category = req.body.categoryId;
	newStory.title = req.body.title;
	newStory.titleTeaser = titleTeaser;
	newStory.status = 'CREATED';
	newStory.content = req.body.content;
	newStory.coverPicture = pictureURI;
	newStory.teaserContent = teaserContent;
	newStory.createdOn = moment.utc();

	newStory.save(function(storySaveErr, savedStory){
    	if (storySaveErr) {
            res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Validation.validatingErrors(storySaveErr)
            });
            return;
        } 
        if(savedStory){
        	res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: savedStory._id,
	            error: ''
    		});
			return;
        	}
    	});
}

exports.getStory = function(req, res) {
	
	Story.findOne({_id:req.params.storyId}).populate('user category comments likes shares').exec(function(storyErr, story){
		if(storyErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
        	return;
		}

		if(story == null){
			res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: '',
	            error: Codes.errorMsg.ST_NO
	        });
	        return;
		}	


        if(story){
        	res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: story,
	            error: ''
    		});
			return;
		}
	});
}





exports.getStoriesByUser = function(req, res) {
	
	Story.find({user:req.body.userId}).populate('user category comments likes shares').exec(function(storiesErr, stories){
		if(storiesErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
        	return;
		}

		if(stories == null){
			res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: '',
	            error: Codes.errorMsg.ST_NO
	        });
	        return;
		}	


        if(stories){
        	res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: stories,
	            error: ''
    		});
			return;
		}
	});
}


exports.getRecentStories = function(req, res){

	var now = moment.utc().format("YYYY-MM-DD HH:mm:ss");
	var sevenDaysBefore = moment.utc().subtract('7','d').format("YYYY-MM-DD HH:mm:ss");

	Story.find({createdOn:{$gte:sevenDaysBefore, $lt: now},status: {$ne:'REPORTED'}}).sort({"createdOn":-1}).populate('user category comments likes shares').exec(function(storiesErr, stories){
		if(storiesErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
        	return;
		}

		if(stories == null){
			res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: '',
	            error: Codes.errorMsg.ST_NO
	        });
	        return;
		}

        if(stories){
        	res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: stories,
	            error: ''
    		});
			return;
		}
	});

}

exports.getTrendingStories = function(req, res){

	var now = moment.utc().format("YYYY-MM-DD HH:mm:ss");
	var thirtyDaysBefore = moment.utc().subtract('30','d').format("YYYY-MM-DD HH:mm:ss");

	Story.find({createdOn:{$gte:thirtyDaysBefore, $lt: now},status: {$ne:'REPORTED'}}).sort({"trendIndex":1}).populate('user category comments likes shares').exec(function(storiesErr, stories){
		if(storiesErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
        	return;
		}

		if(stories == null){
			res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: '',
	            error: Codes.errorMsg.ST_NO
	        });
	        return;
		}

		if(stories.length > 15){
			stories = stories.slice(0,15);
		}

        if(stories){
        	res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: stories,
	            error: ''
    		});
			return;
		}
	});

}





exports.getAllStories = function(req, res) {
	
	Story.find({status: {$ne:'REPORTED'}}).populate('user category comments likes shares').exec(function(storiesErr, stories){
		if(storiesErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
        	return;
		}

		if(stories == null){
			res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: '',
	            error: Codes.errorMsg.ST_NO
	        });
	        return;
		}	


        if(stories){
        	res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: stories,
	            error: ''
    		});
			return;
		}
	});
}

// exports.approveStory = function(req, res){
// 	Story.findOne({_id:req.body.storyId}, function(storyErr, story){
// 		if(storyErr){
// 			res.status(Codes.httpStatus.ISE).json({
// 	            status: Codes.status.FAILURE,
// 	            code: Codes.httpStatus.ISE,
// 	            data: '',
// 	            error: Codes.errorMsg.UNEXP_ERROR
// 	        });
//         	return;
// 		}

// 		if(story == null){
// 			res.status(Codes.httpStatus.OK).json({
// 	            status: Codes.status.SUCCESS,
// 	            code: Codes.httpStatus.OK,
// 	            data: '',
// 	            error: Codes.errorMsg.ST_NO
// 	        });
// 	        return;
// 		}	

// 		story.status = 'APPROVED';
// 		story.save(function(storySaveErr, savedStory){
//     	if (storySaveErr) {
//             res.status(Codes.httpStatus.BR).json({
//                 status: Codes.status.FAILURE,
//                 code: Codes.httpStatus.BR,
//                 data: '',
//                 error: Validation.validatingErrors(storySaveErr)
//             });
//             return;
//         } 
//         if(savedStory){
//         	res.status(Codes.httpStatus.OK).json({
// 	            status: Codes.status.SUCCESS,
// 	            code: Codes.httpStatus.OK,
// 	            data: savedStory._id,
// 	            error: ''
//     		});
// 			return;
//         	}
//     	});



// 	});
// }


// exports.publishStory = function(req, res){
// 	Story.findOne({_id:req.body.storyId}, function(storyErr, story){
// 		if(storyErr){
// 			res.status(Codes.httpStatus.ISE).json({
// 	            status: Codes.status.FAILURE,
// 	            code: Codes.httpStatus.ISE,
// 	            data: '',
// 	            error: Codes.errorMsg.UNEXP_ERROR
// 	        });
//         	return;
// 		}

// 		if(story == null){
// 			res.status(Codes.httpStatus.OK).json({
// 	            status: Codes.status.SUCCESS,
// 	            code: Codes.httpStatus.OK,
// 	            data: '',
// 	            error: Codes.errorMsg.ST_NO
// 	        });
// 	        return;
// 		}	

// 		story.status = 'PUBLISHED';
// 		story.save(function(storySaveErr, savedStory){
//     	if (storySaveErr) {
//             res.status(Codes.httpStatus.BR).json({
//                 status: Codes.status.FAILURE,
//                 code: Codes.httpStatus.BR,
//                 data: '',
//                 error: Validation.validatingErrors(storySaveErr)
//             });
//             return;
//         } 
//         if(savedStory){
//         	res.status(Codes.httpStatus.OK).json({
// 	            status: Codes.status.SUCCESS,
// 	            code: Codes.httpStatus.OK,
// 	            data: savedStory._id,
// 	            error: ''
//     		});
// 			return;
//         	}
//     	});



// 	});
// }




exports.viewStory = function(req, res){
	Story.findOne({_id:req.body.storyId}, function(storyErr, story){
		if(storyErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
        	return;
		}

		if(story == null){
			res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: '',
	            error: Codes.errorMsg.ST_NO
	        });
	        return;
		}	

		story.countsView = story.countsView + 1;
		
		story.trendIndex = story.trendIndex + 1;

		story.save(function(storySaveErr, savedStory){
    	if (storySaveErr) {
            res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Validation.validatingErrors(storySaveErr)
            });
            return;
        } 
        if(savedStory){
        	res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: savedStory._id,
	            error: ''
    		});
			return;
        	}
    	});

	});
}


exports.likeStory = function(req, res){

	Story.findOne({_id:req.body.storyId}, function(storyErr, story){
		if(storyErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
        	return;
		}

		if(story == null){
			res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: '',
	            error: Codes.errorMsg.F_INV_SID
	        });
	        return;
		}	
		story.trendIndex = story.trendIndex + 1;
		story.likes.push(req.body.userId);
		story.save(function(storySaveErr, savedStory){
    	if (storySaveErr) {
            res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Validation.validatingErrors(storySaveErr)
            });
            return;
        } 
        if(savedStory){
        	res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: savedStory._id,
	            error: ''
    		});
			return;
        	}
    	});
	});
}


exports.shareStory = function(req, res){

	Story.findOne({_id:req.body.storyId}, function(storyErr, story){
		if(storyErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
        	return;
		}

		if(story == null){
			res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: '',
	            error: Codes.errorMsg.F_INV_SID
	        });
	        return;
		}	

		story.trendIndex = story.trendIndex + 1;
		story.shares.push(req.body.userId);
		story.save(function(storySaveErr, savedStory){
    	if (storySaveErr) {
            res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Validation.validatingErrors(storySaveErr)
            });
            return;
        } 
        if(savedStory){
        	res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: savedStory._id,
	            error: ''
    		});
			return;
        	}
    	});
	});
}

exports.commentStory = function(req, res){

	Story.findOne({_id:req.body.storyId}, function(storyErr, story){
		if(storyErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
        	return;
		}

		if(story == null){
			res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: '',
	            error: Codes.errorMsg.F_INV_SID
	        });
	        return;
		}	


		var comment = {};
		comment.user = req.body.userId;
		comment.comment = req.body.comment;
		comment.createdOn = moment.utc();

		story.comments.push(comment);

		story.save(function(storySaveErr, savedStory){
    	if (storySaveErr) {
            res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Validation.validatingErrors(storySaveErr)
            });
            return;
        } 
        if(savedStory){
        	res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: savedStory._id,
	            error: ''
    		});
			return;
        	}
    	});
	});
}


exports.reportStory = function(req, res){

	Story.findOne({_id:req.body.storyId}).populate('user').exec(function(storyErr, story){
		if(storyErr){
			res.status(Codes.httpStatus.ISE).json({
	            status: Codes.status.FAILURE,
	            code: Codes.httpStatus.ISE,
	            data: '',
	            error: Codes.errorMsg.UNEXP_ERROR
	        });
        	return;
		}

		if(story == null){
			res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: '',
	            error: Codes.errorMsg.F_INV_SID
	        });
	        return;
		}	



		var report = {};
		report.user = req.body.userId;
		report.comment = req.body.comment;
		report.createdOn = moment.utc();

		if(story.reports.length == 10){
			story.status = 'REPORTED';
			sendStoryReportAbuseMail(story);
		}

		story.reports.push(report);

		story.save(function(storySaveErr, savedStory){
    	if (storySaveErr) {
            res.status(Codes.httpStatus.BR).json({
                status: Codes.status.FAILURE,
                code: Codes.httpStatus.BR,
                data: '',
                error: Validation.validatingErrors(storySaveErr)
            });
            return;
        } 
        if(savedStory){
        	res.status(Codes.httpStatus.OK).json({
	            status: Codes.status.SUCCESS,
	            code: Codes.httpStatus.OK,
	            data: savedStory._id,
	            error: ''
    		});
			return;
        	}
    	});
	});
}


function sendStoryReportAbuseMail(story){
  //   var htmlstream = fs.createReadStream('public/pitch/reset_password_mail.html', {
		// 	root: __dirname
		// });
    var mailOptions = {
	    from: 'Inyards Pitch <noreply@inyards.com>',
	    replyTo: 'support@inyards.com',
	    sender: 'Inyards Pitch <noreply@inyards.com>',
	    to: 'admin@inyards.com',
	    subject: 'Pitch Reported Abuse and Hidden',
	    text:'Pitch Reported Abuse and Hidden --- Title: ' + story.title + ' --- Pitched by: ' + story.user.username 
	    // html: htmlstream 
	};
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
			return;
	    }else{
	        console.log('Pitch Report Abuse Mail sent: ' + info.response);
	       return;
	    };
	});
}



// module.exports.LiveScores = function(req,res){//
 
//     var url = 'https://api.soccerama.pro/v1.2/livescore?api_token=' + APIkey;
//     request({url:url , json:true},function(err,data){
//         if(err ||data.statusCode!=200){
//             res.status(Codes.httpStatus.ISE).json({
//                 status : Codes.status.FAILURE,
//                 code : Codes.httpStatus.ISE,
//                 data : '',
//                 error : Codes.errorMsg.INVALID_REQ
//             });
//             return;
//         }
//         res.status(Codes.httpStatus.OK).json({
                 
//             status : Codes.status.SUCCESS,
//             code : Codes.httpStatus.OK,
//             data : data.body.data,
//             error : ''
             
//         });
//         return;
//     });
// };
 
// module.exports.Commentary = function(req,res){//
 
//     var n = num + 1;
//     var currentDate = moment.utc().subtract('1','d').format("YYYY-MM-DD HH:mm:ss");
//     Match.find({startingDateTime : { $lt : currentDate}},'matchId startingDateTime').sort({startingDateTime:-1}).exec(function(err,data){
 
//         if(err){
//             res.status(Codes.httpStatus.ISE).json({
//                 status : Codes.status.FAILURE,
//                 code : Codes.httpStatus.ISE,
//                 data : '',
//                 error : Codes.errorMsg.UNEXP_ERROR
//             });
//             return;
//         }
//         data = data.slice(0,n);
//         var head = [];
//         var count = 0;
//         var len = Object.keys(data).length;
//         console.log(data);
//         for(var i = 0;i<len;i++){
             
//             var url = 'https://api.soccerama.pro/v1.2/commentaries/match/' + data[i].matchId + '?api_token=' + APIkey;
//             console.log(url);
//             request({url:url , json:true},function(err,response,com){
 
//                 console.log(response.statusCode);
//                 if(err || response.statusCode!=200){
//                     res.status(Codes.httpStatus.ISE).json({
//                         status : Codes.status.FAILURE,
//                         code : Codes.httpStatus.ISE,
//                         data : '',
//                         error : Codes.errorMsg.INVALID_REQ
//                     });
//                     return;
//                     console.log("hello");
 
//                 }
 
//                 //com.data.push({matchId : data[i].matchId});
//                 head.push(com.data);
//                 count++;
//                 if(count == n - 1){
//                     res.status(Codes.httpStatus.ISE).json({
//                         status : Codes.status.SUCCESS,
//                         code : Codes.httpStatus.OK,
//                         data : head,
//                         error : ''
//                     });
//                     return;
//                 }
//             });
//         }
//         return;
         
//     });
// };
 
// module.exports.Stats = function(req,res){//
     
//     //
//     var n = num + 1;
//     var currentDate = moment.utc().subtract('1','d').format("YYYY-MM-DD HH:mm:ss");
//     Match.find({startingDateTime : { $lt : currentDate}},'matchId startingDateTime').sort({startingDateTime:-1}).exec(function(err,data){
 
//         console.log("sdjf");
//         if(err){
//             res.status(Codes.httpStatus.ISE).json({
//                 status : Codes.status.FAILURE,
//                 code : Codes.httpStatus.ISE,
//                 data : '',
//                 error : Codes.errorMsg.UNEXP_ERROR
//             });
//             return;
//         }
//         data = data.slice(0,n);
//         var head = [];
//         var count = 0;
//         var len = Object.keys(data).length;
//         console.log(data);
//         for(var i = 0;i<len;i++){
             
//             var url = 'https://api.soccerama.pro/v1.2/statistics/match/' + data[i].matchId + '?api_token=' + APIkey;
//             console.log(url);
//             request({url:url , json:true},function(err,response,com){
 
//                 console.log(response.statusCode);
//                 if(err || response.statusCode!=200){
//                     res.status(Codes.httpStatus.ISE).json({
//                         status : Codes.status.FAILURE,
//                         code : Codes.httpStatus.ISE,
//                         data : '',
//                         error : Codes.errorMsg.INVALID_REQ
//                     });
//                     return;
//                     console.log("hello");
 
//                 }
//                 head.push(com);
//                 count++;
//                 if(count == n - 1){
//                     res.status(Codes.httpStatus.ISE).json({
//                         status : Codes.status.SUCCESS,
//                         code : Codes.httpStatus.OK,
//                         data : head,
//                         error : ''
//                     });
//                     return;
//                 }
//             });
//         }
//         return;
         
//     });   
 
// };
 
// module.exports.Standings = function(req,res){
//     //
//     var count = 0;
//     var head = [];
//     Season.find({},'seasonId',function(err,data){
//         if(err){
//             res.status(Codes.httpStatus.ISE).json({
//                 status : Codes.status.FAILURE,
//                 code : Codes.httpStatus.ISE,
//                 data : '',
//                 error : Codes.errorMsg.UNEXP_ERROR
//             });
//             return;
//         }
//         var len =  Object.keys(data).length;
//         len = parseInt(len);
 
//         for(var i = 0;i<len;i++){
//             var url = 'https://api.soccerama.pro/v1.2/standings/season/' + data[i].seasonId + '?api_token=' + APIkey;
//             console.log(url);
//             request({url:url , json:true},function(err,response,com){
//                 console.log(response.statusCode);
//                 console.log(count);
//                 if(err||response.statusCode!=200){
//                     res.status(Codes.httpStatus.ISE).json({
//                         status : Codes.status.FAILURE,
//                         code : Codes.httpStatus.ISE,
//                         data : '',
//                         error : Codes.errorMsg.INVALID_REQ
//                     });
//                     return;
//                 }
//                 head.push(com.data);
//                 count++;
//                 if(count == len - 1){
//                     res.status(Codes.httpStatus.ISE).json({
//                         status : Codes.status.SUCCESS,
//                         code : Codes.httpStatus.OK,
//                         data : head,
//                         error : ''
//                     });
//                     return;
//                 }
//             });
//         }  
//         return;  
//     });
// };
 
// module.exports.Videos = function(req,res){
 
//     //
//     var n = num + 1;
//     var currentDate = moment.utc().subtract('1','d').format("YYYY-MM-DD HH:mm:ss");
//     Match.find({startingDateTime : { $lt : currentDate}},'matchId startingDateTime').sort({startingDateTime:-1}).exec(function(err,data){
 
//         console.log("sdjf");
//         if(err){
//             res.status(Codes.httpStatus.ISE).json({
//                 status : Codes.status.FAILURE,
//                 code : Codes.httpStatus.ISE,
//                 data : '',
//                 error : Codes.errorMsg.UNEXP_ERROR
//             });
//             return;
//         }
//         data = data.slice(0,n);
//         var head = [];
//         var count = 0;
//         var len = Object.keys(data).length;
//         console.log(data);
//         for(var i = 0;i<len;i++){
             
//             var url = 'https://api.soccerama.pro/v1.2/videos/match/' + data[i].matchId + '?api_token=' + APIkey;
//             request({url:url , json:true},function(err,response,com){
 
//                 console.log(response.statusCode);
//                 if(err || response.statusCode!=200){
//                     res.status(Codes.httpStatus.ISE).json({
//                         status : Codes.status.FAILURE,
//                         code : Codes.httpStatus.ISE,
//                         data : '',
//                         error : Codes.errorMsg.INVALID_REQ
//                     });
//                     return;
//                     console.log("hello");
 
//                 }
 
//                 //com.data.push({matchId : data[i].matchId});
//                 console.log(com);
//                 head.push(com.data);
//                 count++;
//                 if(count == n - 1){
//                     res.status(Codes.httpStatus.ISE).json({
//                         status : Codes.status.SUCCESS,
//                         code : Codes.httpStatus.OK,
//                         data : head,
//                         error : ''
//                     });
//                     return;
//                 }
//             });
//         }
//         return;
         
//     });
 
// };
 
// module.exports.TopScorers = function(req,res){
 
//     var count = 0;
//     var head = [];
//     Season.find({},'seasonId',function(err,data){
//         if(err){
//             res.status(Codes.httpStatus.ISE).json({
//                 status : Codes.status.FAILURE,
//                 code : Codes.httpStatus.ISE,
//                 data : '',
//                 error : Codes.errorMsg.UNEXP_ERROR
//             });
//             return;
//         }
//         var len =  Object.keys(data).length;
//         len = parseInt(len);
 
//         for(var i = 0;i<len;i++){
//             var url = 'https://api.soccerama.pro/v1.2/topscorers/season/' + data[i].seasonId + '?api_token=' + APIkey;
//             console.log(url);
//             request({url:url , json:true},function(err,response,com){
//                 console.log(response.statusCode);
//                 console.log(count);
//                 if(err||response.statusCode!=200){
//                     res.status(Codes.httpStatus.ISE).json({
//                         status : Codes.status.FAILURE,
//                         code : Codes.httpStatus.ISE,
//                         data : '',
//                         error : Codes.errorMsg.INVALID_REQ
//                     });
//                     return;
//                 }
//                 head.push(com.data);
//                 count++;
//                 if(count == len - 1){
//                     res.status(Codes.httpStatus.ISE).json({
//                         status : Codes.status.SUCCESS,
//                         code : Codes.httpStatus.OK,
//                         data : head,
//                         error : ''
//                     });
//                     return;
//                 }
 
//             });
//         }  
//         return;  
//     });
// };
 
// module.exports.Fixtures = function(req,res){
 
//     var startDate = moment.utc().format("YYYY-MM-DD");
//     var endDate = moment.utc().add('7','d').format("YYYY-MM-DD");
 
//     console.log(startDate);
//     console.log(endDate);
 
//     var url = 'https://api.soccerama.pro/v1.2/matches/'+ startDate + '/'+ endDate +'?api_token=' + APIkey;
//     console.log(url);
//     request({url:url , json:true},function(err,data){
//         console.log(data.statusCode);
//         if(err || data.statusCode!=200){
//             res.status(Codes.httpStatus.ISE).json({
//                 status : Codes.status.FAILURE,
//                 code : Codes.httpStatus.ISE,
//                 data : '',
//                 error : Codes.errorMsg.INVALID_REQ
//             });
//             return;
//         }
//         res.status(Codes.httpStatus.ISE).json({
                 
//             status : Codes.status.SUCCESS,
//             code : Codes.httpStatus.OK,
//             data : data.body.data,
//             error : ''
//         });
//         return;
//     });
// };





