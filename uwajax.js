/**
 * @author Uniwizard Wojciech Niewiadomski
 * @package UWAjax
 * 
 * With help ...
 * https://xhr.spec.whatwg.org/
 * 
 * @param confObj = {
 * 	method	- POST, GET, etc.
 * 	url		- 
 *  async	- 
 * }
 * 
 * Events:
 * 	onnotinitialized();
 * 	onconnectionestablished();
 * 	onrequestreceived();
 * 	onprocess();
 * 	oncompleted(responseBody, status);
 * 	onsuccess(responseBody);
 * 	onerror(responseBody, status);
 * 	onabort();
 */
function UWAjax(confObj) {
	
	/**
	 * built in JavaScript object available in almost all of the Internet Explorers.
	 */	
	var xmlhttp = new XMLHttpRequest();
	
	/**
	 * ... and, as curiosity ...
	 * available in Internet Explorer 6 and later
	 */
	if(!xmlhttp) {
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	}

	/**
	 * ... and, as curiosity again ...
	 * available in Internet Explorer 5.5
	 */
	if(!xmlhttp) {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	var privateObj = {
			sendAfterOpen: false,
			contentTypes: {
				'json': 'application/json',
				'default': 'text/plain;charset=UTF-8'
			}
	};
	
	var publicObj = {
			method:			(typeof confObj.method != 'undefined') ? confObj.method : 'post',
			url:			(typeof confObj.url != 'undefined') ? confObj.url : '',
			async:			(typeof confObj.async != 'undefined') ? !!confObj.async : true,
			contentType:	((typeof confObj.contentType != 'undefined') && (typeof privateObj.contentTypes[confObj.contentType] != 'undefined'))
								? privateObj.contentTypes[confObj.contentType]
								: privateObj.contentTypes['default'],
			data:			(typeof confObj.data != 'undefined') ? confObj.data : null,
			
			/**
		 	* The open() method sets up a request to a web server.
		 	* xmlhttp.open(method, url, async, user, password)
		 	* Specifies the type of request
		 	* 	method:		the type of request: GET, POST, PUT, DELETE, etc. Ignored for non-HTTP(S) URLs.
		 	* 	url:		the file location
		 	* 	async:		true (asynchronous) or false (synchronous)
		 	* 	user:		The optional user name to use for authentication purposes; by default, this is the null value.
		 	* 	password:	The optional password to use for authentication purposes; by default, this is the null value.
		 	* */
			open: function(sendAfterOpen) {
				privateObj.sendAfterOpen = (typeof sendAfterOpen != 'undefined') ? !!sendAfterOpen : true;
				xmlhttp.open(
						this.method,
						this.url,
						this.async
					);
			},
			
			/**
			 * The send() method sends a request to the server. (Behind the scene. Client’s browser does not refresh or takes any round trip.)
			 * xmlhttp.send();			Sends a request to the server (used for GET)
			 * xmlhttp.send(string);	Sends a request string to the server (used for POST)
			 * */
			send: function(data) {
				if(typeof data == 'undefined') {
					data = publicObj.data;
				}
				xmlhttp.send(
						(publicObj.contentType != privateObj.contentTypes['default']) ? JSON.stringify(data) : data
					);
			},
			
			start: function(requestString) {
				publicObj.open();
			},
			
			/**
			 * The abort() method aborts the current server request.
			 * xmlhttp.abort();
			 * */
			abort: function() {
				xmlhttp.abort();
				if(typeof confObj.onabort == 'function') {
					confObj.onabort();
				}
			}
	};
	
	publicObj.readBody = function(rawData) {
		if(rawData !== true) {
			if(!xmlhttp.responseType || xmlhttp.responseType === 'text') {
				return xmlhttp.responseText;
			}
			else if(xmlhttp.responseType === 'document') {
				return xmlhttp.responseXML;
			}
		}
		return xhr.response;
	}
	
	/**The status of the xmlhttpRequest
	 * 
	 * xmlhttp.readyState
	 * 0: request not initialized (before open)
	 * 1: server connection established (beetwen open and send)
	 * 2: request received (after send success, before start processing)
	 * 3: processing request
	 * 4: request finished and response is ready
	 * 
	 * xmlhttp.status
	 * 200: OK
	 * 404: Page not found
	 *					.
	 *					.
	 *					.
	 *
	 * xmlhttp.responseText: The response data as a string
	 * xmlhttp.responseXML: The response data as XML data
	 * */
	xmlhttp.onreadystatechange = function() {
		switch(this.readyState) {
			case 0: {
				if(typeof confObj.onnotinitialized == 'function') {
					confObj.onnotinitialized();
				}
			} break;
			case 1: {
				if(typeof confObj.onconnectionestablished == 'function') {
					confObj.onconnectionestablished();
				}
				this.setRequestHeader('Content-Type', publicObj.contentType);
				if(privateObj.sendAfterOpen) {
					publicObj.send();
				}
			} break;
			case 2: {
				if(typeof confObj.onrequestreceived == 'function') {
					confObj.onrequestreceived();
				}
			} break;
			case 3: {
				if(typeof confObj.onprocess == 'function') {
					confObj.onprocess();
				}
			} break;
			case 4: {
				if(typeof confObj.oncompleted == 'function') {
					confObj.oncompleted(
							publicObj.readBody(),
							xmlhttp.status
						);
				}
				if((xmlhttp.status == 200) && (typeof confObj.onsuccess == 'function')) {
					confObj.onsuccess(
							publicObj.readBody()
						);
				}
				if((xmlhttp.status != 200) && (typeof confObj.onerror == 'function')) {
					confObj.onerror(
							publicObj.readBody(),
							xmlhttp.status
						);
				}
			} break;
			default: {
				throw 'Unclasified state: ['+ this.readyState +']';
			} break;
		}
	};
	
	
	return publicObj;
}
