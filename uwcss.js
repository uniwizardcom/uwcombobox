/**
 * @author Uniwizard Wojciech Niewiadomski
 * @package UWCss
 */
function UWCss(obj) {
	var computedStyle = window.getComputedStyle(obj, null);
	var computedStyleWidth = parseFloat(computedStyle.getPropertyValue('width'));
	var computedStyleHeight = parseFloat(computedStyle.getPropertyValue('height'));
	
	var publicObj = {
			getBordersHorizontal: function() {
				var
					pl = parseFloat(computedStyle.getPropertyValue('padding-left')),
					pr = parseFloat(computedStyle.getPropertyValue('padding-right')),
					ml = parseFloat(computedStyle.getPropertyValue('margin-left')),
					mr = parseFloat(computedStyle.getPropertyValue('margin-right')),
					blw = parseFloat(computedStyle.getPropertyValue('border-left-width')),
					brw = parseFloat(computedStyle.getPropertyValue('border-right-width'))
				;
				
				return {
					'pl': pl,
					'pr': pr,
					'ml': ml,
					'mr': mr,
					'blw': blw,
					'brw': brw,
					'summ': pl + pr + ml + mr + blw + brw
				};
			},
			
			getBordersVertical: function() {
				var 
					pt = parseFloat(computedStyle.getPropertyValue('padding-top')),
					pb = parseFloat(computedStyle.getPropertyValue('padding-bottom')),
					mt = parseFloat(computedStyle.getPropertyValue('margin-top')),
					mb = parseFloat(computedStyle.getPropertyValue('margin-bottom')),
					btw = parseFloat(computedStyle.getPropertyValue('border-top-width')),
					bbw = parseFloat(computedStyle.getPropertyValue('border-bottom-width'))
				;
				
				return {
					'pt': pt,
					'pb': pb,
					'mt': mt,
					'mb': mb,
					'btw': btw,
					'bbw': bbw,
					'summ': pt + pb + mt + mb + btw + bbw
				};
			},
			
			getWidthOutside: function () {
				return computedStyleWidth + this.getBordersHorizontal().summ;
			},

			getHeightOutside: function () {
				return computedStyleHeight + this.getBordersVertical().summ;
			},

			getWidthInside: function () {
				return computedStyleWidth - this.getBordersHorizontal().summ;
			},

			getHeightInside: function () {
				return computedStyleHeight - this.getBordersVertical().summ;
			},

			setWidthInside: function (value) {
				if(!((Object.prototype.toString.call(value) === '[object String]') && (value.indexOf('%')>=0))) {
					value = parseFloat(value);
					if(isNaN(value)) {
						return;
					}
					value += 'px';
				}
				obj.style.width = value;
				var wNew = parseFloat(window.getComputedStyle(obj, null).getPropertyValue('width')) - this.getBordersHorizontal().summ;
				obj.style.width = wNew+'px';
			},
			
			setWidthOutside: function (value) {
				if(!((Object.prototype.toString.call(value) === '[object String]') && (value.indexOf('%')>=0))) {
					value = parseFloat(value);
					if(isNaN(value)) {
						return;
					}
					value += 'px';
				}
				obj.style.width = value;
				var wNew = parseFloat(window.getComputedStyle(obj, null).getPropertyValue('width')) + this.getBordersHorizontal().summ;
				obj.style.width = wNew+'px';
			}
	};
	
	return publicObj;
}
