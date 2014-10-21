var Express = require('express'),
	Mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	connection = Mongoose.connection,
	mongoUri = 'mongodb://localhost/song',
	port = 9011,
	app = Express();

var Artist = require('./lib/artist'),
	Song = require('./lib/song'),
	Tag = require('./lib/tag');

Mongoose.connect(mongoUri);
connection.once('open', function(){
	console.log('Successfully connected to ' + mongoUri);
});


app.use(bodyParser.json());

app.post('/artists', function(req, res){
	var artist = new Artist(req.body.artist);
	artist.save(function(err){
		if(err) {res.send(err)};
		res.send(req.body.artist.name + ' was saved!');
	});
});

app.post('/artists/:name/songs', function(req, res){
	Artist.findOne({ name: req.params.name }).populate('songs').exec(function(err, artist){
		if(err){res.send(err)};
		artist._id;
		var newSong = new Song(req.body.song);
		newSong.artist.addToSet(artist._id)
		newSong.save(function(err, song){
			if (err) {res.send(err)};
			artist.songs.addToSet(newSong);
			artist.save(function(err, artist){
				if(err){res.send(err)};
				res.send(song.name + ' was saved to ' + artist.name + "'s collection!");
			})
		})
	});
});

app.post('/songs/:name/tags', function(req, res){
	Tag.findOneAndUpdate({ name: req.body.name}, req.body, {upsert: true})
		.exec(function(err, tag){
			if(err) res.send(err);
			tag.save(function(err){
				if(err) res.send(err);
			});
			Song.findOne({name: req.params.name})
				.exec(function(err, song){
					if(err) return res.send(err);
					song.tags.addToSet(tag);
					song.save(function(err){
						if(err) res.send(err);
						res.send(tag.name + ' has been added to ' + song.name);
					})
		})
	});
});

app.get('/artists', function(req, res){
	Artist.find(function(err, artist){
		if(err){res.send(err)};
		res.send(artist);
	});
});

app.get('/artists/:name', function(req, res){
	Artist.findOne({ name: req.params.name }, function(err, artist){
		if(err){res.send(err)};
		res.send(artist);
	});
});

app.listen(port, function(){
	console.log('Now listening on port: ' + port)
});