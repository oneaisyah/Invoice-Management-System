
let StatementOfAccount = require('../models/statementOfAccount');
const { getStatementOfAccountCSV } = require('../pipelines/statementOfAccountCSVPipeline.js');

const StatementOfAccountController = {
    getCSV: async (req, res) => {
        try {
            const csvString = await getStatementOfAccountCSV(req.query);
            res.setHeader('Content-Disposition', 'attachment; filename="statementOfAccounts.csv"');
            res.header('Content-Type', 'text/csv');
            res.status(200).send(csvString);
        } catch (err) {
            res.status(400).json({ 'message': 'Could not retrieve statement of accounts as csv', 'error': { name: err.name, message: err.message, stacktrace: err.stacktrace } });
            throw err;
        }
    },
    get: (req, res) => {
        StatementOfAccount.search(req.query)
            .then((statementOfAccounts) => {
                res.status(200).json({ message: "statement of accounts retrieved", statementOfAccounts });
            }).catch((err) => {
                console.log(err);
                res.status(400).json({ message: 'could not retrieve statement of accounts', error: { message: err.message, name: err.name } });
            });
    },
    getById: (req, res) => { // Get statement of account
        StatementOfAccount.getById(req.params.id, req.query)
            .then((statementOfAccount) => {
                if (!statementOfAccount) {
                    res.status(404).json({ message: "statement of account does not exist" });
                }
                else {
                    res.status(200).json({ message: "statement of account retrieved", statementOfAccount });
                }
            }).catch((err) => {
                res.status(400).json({ message: "statement of account could not be retrieved", err })
            });
    },
    post: (req, res) => { // Create statement of account
        StatementOfAccount.create(req.body)
            .then((statementOfAccount) => {
                res.status(201).json({ message: 'Statement of account was added successfully', statementOfAccount });
            }).catch((err) => {
                console.log(err);
                res.status(400).json({ 'error': `Statement of account could not be added.`, error: err });
            });
    },
    put: (req, res) => { // Update statement of account
        StatementOfAccount.updateById(req.params.id, req.body)
            .then(statementOfAccount => {
                res.status(201).json({ message: "Statement of account updated", statementOfAccount });
            })
            .catch(err => res.status(400).json({ error: err }));
    },
    delete: (req, res) => { // Deletes statement of account.
        StatementOfAccount.deleteById(req.params.id)
            .then((statementOfAccount) => {
                res.json({ 'message': 'Statement of account was deleted successfully', statementOfAccount })
            }).catch((err) => {
                res.status(400).json({ message: 'Statement of account was not deleted! It is possible that it does not exist!', error: err })
            });
    },
    uploadImage: async (req, res) => {
        try {
            if (req.file) {
                const mediaLink = await dataBucket.uploadFile(`${process.cwd()}/${req.file.path}`, `${req.file.path}`);
                res.status(200).json({ message: "file uploaded to data bucket", mediaLink })
            }
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ message: "file could not be uploaded", error: { name: err.name, message: err.message } })
        }
    }
}
module.exports = StatementOfAccountController;