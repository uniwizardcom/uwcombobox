/**
 * @author Uniwizard Wojciech Niewiadomski
 * @package UWCombobox
 * 
 * @param confObj = {
 * 	input - native JS object to text input element
 * }
 * 
 * 
 * @returns
 */
function UWCombobox(confObj) {
	
	var publicObj = {
			'value': null,
			'load': null
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
				
				var tthis = this;
				this.divContainer.onclick = function(){
					tthis.createBackground();
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
				input.style.width = '99%';
				var inputContainer = document.createElement('div');
				inputContainer.className = 'uwcombobox-list-input';
				inputContainer.style.width = '100%';
				inputContainer.style.overflow = 'hidden';
				inputContainer.appendChild(input);
				
				this.listView.appendChild(inputContainer);
				
				this.listContainer = document.createElement('div');
				this.listContainer.className = 'uwcombobox-list-container';
				this.listContainer.style.width = '100%';
				this.listContainer.style.height = '200px';
				this.listContainer.style.overflowX = 'hidden';
				this.listContainer.style.overflowY = 'auto';
				
				this.listView.appendChild(this.listContainer);
				document.body.appendChild(this.listView);

				this.refreshListView();
			},

			background: null,
			listContainer: null,
			listView: null,
			listItemsView: null,
			createBackground: function(width, height) {
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
				
				if(typeof publicObj.load == 'function') {
					publicObj.load();
				}
			},
			resizeBackground: function(width, height) {
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
					for(var itemKey in this.dataCollection) {
						console.log(itemKey);
						var item = document.createElement('li');
						item.setAttribute('uwcombobox-list-data', itemKey);
						item.innerHTML = this.dataCollection[itemKey];
						item.onclick = function(){
							publicObj.value = this.getAttribute('uwcombobox-list-data');
							if(typeof publicObj.onchange == 'function') {
								publicObj.onchange(this);
							}
						};
						this.listItemsView.appendChild(item);
					}
				}
				console.log(this.listView);
			}
	};
	privateObj.prepareContainer(confObj.input);
	
	if(typeof confObj.buttons == 'object') {
		
	}
	
	publicObj.load = function() {
		console.log(1);
		setTimeout(function(){
			console.log(2);
			privateObj.dataCollection = {
					'key 1': 'Value 1',
					'key 2': 'Value 2',
					'key 3': 'Value 3',
					'key 4': 'Value 4',
					'key 5': 'Value 5',
					'key 6': 'Value 6',
					'key 7': 'Value 7',
					'key 8': 'Value 8',
					'key 9': 'Value 9',
					'key 0': 'Value 0',
			};
			privateObj.refreshListView();
		}, 5000);
	};
	
	publicObj.open = function() {
		privateObj.createBackground();
	};
	
	publicObj.close = function() {
		if(privateObj.background !== null) {
			privateObj.background.onclick();
			privateObj.background = null;
		}
	};
	
	window.addEventListener('resize', function(event){
		privateObj.resizeBackground();
	});
	
	return publicObj;
}

