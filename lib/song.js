var Mongoose = require('mongoose'),
	Schema = Mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var schema = new Schema({
	name: { type: String, required: true },
	album: { type: String, required: true },
	genre: [{ type: String, required: true }],
	releasedOn: { type: Date, required: false },
	isExplicit: { type: Boolean, default: false },
	artist: [{ type: ObjectId, ref: 'Artist' }],
	tags: [{ type: ObjectId, ref: 'Tag' }]
});

module.exports = Mongoose.model('Song', schema);