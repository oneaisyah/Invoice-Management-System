
const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('dotenv').config();

async function createAccountCheck(req, res, next) { //*! Logic here: if there are no users in the database then bypass token check
    
    const isThereAUserInDatabase = (await User.getAll()).length > 0;
    let decoded;
    if (isThereAUserInDatabase) { //* Database has >= 1 user; there must be a token in request headers, to be checked 
         //! Decoded if verified returns the requester's username and role level: decoded: { username: 'sean2', roleLevel: 0 }
        try {
            const token = String(req.headers.authorization)
            .replace(/^bearer|^jwt/i, "")
            .replace(/^\s+|\s+$/gi, "");
            decoded = jwt.verify(token, process.env.TOKEN_KEY);
    
        } catch (err) {
            // console.error('Error in createAccountCheck:', err);
            return res.status(401).json({ message: 'Invalid token' });
        }
    
    }
    
    const user = await User.searchByUsername({ 'username': req.body.username });

    if (user.length > 0) {
        console.log('Username exists!');
        return res.status(409).json({ message: 'Username already exists' });
    }

    
    if (!req.body.username) {
        console.log('Request body does not have username!');
        return res.status(404).json({ message: 'Request body has no username field!' });
    }

    const desiredRoleLevelToCreate = req.body.roleLevel;

    isThereAUserInDatabase ? (creatorRoleLevel = decoded.roleLevel) : (creatorRoleLevel = 4);

    if (typeof desiredRoleLevelToCreate !== 'number') {
        console.log('Role level to create is not of number data type!');
        return res.status(404).json({ message: 'Role level to create is not of number data type!' });
    } else if (creatorRoleLevel <= desiredRoleLevelToCreate) {
        return res.status(403).json({ message: 'Insufficient permissions to create requested role level!'});
    }

    return next();
} 

async function updateAccountCheck(req, res, next) {

    const isThereAUserInDatabase = (await User.getAll()).length > 0;
    let decoded;

    if (isThereAUserInDatabase) { //* Database has >= 1 user; there must be a token in request headers, to be checked 
         //! Decoded if verified returns the requester's username and role level: decoded: { username: 'sean2', roleLevel: 0 }
        try {
            const token = String(req.headers.authorization)
            .replace(/^bearer|^jwt/i, "")
            .replace(/^\s+|\s+$/gi, "");
            decoded = jwt.verify(token, process.env.TOKEN_KEY);
            req.headers.currentUsername = decoded.username
    
        } catch (err) {
            console.error('Error in updateAccountCheck:', err);
            return res.status(401).json({ message: 'Invalid token' });
        }
    
    } else {
        console.error('Error in updateAccountCheck:', err);
        return res.status(404).json({ message: 'No users found' });
    }
    
    if (((req.body.currentUsername) && (!req.body.newUsername)) || ((!req.body.currentUsername) && (req.body.newUsername))) {
        console.log('Bad request. Either both currentUsername and newUsername fields must exist or both do not. Should not have half-half!');
        return res.status(400).json({ message: 'Request fields are invalid. Should either have both currentUsername and newUsername, or none at all.' });
    }

    if (req.body.username) {
        const user = await User.searchByUsername({ 'username': req.body.username });

        if (user.length > 0) {
            console.log('New username exists!');
            return res.status(409).json({ message: 'Username already exists' });
        }
    }

    const desiredRoleLevelToCreate = req.body.roleLevel;

    if (desiredRoleLevelToCreate) {

        isThereAUserInDatabase ? (creatorRoleLevel = decoded.roleLevel) : (creatorRoleLevel = 4);

        if (typeof desiredRoleLevelToCreate !== 'number') {
            console.log('Role level to create is not of number data type!');
            return res.status(404).json({ message: 'Role level to modify is not of number data type!' });
            
        } else if (creatorRoleLevel < desiredRoleLevelToCreate) {
            return res.status(403).json({ message: 'Insufficient permissions to create requested role level!'});
        }

    }

    return next();
} 

module.exports = {createAccountCheck, updateAccountCheck}