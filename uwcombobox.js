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

function ObjectIsEmpty(obj) {
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop)) {
			return false;
		}
	}
	return true;
}

function scrollIntoView(el) {
	setTimeout(function(){
		el.scrollIntoView(true);
	}, 100);
}

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
			filterValue: null,
			
			/** key (column) name for value from data record */
			keyName: (typeof confObj.keyName != 'undefined') ? confObj.keyName : null,
			
			/** key (value) name for data record */
			keyValue: (typeof confObj.keyValue != 'undefined') ? confObj.keyValue : null,
			
			/** method to force load data from source */
			load: null,
			
			setRecordData: {},
			setRecord: function(val, keyName){
				this.setRecordData.val = val;
				this.setRecordData.keyName = ((Object.prototype.toString.call(keyName) === '[object String]') ? keyName.trim() : '').length ? keyName.trim() : this.keyName;
			},
			
			url: (typeof confObj.url != 'undefined') ? confObj.url : null,
			
			viewName: ((Object.prototype.toString.call(confObj.view) === '[object String]') ? confObj.view.trim() : '').length ? confObj.view.trim() : 'default',
			
			data: (Object.prototype.toString.call(confObj.data) === '[object Object]') ? confObj.data : {}
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
					buttonOpen: null,
					
			};

			privateObj.view.prepareContainer(confObj.input);
			
			privateObj.view.confValues = {
					'keyName': publicObj.keyName,
					'keyValue': publicObj.keyValue,
			};
			
			/** method to force load data from source */
			publicObj.load = function(onstart, buttonDom, afterSuccess) {
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
				
				publicObj.data.filter = ((Object.prototype.toString.call(this.filterValue) === '[object String]') ? this.filterValue.trim() : '');
				publicObj.data.q_word = ( publicObj.data.filter.length
						? publicObj.data.filter.split(' ')
								.map(function(value) {
									return value.trim();
								})
								.filter(function(value) {
									return value.replace(/(\r\n|\n|\r)/gm, '');
								})
						: []
					);
				
				privateObj.view.ajax = UWAjax({
					url: publicObj.url,
					method: 'post',
					contentType: 'form',
					data: publicObj.data,
					onsuccess: function(data){
						privateObj.view.dataCollection = JSON.parse(data);
						privateObj.view.refreshListView();
						if(onstart === true) {
							privateObj.view.refreshValueOnView();
						}
						if(typeof afterSuccess == 'function') {
							afterSuccess();
						}
					},
					oncompleted: function(body, status){
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
			publicObj.load(true, null, function(){
				if(!ObjectIsEmpty(publicObj.setRecordData)) {
					privateObj.view.setRecord(
							publicObj.setRecordData.val,
							publicObj.setRecordData.keyName
						);
				}
			});
			
			/** method to programically open list */
			publicObj.open = function() {
				privateObj.view.createBackground();
				if((typeof this.load == 'function') && ObjectIsEmpty(privateObj.view.dataCollection)) {
					this.load();
				}
			};
			
			/** method to programically close list */
			publicObj.close = function() {
				if(privateObj.view) {
					privateObj.view.close();
				}
			};
			
			window.addEventListener('resize', function(event){
				publicObj.close();
			});
			
			window.addEventListener('scroll', function(event){
				publicObj.close();
			});
		});
	});
	
	return publicObj;
}

