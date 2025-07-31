let User = require('./../models/user.js');
const hashingPassword = require('../utils/hashingPassword');

const UserController = {
    get: (req, res) => {
        User.search(req.query)
            .then((user) => {
                res.status(200).json({ message: 'Users retrieved', user });
            }).catch((err) => {
                res.status(400).json({ message: 'could not retrieve users', error: { message: err.message, name: err.name } });
            });
    },
    getByID: (req, res) => {
        filter = {}
        filter["_id"] = req.params.id
        User.search(filter)
            .then((user) => {
                if (!user)
                    res.status(404).send({ message: `User with id does not exist` });
                else
                    res.status(200).send({ message: "User retrieved", user });
            }).catch((err) => {
                res.status(400).json({ message: 'User not found!', error: err })
            });
    },
    post: (req, res) => { //* TODO: Fix post logic; login logic should change
        hashingPassword(req.body.password).then((newPassword) => {
            const newUser = {
                ... req.body,
                password: newPassword,
            };
            User.create(newUser)
                .then((user) => {

                    // console.log('User was created successfully');
                    res.status(201).json({ message: 'User was added successfully', user });
                }).catch((err) => {
                    console.log('User was NOT created successfully');
                    console.log('Error', err);
                    res.status(400).json({ message: 'User was not added successfully.', error: err });
                });
            
        });
    },
    put: (req, res) => {

        documentIDToEdit = req.params.id // Document ID to edit.
        if (req.body.password) {
            hashingPassword(req.body.password).then((newPassword) => {
                req.body.password = newPassword
                User.updateByName(req.headers.currentUsername, documentIDToEdit, req.body)
                    .then(user => res.status(201).json({ message: "User updated by ID", user }))
                    .catch(err => res.status(500).json({ message: "User not updated by ID", error: err }));
            })
        } else {
        User.updateByName(req.headers.currentUsername, documentIDToEdit, req.body)


            .then(user => res.status(201).json({ message: "User updated by ID", user }))
            .catch(err => res.status(500).json({ message: "User not updated by ID", error: err }));
        }
    },
    delete: (req, res) => {
        User.deleteById(req.params.id)
            .then(user => res.status(200).json({ message: "User deleted by id", user }))
            .catch(err => res.status(400).json({ error: err }));
    }
}

module.exports = UserController;
