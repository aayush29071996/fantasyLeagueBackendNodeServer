/*
 * Created by harirudhra on Sat 15 Apr 2017
*/

var User = require('../models/User');
var Category = require('../models/Category');
var Story = require('../models/Story');
var StoryCoverPicture = require('../models/StoryCoverPicture');

var moment = require('moment');

var Codes = require('../Codes');
var Validation = require('./Validation');



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
	
	var newStory = new Story;
	newStory.user = req.body.userid;
	newStory.category = req.body.categoryId;
	newStory.title = req.body.title;
	newStory.status = 'CREATED';
	newStory.content = req.body.content;
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


exports.getAllStories = function(req, res) {
	
	Story.find({}).populate('user category comments likes shares').exec(function(storiesErr, stories){
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

exports.approveStory = function(req, res){
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

		story.status = 'APPROVED';
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


exports.publishStory = function(req, res){
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

		story.status = 'PUBLISHED';
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

		story.countsLike = story.countsLike + 1;
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

		story.countsShare = story.countsShare + 1;
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

		story.countsComment = story.countsComment + 1;
		
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







