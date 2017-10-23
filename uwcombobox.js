/**
 * @author Uniwizard Wojciech Niewiadomski
 * @package UWCombobox
 */
function ObjectIsEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

/**
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
 * TODO: Support buttons
 * 
 * @returns
 */
function UWCombobox(confObj) {
	
	var publicObj = {
			/** selected value or null */
			selectedValue: null,
			
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
			divContainer: null,
			dataCollection: {},
			prepareContainer: function(inp) {
				var
					w = parseFloat(window.getComputedStyle(inp, null).getPropertyValue('width')),
					pl = parseFloat(window.getComputedStyle(inp, null).getPropertyValue('padding-left')),
					pr = parseFloat(window.getComputedStyle(inp, null).getPropertyValue('padding-right')),
					ml = parseFloat(window.getComputedStyle(inp, null).getPropertyValue('margin-left')),
					mr = parseFloat(window.getComputedStyle(inp, null).getPropertyValue('margin-right')),
					blw = parseFloat(window.getComputedStyle(inp, null).getPropertyValue('border-left-width')),
					brw = parseFloat(window.getComputedStyle(inp, null).getPropertyValue('border-right-width')),
					width = w + pl + pr + ml + mr + blw + brw,
					
					h = parseFloat(window.getComputedStyle(inp, null).getPropertyValue('height')),
					pt = parseFloat(window.getComputedStyle(inp, null).getPropertyValue('padding-top')),
					pb = parseFloat(window.getComputedStyle(inp, null).getPropertyValue('padding-bottom')),
					mt = parseFloat(window.getComputedStyle(inp, null).getPropertyValue('margin-top')),
					mb = parseFloat(window.getComputedStyle(inp, null).getPropertyValue('margin-bottom')),
					btw = parseFloat(window.getComputedStyle(inp, null).getPropertyValue('border-top-width')),
					bbw = parseFloat(window.getComputedStyle(inp, null).getPropertyValue('border-bottom-width')),
					height = h + pt + pb + mt + mb + btw + bbw
				;
				
				this.divContainer = document.createElement('div');
				this.divContainer.style.width = width+'px';
				this.divContainer.style.height = height+'px';
				this.divContainer.style.overflow = 'hidden';
				
				inp.parentNode.appendChild(this.divContainer);
				this.divContainer.appendChild(inp);
				inp.style.display = 'none';
				
				this.viewContent = document.createElement('div');
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
				inputContainer.appendChild(input);
				
				this.listView.appendChild(inputContainer);
				
				this.listContainer = document.createElement('div');
				this.listContainer.className = 'uwcombobox-list-container';
				this.listContainer.style.width = '100%';
				this.listContainer.style.maxHeight = '200px';
				this.listContainer.style.overflowX = 'hidden';
				this.listContainer.style.overflowY = 'auto';
				
				this.listView.appendChild(this.listContainer);
				document.body.appendChild(this.listView);

				this.refreshListView();
			},

			background: null,
			viewContent: null,
			listContainer: null,
			listView: null,
			listItemsView: null,
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
							publicObj.selectedValue = this.getAttribute('uwcombobox-list-data');
							tthis.viewContent.innerHTML = this.innerHTML;
							confObj.input.value = publicObj.selectedValue;
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
	
	//TODO: Support buttons
	if(typeof confObj.buttons == 'object') {
		
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

