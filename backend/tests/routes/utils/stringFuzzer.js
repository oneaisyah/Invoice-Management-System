function generateArrayOfRandomStrings(numberOfRandomStrings, permissibleChars, stringSize) {

    let arr = new Array();

    for (let i = 0; i <= numberOfRandomStrings; i++) {
        arr.push(getRandomString(permissibleChars, stringSize));
    }

    return arr
}
function getRandomString(permissibleChars, stringSize) {

    let result = '';
    const permissibleCharsLength = permissibleChars.length;

    for (let i = 0; i < stringSize; i++) {
        const randomIndex = Math.floor(Math.random() * permissibleCharsLength);
        result += permissibleChars[randomIndex];
    }

    return result;
}

const alphanumericCharacterSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const tokenCharacterSet = alphanumericCharacterSet + '.';


module.exports = {generateArrayOfRandomStrings, tokenCharacterSet};
/* Usage example

const alphanumericCharacterSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const size = 10;

const randomString = getRandomString(alphanumericCharacterSet, size);
console.log(randomString); // Output will be a random 10-character string using
the permissible characters.
*/