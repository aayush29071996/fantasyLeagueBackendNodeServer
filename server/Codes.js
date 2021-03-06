/*
* Created by harirudhra on Sun 1 Jan 2017
*/

var HttpStatus = require('http-status');

exports.errorMsg = {
	UNEXP_ERROR : 'unexpected error in accessing data',
	USER_NOT_FOUND : 'user not found',
	EMAIL_IN_USE : 'email already in use',
	USERNAME_IN_USE : 'username already in use',
	MOBILE_IN_USE : 'mobile number in use',
	INVALID_REQ : 'invalid api request',
	UNAUTH_KEY : 'unauthorized/invalid api key',

	F_NO_LIVE : 'currently, no live fixtures',
	F_NO_UP : 'currently, no upcoming fixtures',
	F_NO_HIS : 'currently, no history of fixtures',
	F_NO_SE : 'currently, no seasons',
	F_NO_MA : 'currently, no fixtures',
	F_INV_MID: 'invalid match id',
	S_NO : 'currently, no seasons',
	T_NO : 'currently, no teams',
	T_ID_INUSE : 'team id in use',
	P_NO : 'no player',
	P_ID_INUSE : 'player id in use',
	F_ID_INUSE : 'fixture id in use',
	ST_NO : 'currently, no pitches',
	CT_NO : 'currently, no categories',
	PS_INV_ID: 'invalid point system id',
	F_INV_MCID: 'invalid match card id',
	T_INV_TID: 'invalid team id',
	F_NO_MC: 'no match cards for user',
	F_NO_MC_M: 'no match cards for match'
}

exports.status = {
	SUCCESS : 'success',
	FAILURE : 'failure'
}

exports.httpStatus = {
	OK : HttpStatus.OK,
	ISE : HttpStatus.INTERNAL_SERVER_ERROR,
	BR : HttpStatus.BAD_REQUEST,
	NF : HttpStatus.NOT_FOUND,
	UNAUTH : HttpStatus.UNAUTHORIZED
}
