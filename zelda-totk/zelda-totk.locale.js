/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor i18n v20230604

	by Marc Robledo 2023
	translated item names compiled by tingod
*/

var Locale=(function(sge, ui){
	const VALID_LOCALES=['fr','fr_alt','de','it','es','es_alt','nl','ru','ja','ko','zh','zh_alt'];
	var _currentLocale=null;
	var _cachedLocales={};

	var _setLocale=function(langCode){
		_currentLocale=_cachedLocales[langCode];
		sge.refreshItemTabs();
	}

	return{
		_:function(str){
			return _currentLocale && _currentLocale[str]? _currentLocale[str] : null;
		},
		set:function(langCode){
			langCode=langCode.toLowerCase().trim();
			if(!langCode || langCode==='en' || _cachedLocales[langCode]){
				_setLocale(langCode);
			}else if(VALID_LOCALES.indexOf(langCode)!==-1){
				var langCodeAll=langCode.replace('_alt','');
				ui.setLoading(langCodeAll+' locale');
				fetch('./locale/zelda-totk.locale.'+langCodeAll.replace('_alt','')+'.csv')
					.then(res => res.text())
					.then(responseText => {
						var alt=false;
						_cachedLocales[langCodeAll]={};
						_cachedLocales[langCodeAll+'_alt']={};

						responseText
							.split(/\r?\n/)
							.filter(function(line){
								return /^[\s\t]*[^\#]/.test(line) && line.trim();
							})
							.map(function(line){
								return line.split(';')
							}).forEach(function(cols){
								_cachedLocales[langCodeAll][cols[0]]=cols[1];
								_cachedLocales[langCodeAll+'_alt'][cols[0]]=cols[2] || cols[1];
								if(cols[2])
									alt=true;
							});

						ui.setLoading(false);
						_setLocale(langCode);
					})
					.catch(function(){
						ui.setLoading(false);
						alert('Unexpected error: can\'t download locale file');
					});
			}
		}
	}
}(SavegameEditor, UI));
