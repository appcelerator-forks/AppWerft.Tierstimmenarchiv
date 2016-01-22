const DURATION = 20000,
    HEIGHT = 150;
var TSA = new (require('model/tsa.adapter'))();
var Row = require('ui/record.row');

module.exports = function(_e) {
	var record = TSA.getRecordById(_e.itemId);
	console.log('≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈');
	if (!record) {
		console.log('Warning: no record');
		return;
	}
	console.log('Info: record with props found: ' + record.species + ' ' + record.orders_de);

	var $ = Ti.UI.createWindow({
		backgroundColor : COLOR.DARKGREEN,
		orientationModes : [Titanium.UI.PORTRAIT]
	});
	$.imageView = Ti.UI.createView({

	});
	var firstRow = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		itemId : JSON.stringify({
			mod : 'zoom.window',
			id : record.species_latin
		})
	});
	firstRow.add($.imageView);
	$.listView = Ti.UI.createTableView({
		top : 0,
		data : [firstRow],
		height : Ti.UI.FILL,
		backgroundColor : 'transparent'
	});
	$.listView.appendRow(Row('Art', record.species));
	record.erstbeschreibung && $.listView.appendRow(Row('Erstbeschreibung:', record.erstbeschreibung));
	record.deutscher_name && $.listView.appendRow(Row('deutscher Name:', record.deutscher_name));
	record.english_name && $.listView.appendRow(Row('englischer Name:', record.english_name));
	$.listView.appendRow(Row('Familie:', record.families_de + ' (' + record.families_latin + ')'));
	$.listView.appendRow(Row('Ordnung:', record.orders_de + ' (' + record.orders_latin + ')'));
	record.Beschreibung && $.listView.appendRow(Row(record.Beschreibung, ''));

	$.listView.addEventListener('click', function(_e) {
		if (_e.row.itemId) {
			var payload = JSON.parse(_e.row.itemId);
			if (payload.id)
				require('ui/'+payload.mod)(payload.id).open();
		}
	});
	record.ort && $.listView.appendRow(Row('Aufnahmeort', record.ort));
	record.autor && $.listView.appendRow(Row('Autor', record.Autor));

	new (require('vendor/wikimedia.adapter'))(record.species_latin, {
		onload : function(blob) {
			//return;
			$.imageView.backgroundImage = blob.nativePath;
			var height = parseFloat(blob.height) / parseFloat(blob.width) * parseFloat(Ti.Platform.displayCaps.platformWidth) / parseFloat(Ti.Platform.displayCaps.logicalDensityFactor);
			$.imageView.setHeight(height);
			$.listView.data[0].setHeight(height);
			$.listView.setTop(0);
			$.imageView.add(Ti.UI.createImageView({
				image : '/assets/wikispecies.png',
				top : 0,
				right : 0,
				width : 50,
				height : 'auto',
				zIndex : 99,
				opacity : 0.7
			}));
		}
	});
	var audioPlayer = Ti.Media.createAudioPlayer({
		url : record.audio,
		allowBackground : true,
		volume : 1
	});
	audioPlayer.addEventListener('change', function(_e) {
		if (_e.state == 3) {
			$.playerView.animate({
				bottom : 0
			});
			console.log(audioPlayer.duration);
			var duration = audioPlayer.duration || DURATION;
			$.playerView.darker && $.playerView.darker.animate({
				width : 0,
				duration : duration
			});
		}
		// calculation of width:
		//console.log(_e.state);
	});
	audioPlayer.addEventListener('complete', function(_e) {
		$.playerView.animate({
			bottom : -HEIGHT
		});
		if (_e.error && Ti.Android) {
			Ti.UI.createNotification({
				message : 'Der sound kann nicht abgespielt werden.\nGerät nicht im Netz?'
			}).show();
		}
		//		$.close();
	});
	$.playerView = Ti.UI.createView({
		backgroundColor : 'black',
		bottom : -HEIGHT,
		height : HEIGHT
	});
	$.playerView.add(Ti.UI.createImageView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		image : record.spectrogram
	}));
	$.playerView.darker = Ti.UI.createView({
		backgroundColor : '#c000',
		width : '100%',
		right : 0
	});
	$.playerView.add($.playerView.darker);

	$.add($.listView);
	$.add($.playerView);
	$.addEventListener('close', function() {
		audioPlayer.pause();
		audioPlayer.stop();
		audioPlayer.release();
		audioPlayer = null;
	});

	$.addEventListener('open', function(_event) {
		if (Ti.Android) {
			var АктйонБар = require('com.alcoapps.actionbarextras');
			АктйонБар.setTitle('Tierstimmenarchiv');
			АктйонБар.setFont('Helvetica-Bold');
			АктйонБар.setSubtitle(record.species);
			АктйонБар.displayUseLogoEnabled = false;
			АктйонБар.setStatusbarColor(COLOR.BROWN);
			АктйонБар.backgroundColor = COLOR.DARKGREEN;
			_event.source.getActivity().actionBar.displayHomeAsUp = true;
			var activity = _event.source.getActivity();
			activity.actionBar.onHomeIconItemSelected = function() {
				$.close();
			};

			activity.onCreateOptionsMenu = function(_menuevent) {
				_menuevent.menu.clear();
				_menuevent.menu.add({
					title : 'Favorite',
					itemId : 1,
					showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
					checked : false,
					icon : Ti.App.Android.R.drawable.ic_action_favorite_add
				}).addEventListener("click", function(_e) {
					_e.source.icon = (_e.source.icon == Ti.App.Android.R.drawable.ic_action_favorite_add) ? Ti.App.Android.R.drawable.ic_action_favorite : Ti.App.Android.R.drawable.ic_action_favorite_add;
					alert('Merkzettel ist noch nicht umgesetzt.');
				});

				_menuevent.menu.add({
					title : 'Klingelton',
					itemId : 2,
					showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
					icon : Ti.App.Android.R.drawable.ic_action_ringtone
				}).addEventListener("click", function() {
					alert('Klingelton ist noch nicht umgesetzt.');
				});

			};
		}
	});
	$.open();
	audioPlayer.start();
};

