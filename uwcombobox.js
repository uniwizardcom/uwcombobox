/**
 * @author Uniwizard Wojciech Niewiadomski
 * @package UWCombobox
 * @param confObj = {
 * 	value		- selected value or null
 * 	load		- method to force load data from source
 *  open		- method to programically open list
 *  close		- method to programically close list
 * 	input		- native JS object to text input element
 * 	buttons		- extra buttons for list
 * 	onchange	- event on switch to other value from list
 * }
 * 
 * TODO: Multi select (with Ctrl button)
 * TODO: Multi select, with:
 * - check for multiselect
 * - select list in other view
 * 
 * @returns
 */

function UWLoadScript(type, attributes, callback) {
		var s = document.createElement(type);
		for(var a in attributes) {
			s[a] = attributes[a];
		}

		if(s.onreadystatechange === null) {
			s.onreadystatechange = function(){
				if(this.readyState == 'complete' || this.readyState == 'loaded') {
					if(typeof callback == 'function') {
						callback();
					}
				}
			}
		}
		else if(s.onload === null) {
			s.onload = function(){
				if(typeof callback == 'function') {
					callback();
				}
			}
		}
		
		document.getElementsByTagName('head')[0].appendChild(s);
	}

function UWCombobox(confObj) {
	
	var publicObj = {
			/** selected value or null */
			value: null,
			
			/** selected recordValue or null */
			recordValue: null,
			
			/** putting value for filter results */
			filerValue: null,
			
			/** key (column) name for value from data record */
			keyName: (typeof confObj.keyName != 'undefined') ? confObj.keyName : null,
			
			/** key (value) name for data record */
			keyValue: (typeof confObj.keyValue != 'undefined') ? confObj.keyValue : null,
			
			/** method to force load data from source */
			load: null,
			
			url: (typeof confObj.url != 'undefined') ? confObj.url : null,
			
			viewName: ((Object.prototype.toString.call(confObj.view) === '[object String]') ? confObj.view.trim() : '').length ? confObj.view.trim() : 'default'
	};
	
	if(typeof confObj.onchange == 'function') {
		publicObj.onchange = confObj.onchange;
	}
	
	var t = (new Date()).getTime();
	
	UWLoadScript('link', {
		'href': './view/'+publicObj.viewName+'/uwcomboboxview.css?t='+t,
		'rel': 'stylesheet'
	}, function() {
		UWLoadScript('script', {
			'src': './view/'+publicObj.viewName+'/uwcomboboxview.js?t='+t,
			'async': 1,
			'type': 'text/javascript'
		}, function() {
			
			var privateObj = {
					view: UWComboboxView(publicObj),
					buttonOpen: null
			};

			privateObj.view.prepareContainer(confObj.input);
			
			privateObj.view.confValues = {
					'keyName': publicObj.keyName,
					'keyValue': publicObj.keyValue,
			};
			
			/** method to force load data from source */
			publicObj.load = function(onstart, buttonDom) {
				if(!publicObj.url) {
					return;
				}

				if(privateObj.view.ajax) {
					privateObj.view.ajax.abort();
				}
				
				var currentClassName;
				if(buttonDom) {
					currentClassName = buttonDom.className;
					buttonDom.className = currentClassName+' loading';
				}
				privateObj.view.ajax = UWAjax({
					url: publicObj.url,
					method: 'post',
					contentType: 'json',
					data: {
						'filter': this.filerValue
					},
					onsuccess: function(data){
						privateObj.view.dataCollection = JSON.parse(data);
						privateObj.view.refreshListView();
						if(onstart === true) {
							privateObj.view.refreshValueOnView();
						}
					},
					oncompleted: function(){
						privateObj.view.ajax = null;
						if(buttonDom) {
							buttonDom.className = currentClassName;
						}
					}
				});
				privateObj.view.ajax.start();
			};
			privateObj.view.setButtons(confObj.buttons);
			privateObj.view.load = publicObj.load;
			
			/** loading data on start */
			publicObj.load(true);
			
			/** method to programically open list */
			publicObj.open = function() {
				privateObj.view.createBackground();
				if((typeof this.load == 'function') && ObjectIsEmpty(privateObj.view.dataCollection)) {
					this.load();
				}
			};
			
			/** method to programically close list */
			publicObj.close = function() {
				privateObj.view.close();
			};
			
			window.addEventListener('resize', function(event){
				privateObj.view.resizeBackground();
			});
		});
	});
	
	return publicObj;
}

