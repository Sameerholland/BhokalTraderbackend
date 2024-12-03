const passport = require("passport");

exports.isAuth = (req, res, done) => {
  return passport.authenticate('jwt ')
};

exports.sentizeUser = (user)=>{
	console.log(user)
   return {Id:user.Id,Name:user.Name,email_address:user.email_address, Course_Id:user.Course_Id,role:user.role}
}

exports.cookieExtracter = function(req){
  let token = null;
  if(req && req.headers.cookie){
    const cookies = cookieParser(req.headers.cookie)
	 console.log("Working in cokinng")
    token = cookies['jwt'];
  }
  return token;
}

function cookieParser(cookieString) {
	console.log(cookieString)

	// Return an empty object if cookieString
	// is empty
	if (cookieString === "")
		return {};

	// Get each individual key-value pairs
	// from the cookie string
	// This returns a new array
	let pairs = cookieString.split(";");

	// Separate keys from values in each pair string
	// Returns a new array which looks like
	// [[key1,value1], [key2,value2], ...]
	let splittedPairs = pairs.map(cookie => cookie.split("="));


	// Create an object with all key-value pairs
	const cookieObj = splittedPairs.reduce(function (obj, cookie) {

		// cookie[0] is the key of cookie
		// cookie[1] is the value of the cookie 
		// decodeURIComponent() decodes the cookie 
		// string, to handle cookies with special
		// characters, e.g. '$'.
		// string.trim() trims the blank spaces 
		// auround the key and value.
		obj[decodeURIComponent(cookie[0].trim())]
			= decodeURIComponent(cookie[1].trim());
		return obj;
	}, {})
	return cookieObj;
}



