var TSA = new (require('model/tsa.adapter'))();
var CanvasObject = require('com.wwl.canvas');
var audioRecorder = require('titutorial.audiorecorder');
var LDF = Ti.Platform.displayCaps.logicalDensityFactor;
var CANVASHEIGHT = 320 / LDF;

var canvasready = false;

module.exports = function() {
	var $ = Ti.UI.createWindow({
		backgroundColor : COLOR.LIGHTGREEN,
	});
	$.canvascontainer = Ti.UI.createScrollView({
		scrollType : 'horizontal',
		width:Ti.UI.FILL,
		contentWidth:Ti.UI.SIZE,
		top:0,
		height : CANVASHEIGHT / LDF,
		contentHeight : CANVASHEIGHT / LDF
	});
	$.canvas = CanvasObject.createCanvasView({
		backgroundColor : 'black',
		top : 0,
		left : 0,
		width : 3000,
		height : Ti.UI.FILL,
	});
	$.canvascontainer.add($.canvas);
	$.add($.canvascontainer);
	$.canvas.addEventListener('load', function() {
		$.canvas.lineWidth = LDF;
		$.canvas.strokeStyle = '#3BFC34';
		$.canvas.antiAliasing = true;
		canvasready = true;
	});
	audioRecorder.startRecording({
		outputFormat : audioRecorder.OutputFormat_MPEG_4,
		audioEncoder : audioRecorder.AudioEncoder_AAC,
		directoryName : "recordings",

		maxDuration : 60000,
		success : function(e) {
			clearInterval(cron);
		},
		error : function(d) {
			alert("error => " + e.message);
			Ti.API.info("error is => " + JSON.stringify(d));
		}
	});
	var cron = setInterval(getLevel, 50);
	var tick = 0;
	function getLevel() {
		if (audioRecorder.isRecording() && $.canvas && canvasready == true) {
			var level = audioRecorder.getMaxAmplitude() / 6000;
			$.canvas.beginPath();
			$.canvas.moveTo(tick, CANVASHEIGHT / 2 - level * CANVASHEIGHT);
			$.canvas.lineTo(tick, CANVASHEIGHT / 2 + level * CANVASHEIGHT);
			tick = tick + LDF;
			$.canvas.closePath();
			$.canvas.stroke();
		}
	}


	$.addEventListener('close', function(_event) {
		clearInterval(cron);
		audioRecorder.stopRecording();
		$.canvas = null;
		canvasready = false;
	});
	$.addEventListener('open', function(_event) {
		if (Ti.Android) {
			var АктйонБар = require('com.alcoapps.actionbarextras');
			АктйонБар.setTitle('Tierstimmenarchiv');
			АктйонБар.setFont('Helvetica-Bold');
			АктйонБар.setSubtitle('Aufnahme');
			АктйонБар.displayUseLogoEnabled = false;
			АктйонБар.setStatusbarColor(COLOR.BROWN);
			АктйонБар.backgroundColor = COLOR.DARKGREEN;
			_event.source.getActivity().actionBar.displayHomeAsUp = true;
			var activity = _event.source.getActivity();
			activity.actionBar.onHomeIconItemSelected = function() {
				$.close();
			};
		}
	});
	return $;
};

