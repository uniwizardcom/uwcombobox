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

	function GetWidth(obj) {
		var
			w = parseFloat(window.getComputedStyle(obj, null).getPropertyValue('width')),
			pl = parseFloat(window.getComputedStyle(obj, null).getPropertyValue('padding-left')),
			pr = parseFloat(window.getComputedStyle(obj, null).getPropertyValue('padding-right')),
			ml = parseFloat(window.getComputedStyle(obj, null).getPropertyValue('margin-left')),
			mr = parseFloat(window.getComputedStyle(obj, null).getPropertyValue('margin-right')),
			blw = parseFloat(window.getComputedStyle(obj, null).getPropertyValue('border-left-width')),
			brw = parseFloat(window.getComputedStyle(obj, null).getPropertyValue('border-right-width'))
		;
		return w + pl + pr + ml + mr + blw + brw;
	}

	function GetHeight(obj) {
		var
			h = parseFloat(window.getComputedStyle(obj, null).getPropertyValue('height')),
			pt = parseFloat(window.getComputedStyle(obj, null).getPropertyValue('padding-top')),
			pb = parseFloat(window.getComputedStyle(obj, null).getPropertyValue('padding-bottom')),
			mt = parseFloat(window.getComputedStyle(obj, null).getPropertyValue('margin-top')),
			mb = parseFloat(window.getComputedStyle(obj, null).getPropertyValue('margin-bottom')),
			btw = parseFloat(window.getComputedStyle(obj, null).getPropertyValue('border-top-width')),
			bbw = parseFloat(window.getComputedStyle(obj, null).getPropertyValue('border-bottom-width'))
		;
		return h + pt + pb + mt + mb + btw + bbw;
	}
	
	var publicObj = {
			/** selected value or null */
			value: null,
			
			/** key (column) name for value from data record */
			keyName: (typeof confObj.keyName != 'undefined') ? confObj.keyName : null,
			
			/** key (value) name for data record */
			keyValue: (typeof confObj.keyValue != 'undefined') ? confObj.keyValue : null,
			
			/** method to force load data from source */
			load: null
	};
	
	if(typeof confObj.onchange == 'function') {
		publicObj.onchange = confObj.onchange;
	}
	
	var privateObj = {
			background: null,
			viewContent: null,
			listContainer: null,
			buttonsContainer: null,
			listView: null,
			listItemsView: null,
			
			divContainer: null,
			dataCollection: {},
			buttonsDefault: {
				'xxx': {
					'title': 'V'
				}
			},
			prepareContainer: function(inp) {
				var width = GetWidth(inp), height = GetHeight(inp);
				
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
				this.divContainer.appendChild(this.viewContent);
				
				var tthis = this;
				this.divContainer.onclick = function(){
					tthis.createBackground(this);
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
				
				var inputContainer = document.createElement('div');
				inputContainer.className = 'uwcombobox-list-input';
				inputContainer.style.width = '100%';
				inputContainer.style.overflow = 'hidden';
				
				var inputContContainer = document.createElement('div');
				inputContContainer.style.float = 'left';
				inputContContainer.appendChild(input);
				inputContainer.appendChild(inputContContainer);
				
				var buttonDom = document.createElement('button');
				buttonDom.setAttribute('type', 'button');
				buttonDom.innerHTML = '*';
				buttonDom.onclick = function(){
					publicObj.load();
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
				
				var w = GetWidth(inputContContainer) - GetWidth(buttonContainer);
				var h = GetHeight(input);
				input.style.width = w+'px';
				buttonDom.style.height = h+'px';
				buttonContainer.style.height = h+'px';
				
				console.log(GetWidth(inputContContainer), GetWidth(buttonContainer));
				
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
				this.listView.style.width = (offset.width)+'px';
				
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
				var tthis = this;
				function resetItems() {
					var liList = tthis.listItemsView.getElementsByTagName('li');
					for(var i=0; i<liList.length; i++) {
						liList[i].className = '';
					}
				}
				
				if(this.listItemsView) {
					this.listItemsView.parentNode.removeChild(this.listItemsView);
				}
				
				if(this.listContainer) {
					this.listItemsView = document.createElement('ul');
					this.listContainer.appendChild(this.listItemsView);
					
					this.listItemsView.innerHTML = '';
					for(var i=0; i<this.dataCollection.length; i++) {
						var item = document.createElement('li');
						item.setAttribute('uwcombobox-list-data', this.dataCollection[i][publicObj.keyName]);
						item.innerHTML = this.dataCollection[i][publicObj.keyValue];
						item.onclick = function(){
							resetItems();
							publicObj.value = this.getAttribute('uwcombobox-list-data');
							tthis.viewContent.innerHTML = this.innerHTML;
							confObj.input.value = publicObj.value;
							this.className = 'visited';
							tthis.close();
							if(typeof publicObj.onchange == 'function') {
								try {
									publicObj.onchange(this);
								}
								catch(e){
									console.log(e);
								}
							}
						};
						if(confObj.input.value == this.dataCollection[i][publicObj.keyName]) {
							item.className = 'visited';
						}
						this.listItemsView.appendChild(item);
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
		//var heigbuttonDombj.viewContent.parentNode);
		privateObj.buttonsContainer = document.createElement('div');
		privateObj.buttonsContainer.className = 'uwcombobox-buttons';
		privateObj.buttonsContainer.style.float = 'right';

		var w = parseFloat(window.getComputedStyle(privateObj.viewContent, null).getPropertyValue('padding-left'))
			+ parseFloat(window.getComputedStyle(privateObj.viewContent, null).getPropertyValue('padding-right'))
			+ parseFloat(window.getComputedStyle(privateObj.viewContent, null).getPropertyValue('margin-left'))
			+ parseFloat(window.getComputedStyle(privateObj.viewContent, null).getPropertyValue('margin-right'))
			+ parseFloat(window.getComputedStyle(privateObj.viewContent, null).getPropertyValue('border-left-width'))
			+ parseFloat(window.getComputedStyle(privateObj.viewContent, null).getPropertyValue('border-right-width'))
		;
		var h = parseFloat(window.getComputedStyle(privateObj.viewContent, null).getPropertyValue('height'))
			- (parseFloat(window.getComputedStyle(privateObj.viewContent, null).getPropertyValue('padding-top'))
			+ parseFloat(window.getComputedStyle(privateObj.viewContent, null).getPropertyValue('padding-bottom'))
			+ parseFloat(window.getComputedStyle(privateObj.viewContent, null).getPropertyValue('margin-top'))
			+ parseFloat(window.getComputedStyle(privateObj.viewContent, null).getPropertyValue('margin-bottom'))
			+ parseFloat(window.getComputedStyle(privateObj.viewContent, null).getPropertyValue('border-top-width'))
			+ parseFloat(window.getComputedStyle(privateObj.viewContent, null).getPropertyValue('border-bottom-width'))
			)
		;
		
		for(var buttonKey in privateObj.buttonsDefault) {
			var button = privateObj.buttonsDefault[buttonKey];
			var buttonDom = document.createElement('button');
			buttonDom.setAttribute('type', 'button');
			buttonDom.innerHTML = button.title;
			if(typeof button.click == 'function') {
				buttonDom.onclick = button.click;
			}
			privateObj.buttonsContainer.appendChild(buttonDom);
			buttonDom.style.height = h+'px';
		}
		
		privateObj.viewContent.parentNode.appendChild(privateObj.buttonsContainer);
		privateObj.viewContent.style.float = 'left';

		var widthButtonsContainer = parseFloat(window.getComputedStyle(privateObj.buttonsContainer, null).getPropertyValue('width'));
		var widthParentContainer = parseFloat(window.getComputedStyle(privateObj.viewContent.parentNode, null).getPropertyValue('width'));
		
		var widthButtonsContainer = GetWidth(privateObj.buttonsContainer);
		var widthParentContainer = GetWidth(privateObj.viewContent.parentNode);

		privateObj.viewContent.style.height = h+'px';
		privateObj.viewContent.style.width = (widthParentContainer - widthButtonsContainer - w)+'px';
		privateObj.buttonsContainer.style.height = h+'px';
	}
	
	/** method to force load data from source */
	publicObj.load = function() {
		
		UWAjax({
			url: './getdata.php',
			method: 'post',
			contentType: 'json',
			data: {
				'aaa': 'bbb',
				'ccc': 'ddd'
			},
			onsuccess: function(data){
				privateObj.dataCollection = JSON.parse(data);
				privateObj.refreshListView();
			}
		}).start();
	};
	
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

