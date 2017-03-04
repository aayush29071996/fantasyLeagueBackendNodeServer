'use strict';

exports.adminContent = function(req,res,next){
    console.log(req.subdomains);
    if(req.subdomains[1]=='admin')
        {res.sendFile('../../dashboard/index.html', {
			root: __dirname
		});
    }
    else
        next();
};