const Locale = ( function ( ui ) {
	const VALID_LOCALES = [ 'de', 'en' ];
	let _currentLocale = null;
	let _currentLocaleAlt = null;
	const _cachedLocales = {};

	const _setSelectLanguageStatus = function ( status ) {
		if ( document.getElementById( 'select-language' ) ) {
			document.getElementById( 'select-language' ).disabled = !status;
		}
	};
	const _setLocale = function ( langCode ) {
		_currentLocale = _cachedLocales[ langCode ];
		if ( /_alt$/.test( langCode ) ) {
			_currentLocaleAlt = _cachedLocales[ langCode.replace( '_alt', '' ) ];
		} else {
			_currentLocaleAlt = null;
		}

		document.querySelectorAll( '*[data-translate-title]' ).forEach( ( elem ) => {
			elem.setAttribute( 'title', '' );
			elem.setAttribute( 'data-tooltip', Locale._( elem.getAttribute( 'data-translate-title' ) ) );
		} );

		document.querySelectorAll( '*[data-translate]' ).forEach( ( elem ) => {
			elem.textContent = Locale._( elem.getAttribute( 'data-translate' ) );
		} );
	};

	return {
		_: function ( str ) {
			if ( _currentLocale && _currentLocale[ str ] ) {
				return _currentLocale[ str ];
			} else if ( _currentLocaleAlt && _currentLocaleAlt[ str ] ) {
				return _currentLocaleAlt[ str ];
			}
			return str;
		},
		set: function ( langCode ) {
			if ( langCode === 'qqx' || _cachedLocales[ langCode ] ) {
				_setLocale( langCode );
			} else if ( VALID_LOCALES.includes( langCode ) ) {
				const langCodeAll = langCode.replace( '_alt', '' );

				// ui.toast( `Loading ${ langCodeAll.toUpperCase() } translation...`, 'locale' );
				_setSelectLanguageStatus( false );

				const script = document.createElement( 'script' );
				script.type = 'text/javascript';
				script.onload = function () {
					// ui.toast( false, 'locale' );
					_setSelectLanguageStatus( true );
					_setLocale( langCode );
				};
				script.onerror = function () {
					// ui.toast( 'Unexpected error: can\'t download locale file', 'locale' );
					_setSelectLanguageStatus( true );
				};
				script.src = `./locale/${ langCodeAll }.js`;
				document.head.appendChild( script );
			}
		},
		add: function ( langCode, strings ) {
			_cachedLocales[ langCode ] = strings;
		}
	};
}( UI ) );
