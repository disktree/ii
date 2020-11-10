
import haxe.Json;
import js.Browser.console;
import js.Browser.document;
import js.Browser.window;
import js.html.File;
import js.html.IFrameElement;

using haxe.io.Path;

class App {

	static function main() {

		console.log("%cDISKTREE.NET", "color:#000");

		document.addEventListener( 'DOMContentLoaded', e -> {
			var pageTheme = document.head.querySelector('meta[name="theme"]');
			if( pageTheme == null ) {
				var theme = Theme.loadLocal();
				if( theme != null ) {
					Theme.apply( theme );
				}
			} else {
				trace('Found local theme');
			}
			window.addEventListener( 'dragover', e -> {
				e.stopPropagation();
				e.preventDefault();
				e.dataTransfer.dropEffect = 'copy';
				document.body.classList.add( 'dragover' );
			});
			/* document.body.addEventListener( 'dragenter', e -> {
				trace("DRAGENTER");
				e.stopPropagation();
				e.preventDefault();
			}); */
			window.addEventListener( 'dragleave', e -> {
				trace("dragleave");
				e.stopPropagation();
				e.preventDefault();
				document.body.classList.remove( 'dragover' );
			});
			window.addEventListener( 'drop', e -> {
				e.preventDefault();
				e.stopPropagation();
				document.body.classList.remove( 'dragover' );
				var file : File = e.dataTransfer.files[0];
				if( file != null && file.name.extension() == 'svg' ) {
					trace(file);
					Theme.readSVGFile( file, true, svg -> {
						Theme.applySVG( svg );
					} );
				}
			});

			/*
			var iframe : IFrameElement = cast document.body.querySelector( 'main article iframe' );
			if( iframe != null ) {
				var source = null;
				window.addEventListener( 'message', function(e){
					console.debug(e);
					var msg : Dynamic = try Json.parse( e.data ) catch(e:Dynamic) {
						trace(e);
						return;
					}
					console.debug(msg);
					source = e.source;
					//var title = document.body.querySelector( 'main .title' );
					//title.textContent = msg.channel;
					//e.source.posMessage( Json.stringify( { channel: 'sander-2', video: 1 } ) );
				}, false );

				window.addEventListener( 'keydown', e -> {
					switch e.key {
					case 'd':
						trace(source);
						if( source != null ) {
							source.postMessage( Json.stringify( { channel: 'sander-2', video: 1 } ) );
						}
						//iframe.postMessage( { channel: 'sander-2', video: 1 } );
					default:
					}
				});
			}
			*/
		});
	}
}
