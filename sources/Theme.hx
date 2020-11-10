
import haxe.Json;
import js.html.DOMParser;
import js.html.File;
import js.html.FileReader;
import js.html.svg.SVGElement;
import js.Browser.document;
import js.Browser.window;

typedef ThemeData = {

	/** Application Background. **/
	var background : String;

	/** Foreground, high-contrast. **/
	var f_high : String;

	/** Foreground, medium-contrast. **/
	var f_med : String;

	/** Foreground, low-contrast. **/
	var f_low : String;

	/** Foreground, for modals and overlays. **/
	var f_inv : String;

	/** Background, high-contrast. **/
	var b_high : String;

	/** Background, medium-contrast. **/
	var b_med : String;

	/** Background, low-contrast. **/
	var b_low : String;

	/** Background, for modals and overlays. **/
	var b_inv : String;
}

class Theme {

	static inline var STORAGE_ID = 'disktree_ii_theme';

	public static var current(default,null) : ThemeData;

	public static function loadLocal() : ThemeData {
		var _theme = window.localStorage.getItem(STORAGE_ID);
		return (_theme == null) ? null : Json.parse( _theme );
	}

	public static function saveLocal( theme : ThemeData ) {
		window.localStorage.setItem( STORAGE_ID, Json.stringify(theme) );
	}

	@:expose
	public static function apply( theme : ThemeData, save = true ) {
		var s = document.documentElement.style;
		s.setProperty("--background", theme.background);
		s.setProperty("--f_high", theme.f_high);
		s.setProperty("--f_med", theme.f_med);
		s.setProperty("--f_low", theme.f_low);
		s.setProperty("--f_inv", theme.f_inv);
		s.setProperty("--b_high", theme.b_high);
		s.setProperty("--b_med", theme.b_med);
		s.setProperty("--b_low", theme.b_low);
		s.setProperty("--b_inv", theme.b_inv);
		current = theme;
		if( save ) saveLocal( theme );
		return current;
	}

	@:expose
	public static function applySVG( svg : SVGElement, ?save : Bool ) {
		var theme = {
			background: svg.getElementById('background').getAttribute('fill'),
			f_high: svg.getElementById('f_high').getAttribute('fill'),
			f_med: svg.getElementById('f_med').getAttribute('fill'),
			f_low: svg.getElementById('f_low').getAttribute('fill'),
			f_inv: svg.getElementById('f_inv').getAttribute('fill'),
			b_high: svg.getElementById('b_high').getAttribute('fill'),
			b_med: svg.getElementById('b_med').getAttribute('fill'),
			b_low: svg.getElementById('b_low').getAttribute('fill'),
			b_inv: svg.getElementById('b_inv').getAttribute('fill')
		};
		return apply( theme, save );
	}

	public static function applySVGFile( file : File, ?save : Bool ) {
		readSVGFile( file, save, svg -> applySVG( svg ) );
	}

	public static function readSVGFile( file : File, ?save : Bool, callback : SVGElement->Void ) {
		var reader = new FileReader();
		reader.onload = e -> {
			var svg : SVGElement = cast new DOMParser().parseFromString( e.target.result, TEXT_XML );
			callback( svg );
		}
		reader.readAsText( file, 'UTF-8' );
	}

}
