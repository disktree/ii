
import js.Browser.console;
import js.Browser.document;
import js.Browser.window;
import js.html.Element;
import js.html.AudioElement;
import js.html.audio.AudioContext;
import js.html.audio.AnalyserNode;
import js.lib.Uint8Array;
import js.html.CanvasElement;
import js.html.CanvasRenderingContext2D;
import js.html.InputElement;
import js.html.TimeElement;

@:keep
class Audioplayer {

	static var player : Element;
	static var audio : AudioElement;
	static var animationFrameId : Int;
	static var analyser : AnalyserNode;
	static var audioContext : AudioContext;
	static var timeData : Uint8Array;
	static var canvas : CanvasElement;
	static var ctx : CanvasRenderingContext2D;
	static var isPlaying = false;
	static var time : TimeElement;
	static var range : InputElement;

	@:expose
	static function init() {

		trace('Init audioplayer');

		var player = document.querySelector( 'div.audioplayer' );
		if( player == null ) {
			console.warn('Audioplayer element not found');
			return;
		}

		audio = cast player.querySelector('audio');
		audio.crossOrigin = "anonymous";
		audio.preload = "none";
		audio.oncanplaythrough = e -> {
			console.log(e);
		}
		audio.onended = e -> {
			console.log(e);
			isPlaying = false;
		}
		audio.onplay = e -> {
			console.log(e);
			player.classList.add('playing');
		}
		audio.onpause = e -> {
			console.log(e);
			isPlaying = false;
			player.classList.remove('playing');
			//window.cancelAnimationFrame( animationFrameId );
			//animationFrameId = null;
		}
		audio.onplaying = e -> {
			trace(e);
			if( audioContext == null ) {
				audioContext = new AudioContext();
				analyser = audioContext.createAnalyser();
				analyser.fftSize = 2048;
				analyser.connect( audioContext.destination );
				timeData = new Uint8Array( analyser.frequencyBinCount );
				var mediaSource = audioContext.createMediaElementSource( audio );
				mediaSource.connect( analyser );
			}
			isPlaying = true;
		}

		time = cast player.querySelector('time');
		var controls = player.querySelector('.controls');
		var stopButton = controls.querySelector('.ic-pause');
		var playButton = controls.querySelector('.ic-play');
		range = cast controls.querySelector('input[type="range"]');

		playButton.onclick = function(e){
			console.log(e);
			play();
		}
		stopButton.onclick = function(e){
			console.log(e);
			audio.pause();
		}

		canvas = cast player.querySelector("canvas.spectrum");
		ctx = canvas.getContext2d();

		var playlist = document.body.querySelector( 'ol.playlist' );

		for( li in playlist.children ) {
			li.onclick = e -> {
				load( li.getAttribute('data-track')  );
			}
		}

		animationFrameId = window.requestAnimationFrame( update );
	}

	@:expose
	static function load( url : String ) {
		trace( 'Loading: '+ url);
		audio.src = url;
		audio.play();
	}

	@:expose
	static function play() {
		audio.play();
	}

	static function update( _time : Float ) {
		animationFrameId = window.requestAnimationFrame( update );
		if( isPlaying ) {
			var percent = audio.currentTime / audio.duration;
			time.textContent = Std.int( audio.currentTime )+"/"+Std.int( audio.duration );
			range.value = ''+percent;
			analyser.getByteTimeDomainData( timeData );
			ctx.clearRect( 0, 0, canvas.width, canvas.height );
			var v : Float, x : Float, y : Float;
			var hw = canvas.width/2;
			var hh = canvas.height/2;
			ctx.strokeStyle = Theme.current.f_high;
			ctx.lineWidth = 1;
			ctx.beginPath();
			for( i in 0...analyser.frequencyBinCount ) {
				v = i / 180 * Math.PI;
				x = Math.cos(v) * timeData[i];
				y = Math.sin(v) * timeData[i];
				ctx.lineTo( hw + x, hh + y );
			}
			ctx.stroke();
		}
	}

}
