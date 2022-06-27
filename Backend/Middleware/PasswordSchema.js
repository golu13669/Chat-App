
const passwordValidator = require('password-validator');

module.exports.schema = new passwordValidator()
.is().min(8,'Password must have minimun length of 8')                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase(1,'Password must contain atleast one uppercase letter')                              // Must have uppercase letters
.has().lowercase(1,'Password must contain  atleast one lowercase letter')                              // Must have lowercase letters
.has().digits(1,'Password must contain  atleast one digit')  
.has().symbols(1,'Password must contain  atleast one symbol')                              
.is().not().oneOf(['Password','Passw0rd', 'Password123'],'Password cannot be similar to the word \'password\'');
