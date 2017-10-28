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
 * TODO: Mobile (screen less 960px) wersion
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

function UWComboboxViewDefault(directParent) {
	var privateObj = {
			viewContent: null,
			viewContentText: null,
			listContainer: null,
			buttonsContainer: null,
			listView: null,
			listItemsView: null,
			
			divContainer: null,
			background: null,
			buttonsDefault: {
				'defaultArrowDown': {
					'className': ' arrow-down',
					'width': '20px'
				}
			}
		};
	
	var publicObj = {
			ajax: null,
			load: null,
			dataCollection: {},
			domInput: null,
			
			setButtons: function(buttonsList) {
				for(var buttonKey in buttonsList) {
					privateObj.buttonsDefault[buttonKey] = buttonsList[buttonKey];
				}
				this.prepareButtons();
			},
			
			createBackground: function() {
				privateObj.background = document.createElement('div');
				privateObj.background.style.top = '0px';
				privateObj.background.style.left = '0px';
				privateObj.background.style.position = 'fixed';
				privateObj.background.style.zIndex = '1000';
				privateObj.background.className = 'background';
				document.body.appendChild(privateObj.background);
				
				this.resizeBackground();
				var tthis = this;
				privateObj.background.onclick = function(){
					this.parentNode.removeChild(this);
					tthis.closeListView();
				}
				this.refreshView();
				
				var offset = privateObj.divContainer.getBoundingClientRect();
				privateObj.listView.style.left = (offset.left)+'px';
				privateObj.listView.style.top = (offset.top + offset.height)+'px';
				
			},
			resizeBackground: function() {
				if(privateObj.background) {
					var
						width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
						height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
					;
					privateObj.background.style.width = width+'px';
					privateObj.background.style.height = height+'px';
				}
			},
			close: function() {
				if(privateObj.background !== null) {
					privateObj.background.onclick();
					privateObj.background = null;
				}
			},
			
			prepareButtons: function() {
				var tthis = this;
				if(typeof privateObj.buttonsDefault == 'object' && !ObjectIsEmpty(privateObj.buttonsDefault)) {
					privateObj.buttonsContainer = document.createElement('div');
					privateObj.buttonsContainer.className = 'uwcombobox-buttons';
					privateObj.buttonsContainer.style.float = 'right';

					var w = UWCss(privateObj.viewContent).getWidthOutside(),
						h = UWCss(privateObj.viewContent).getHeightInside()
					;
					
					for(var buttonKey in privateObj.buttonsDefault) {
						var button = privateObj.buttonsDefault[buttonKey], className = 'functional-button';
						var buttonDom = document.createElement('div');
						buttonDom.style.float = 'left';
						if(typeof button.title != 'undefined') {
							buttonDom.innerHTML = button.title;
							buttonDom.title = button.title;
						}
						if(typeof button.className != 'undefined') {
							className += button.className;
						}
						if(typeof button.className != 'undefined') {
							className += button.className;
						}
						buttonDom.className = className;
						if(typeof button.click == 'function') {
							buttonDom.onclick = button.click;
							buttonDom.sender = button;
							buttonDom.uwcombobox = directParent;
						}
						privateObj.buttonsContainer.appendChild(buttonDom);
						buttonDom.style.height = h+'px';
						if(typeof button.width != 'undefined') {
							buttonDom.style.width = button.width;
						}
						
						if(!privateObj.buttonOpen) {
							privateObj.buttonOpen = buttonDom;
						}
					}
					
					privateObj.buttonOpen.onclick = function(){
						tthis.createBackground();
					};
					
					privateObj.viewContent.parentNode.appendChild(privateObj.buttonsContainer);
					privateObj.viewContent.style.float = 'left';
					
					var widthButtonsContainer = UWCss(privateObj.buttonsContainer).getWidthOutside();
					var widthParentContainer = UWCss(privateObj.viewContent.parentNode).getWidthOutside();
					
					privateObj.viewContent.style.height = h+'px';
					UWCss(privateObj.viewContent).setWidthInside(widthParentContainer - widthButtonsContainer);
					privateObj.buttonsContainer.style.height = h+'px';
				}
			},
			
			prepareContainer: function(inp) {
				var width = UWCss(inp).getWidthOutside(),
					height = UWCss(inp).getHeightOutside();
				
				this.domInput = inp;
				privateObj.divContainer = document.createElement('div');
				privateObj.divContainer.style.width = width+'px';
				privateObj.divContainer.style.height = height+'px';
				privateObj.divContainer.style.overflow = 'hidden';
				privateObj.divContainer.style.display = 'inline-block';
				
				inp.parentNode.appendChild(privateObj.divContainer);
				privateObj.divContainer.appendChild(inp);
				inp.style.display = 'none';
				
				privateObj.viewContent = document.createElement('div');
				privateObj.viewContent.className = 'uwcombobox-control';
				privateObj.viewContent.style.width = width+'px';
				privateObj.viewContent.style.height = height+'px';
				privateObj.viewContentText = document.createElement('div');
				privateObj.viewContentText.className = 'uwcombobox-contenttext';
				privateObj.viewContent.appendChild(privateObj.viewContentText);
				privateObj.divContainer.appendChild(privateObj.viewContent);
				
				var tthis = this;
				privateObj.viewContent.onclick = function(){
					tthis.createBackground();
				};
			},
			refreshView: function() {
				var tthis = this;
				
				privateObj.listView = document.createElement('div');
				privateObj.listView.className = 'uwcombobox-list';
				privateObj.listView.style.top = '0px';
				privateObj.listView.style.left = '0px';
				privateObj.listView.style.position = 'fixed';
				privateObj.listView.style.zIndex = '1001';
				
				var input = document.createElement('input');
				input.setAttribute('type','text');
				input.onchange = function(){
					tthis.filerValue = this.value;
				};
				
				var inputContainer = document.createElement('div');
				inputContainer.className = 'uwcombobox-list-input';
				inputContainer.style.width = '100%';
				inputContainer.style.overflow = 'hidden';
				
				var inputContContainer = document.createElement('div');
				inputContContainer.style.float = 'left';
				inputContContainer.style.width = 'auto';
				inputContContainer.style.overflow = 'hidden';
				inputContContainer.appendChild(input);
				inputContainer.appendChild(inputContContainer);

				var tm = 0;
				var buttonDom = document.createElement('div');
				buttonDom.className = 'reload-button';
				buttonDom.onclick = function(){
					console.log(tthis.ajax);
					if(!tthis.ajax) {
						tthis.load();
					}
				};
				
				function checkForPuttingSign() {
					tm = setTimeout(function(){
						tm = 0;
						input.onchange();
						buttonDom.onclick();
					}, 1000);
				}
				input.onkeyup = function(){
					if(tthis.ajax) {
						tthis.ajax.abort();
					}
					if(tm > 0) {
						clearTimeout(tm);
						tm = 0;
					}
					checkForPuttingSign();
				};
				
				var buttonContainer = document.createElement('div');
				buttonContainer.style.float = 'right';
				buttonContainer.appendChild(buttonDom);
				inputContainer.appendChild(buttonContainer);
				
				privateObj.listView.appendChild(inputContainer);
				
				privateObj.listContainer = document.createElement('div');
				privateObj.listContainer.className = 'uwcombobox-list-container';
				privateObj.listContainer.style.width = '100%';
				privateObj.listContainer.style.maxHeight = '200px';
				privateObj.listContainer.style.overflowX = 'hidden';
				privateObj.listContainer.style.overflowY = 'auto';
				
				privateObj.listView.appendChild(privateObj.listContainer);
				document.body.appendChild(privateObj.listView);

				var inputContainerWidth = UWCss(inputContainer).getWidthOutside();
				var h = UWCss(inputContContainer).getHeightOutside();
				buttonDom.style.width = h+'px';
				buttonDom.style.height = h+'px';
				
				var buttonContainerWidth = UWCss(buttonContainer).getWidthOutside();
				UWCss(inputContContainer).setWidthOutside(inputContainerWidth - buttonContainerWidth);
				buttonContainer.style.height = h+'px';
				
				this.refreshListView();
			},
			refreshListView: function() {
				if(privateObj.listItemsView) {
					privateObj.listItemsView.parentNode.removeChild(privateObj.listItemsView);
				}
				if(privateObj.listContainer) {
					privateObj.listItemsView = document.createElement('ul');
					privateObj.listContainer.appendChild(privateObj.listItemsView);
					privateObj.listItemsView.innerHTML = '';
					this.refreshValueOnView();
				}
			},
			refreshValueOnView: function() {
				var tthis = this;
				function resetItems() {
					var liList = privateObj.listItemsView.getElementsByTagName('li');
					for(var i=0; i<liList.length; i++) {
						liList[i].className = '';
					}
				}
				for(var i=0; i<this.dataCollection.length; i++) {
					if(privateObj.listItemsView) {
						var item = document.createElement('li');
						item.record = this.dataCollection[i];
						item.setAttribute('uwcombobox-list-data', item.record[this.confValues.keyName]);
						item.innerHTML = item.record[this.confValues.keyValue];
						item.onclick = function(){
							resetItems();
							directParent.value = this.record[tthis.confValues.keyName];
							directParent.recordValue = this.record;
							privateObj.viewContentText.innerHTML = this.innerHTML;
							tthis.domInput.value = tthis.value;
							this.className = 'visited';
							tthis.close();
							setTimeout(function(){
								if(typeof tthis.onchange == 'function') {
									try {
										tthis.onchange(this);
									}
									catch(e){
										console.log(e);
									}
								}
							}, 100);
						};
						if(this.domInput.value == this.dataCollection[i][this.confValues.keyName]) {
							item.className = 'visited';
						}
						privateObj.listItemsView.appendChild(item);
					}
					
					if(this.domInput.value == this.dataCollection[i][this.confValues.keyName]) {
						privateObj.viewContentText.innerHTML = this.dataCollection[i][this.confValues.keyValue];
						directParent.value = this.domInput.value;
						directParent.recordValue = this.dataCollection[i];
					}
				}
			},
			closeListView: function() {
				privateObj.listView.parentNode.removeChild(privateObj.listView);
			}
		};
	
	return publicObj;
}

function UWComboboxViewMobile() {
	var privateObj = {};
	
	var publicObj = {};
	
	return publicObj;
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
			
			viewName: ((Object.prototype.toString.call(confObj.viewName) === '[object String]') ? confObj.viewName.trim() : '').length ? confObj.viewName : 'default'
	};
	
	if(typeof confObj.onchange == 'function') {
		publicObj.onchange = confObj.onchange;
	}
	
	var privateObj = {
			view: UWComboboxViewDefault(publicObj),
			buttonOpen: null
	};
	
	privateObj.view.confValues = {
			'keyName': publicObj.keyName,
			'keyValue': publicObj.keyValue,
	};
	
	/** method to force load data from source */
	publicObj.load = function(onstart) {
		if(!publicObj.url) {
			return;
		}

		if(privateObj.view.ajax) {
			privateObj.view.ajax.abort();
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
			}
		});
		privateObj.view.ajax.start();
	};

	privateObj.view.prepareContainer(confObj.input);
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
	
	return publicObj;
}

