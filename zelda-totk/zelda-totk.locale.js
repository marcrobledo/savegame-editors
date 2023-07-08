/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor i18n v20230605

	by Marc Robledo 2023
	translated item names compiled by tingod
*/

var Locale=(function(ui){
	const VALID_LOCALES=['en','fr','fr_alt','de','it','es','es_alt','nl','ru','ja','ko','zh','zh_alt'];
	var _currentLocale=null;
	var _currentLocaleAlt=null;
	var _cachedLocales={};

	var _setSelectLanguageStatus=function(status){
		if(document.getElementById('select-language'))
			document.getElementById('select-language').disabled=!status;	
	};
	var _setLocale=function(langCode){
		_currentLocale=_cachedLocales[langCode];
		if(/_alt$/.test(langCode)){
			_currentLocaleAlt=_cachedLocales[langCode.replace('_alt','')];
		}else{
			_currentLocaleAlt=null;
		}

		document.querySelectorAll('*[data-translate-title]')
			.forEach(function(elem){
				elem.setAttribute('title','');
				elem.setAttribute('data-tooltip', Locale._(elem.getAttribute('data-translate-title')));
			});
		
		document.querySelectorAll('*[data-translate]')
			.forEach(function(elem){
				elem.innerHTML=Locale._(elem.getAttribute('data-translate'));
			});
	}

	return{
		_:function(str){
			if(_currentLocale && _currentLocale[str])
				return _currentLocale[str];
			else if(_currentLocaleAlt && _currentLocaleAlt[str])
				return _currentLocaleAlt[str];
			return str;
		},
		set:function(langCode){
			if(_cachedLocales[langCode]){
				_setLocale(langCode);
			}else if(VALID_LOCALES.indexOf(langCode)!==-1){
				var langCodeAll=langCode.replace('_alt','');

				ui.toast('Loading '+langCodeAll.toUpperCase()+' translation...', 'locale');
				_setSelectLanguageStatus(false);

				var script=document.createElement('script');
				script.type='text/javascript';
				script.onload=function(){
					ui.toast(false, 'locale');
					_setSelectLanguageStatus(true);
					_setLocale(langCode);
				}
				script.onerror=function(){
					ui.toast('Unexpected error: can\'t download locale file', 'locale');
					_setSelectLanguageStatus(true);
				}
				script.src='./locale/zelda-totk.locale.'+langCodeAll+'.js';
				document.head.appendChild(script);
			}
		},
		add:function(langCode, strings){
			_cachedLocales[langCode]=strings;
		}
	}
}(UI));


function _(str){
	return Locale._(str);
}