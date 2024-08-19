const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    name: { type: String, required: true, unique: true },
    isPrivate: { type: Boolean, default: false },
    passcode: { type: String, required: function() { return this.isPrivate; } }
});

module.exports = mongoose.model('Room', RoomSchema);
