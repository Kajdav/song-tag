var Mongoose = require('mongoose'),
	Schema = Mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var schema = new Schema({
	name: { type: String, required: true, uniqueness: true },
	bio: { type: String },
	genres: [{ type: String }],
	songs: [{type: ObjectId, ref: 'Song' }]
});

module.exports = Mongoose.model('Artist', schema);