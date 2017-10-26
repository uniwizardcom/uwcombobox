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
function UWCombobox(confObj) {

	function ObjectIsEmpty(obj) {
	    for(var prop in obj) {
	        if(obj.hasOwnProperty(prop)) {
	        	return false;
	        }
	    }

	    return true;
	}
	
	var publicObj = {
			/** selected value or null */
			value: null,
			
			/** putting value for filter results */
			filerValue: null,
			
			/** key (column) name for value from data record */
			keyName: (typeof confObj.keyName != 'undefined') ? confObj.keyName : null,
			
			/** key (value) name for data record */
			keyValue: (typeof confObj.keyValue != 'undefined') ? confObj.keyValue : null,
			
			/** method to force load data from source */
			load: null,
			
			url: (typeof confObj.url != 'undefined') ? confObj.url : null
	};
	
	if(typeof confObj.onchange == 'function') {
		publicObj.onchange = confObj.onchange;
	}
	
	var privateObj = {
			ajax: null,
			background: null,
			viewContent: null,
			viewContentText: null,
			listContainer: null,
			buttonsContainer: null,
			listView: null,
			listItemsView: null,
			
			divContainer: null,
			dataCollection: {},
			buttonsDefault: {
				'xxx': {
					'className': ' arrow-down',
					'width': '20px'
				}
			},
			buttonOpen: null,
			
			prepareContainer: function(inp) {
				var width = UWCss(inp).getWidthOutside(), height = UWCss(inp).getHeightOutside();
				
				this.divContainer = document.createElement('div');
				this.divContainer.style.width = width+'px';
				this.divContainer.style.height = height+'px';
				this.divContainer.style.overflow = 'hidden';
				
				inp.parentNode.appendChild(this.divContainer);
				this.divContainer.appendChild(inp);
				inp.style.display = 'none';
				
				this.viewContent = document.createElement('div');
				this.viewContent.className = 'uwcombobox-control';
				this.viewContent.style.width = width+'px';
				this.viewContent.style.height = height+'px';
				this.viewContentText = document.createElement('div');
				this.viewContentText.className = 'uwcombobox-contenttext';
				this.viewContent.appendChild(this.viewContentText);
				this.divContainer.appendChild(this.viewContent);
				
				var tthis = this;
				this.viewContent.onclick = function(){
					tthis.createBackground(tthis.divContainer);
				};
			},
			refreshView: function() {
				this.listView = document.createElement('div');
				this.listView.className = 'uwcombobox-list';
				this.listView.style.top = '0px';
				this.listView.style.left = '0px';
				this.listView.style.position = 'fixed';
				this.listView.style.zIndex = '1001';
				
				var input = document.createElement('input');
				input.setAttribute('type','text');
				input.onchange = function(){
					publicObj.filerValue = this.value;
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
					if(!privateObj.ajax) {
						publicObj.load();
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
					if(privateObj.ajax) {
						privateObj.ajax.abort();
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
				
				this.listView.appendChild(inputContainer);
				
				this.listContainer = document.createElement('div');
				this.listContainer.className = 'uwcombobox-list-container';
				this.listContainer.style.width = '100%';
				this.listContainer.style.maxHeight = '200px';
				this.listContainer.style.overflowX = 'hidden';
				this.listContainer.style.overflowY = 'auto';
				
				this.listView.appendChild(this.listContainer);
				document.body.appendChild(this.listView);

				var inputContainerWidth = UWCss(inputContainer).getWidthOutside();
				var h = UWCss(inputContContainer).getHeightOutside();
				buttonDom.style.width = h+'px';
				buttonDom.style.height = h+'px';
				
				var buttonContainerWidth = UWCss(buttonContainer).getWidthOutside();
				UWCss(inputContContainer).setWidthOutside(inputContainerWidth - buttonContainerWidth);
				buttonContainer.style.height = h+'px';
				
				this.refreshListView();
			},

			createBackground: function(clickedObject) {
				this.background = document.createElement('div');
				this.background.style.top = '0px';
				this.background.style.left = '0px';
				this.background.style.position = 'fixed';
				this.background.style.zIndex = '1000';
				this.background.className = 'background';
				document.body.appendChild(this.background);
				
				this.resizeBackground();
				this.background.onclick = function(){
					this.parentNode.removeChild(this);
					privateObj.listView.parentNode.removeChild(privateObj.listView);
				}
				this.refreshView();
				
				var offset = clickedObject.getBoundingClientRect();
				this.listView.style.left = (offset.left)+'px';
				this.listView.style.top = (offset.top + offset.height)+'px';
				
				if((typeof publicObj.load == 'function') && ObjectIsEmpty(privateObj.dataCollection)) {
					publicObj.load();
				}
			},
			resizeBackground: function() {
				if(this.background) {
					var
						width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
						height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
					;
					this.background.style.width = width+'px';
					this.background.style.height = height+'px';
				}
			},
			refreshListView: function() {
				if(this.listItemsView) {
					this.listItemsView.parentNode.removeChild(this.listItemsView);
				}
				if(this.listContainer) {
					this.listItemsView = document.createElement('ul');
					this.listContainer.appendChild(this.listItemsView);
					this.listItemsView.innerHTML = '';
					this.refreshValueOnView();
				}
			},
			refreshValueOnView: function() {
				var tthis = this;
				function resetItems() {
					var liList = tthis.listItemsView.getElementsByTagName('li');
					for(var i=0; i<liList.length; i++) {
						liList[i].className = '';
					}
				}
				for(var i=0; i<this.dataCollection.length; i++) {
					if(this.listItemsView) {
						var item = document.createElement('li');
						item.setAttribute('uwcombobox-list-data', this.dataCollection[i][publicObj.keyName]);
						item.innerHTML = this.dataCollection[i][publicObj.keyValue];
						item.onclick = function(){
							resetItems();
							publicObj.value = this.getAttribute('uwcombobox-list-data');
							tthis.viewContentText.innerHTML = this.innerHTML;
							confObj.input.value = publicObj.value;
							this.className = 'visited';
							tthis.close();
							setTimeout(function(){
								if(typeof publicObj.onchange == 'function') {
									try {
										publicObj.onchange(this);
									}
									catch(e){
										console.log(e);
									}
								}
							}, 100);
						};
						if(confObj.input.value == this.dataCollection[i][publicObj.keyName]) {
							item.className = 'visited';
						}
						this.listItemsView.appendChild(item);
					}
					
					if(confObj.input.value == this.dataCollection[i][publicObj.keyName]) {
						this.viewContentText.innerHTML = this.dataCollection[i][publicObj.keyValue];
						publicObj.value = confObj.input.value;
					}
				}
			},
			close: function() {
				if(this.background !== null) {
					this.background.onclick();
					this.background = null;
				}
			}
	};
	privateObj.prepareContainer(confObj.input);

	for(var buttonKey in confObj.buttons) {
		privateObj.buttonsDefault[buttonKey] = confObj.buttons[buttonKey];
	}
	
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
				buttonDom.uwcombobox = publicObj;
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
			privateObj.createBackground(privateObj.divContainer);
		};
		
		privateObj.viewContent.parentNode.appendChild(privateObj.buttonsContainer);
		privateObj.viewContent.style.float = 'left';
		
		var widthButtonsContainer = UWCss(privateObj.buttonsContainer).getWidthOutside();
		var widthParentContainer = UWCss(privateObj.viewContent.parentNode).getWidthOutside();
		
		privateObj.viewContent.style.height = h+'px';
		UWCss(privateObj.viewContent).setWidthInside(widthParentContainer - widthButtonsContainer);
		privateObj.buttonsContainer.style.height = h+'px';
	}
	
	/** method to force load data from source */
	publicObj.load = function(onstart) {
		if(!this.url) {
			return;
		}

		if(privateObj.ajax) {
			privateObj.ajax.abort();
		}
		
		privateObj.ajax = UWAjax({
			url: this.url,
			method: 'post',
			contentType: 'json',
			data: {
				'filter': this.filerValue
			},
			onsuccess: function(data){
				privateObj.dataCollection = JSON.parse(data);
				privateObj.refreshListView();
				if(onstart === true) {
					privateObj.refreshValueOnView();
				}
			},
			oncompleted: function(){
				privateObj.ajax = null;
			}
		});
		privateObj.ajax.start();
	};
	
	/** loading data on start */
	publicObj.load(true);
	
	/** method to programically open list */
	publicObj.open = function() {
		privateObj.createBackground();
	};
	
	/** method to programically close list */
	publicObj.close = function() {
		privateObj.close();
	};
	
	window.addEventListener('resize', function(event){
		privateObj.resizeBackground();
	});
	
	return publicObj;
}

