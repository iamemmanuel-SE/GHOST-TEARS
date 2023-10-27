const User = require('../models/userModel')
const mongoose = require('mongoose')


// //Get all users
// const getUsers = async (req, res) => {
//     const users = await User.find({}).sort({createdAt: -1})
//     res.status(200).json(users)
// }

// Update user status for Active/inactive 
const updateUserStatus = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such user'})
    }

    const statusUpdate = await User.findOneAndUpdate(
        {_id: id}, 
        { $set: req.body }
    )
    if(!statusUpdate){
        return res.status(400).json({error: 'No such user'})
    }
    res.status(200).json(statusUpdate);
}

//Get all active users
const getActiveUsers = async (req, res) => {
    const users = await User.find({ isActive: true}).sort({createdAt: -1})
    res.status(200).json(users)
}


module.exports = {updateUserStatus, getActiveUsers}