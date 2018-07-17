"use strict";

/*
	TODO
*/

function nao() {
	this.ip_			= '%NAO_IPADDR%';
	this.vers_			= '%APP_VERSION%';
	this.state_			= 'initialising';
	this.socket_		= null;
	this.queue_			= [];
	this.timeout_		= 50;
	this.reconnectAttempt = 0;

	this.eventSelf_		= null;
	this.eventFunc_		= null;
	this.readyFunc_		= null;
	this.closeFunc_		= null;
	this.errorFunc_		= null;
	this.reconnectFunc_	= null;

	this.pongInterval_	= null;
	this.domainId_		= 0;
	this.domain_		= '';
	this.name_			= 'NAO';
	this.colour_		= 'blue';

	this.authUser = '';
	this.authPass = '';
	this.eventCb_		= [];
	this.warnOnBattery = true;
	this.warnOnDiskspace = true;
	this.tablet			= false;

	var self = this;

/* Connect */
	this.connect = function(eventSelf=null, options=null) {
		this.state_ = 'connecting';

		if(eventSelf != null || options != null) {
			this.eventSelf_ = eventSelf;

			if('eventFunc' in options) {
				this.eventFunc_ = options.eventFunc;
			}
			if('readyFunc' in options) {
				this.readyFunc_ = options.readyFunc;
			}
			if('closeFunc' in options) {
				this.closeFunc_ = options.closeFunc;
			}
			if('errorFunc' in options) {
				this.errorFunc_ = options.errorFunc;
			}
		}
		
		try {
			if(this.ip_.substr(0,1) == '%') {
				this.ip_ = 'localhost';
			}
			
			this.socket_ = new WebSocket('ws://' + this.ip_ + ':4000/');
		} catch(e) {
			this.state_	= 'error';
		
			if(this.errorFunc != null) {
				this.errorFunc(this.state_, -1, e);
			}
			
			return;
		}
		
		this.readyError = function(error_code, error_message) {
			this.state_ = 'error';
			if(this.errorFunc_ != null) {
				this.errorFunc_(self.state, error_code, error_message);
			}
		}

		this.readyCheck = function() {
			if(self.domain_ == '') {
				self.send_('cadet_settingget', {'setting':'domain'}, function(result) {
					if(result['error_code'] == 0) {
						self.domainId_ = (result['value'] == '' ? 0 : result['value']);
						if(self.domainId_ != 0) {
							self.send_('cadet_domainget', {'id':result['value']}, function(result) {
								if(result['error_code'] == 0) {
									self.domain_ = result['domain']['name'];
									self.send_('cadet_settingget', {'setting':'colour'}, function(result) {
										if(result['error_code'] == 0) {
											self.colour_ = (result['value'] == '' ? self.colour_ : result['value']);
											self.readyCheck();
										} else {
											self.readyError(result['error_code'], result['error_message']);
										}
									});
								} else {
									self.readyError(result['error_code'], result['error_message']);
								}
							});
						} else {
							self.domain_ = 'location not set';
							self.readyCheck();
						}
					} else {
						self.readyError(result['error_code'], result['error_message']);
					}
				});
			} else if(self.name_ == '') {
				self.send_('system_robotname', null, function(result) {
					if(result['error_code'] == 0) {
						self.name_ = result['name'];
						self.readyCheck();
					} else {
						self.readyError(result['error_code'], result['error_message']);
					}
				});
			} else {
				self.state_ = 'ready';
				self.reconnectAttempt = 0;

				if(self.authUser == '') {
					if(self.readyFunc_ != null) {
						self.readyFunc_(self.state);
					}
				} else {
					self.auth(self.authUser, self.authPass, null, false);
				}
			}
		}
		
		var closeFunc = function() {
			if(self.reconnectAttempt < 3 && self.authUser != '') {
				self.connect();
			}
		
			self.state_ = 'disconnected';
			self.socket_ = null;

			if(self.pongInterval_ != null) {
				window.clearInterval(self.pongInterval_);
				self.pongInterval_ = null;
			}
			
			if(self.closeFunc != null) {
				self.closeFunc(self.state_);
			}
		}
			
		this.socket_.onopen = function() {
			self.state_ = 'connected';
			self.readyCheck();

			if(self.pongInterval_ != null) {
				window.clearInterval(self.pongInterval_);
				self.pongInterval_ = null;
			}
			
			this.pongInterval_ = window.setInterval(function() {
				if(self.send('cadet_pong', null, function(result) {
					if(result['error_code'] != 0) {
						closeFunc();
					}
				}) == false) {
					closeFunc();
				}
			}, 15000);
		}
		
		this.socket_.onclose = function() {
			if(self.state_ != 'ready') {
				closeFunc();
				if(self.closeFunc_ != null) {
					self.closeFunc_(self.state_);
				}
			} else {
				closeFunc();
			}
		}			
				
		this.socket_.onmessage = function(event) {
			var data = JSON.parse(event.data);
			if(typeof data === 'object') {
				self.notResponding(false);
				if('event' in data && self.state_ == 'ready') {
					for(var i=0; i<self.eventCb_.length; i++) {
						if(self.eventCb_[i].event == data.event) {
							self.eventCb_[i].callback(data, self.eventCb_[i].data);
						}
					}
					
					// TODO this.eventFunc_
 					if(self.eventFunc_ != null) {
 						if(data['event'] == 'event_shutdown') {
 							self.reconnectAttempt = 99;	// Dont reconnect
 						}
 						
 						self.eventFunc_(self.eventSelf_, data);
 					}
				} else if('token' in data) {
					var token = parseInt(data['token']);

					for(var i_ = 0; i_ < self.queue_.length; i_++) {
						if(self.queue_[i_]['token'] == token) {
							window.clearTimeout(self.queue_[i_]['timeout']);
							
							if(!('error_code' in data)) { data['error_code'] = 0; }
							if(!('error_message' in data)) { data['error_message'] = ''; }
							
							var cb = self.queue_[i_]['callback'];
							self.queue_.splice(i_, 1);
	
							$.each(data, function(name, value) {
								if(typeof value === 'object') {
									$.each(value, function(subname, subvalue) {
										if(typeof subvalue === 'string' && subvalue.length > 6) {
											if (/^[\],:{}\s]*$/.test(subvalue.replace(/\\["\\\/bfnrtu]/g, '@').
											replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
											replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
												data[name][subname] = JSON.parse(subvalue);
											}
										}
										
										if(typeof subvalue === 'object' && subvalue != null) {
											$.each(subvalue, function(subsubname, subsubvalue) {
												if(typeof subsubvalue === 'string' && subsubvalue.length > 6) {
													if (/^[\],:{}\s]*$/.test(subsubvalue.replace(/\\["\\\/bfnrtu]/g, '@').
													replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
													replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
														data[name][subname][subsubname] = JSON.parse(subsubvalue);
													}
												}
											});
										}
									});
								}
							});
	
							cb(data);				
							break;
						}
					}
				}
			}
		}
	}

/* Auth */
	this.auth = function(name, password, callback=null, resetAttempts=true) {
		var this_ = this;

		if(resetAttempts) {
			this_.reconnectAttempt = 0;
		}
		
		var data = {'name': name, 'password': password};

		this.send('cadet_userlogin', data, function(result) {
			if(result['error_code'] == 0) {
				if(result['user']['id'] != 0) {
					this_.authUser = name;
					this_.authPass = password;
				}
			}
			
			if(callback != null) {
				callback(result);
			}
		});
	}
	
	this.reauth = function(name, password) {
		var this_ = this;
		
		this_.authUser = name;
		this_.authPass = password;
	}
	
/*
 *	Setup
 */
	this.setup = function(domain, adminPassword, rootPassword, callback) {
		var this_ = this;
		
		var data = {'domain': domain, 'admin': adminPassword, 'root': rootPassword};

		this.send('cadet_setup', data, function(r) {
			if(r['error_code'] == 0) {
				this_.domainId_ = r['id'];
				this_.domain_ = domain;
			}
			
			callback(r);
		});
	}

/* Send */
	this.send = function(cmd, data=null, callback=null) {
		if(this.state_ != 'ready') {
			return false;
		}
		
		this.send_(cmd, data, callback, 0);
		return true;
	}

	this.send_ = function(cmd, data, callback, retry=0) {
		if(self.state_ != 'ready' && self.state_ != 'connected') {
			if(callback != null) {
				callback({'error_code':98});	// disconnected
			}
			return false;
		}

		if(retry >= self.timeout_) {

			if(callback != null) {
				callback({'error_code':99});	// timeout waiting for socket to connect or be ready
			}
			
			return;
		}
		
		if(data == null) {
			data = {};
		}

		data['command'] = cmd;
		if(self.socket_ != null) {
			if(self.socket_.readyState == 1) {
				var token = Math.floor(Math.random() * (100000 - 1000)) + 1000;

				for(var i_ = 0; i_ < self.queue_.length; i_++) {
					if(self.queue_[i_]['token'] == token) {
						i_ = 0;
						token = Math.floor(Math.random() * (100000 - 1000)) + 1000;
					}
				}
		
				data['token'] = token;
				for(var i=0; i<Object.keys(data).length; i++) {
				  if(typeof data[Object.keys(data)[i]] == 'object') {
					data[Object.keys(data)[i]] = JSON.stringify(data[Object.keys(data)[i]]);
				  }
				}
				var str = JSON.stringify(data);

				if(callback != null) {			
					data['callback'] = callback;

					data['timeout'] = window.setTimeout(function() {
						self.notResponding();
// 						for(var i_ = 0; i_ < self.queue_.length; i_++) {
// 							if(self.queue_[i_]['token'] == token) {
// 								var cb = self.queue_[i_]['callback'];
// 								self.queue_.splice(i_, 1);
// 
// 								cb({'error_code':99});	// Timeout waiting for response from NAO
// 								break;
// 							}
// 						}
					}, 15000);

					this.queue_.push(data);
				}
		
				self.socket_.send(str);
				return;
			}
		}
					
		window.setTimeout(function() { self.send_(cmd, data, callback, ++retry); }, 200);
	}
	
/*
 *	Not responding
 */
	this.notResponding = function(show=true) {
		if(show && $('.cadet-bad-error').length == 0) {
			if($('.nao-waiting').length == 0) {
				$('body').append('<div class="nao-waiting"><i class="fa fa-cog fa-spin"></i> ' + self.name_ + ' is currently busy... Please wait... <button id="nao-reconnect">Reconnect</button>' + (self.tablet == true ? '<button id="nao-close">Close</button>' : '') + '</div>');
			}
		} else {
			$('.nao-waiting').remove();
		}
	}

/* Error code to text */
	this.errorCodeToText = function(code, mode=0) {
		if(code == undefined) return '';
	
		var str = '';
	
		switch(code) {
			case 1:
				str = 'Unknown command';
				break;
			case 2:
				str = 'Script is in use';
				break;
			case 3:
				str = 'Script is missing';
				break;
			case 4:
				str = 'Script is already running';
				break;
			case 5:
				str = 'Parameter missing from command';
				break;
			case 6:
				str = 'Exception thrown';
				break;
			case 7:
				str = 'File is missing';
				break;
			case 8:
				str = 'File already exists';
				break;
			case 9:
				str = 'Resource is in use';
				break;
			case 10:
				str = 'Command not found';
				break;
			case 11:
				str = 'ALProxy not found';
				break;
			case 12:
				str = 'Function not found in ALProxy';
				break;
			case 13:
				str = 'User not authenticated';
				break;
			case 14:
				str = 'Domain not set';
				break;
			case 15:
				str = 'User password incorrect';
				break;
			case 16:
				str = 'User is not valid or does not have permission';
				break;
			case 98:
				str = 'NAO Disconnected';
				break;
			case 99:
				str = 'Timed out';
				break;
		}
		
		if(mode == 1) {
			return str;
		}
		
		return code + (str != '' ? ' (' + str + ')' : '');
	}
	
/* Subscribe */
	this.subscribe = function(id, event, callback, data) {
		for(var i=0; i<this.eventCb_.length; i++) {
			if(this.eventCb_[i].id == id) {
				return;
			}
		}
		
		this.eventCb_.push({
			'id': 		id,
			'event':	event,
			'callback':	callback,
			'data':		data
		});
	}
	
	this.unsubscribe = function(id) {
		for(var i=0; i<this.eventCb_.length; i++) {
			if(this.eventCb_[i].id == id) {
				this.eventCb_.splice(i, 1);
			}
		}
	}
	
/*
 *	Domain
 */
	this.domain = function() {
		return self.domain_;
	}

/*
 *	Domain Id
 */
	this.domainId = function() {
		return self.domainId_;
	}

/*
 *	Name
 */
	this.name = function() {
		return self.name_;
	}
	
/*
 *	Version
 */
	this.version = function() {
		return self.vers_;
	}
	
/*
 *	Colour
 */
	this.colour = function(colour = null) {
		if(colour != null) {
			self.colour_ = colour;
			self.app.nao.send('cadet_settingset', {'setting':'colour', 'value':colour}, null);
		}
		
		return self.colour_;
	}
}

$(document).ready(function() {
	$('body').on('click', '#nao-reconnect', function() {
		if(window.confirm('Are you sure you want to reconnect to the NAO?')) {
			location.reload(true);
		}
	});

	$('body').on('click', '#nao-close', function() {
		if(window.confirm('Are you sure you want to close NAO Cadet?')) {
			location.href = '/close.html';
		}
	});
});