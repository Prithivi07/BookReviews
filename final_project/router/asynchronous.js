const { default:axios } = require('axios');
let express = require('express')
const async_awaitCalls = express.Router()

async_awaitCalls.get('/', async function (req, res) {
    
    try {
        const response = await axios.get("http://localhost:5000/")
        return res.status(200).json({books : response.data.books});
    } 
    catch (error) {
        return res.status(error.response.status).json({message: error.response.data.message}); 
    }
  });

module.exports.asyncawait = async_awaitCalls