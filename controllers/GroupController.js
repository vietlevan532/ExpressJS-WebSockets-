const Group = require('../models/Group');
const User = require('../models/User');
const Member = require('../models/Member');
const mongoose = require('mongoose');

class GroupController {

    renderGroups = async (req, res, next) => {
        try {
            const groups = await Group.find({ creator_id: req.session.user_id }).lean();
            res.render('group', {groups: groups});
        } catch (error) {
            res.status(500).json(error);
        }
    }

    createGroup = async (req, res) => {
        try {
            const group = new Group({
                creator_id: req.session.user_id,
                name: req.body.name,
                image: 'images/' + req.file.filename,
                limit: req.body.limit
            });
            await group.save();

            const groups = await Group.find({ creator_id: req.session.user_id }).lean();
            res.render('group', {message: req.body.name + ' - group created successfully', groups: groups});
        } catch (error) {
            res.status(500).json(error);
        }
    }

    getMembers = async (req, res) => {
        try {
            const users = await User.aggregate([
                {
                    $lookup: {
                        from: 'members',
                        localField: '_id',
                        foreignField: 'user_id',
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: [ '$group_id', mongoose.Types.ObjectId(req.body.group_id) ] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as:'members'
                    }
                },
                {
                    $match: {
                        '_id': {
                            $nin:[ mongoose.Types.ObjectId(req.session.user._id) ]
                        }
                    }
                }
            ]);
            res.status(200).send({ success: true, data: users });
        } catch (error) {
            res.status(500).send({ success: false, msg: error.message });
        }
    }

    addMembers = async (req, res) => {
        try {
            if (!req.body.members) {
                res.status(200).send({ success: false, msg: 'Please select any Member' });
            } else if (req.body.members.length > parseInt(req.body.limit)){
                res.status(200).send({ success: false, msg: "Can't select more than " + req.body.limit + 'members' });
            } else {
                await Member.deleteMany({ group_id: req.body.group_id });
                var data = [];
                const members = req.body.members;
                for (let i = 0; i < members.length; i++) {
                    data.push({
                        group_id: req.body.group_id,
                        user_id: members[i]
                    });
                }
                await Member.insertMany(data);
                res.status(200).send({ success: true, msg: 'Members added successfully' });
            }
        } catch (error) {
            res.status(500).send({ success: false, msg: error.message });
        }
    }

}

module.exports = new GroupController;
