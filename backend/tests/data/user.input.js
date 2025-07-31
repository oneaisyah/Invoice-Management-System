var users = [{
    username: 'sean',
    password: '123',
    roleLevel: 3
},{
    username: 'john',
    password: '123abc',
    roleLevel: 2
},{
    username: 'nicole',
    password: '123def',
    roleLevel: 1
}];
module.exports = users;

//! Note that the first user is of highest role level; this user will be used to obtain the token via logging in to this user's account