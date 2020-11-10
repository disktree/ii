import js.html.File;
import js.Browser.console;
import js.Browser.document;
import js.Browser.window;

using haxe.io.Path;

class App {

	static function main() {

		console.log("%cDISKTREE.NET", "color:#000");

		document.addEventListener('DOMContentLoaded', e -> {
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
		});
	}
}
