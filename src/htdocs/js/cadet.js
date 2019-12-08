"use strict";

/*
TODO
- Recent users should also have the domain name and robot name (incase ipad is used on multiple robots, domains)
*/

/*
?view=scripts&dir=4&showall=0&action=renamescript&id=9
*/

var cadetVersion = '1.0.1';	// Version number now stored in this file instead of the behaviour file
var cadetDebug = true;

function cadetApp(defaultLang = '') {
	this.cadet			= this;
	this.nao			= null;
	this.workspace		= null;
	
	this.userId			= 0;
	this.userName		= '';
	this.userOptions	= {};
	this.userNew		= false;
	
	this.scriptId		= 0;
	this.scriptName		= '';
	this.scriptXml		= '';
	this.scriptOptions	= '';
	
	this.i18nLang = defaultLang;
	this.i18nData = null;
	
/*
 *	Initalize
 */
	this.initalize = function(self) {
		// Setup language data
// 		self.laces.i18nAppFunc = this.i18n;
		
		if(typeof nao_i18n !== 'undefined') {
			self.app.i18nSetData(self, nao_i18n);			
		}

		$.getScript('/blockly/msg/js/' + defaultLang + '.js', function() { });

		cadetDefBlocks(self, this.i18n);
		window.document.title = self.app.i18n(self, 'NAO_CADET', 'NAO Cadet');
	
		self.laces.status(self.app.i18n(self, 'MSG_LOADING_NAO_CADET', 'Loading NAO Cadet...'));

		self.app.nao = new nao();
		self.app.workspace = new workspace(self, this.i18n);

		self.laces.status(self.app.i18n(self, 'MSG_CONNECTING_TO_NAO', 'Connecting to NAO...'));
		if(!cadetDebug) {
			self.app.nao.connect(self, {
				'eventFunc':	self.app.naoEvent,
				'readyFunc':	function() { self.app.naoReady(self); },
				'closeFunc':	function(state) { self.app.naoClose(self, state); },
				'errorFunc':	function(state, errorCode, errorMessage) { self.app.naoError(self, state, errorCode, errorMessage); }
			});
		}		
		self.laces.viewRegister('setup', self.app.i18n(self, 'TITLE_NAO_CADET_SETUP', 'NAO Cadet Setup'), self.app.viewSetup);
		self.laces.viewRegister('login', self.app.i18n(self, 'TITLE_NAO_CADET_LOGIN', 'NAO Cadet Login'), self.app.viewLogin);
		self.laces.viewRegister('admin', self.app.i18n(self, 'TITLE_NAO_CADET_ADMIN', 'NAO Cadet Admin'), self.app.viewAdmin);
		self.laces.viewRegister('scripts', self.app.i18n(self, 'TITLE_NAO_CADET_SCRIPTS', 'NAO Cadet Scripts'), self.app.viewScripts);
		self.laces.viewRegister('workspace', self.app.i18n(self, 'TITLE_NAO_CADET_WORKSPACE', 'NAO Cadet Workspace'), self.app.viewWorkspace);
		self.laces.viewDefault('login');

		if('tablet' in self.laces.options && self.laces.options.tablet == 1) {
			self.app.nao.tablet = true;
		}

		if(cadetDebug) {
				self.laces.view('workspace').show(0);
		}

		self.laces.tinkerbell('cadetWelcome', {
			'event':	'tinkerbell_newuser',
			'title':	'Hi there, I\'m Tinkerbell',
			'message':	'Welcome to NAO Cadet, I am here to show you around and help you create your first script.<br><br>Press the OK button to get started!',
			'location':	{'left':'40%', 'top':'20%'},
			'next':		'cadetScriptViewFolder'
		});

		self.laces.tinkerbell('cadetScriptViewFolder', {
			'title':	'Script folders',
			'message':	'This is a folder which contains scripts. You can press this card to open it and view the scripts inside.',
			'location':	{'elem':'.cadet-script-card[data-type=dir]'},
			'next':	'cadetScriptViewScript'
		});

		self.laces.tinkerbell('cadetScriptViewScript', {
			'title':	'Scripts',
			'message':	'<img src="/img/card.png">Cards that look like the above are scripts. Click them to open them in the workspace view.',
			'location':	{'left':'30%', 'top':'20%'},
			'next':	'cadetScriptViewLocked'
		});

		self.laces.tinkerbell('cadetScriptViewLocked', {
			'title':	'Locked scripts',
			'message':	'<img src="/img/cardlocked.png">Scripts with the icon above are locked scripts. You cannot edit these scripts, but you can view them and save them as your own',
			'location':	{'left':'40%', 'top':'30%'},
			'next':	'cadetScriptViewEdit'
		});

		self.laces.tinkerbell('cadetScriptViewEdit', {
			'title':	'Edit scripts info',
			'message':	'<img src="/img/cardedit.png">This button on scripts lets you edit them, change their name, colour and icon',
			'location':	{'left':'40%', 'top':'30%'},
			'next':	'cadetScriptViewBreadcrumb'
		});

		self.laces.tinkerbell('cadetScriptViewBreadcrumb', {
			'title':	'Folder breadcrumb',
			'message':	'This here shows you which folder you are in. To go back, press the <i>Home</i> link here.',
			'location':	{'elem':'.breadcrumb'},
			'next':	'cadetScriptViewMenu'
		});

		self.laces.tinkerbell('cadetScriptViewMenu', {
			'title':	'Menu',
			'message':	'Under this menu, you can change the view, see the sounds and motions on the NAO, edit your profile and logout!',
			'location':	{'elem':'[id=navbarDropdown]'},
			'next':		'cadetScriptViewTinkerbell'
		});

		self.laces.tinkerbell('cadetScriptViewTinkerbell', {
			'title':	'This is where I live!',
			'message':	'Pressing here will bring me back to help you!',
			'location':	{'elem':'[data-id=cadet-script-tbell]'},
			'next':		'cadetScriptViewCreate'
		});

		self.laces.tinkerbell('cadetScriptViewCreate', {
			'title':	'Create Script',
			'message':	'Pressing this menu item creates a new script, give it a try and i\ll see you in the script workspace!',
			'location':	{'elem':'[data-id=cadet-script-create]'},
		});

		self.laces.tinkerbell('cadetMenu', {
			'event':	'tinkerbell_menu',
			'title':	'Hey!',
			'message':	'What did you need help with?<br><br><ul>' + 
				'<li><a href="#" data-id="cadetScriptViewLocked" data-next="_hide">What does the padlock mean?</a></li>' + 
				'<li><a href="#" data-id="cadetScriptViewEdit" data-next="_hide">How do I rename a script?</a></li>' + 
				'</ul>',
			'button':	'Hide',
			'width':	'300px',
			'next':		'_hide',
			'location':	{'left':'40%', 'top':'20%'}
		});
		
		self.laces.tinkerbell('cadetWorkspaceView', {
			'event':	'tinkerbell_newuserscript',
			'title':	'This is the script workspace',
			'message':	'Here you use blocks to create your script to control the NAO',
			'next':		'cadetWorkspaceViewStack',
			'location':	{'left':'40%', 'top':'20%'}
		});

		self.laces.tinkerbell('cadetWorkspaceViewStack', {
			'title':	'Event stack',
			'message':	'This is an event stack. Blocks underneath this stack are run when this event occurs',
			'location':	{'left':'120px', 'top':'80px'},
			'next':		'cadetWorkspaceViewToolbox'
		});

		self.laces.tinkerbell('cadetWorkspaceViewToolbox', {
			'title':	'Toolbox',
			'message':	'Here is the toolbox, pressing these squares will show you blocks you can use',
			'location':	{'left':'20px', 'top':'60px'},
			'next':		'cadetWorkspaceViewRun'
		});

		self.laces.tinkerbell('cadetWorkspaceViewRun', {
			'title':	'Run script',
			'message':	'When you are ready to run your script, press this menu item',
			'location':	{'elem': 'a[data-id=cadet-workspace-run]'}
		});
	}
	
/*
 *	NAO Reconnect
 */
	this.naoReconnect = function(self, pwdRequired) {
		if(pwdRequired) {
			alert(self.app.i18n(self, 'MSG_PASSWORD_REQUIRED', 'Password required'));
		}
	
		return {'username':self.app.userName, 'password':''};
	}

/*
 *	NAO Event
 */
	this.naoEvent = function(self, event) {
		switch(event.event) {
			case 'event_restart':
				self.laces.alert({
					'title': self.app.i18n(self, 'TITLE_RESTART_REQUIRED', 'Restart required'),
					'message': self.app.i18n(self, 'MSG_RESTART_REQUIRED', 'There has been a system change with %NAME% and a restart of NAO Cadet is required.'),
					'buttons': [self.app.i18n(self, 'BTN_RESTART', 'Restart')],
					'callback': function() {
						location.reload(true);
					}
				});
				
				break;
			case 'event_shutdown':
				self.laces.alert({
					'title': self.app.i18n(self, 'TITLE_NAO_CADET_SHUTDOWN', 'NAO Cadet has quit'),
					'message': self.app.i18n(self, 'MSG_NAO_CADET_SHUTDOWN', 'NAO Cadet has quit on %NAME%. Thanks for playing!'),
					'callback': function() {
						window.location.href = '/close.html';
					}
				});
				
				break;
			case 'event_battery':
				if(event.percent <= 20) {
					if(!self.app.warningBatteryLow) {
						self.app.warningBatteryLow = true;
						self.laces.alert({
							'title': self.app.i18n(self, 'TITLE_NAO_BATTERY_LOW', 'Battery low on %NAME%'),
							'message': self.app.i18n(self, 'MSG_NAO_BATTERY_LOW', '%NAME% is running low on charge. You may need to connect %NAME% to power soon')
						});
					}
				} else {
					self.app.warningBatteryLow = false;
				}
				
				break;
			case 'event_diskfree':
				if(event.free < 102400) {
					if(!self.app.warningDiskLow) {
						self.app.warningDiskLow = true;
						self.laces.alert({
							'title': self.app.i18n(self, 'TITLE_NAO_DISK_LOW', 'Disk space low on %NAME%'),
							'message': self.app.i18n(self, 'MSG_NAO_DISK_LOW', '%NAME% is running low on storage. An administrator may need to remove sounds/videos from NAO Cadet or programs from Choregraphe')
						});
					}
				} else {
					self.app.warningDiskLow = false;
				}
				
				break;
			case 'event_motions_changed':
				self.app.workspaceUpdateMotions(self);
				break;
		}
	}

/*
 *	NAO Ready
 */
	this.naoReady = function(self) {
		if(self.app.nao.domainId() == 0) {
			self.laces.viewDefault('setup');
		}
		
		self.laces.ready();
	}
	
/*
 *	NAO Error
 */
	this.naoError = function(self, state, errorCode, errorMessage) {
		self.laces.status('exclamation', self.app.i18n(self, 'ERROR_CONNECTING_NAO', 'Error Connecting to NAO'), false, true);
		self.laces.alert({
			'title': self.app.i18n(self, 'TITLE_NAO_CANT_CONNECT', 'Could not connect to NAO'),
			'message': self.app.i18n(self, 'MSG_UNEXPECTED_DISCONNECT', '%NAME% has unexpectedly disconnected from us. There maybe a network issue or the NAO may need to be restarted.'),
			'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ':' + self.app.nao.errorCodeToText(errorCode) + '<br><br>' + errorMessage
		});
	}

/*
 *	NAO Close
 */
	this.naoClose = function(self, state) {
		self.laces.status('exclamation', self.app.i18n(self, 'ERROR_CONNECTING_NAO', 'Error Connecting to NAO'), false, true);
		self.laces.alert({
			'title': self.app.i18n(self, 'TITLE_NAO_DISCONNECTED', 'NAO disconnected'),
			'message': self.app.i18n(self, 'MSG_UNEXPECTED_DISCONNECT', '%NAME% has unexpectedly disconnected from us. There maybe a network issue or the NAO may need to be restarted.')
		});
	}

/*
 *	View Setup
 */
	this.viewSetup = function(self, action) {
		switch(action) {
			case '_show':
				if(self.app.nao.domainId() != 0) {
					self.laces.view('login').show();
					break;
				}
			
				self.laces.navbar().hide();
				self.laces.status();
			
				var html = '';
				
				html += '<p class="alert alert-info">' + self.app.i18n(self, 'MSG_FIRST_TIME', 'We\'ve noticed that this is the first time NAO Cadet has been run on %NAME%, and we need the following information before we continue:', {NAME: {prefix: '<strong>', postfix: '</strong>'}}) + '</p>';

				html += '<div class="form-group">' +
					'<label for="cadet-setup-location">' + self.app.i18n(self, 'MSG_LOCATION', 'Location') + '</label>' +
					'<input type="text" class="form-control" id="cadet-setup-location" aria-describedby="cadet-setup-location-help">' +
					'<small id="cadet-setup-location-help" class="form-text text-muted">' + self.app.i18n(self, 'MSG_FIRST_TIME_LOCATION_INFO', 'NAO Cadet identifies users and scripts per location. If %NAME% moves to a different location, it will not affect the users and scripts at this location.<br><br>Users will be able to view scripts at other locations, but not modify them.', {NAME: {prefix: '<strong>', postfix: '</strong>'}}) + '</small>' +
				'</div>';
					
				html += '<div class="form-group">' +
					'<label for="cadet-setup-admin">' + self.app.i18n(self, 'MSG_ADMIN_PASSWORD', 'Admin password') + '</label>' +
					'<input type="text" class="form-control" id="cadet-setup-admin" aria-describedby="cadet-setup-admin-help">' +
					'<small id="cadet-setup-admin-help" class="form-text text-muted">' + self.app.i18n(self, 'MSG_ADMIN_PASSWORD_INFO', 'The admin account is used to modify NAO Cadet settings and perform bulk activities.') + '</small>' +
				'</div>';
					
				html += '<div class="form-group">' +
					'<label for="cadet-setup-root">' + self.app.i18n(self, 'MSG_ROOT_PASSWORD', 'Root password') + '</label>' +
					'<input type="text" class="form-control" id="cadet-setup-root" aria-describedby="cadet-setup-root-help">' +
					'<small id="cadet-setup-root-help" class="form-text text-muted">' + self.app.i18n(self, 'MSG_ROOT_PASSWORD_INFO', 'The <strong>root</strong> account is used as an emergency account and can permanently delete data.') + '</small>' +
				'</div>';
				
				self.laces.modal('setup', {
					'html':		html,
					'title':	self.app.i18n(self, 'TITLE_SETUP', 'Setup'),
					'buttons':	[{
						'id':		'save',
						'title':	self.app.i18n(self, 'BTN_SAVE', 'Save'),
						'style':	'primary'
					}],
					'callback':	function(self, action, data) {
						switch(action) {
							case '_ready':														
								break;
							case '_valid':
								if(data.id == 'cadet-setup-location' && data.value == '') {
									return false;
								}
								if(data.id == 'cadet-setup-admin' && data.value == '') {
									return false;
								}
								if(data.id == 'cadet-setup-root' && data.value == '') {
									return false;
								}
							
								return true;
							case '_click':
								this.loading(true);
							
								self.app.nao.setup($('#cadet-setup-location').val(), $('#cadet-setup-admin').val(), $('#cadet-setup-root').val(), function(r) {
									self.laces.modal('setup').loading(false);
									if(r['error_code'] == 0) {
										self.laces.modal('setup').close();
										self.laces.view('login').show();
									} else {
										self.laces.alert({
											'title': self.app.i18n(self, 'TITLE_SETUP_ERROR', 'NAO Cadet Setup Error'),
											'message': self.app.i18n(self, 'ERROR_SETUP', 'There was an error setting up NAO Cadet'),
											'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
										});
									}
								});

								break;
						}
					}
				}).show();
				
				break;
			case '_close':
				break;
		}
	}

/*
 *	View Login
 */
	this.viewLogin = function(self, action) {
		switch(action) {
			case '_show':
				if(self.app.nao.domainId() == 0) {
					self.laces.view('setup').show();
					return;
				}
				
				self.app.nao.reauth('', '');
				self.laces.navbar().hide();
				self.laces.status();
			
				var html = '';

				if('tablet' in self.laces.options && self.laces.options.tablet == 1) {
					html += '<a href="/close.html" class="cadet-welcome-close"><i class="fa fa-close"></i></a>';
				}
				
				html += '<a href="#" class="cadet-welcome-about"><i class="fa fa-question"></i></a>';
				html += '<h1 class="display-4">' + self.app.i18n(self, 'TITLE_WELCOME_NAO_CADET', 'Welcome to NAO Cadet') + '</h1>';
				html += '<div class="cadet-jumbotron-slider">';
					html += '<div class="cadet-jumbotron-slider-item">';
						html += '<p class="lead">' + self.app.i18n(self, 'MSG_WELCOME_NAO_CADET', '%TIME_GREETING%, It\'s great to be in %LOCATION%<br><br>Before we start, what is your name?', {LOCATION: {prefix: '<strong id="cadet-location-name">', postfix: '</strong> <a class="btn btn-link fa fa-info-circle" id="cadet-btn-locationinfo"></a>'}}) + '</p>';
					html += '</div>';
					html += '<div class="cadet-jumbotron-slider-item">';
						html += '<p class="lead">Hi <strong id="cadet-login-name"></strong>!<br><br>' + self.app.i18n(self, 'MSG_ENTER_PASSWORD', 'Enter your password to login') + ':</p>';
					html += '</div>';
				html += '</div>';
				html += '<hr class="my-4">';
				html += '<div class="row" id="cadet-section-recent"></div>';
				html += '<div class="cadet-jumbotron-slider">';
					html += '<div class="cadet-jumbotron-slider-item">';
						html += '<label class="sr-only" for="cadet-username">' + self.app.i18n(self, 'MSG_NAME', 'Name') + '</label>';
						html += '<input type="text" class="form-control form-control-lg mb-2 mr-sm-2" id="cadet-login-username">';
						html += '<div class="text-center"><button type="submit" class="btn btn-primary btn-lg mb-2" id="cadet-btn-go">' + self.app.i18n(self, 'BTN_LETS_GO', 'Lets Go') + '</button></div>';
					html += '</div>';
					html += '<div class="cadet-jumbotron-slider-item">';
						html += '<label class="sr-only" for="cadet-password">' + self.app.i18n(self, 'MSG_PASSWORD', 'Password') + '</label>';
						html += '<input type="password" class="form-control form-control-lg mb-2 mr-sm-2" id="cadet-login-password">';
						html += '<div class="text-center"><button type="button" class="btn btn-secondary btn-lg mb-2 mr-2" id="cadet-btn-back">' + self.app.i18n(self, 'BTN_BACK', 'Back') + '</button><button type="submit" class="btn btn-primary btn-lg mb-2" id="cadet-btn-login">' + self.app.i18n(self, 'BTN_Login', 'Login') + '</button></div>';
					html += '</div>';
				html += '</div>';
				
				self.laces.jumbotron('login', html, function(self, action, data) {
					switch(action) {
						case '_ready':
							if(self.app.nao.domainId() != self.laces.settingGet('cadet-domain')) {
								self.laces.settingSet('cadet-domain');
								self.laces.settingSet('cadet-recent-users');
							} else {
								self.app.nao.send('cadet_userlist', {'domain': self.app.nao.domainId()}, function(r) {
									var recentUsers = self.laces.settingGet('cadet-recent-users');
						
									try {
										recentUsers = JSON.parse(recentUsers);
										if(r['error_code'] == 0) {
											for(var recentNum = 0; recentNum < recentUsers.length, recentNum < 5; recentNum++) {
												for(var i=0; i<r['users'].length; i++) {
													if(recentUsers[recentNum] == r['users'][i].id) {
														$('#cadet-section-recent').append('<a href="#" class="cadet-recent-user" data-id="' + r['users'][i].id + '">' + r['users'][i].name + '</a>');
														break;
													}
												}
											}
										}
									} catch(e) {
										//...
									}
								});
							}
							
							$('body').on('click', '.cadet-recent-user', function() {
								$('#cadet-login-username').val($(this).html());
								$('#cadet-btn-go').trigger('click');
								return false;
							});
														
							$('body').on('click', '.cadet-welcome-about', function() {
								self.app.viewAbout(self);
								return false;
							});
							
							$('#cadet-login-username').attr('disabled', false);
							$('#cadet-login-password').attr('disabled', true);
														
							break;
						case '_valid':
							return true;
						case '_click':
							var loginFunc = function(userId, userName, userOptions, userNew) {
								self.app.userId = userId;
								self.app.userName = userName;
								self.app.userOptions = (userOptions == null || userOptions == '' ? {} : userOptions);
								
								var recentUsers = self.laces.settingGet('cadet-recent-users');
								try {
									recentUsers = JSON.parse(recentUsers);
									recentUsers.unshift(userId);
									recentUsers = recentUsers.unique();
								} catch(e) {
									recentUsers = [userId];
								}
								
								self.laces.settingSet('cadet-domain', self.app.nao.domainId());
								self.laces.settingSet('cadet-recent-users', JSON.stringify(recentUsers));
								self.laces.view('scripts').show();
								
								if(userNew) {
									self.app.userNew = userNew;
// 									self.laces.tinkerbellEvent('tinkerbell_newuser');
								}
							}
						
							switch(data.id) {
								case 'cadet-btn-go':
									var username = self.laces.jumbotron('login').find('#cadet-login-username').val();
									var password = self.laces.jumbotron('login').find('#cadet-login-password').val();
								
									if(username == '') {
										self.laces.jumbotron('login').invalidate('#cadet-login-username');
									} else {
										self.laces.jumbotron('login').loading(true);
										self.app.nao.auth(username, password, function(r) {
											self.laces.jumbotron('login').loading(false);
											if(r['error_code'] == 0) {
												loginFunc(r['user']['id'], r['user']['name'], r['user']['options'], r['user']['new']);
											} else if(r['error_code'] == 15){
												self.laces.jumbotron('login').find('#cadet-login-name').html(username);
												self.laces.jumbotron('login').find('#cadet-section-recent').slideUp(400);
												self.laces.jumbotron('login').find('.cadet-jumbotron-slider').animate({marginLeft:'-58.2rem'}, 400, function() {
													$('#cadet-login-username').attr('disabled', true);
													$('#cadet-login-password').attr('disabled', false);
													self.laces.jumbotron('login').find('#cadet-login-password').focus();
												});
											} else {
												self.laces.alert({
													'title': self.app.i18n(self, 'TITLE_NAO_ERROR', 'NAO Error'),
													'message': self.app.i18n(self, 'ERROR_LOGIN', 'The NAO could not log you in because an error occurred'),
													'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
												});
											}
										});
									}
									
									break;
								case 'cadet-btn-login':
									var username = self.laces.jumbotron('login').find('#cadet-login-username').val();
									var password = self.laces.jumbotron('login').find('#cadet-login-password').val();
								
									if(username == '') {
										self.laces.jumbotron('login').find('#cadet-btn-back').trigger('click');
									} else if(password == '') {
										self.laces.jumbotron('login').invalidate('#cadet-login-password');
									} else {
										self.laces.jumbotron('login').loading(true);
										self.app.nao.auth(username, password, function(r) {
											self.laces.jumbotron('login').loading(false);
											if(r['error_code'] == 0) {
												loginFunc(r['user']['id'], r['user']['name'], r['user']['options'], r['user']['new']);
											} else if(r['error_code'] == 15){
												self.laces.jumbotron('login').invalidate('#cadet-login-password');
											} else {
												self.laces.alert({
													'title': self.app.i18n(self, 'TITLE_NAO_ERROR', 'NAO Error'),
													'message': self.app.i18n(self, 'ERROR_LOGIN', 'The NAO could not log you in because an error occurred'),
													'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
												});
											}
										});
									}
									
									break;
								case 'cadet-btn-back':
									self.laces.jumbotron('login').find('#cadet-section-recent').slideDown(400);
									self.laces.jumbotron('login').find('.cadet-jumbotron-slider').animate({marginLeft:0}, 400);
									self.laces.jumbotron('login').find('#cadet-login-username').val('');
									self.laces.jumbotron('login').find('#cadet-login-password').val('');
									$('#cadet-login-username').attr('disabled', false);
									$('#cadet-login-password').attr('disabled', true);
									break;
								case 'cadet-btn-locationinfo':
									self.laces.alert({
										'title': self.app.i18n(self, 'TITLE_LOCATION_SETTING', 'Location setting'),
										'message': self.app.i18n(self, 'MSG_LOCATION_SETTING', 'This NAO is currently set for the location %LOCATION% and will default to the scripts and users at %LOCATION%.<br><br>If this is not correct and you would like to change this, login using the <i>admin</i> account and select <i>Change Location</i>.', {LOCATION: {prefix: '<strong>', postfix: '</strong>'}}),
										'style': 'info'
									});
									
									break;
							}
							
							break;
						case '_close':
							$('body').off('click', '.cadet-welcome-about');
							$('body').off('click', '.cadet-recent-user');
							break;
					}
				}).show();
				
// 				self.laces.tinkerbellHide();
				break;
			case '_close':
				self.laces.jumbotron('login').close();
				break;
		}
	}
	
/*
 *	View Scripts
 */
	this.viewScripts = function(self, action) {
		switch(action) {
			case '_show':
				if(self.app.userId == 0) {
					self.laces.view('login').show();
					return;
				}

				if(self.app.userId < 0) {
					self.laces.view('admin').show();
					return;
				}

				self.laces.status('Loading');
			
				self.laces.navbar()
					.hide()
					.brand('<img src="/img/naohead.png">' + self.app.i18n(self, 'NAO_CADET', 'NAO Cadet'), function(self) {
						self.app.viewAbout(self);
					})
					.clear()
					.append('cadet-script-create', self.app.i18n(self, 'BTN_CREATE', 'Create'), function(self, id) { 
// 						if(self.laces.tinkerbellVisible()) {
// 							self.laces.tinkerbellEvent('cadet-script-create')
// 						} else {
							self.app.scriptEdit(self, 0);
// 						}
					})
					.appendDropdown('cadet-script-dropdown', '<i class="fa fa-bars"></i>', [
						{id: 'cadet-script-import',		title: self.app.i18n(self, 'MENU_UPLOAD_SCRIPT', 'Upload Script')},
						{id: 'sep'},
						{id: 'cadet-view-mine',			title: self.app.i18n(self, 'MENU_MY_SCRIPTS', 'My scripts'),			checkGroup: 'view'},
						{id: 'cadet-view-all',			title: self.app.i18n(self, 'MENU_ALL_SCRIPTS', 'All scripts'),			checkGroup: 'view'},
						{id: 'sep'},
						{id: 'cadet-view-empty',		title: self.app.i18n(self, 'MENU_SHOW_EMPTY', 'Show empty folders')},
						{id: 'sep'},
						{id: 'cadet-view-sounds',		title: self.app.i18n(self, 'MENU_SOUNDS', 'Sounds')},
						{id: 'cadet-view-videos',		title: self.app.i18n(self, 'MENU_PHOTOSVIDEOS', 'Photos/Videos')},
						{id: 'cadet-view-behaviors',	title: self.app.i18n(self, 'MENU_BEHAVIORS', 'Behaviors')},
						{id: 'cadet-view-motions',		title: self.app.i18n(self, 'MENU_MOTIONS', 'Motions')},
						{id: 'sep'},
						{id: 'cadet-user-profile',		title: self.app.i18n(self, 'MENU_MY_PROFILE', 'My profile')},
						{id: 'cadet-user-logout',		title: self.app.i18n(self, 'MENU_LOGOUT', 'Logout')
					}], function(self, id, enabled) {
						if(enabled == true) {
							switch(id) {
								case 'cadet-script-import':
									self.app.scriptImport(self);
									break;
								case 'cadet-view-mine':
									self.app.userOptions['scriptAll'] = false;
									self.laces.navbar().enable('cadet-view-empty');
									self.app.viewScriptsUpdate(self);
									break;
								case 'cadet-view-all':
									self.app.userOptions['scriptAll'] = true;
									self.laces.navbar().disable('cadet-view-empty');
									self.app.viewScriptsUpdate(self);
									break;
								case 'cadet-view-empty':
									self.app.userOptions['scriptEmptyDir'] = true;
									self.app.viewScriptsUpdate(self);
									break;
								case 'cadet-view-sounds':
									self.app.actionViewSounds(self);
									break;
								case 'cadet-view-videos':
									self.app.actionViewVideos(self);
									break;
								case 'cadet-view-behaviors':
									self.app.actionViewBehaviors(self);
									break;
								case 'cadet-view-motions':
									self.app.actionViewMotions(self);
									break;
								case 'cadet-user-profile':
									self.app.actionUserProfile(self);
									break;
								case 'cadet-user-logout':
									self.laces.view('login').show();
									break;
							}
						} else {
							if(id == 'cadet-view-empty') {
								self.app.userOptions['scriptEmptyDir'] = false;
								self.app.viewScriptsUpdate(self);
							}
						}
					})
// 					.append('cadet-script-tbell', '<i class="fa fa-bell"></i>', function(self, id) { self.laces.tinkerbellEvent('tinkerbell_menu'); })
					.show();

					if(self.laces.isTablet()) {
						self.laces.navbar().append('cadet-script-close', '<i class="fa fa-close"></i>', function(self, id) {window.location.href = '/close.html';});
					}

			
				var html = '<div id="cadet-script-navbar"></div><div id="cadet-script-items">' + self.laces.statusInsert() + '</div>';

				return html;
			case '_ready':
				self.app.nao.subscribe('viewscripts', 'event_script_changed', function(event, self) {
					self.app.viewScriptsUpdate(self);
				}, self);
			
				self.app.viewScriptsUpdate(self);
				$('#cadet-domain-dropdown').lacesSelect();
				
				$('body').on('click', '.cadet-script-card', function() {
					var type = $(this).attr('data-type');
					
					if(type == 'script') {
						self.laces.view('workspace').show($(this).attr('data-id'));
					} else if(type == 'dir') {
						self.app.userOptions.scriptDir = $(this).attr('data-id');
						self.app.viewScriptsUpdate(self);
					}

					return false;
				});
				
				$('body').on('click', '.cadet-script-edit', function() {
					var type = $(this).parent().attr('data-type');
					
					if(type == 'script') {
						self.app.scriptEdit(self, $(this).parent().attr('data-id'));
					} else if(type == 'dir') {
						var name = $(this).parent().attr('data-id');
				 		self.app.askName(self, self.app.i18n(self, 'TITLE_RENAME_FOLDER', 'Rename folder'), name, self.app.i18n(self, 'MSG_RENAME', 'Rename'), function(self, value) {
				 			self.app.nao.send('cadet_scriptchangedir', {'olddir': name, 'newdir': value, 'domain': self.app.userOptions['scriptDomain']}, function(r) {
				 				if(r['error_code'] != 0) {
									self.laces.alert({
										'title': self.app.i18n(self, 'TITLE_NAO_ERROR', 'NAO Error'),
										'message': self.app.i18n(self, 'ERROR_RENAME_FOLDER', 'Could not rename the folder because an error occurred'),
										'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
									});
				 				}
				 				
				 				self.app.viewScriptsUpdate(self);
				 			});
				 		});
					}
					
					return false;
				});

				$('body').on('click', '.cadet-script-locked', function() {
					self.laces.alert({
						'title': self.app.i18n(self, 'TITLE_SCRIPT_LOCKED', 'Script locked'),
						'message': self.app.i18n(self, 'MSG_SCRIPT_LOCKED', 'This script is locked because it was created by someone else or is currently being edited.<br><br>You are able to view this script however you will need to save it as a copy.'),
						'style': 'info'
					});
					return false;
				});

				$('body').on('click', '#cadet-folder-home', function() {
					self.app.userOptions.scriptDir = '';
					self.app.viewScriptsUpdate(self);
				});
				
				$('body').on('change', '#cadet-domain-dropdown', function() {
					self.app.userOptions['scriptDomain'] = $(this).val();
					self.app.viewScriptsUpdate(self);
				});

				break;
			case '_close':
				$('body').off('change', '#cadet-domain-dropdown');
				$('body').off('click', '.cadet-script-card');
				$('body').off('click', '.cadet-script-locked');
				$('body').off('click', '.cadet-script-edit');
				$('body').off('click', '#cadet-folder-home');
				self.app.nao.unsubscribe('viewscripts');
				break;
		}
	}

/*
 *	View Scripts Update
 */
	this.viewScriptsUpdate = function(self) {
		var html = '';
		
		if(!('scriptDir' in self.app.userOptions) || self.app.userOptions.scriptDir == null) {
			self.app.userOptions.scriptDir = '';
		}
		
		if(!('scriptDomain' in self.app.userOptions)) {
			self.app.userOptions.scriptDomain = self.app.nao.domainId();
		}
		
		if(!('scriptAll' in self.app.userOptions)) {
			self.app.userOptions.scriptAll = false;
			self.laces.navbar().check('cadet-view-mine', true);
		} else {
			self.laces.navbar().check('cadet-view-mine', !self.app.userOptions.scriptAll);
			self.laces.navbar().check('cadet-view-all', self.app.userOptions.scriptAll);			
		}
		
		if(!('scriptEmptyDir' in self.app.userOptions)) {
			self.app.userOptions.scriptEmptyDir = false;
		}

		$('#cadet-script-items').html(self.laces.statusInsert());

		/* Script Navbar */
		html += '<select id="cadet-domain-dropdown"></select><nav aria-label="breadcrumb" style="display:inline-block">';
		if(self.app.userOptions.scriptDir == '') {
			html += '<ol class="breadcrumb"><li class="breadcrumb-item"><i class="fa fa-folder-open-o"></i> ' + self.app.i18n(self, 'BTN_HOME', 'Home') + '</li></ol>';
		} else {
			html += '<ol class="breadcrumb"><li class="breadcrumb-item"><i class="fa fa-folder-open-o"></i> <a href="#" id="cadet-folder-home">' + self.app.i18n(self, 'BTN_HOME', 'Home') + '</a></li><li class="breadcrumb-item active" aria-current="page" data-name="' + self.app.userOptions.scriptDir + '">' + self.app.userOptions.scriptDir + '</li></ol>';
		}

		html += '</nav>';
		$('#cadet-script-navbar').animate({opacity:0}, 200, function() {
			$('#cadet-script-navbar').html(html);
			
			/* Domain Select Update */		
			self.app.nao.send('cadet_domainlist', null, function(r) {
				if(r['error_code'] == 0) {
					for(var i=0; i<r['domains'].length;i++) {
						$('#cadet-domain-dropdown').append('<option value="' + r['domains'][i].id + '"' + (self.app.userOptions.scriptDomain == r['domains'][i]['id'] ? ' selected' : '') + '>' + r['domains'][i].name + '</option>');
					}
		
					$('#cadet-domain-dropdown').lacesSelect('refresh');
					$('#cadet-script-navbar').animate({opacity:1}, 200);
				}
			});		
		});	
		
		/* Script Items */
		self.app.nao.send('cadet_scriptlist', {'domain': self.app.userOptions.scriptDomain, 'tutorial': true}, function(r) {
			if(r['error_code'] == 0) {
				var scriptList = r['scripts'];
				var scriptDir = [];

				var scriptListTmp = [];
				for(var i=0; i<scriptList.length; i++) {
					if(!('options' in scriptList[i]) || scriptList[i]['options'] == '' || scriptList[i]['options'] == '""') scriptList[i]['options'] = {'dir': ''};
					if(!('dir' in scriptList[i].options)) scriptList[i].options['dir'] = '';
					if(!('icon' in scriptList[i].options)) scriptList[i].options['icon'] = 'file-code-o';
					if(!('colour' in scriptList[i].options)) scriptList[i].options['colour'] = 'F7D46F';

					if(scriptList[i].options.dir != self.app.userOptions.scriptDir) {
						if(self.app.userOptions.scriptDir == '') {
							var dirFound = false;
						
							for(var j=0; j<scriptDir.length; j++) {
								if(scriptDir[j].name == scriptList[i].options.dir) {
									dirFound = true;
									scriptDir[j].count++;
									if(scriptList[i].userid == self.app.userId) {
										scriptDir[j].mine++;
									}
									if(scriptList[i].userid == 0) {
										scriptDir[j].tutorials++;
									}
								}
							}
						
							if(dirFound == false) {
								scriptDir.push({'name': scriptList[i].options.dir, 'count': 1, 'mine': (scriptList[i].userid == self.app.userId ? 1 : 0), 'tutorials': 0});
							}
						}
					} else {
						if(scriptList[i].userid != self.app.userId) {
							scriptList[i].locked = true;
						}
						
						scriptListTmp.push(scriptList[i]);
					}
				}
				
				scriptList = scriptListTmp;
				
				for(var i=0; i<scriptDir.length; i++) {
					scriptList.push({
						'id': scriptDir[i].name,
						'name': scriptDir[i].name,
						'count': scriptDir[i].count,
						'mine': scriptDir[i].mine,
						'locked': false,
						'tutorials': scriptDir[i].tutorials
					})
				}
				// id, locked, options.colour, options.icon, count, mine, username
				
				scriptList.sortBy('name');

				var noScripts = true;
				if(scriptList.length > 0) {
					var html = '';
					
					html += '<div class="row">';
					
					for(var i=0; i<scriptList.length; i++) {
						if(self.app.userOptions.scriptAll || scriptList[i].userid == self.app.userId || scriptList[i].userid == 0 || 'count' in scriptList[i]) {
							if(!('count' in scriptList[i]) || self.app.userOptions.scriptEmptyDir || scriptList[i].mine > 0 || self.app.userOptions.scriptAll || ('tutorials' in scriptList[i] && scriptList[i].tutorials > 0)) {
								noScripts = false;
								html += '<div class="col-md-6 col-lg-4">' + 
									'<div class="card cadet-script-card" data-type="' + ('count' in scriptList[i] ? 'dir' : 'script') + '" data-id="' + self.laces.escapeHtml(scriptList[i].id) + '">' + 
										'<div class="cadet-script-locked"' + (scriptList[i].locked == true ? ' style="display:block"' : 'style="display:none"') + '><i class="fa fa-lock"></i></div>' +
										'<div class="cadet-script-edit"><i class="fa fa-ellipsis-v"></i></div>' +
										('count' in scriptList[i] ? 
											'<div class="card-img-top" style="background-color:#fff; border-bottom:1px solid #ddd"><i class="fa fa-folder-open-o fa-fw" style="color:#F7D46F"></i></div>' :
											'<div class="card-img-top" style="background-color:#' + scriptList[i]['options']['colour'] + '"><i class="fa fa-' + scriptList[i]['options']['icon'] + ' fa-fw" style="color:#fff"></i></div>'
										) +
										'<div class="card-body">' + 
											'<h5 class="card-title">' + self.laces.escapeHtml(scriptList[i].name) + '</h5>' + 
										('count' in scriptList[i] ? 
											(self.app.userOptions.scriptAll ?
												'<p class="card-text"><small class="text-muted">' + self.app.i18n(self, 'MSG_SCRIPT_COUNT', '%1% script(s)', {1: {content: scriptList[i].count}}) + '</small></p>' :
												'<p class="card-text"><small class="text-muted">' + self.app.i18n(self, 'MSG_SCRIPT_TOTAL', '%1% script(s) [%2% total]', {1: {content: scriptList[i].mine}, 2: {content: scriptList[i].count}}) + '</small></p>'
											) :
											'<p class="card-text"><small class="text-muted">' + self.app.i18n(self, 'MSG_CREATED_BY', 'Created by') + ' ' + self.laces.escapeHtml(scriptList[i]['username']) + '</small></p>'
										) +
										'</div>' + 
									'</div>' + 
								'</div>';
							}
						}
					}
					
					html += '</div>';
					
					if(noScripts == false) {
						$('#cadet-script-items').queueFadeOut(200, function() {
							$('#cadet-script-items').html(html);
							$('#cadet-script-items').queueFadeIn();
						});
					} else {
						$('#cadet-script-items').queueFadeOut(200, function() {
							$('#cadet-script-items').html(self.laces.statusInsert());
							self.laces.status('exclamation', self.app.i18n(self, 'MSG_NO_SCRIPTS_FOUND', 'No scripts found'));
							$('#cadet-script-items').queueFadeIn();
						});
					}
				} else {
					self.laces.status('exclamation', self.app.i18n(self, 'MSG_NO_SCRIPTS_FOUND', 'No scripts found'));
				}
			} else {
				self.laces.status('exclamation', self.app.i18n(self, 'ERROR_LOADING_SCRIPTS', 'Error loading scripts'), false, true);
			}
		});
	}


/*
 *	Script Edit
 */
 	this.scriptEdit = function(self, id, xml='') {
		var html = '';
		
		html = '<div class="laces-modal-padding">' +
			'<div class="form-group row">' +
				'<label class="col-sm-1 col-form-label" for="cadet-script-name">' + self.app.i18n(self, 'MSG_NAME', 'Name') + '</label>' +
				'<div class="col-sm-11"><input id="cadet-script-name" type="text" class="form-control" value="' + self.laces.escapeHtml(self.app.userName + '\'s ' + self.app.i18n(self, 'MSG_SCRIPT', 'Script')) + '"></div>' +
			'</div>' +
		
			'<div class="form-group row">' +
				'<div class="col-sm-1">' +
					'<label class="col-form-label" for="cadet-script-dir-home">' + self.app.i18n(self, 'MSG_FOLDER', 'Folder') + '</label>' +
				'</div>' +
			
				'<div class="col-sm-11">' +
					'<select id="cadet-script-dir">' +
					'<option selected id="cadet-script-dir-home" value="">' + self.app.i18n(self, 'MSG_HOME', 'Home') + '</option>' +
					'<option data-divider="true"></option>' +
					'<option value="...">' + self.app.i18n(self, 'MSG_OTHER', 'Other') + '</option>' +
					'</select>' +
				'</div>' +
			'</div>' +

			'<div class="row">' +
			'<div class="col-sm-1"><label class="col-form-label" style="margin-top:0.8rem">' + self.app.i18n(self, 'MSG_COLOUR', 'Colour') + '</label></div>' +
			'<div class="col-sm-11">' +
			self.laces.colourSelectorCreate('cadet-script-colour', '', ['F44336', 'D81B60', '9C27B0', '3F51B5', '03A9F4', '00897B', '7CB342', 'FDD835', 'FB8C00', '6D4C41', '546E7A']) + 
			'</div></div>' +

			'<div class="row">' +
			'<div class="col-sm-1"><label class="col-form-label" style="margin-top:0.8rem">' + self.app.i18n(self, 'MSG_ICON', 'Icon') + '</label></div>' +
			'<div class="col-sm-11">' +
			self.laces.iconSelectorCreate('cadet-script-icon', '', ['address-card-o','ambulance','anchor','angellist','automobile','bank','bath','bed','binoculars','birthday-cake','blind','bomb','bug','bullhorn','cab','camera-retro','cloud','code','codiepie','compass','dashboard','database','dribbble','feed','female','futbol-o','gitlab','glass','headphones','heart','info-circle','key','location-arrow']) +
			'</div></div>' +
		'</div>';
 		
		self.laces.modal('script-edit', {
			'html':		html,
			'title':	(id == 0 ? self.app.i18n(self, 'MSG_CREATE_SCRIPT', 'Create script') : self.app.i18n(self, 'MSG_EDIT_SCRIPT', 'Edit script')),
			'buttons':	[
				{'id': 'save',		'title': self.app.i18n(self, 'BTN_SAVE', 'Save'),	'style': 'primary'},
				{'id': 'saveas',	'title': self.app.i18n(self, 'BTN_SAVE_AS', 'Save As'),	'style': 'primary'},
				{'id': 'cancel',	'title': self.app.i18n(self, 'BTN_CANCEL', 'Cancel'),	'style': 'secondary'},
				{'id': 'delete',	'title': '<i class="fa fa-trash"></i>',	'style': 'outline-danger',	'left': true, 'icon': true},
				{'id': 'export',	'title': '<i class="fa fa-download"></i>',	'style': 'outline-secondary',	'left': true, 'icon': true},
				{'id': 'duplicate',	'title': '<i class="fa fa-files-o"></i>',	'style': 'outline-secondary',	'left': true, 'icon': true}
			],
			'callback':	function(self, action, data) {
				switch(action) {
					case '_ready':
						self.laces.modal('script-edit').loading(true, true);
						
						self.app.nao.send('cadet_scriptlist', {'domain': self.app.nao.domainId()}, function(r) {
							if(r['error_code'] == 0) {
								var dirs = [];
				
								for(var i=0; i<r['scripts'].length; i++) {
									if(!('options' in r['scripts'][i]) || r['scripts'][i]['options'] == '') r['scripts'][i]['options'] = {'dir': ''};
									if(!('dir' in r['scripts'][i].options)) r['scripts'][i].options['dir'] = '';
						
									var dir = {
										'id': r['scripts'][i]['options']['dir'].toLowerCase().replace(/[^a-z0-9]/gi, ''),
										'name': r['scripts'][i]['options']['dir']
									};
						
									var found = false;
									for(var j=0; j<dirs.length; j++) {
										if(dirs[j].id == dir.id) {
											found = true;
										}
									}
						
									if(!found) {
										dirs.push(dir);
									}						
								}
					
								dirs.sortBy('name');
								for(var i=0; i<dirs.length; i++) {
									$('<option value="' + dirs[i].name + '"' + (self.app.userOptions.scriptDir == dirs[i].name ? ' selected' : '' )+ '>' + dirs[i].name + '</option>').insertAfter('#cadet-script-dir-home');
								}
					
								$('#cadet-script-dir').lacesSelect('refresh');
								
								if(id != 0) {
									self.app.nao.send('cadet_scriptget', {'id':id}, function(r) {
										if(r['error_code'] == 0) {
											$('#cadet-script-name').val(r['script']['name']);
											$('#cadet-script-dir').val(r['script']['options']['dir']);
											self.laces.colourSelectorSet('cadet-script-colour', r['script']['options']['colour']);
											self.laces.iconSelectorSet('cadet-script-icon', r['script']['options']['icon']);
											
											if(r['script']['user'] != self.app.userId) {
												$('#save').hide();
												$('#delete').hide();
												$('#duplicate').hide();
											} else {
												$('#saveas').hide();
											}
											
											self.laces.modal('script-edit').loading(false, true);
										} else {
											self.laces.alert({
												'title': self.app.i18n(self, 'TITLE_GET_SCRIPT_ERROR', 'Get script error'),
												'message': self.app.i18n(self, 'ERROR_SCRIPT_INFO', 'There was an error getting information about the script'),
												'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
											});
											
											self.laces.modal('script-edit').close();
										}
									});
								} else {
									$('#saveas').hide();
									$('#delete').hide();
									$('#duplicate').hide();
									$('#export').hide();
									self.laces.modal('script-edit').loading(false, true);
								}
							} else {
								self.laces.modal('script-edit').close();
								
								self.laces.alert({
									'title': self.app.i18n(self, 'TITLE_GET_FOLDERS_ERROR', 'Get folders error'),
									'message': self.app.i18n(self, 'ERROR_GET_FOLDERS', 'There was an error getting what folders are on %NAME%'),
									'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
								});
							}
						});

						$('body').on('change', '#cadet-script-dir', function() {
							if($(this).val() == '...') {
								self.app.askName(self, self.app.i18n(self, 'TITLE_CREATE_FOLDER', 'Create folder'), self.app.i18n(self, 'MSG_NEW_FOLDER', 'New folder'), self.app.i18n(self, 'BTN_CREATE', 'Create'), function(self, value) { 
									var dirNew = value.toLowerCase().replace(/[^a-z0-9]/gi, '');
									var found = false;
		
									$('#cadet-script-dir option').each(function() {
										var dir = $(this).val();
										if(dir != '') {
											dir = dir.toLowerCase().replace(/[^a-z0-9]/gi, '');
											if(dir == dirNew) {
												$('#cadet-script-dir').val($(this).val());
												found = true;
											}
										}
									});
		
									if(found == false) {
										var val = self.laces.escapeHtml(value);

										$('<option>').val(val).html(val).insertAfter('#cadet-script-dir-home');
										$('#cadet-script-dir').val(val);
									}

									$('#cadet-script-dir').lacesSelect('refresh');
								});
							}
						});
						
						break;
					case '_valid':
						if(data.id == 'cadet-script-name' && data.value == '') {
							return false;
						}
					
						return true;
					case '_click':
						switch(data.id) {
							case 'cancel':
								self.laces.modal('script-edit').close();
								break;
							case 'save':
								self.laces.modal('script-edit').loading(true, false);
								var options = {
									'colour': self.laces.colourSelectorGet('cadet-script-colour'),
									'icon': self.laces.iconSelectorGet('cadet-script-icon'),
									'dir': self.laces.unescapeHtml($('#cadet-script-dir').val())
								}
					
								var data = {
									'id': (data.id == 'save' ? id : 0),
									'user': self.app.userId,
									'name': self.laces.unescapeHtml($('#cadet-script-name').val()),
									'options': options,
									'xml': xml
								};
								
								self.app.nao.send('cadet_scriptset', data, function(r) {
									if(r['error_code'] == 0) {
										self.laces.modal('script-edit').close();
										if(id == 0) {
											self.laces.view('workspace').show(r['id']);
										}
									} else {
										self.laces.alert({
											'title': self.app.i18n(self, 'TITLE_SAVE_SCRIPT_ERROR', 'Script Save Error'),
											'message': self.app.i18n(self, 'ERROR_SAVE_SCRIPT', 'Your script could not be saved because an error occurred'),
											'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
										});

										self.laces.modal('script-edit').loading(false, false);
									}
								});
								break;
							case 'saveas':
								self.laces.modal('script-edit').loading(true, true);

								self.app.nao.send('cadet_scriptget', {'id':id}, function(r) {
									if(r['error_code'] == 0) {
										var options = {
											'colour': self.laces.colourSelectorGet('cadet-script-colour'),
											'icon': self.laces.iconSelectorGet('cadet-script-icon'),
											'dir': self.laces.unescapeHtml($('#cadet-script-dir').val())
										}
					
										var data = {
											'id': 0,
											'user': self.app.userId,
											'name': self.laces.unescapeHtml($('#cadet-script-name').val()),
											'options': options,
											'xml': r['script']['xml']
										};

										self.app.userOptions.scriptDir = $('#cadet-script-dir').val();
										self.app.nao.send('cadet_scriptset', data, function(r) {
											if(r['error_code'] == 0) {
												self.laces.modal('script-edit').close();
											} else {
												self.laces.alert({
													'title': self.app.i18n(self, 'TITLE_SAVE_SCRIPT_ERROR', 'Save script error'),
													'message': self.app.i18n(self, 'ERROR_SAVE_SCRIPT', 'There was an error saving the script'),
													'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
												});
												
												self.laces.modal('script-edit').close();
											}
										})
									} else {
										self.laces.alert({
											'title': self.app.i18n(self, 'TITLE_SAVE_SCRIPT_ERROR', 'Save script error'),
											'message': self.app.i18n(self, 'ERROR_GET_ORIGINAL_SCRIPT', 'There was an error getting the original script'),
											'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
										});
										
										self.laces.modal('script-edit').close();
									}
								});
								break;
							case 'delete':
								self.laces.modal('delete-script', {
									'html':		'<p>' + self.app.i18n(self, 'MSG_CONFIRM_DELETE_SCRIPT', 'Are you sure you want to delete this script?') + '</p>',
									'width':	'30rem',
									'buttons':	[{
										'id':		'yes',
										'title':	self.app.i18n(self, 'BTN_YES', 'Yes'),
										'style':	'primary'
									},{
										'id':		'no',
										'title':	self.app.i18n(self, 'BTN_No', 'No'),
										'style':	'secondary'
									}],
									'callback':	function(self, action, data) {
										if(action == '_click') {
											if(data.id == 'yes') {
												self.app.nao.send('cadet_scriptdelete', {'id': id}, function(r) {
													if(r['error_code'] == 0) {
														self.laces.modal('script-edit').close();
													} else {
														self.laces.alert({
															'title': self.app.i18n(self, 'TITLE_SCRIPT_DELETE_ERROR', 'Script Delete Error'),
															'message': self.app.i18n(self, 'ERROR_SAVE_SCRIPT', 'Your script could not be saved because an error occurred'),
															'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
														});
													}
												});
											}
											
											self.laces.modal('delete-script').close();
										}
									}
								}).show();
								
								break;
							case 'duplicate':
								self.laces.modal('script-edit').loading(true, true);

								self.app.nao.send('cadet_scriptget', {'id':id}, function(r) {
									if(r['error_code'] == 0) {
										data = {
											'id':		0,
											'name':		r['script']['name'] + ' ' + self.app.i18n(self, 'MSG_COPY', 'copy'),
											'user':		self.app.userId,
											'options':	r['script']['options'],
											'xml':		r['script']['xml']
										};
									
										self.app.nao.send('cadet_scriptset', data, function(r) {
											if(r['error_code'] == 0) {
												self.laces.modal('script-edit').close();
											} else {
												self.laces.alert({
													'title': self.app.i18n(self, 'TITLE_DUPLICATE_SCRIPT_ERROR', 'Duplicate script error'),
													'message': self.app.i18n(self, 'ERROR_SAVE_DUPLICATE_SCRIPT', 'There was an error saving the duplicate script'),
													'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
												});
												
												self.laces.modal('script-edit').close();
											}
										})
									} else {
										self.laces.alert({
											'title': self.app.i18n(self, 'TITLE_DUPLICATE_SCRIPT_ERROR', 'Duplicate script error'),
											'message': self.app.i18n(self, 'ERROR_GET_ORIGINAL_SCRIPT', 'There was an error getting the original script'),
											'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
										});
										
										self.laces.modal('script-edit').close();
									}
								});
								break;
							case 'export':
								self.app.nao.send('cadet_scriptget', {'id': id}, function(r) {
									if(r['error_code'] == 0) {
										self.app.scriptExport(self, r['script']['name'], r['script']['xml']);
									} else {
										self.laces.alert({
											'title': self.app.i18n(self, 'TITLE_EXPORT_SCRIPT_ERROR', 'Export script error'),
											'message': self.app.i18n(self, 'ERROR_EXPORT_SCRIPT', 'Could not retrieve the details of the script to export'),
											'details': self.app.i18n(self, 'MSG_ERROR_CODE') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
										});
									}
								});
								
								break;
						}

						break;
					case '_close':
						$('body').off('change', '#cadet-script-dir');
						break;
				}
			}
		}).show();
 	}
 	
/*
 *	Ask Name
 */
 	this.askName = function(self, title, value, button, cb, password=false) {
		var buttons = [{'id':'create', 'title':button, 'style':'primary'},{'id':'cancel', 'title':self.app.i18n(self, 'BTN_CANCEL', 'Cancel'), 'style':'secondary'}];
		self.laces.modal('askname', {
			'title':	title,
			'html':		'<p><input type="' + (password == false ? 'text' : 'password') + '" class="form-control" id="cadet-askname" value="' + self.laces.escapeHtml(value) + '"></p>',
			'buttons':	buttons,
			'width':	'19rem',
			'callback':	function(self, action, data) {
				switch(action) {
					case '_valid':
						if(data.id == 'cadet-askname' && data.value.toLowerCase().replace(/[^a-z0-9]/gi, '') == '') {
							return false;
						}
						
						return true;
					case '_click':
						switch(data.id) {
							case 'create':
								self.laces.modal('askname').loading(true);
								if(cb(self, self.laces.unescapeHtml(self.laces.modal('askname').find('#cadet-askname').val())) == false) {
									self.laces.modal('askname').loading(false);
								} else {
									self.laces.modal('askname').close();
								}
									
								break;
							case 'cancel':
								self.laces.modal('askname').close();
								break;
						}
						
						break;
				}
			}
		}).show();
 	}
 	
 	this.askNameClose = function(self) {
 		self.laces.modal('askname').close();
 	}


/*
 *	Script Import
 */
 	this.scriptImport = function(self) {
 		var xml = '';
 	
 		var importFunc = function(fileName, dataOffset, fileSize, data, dataLen, nextCallback, self) {
			if(dataOffset == -1) {
				self.laces.progress().close();
				self.app.scriptEdit(self, 0, xml);
			} else {
				xml += atob(data);
				self.laces.progress().percent(Math.floor((dataOffset / fileSize) * 100));
				nextCallback();
			}
		}
 	
		self.laces.uploader('application/xml', importFunc, self);
 	}
 
/*
 *	Script Export
 */
 	this.scriptExport = function(self, name, data, type='xml') {
 		if(name.substr(0, 1) == ".") {
 			name = name.substr(1)
 		}
 		name = name.replace(/[\/:*?|<>]/g, "");
 	
		var event = new MouseEvent('click', { 'view': window, 'bubbles': true, 'cancelable': false });
		var data = new Blob([data], {type: 'text/' + type});

		var a = document.createElement('a');
		a.href = window.URL.createObjectURL(data);
		a.download = name + '.' + type;
		a.dispatchEvent(event);
 	}
 
/*
 *	User Profile
 */
	this.actionUserProfile = function(self) {
		var html = '';
		
		html = '<div>' +
		'<div class="form-group row">' +
			'<label class="col-sm-4 col-form-label" for="cadet-profile-name">' + self.app.i18n(self, 'MSG_NAME', 'Name') + '</label>' +
			'<div class="col-sm-8"><input type="text" id="cadet-profile-name" class="form-control" value="' + self.laces.escapeHtml(self.app.userName) + '"></div>' +
		'</div>' +
		'<h5>' + self.app.i18n(self, 'TITLE_OPTIONS', 'Options') + '</h5>' +
			'<div class="form-check">' +
 			'<input class="form-check-input" type="checkbox" value="" id="cadet-profile-advanced"' + ('advanced' in self.app.userOptions && self.app.userOptions['advanced'] == true ? ' checked="checked"' : '') + '>' +
			'<label class="form-check-label" for="cadet-profile-advanced">' + self.app.i18n(self, 'BTN_SHOW_ADVANCED_BLOCKS', 'Show advanced blocks') + '</label>' +
			'</div>' +
		'<h5>' + self.app.i18n(self, 'TITLE_CHANGE_PASSWORD', 'Change Password') + '</h5>' +
		'<div class="form-group row">' +
			'<label class="col-sm-4 col-form-label" for="cadet-profile-password">' + self.app.i18n(self, 'MSG_NEW_PASSWORD', 'New Password') + '</label>' +
			'<div class="col-sm-8"><input type="password" id="cadet-profile-password" class="form-control"></div>' +
			'<small class="offset-sm-4 col-sm-8 form-text text-muted">' + self.app.i18n(self, 'MSG_LEAVE_BLANK_PASSWORD', 'Leave blank unless you want to change your password') + '</small>' +
		'</div>' +
		'<div id="cadet-profile-password-set-row" class="form-group row">' +
			'<div class="offset-sm-4 col-sm-8"><button class="btn btn-outline-secondary" id="cadet-profile-password-clear" class="form-control">' + self.app.i18n(self, 'BTN_REMOVE_PASSWORD', 'Remove Password') + '</button></div>' +
		'</div>' +
		'<div id="cadet-profile-password-noset-row" class="form-group row laces-hidden">' +
			'<div class="offset-sm-3 col-sm-6"><p class="alert alert-info"><small><i class="fa fa-info-circle" style="margin-right:1rem"></i>' + self.app.i18n(self, 'MSG_NO_PASSWORD_SET', 'No password has been set') + '</small></p></div>' +
		'</div>' +
		'</div>';
		
		var buttons = [{'id':'save', 'title':self.app.i18n(self, 'BTN_SAVE', 'Save'), 'style':'primary'},{'id':'cancel', 'title':self.app.i18n(self, 'BTN_CANCEL', 'Cancel'), 'style':'secondary'}];
		var passwordSet = false;

		self.laces.modal('user-profile', {
			'html':		html,
			'title':	self.app.i18n(self, 'TITLE_MY_PROFILE', 'My Profile'),
			'buttons':	[{
				'id':		'save',
				'title':	self.app.i18n(self, 'BTN_SAVE', 'Save'),
				'style':	'primary'
			},{
				'id':		'cancel',
				'title':	self.app.i18n(self, 'BTN_CANCEL', 'Cancel'),
				'style':	'secondary'
			}],
			'callback':	function(self, action, data) {
				switch(action) {
					case '_ready':														
						self.app.nao.send('cadet_userget', {'id': self.app.userId}, function(r) {
							if(r['error_code'] == 0) {
								if(r['user']['password'] == false) {
									$('#cadet-profile-password-set-row').hide();
									$('#cadet-profile-password-noset-row').show();
								} else {
									passwordSet = true;
								}

								if(!('options' in r['user']) || r['user']['options'] == '') r['user']['options'] = {};
																
								if('advanced' in r['user']['options'] && r['user']['options']['advanced'] == true) {
									$('#cadet-profile-advanced').prop('checked');
								}
							} else {
								self.laces.alert({
									'title': self.app.i18n(self, 'TITLE_LOAD_PROFILE_ERROR', 'Load profile error'),
									'message': self.app.i18n(self, 'ERROR_LOAD_PROFILE', 'Could not load the details of your profile'),
									'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
								});
								
								self.laces.modal('user-profile').close();
							}
						});
						break;
					case '_valid':
						return true;
					case '_click':
						switch(data.id) {
							case 'cancel':
								self.laces.modal('user-profile').close();
								break;
							case 'cadet-profile-password-clear':
								self.app.askName(self, self.app.i18n(self, 'MSG_CURRENT_PASSWORD', 'Current password'), '', self.app.i18n(self, 'BTN_VERIFY', 'Verify'), function(self, value) {
									self.app.nao.send('cadet_userset', {'id':self.app.userId, 'password':-1, 'currentPassword': value}, function(r) {
										if(r['error_code'] == 0) {
											$('#cadet-profile-password-set-row').hide();
											$('#cadet-profile-password-noset-row').show();
											passwordSet = false;
											
											self.app.nao.reauth(self.app.userName, '');
										} else {
											self.laces.alert({
												'title': self.app.i18n(self, 'TITLE_CHANGE_PASSWORD_ERROR', 'Change Password Error'),
												'message': self.app.i18n(self, 'ERROR_CHANGE_PASSWORD', 'Your password could not be changed because an error occurred'),
												'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
											});
										}
									});
								}, true);
								break;
							case 'save':
								self.laces.modal('user-profile').loading();
								
								self.app.userOptions['advanced'] = $('#cadet-profile-advanced').prop('checked');
								
								var data = {'id':self.app.userId, 'name':self.laces.unescapeHtml($('#cadet-profile-name').val()), 'options':self.app.userOptions};
								if($('#cadet-profile-password').val() != '') {
									data['password'] = self.laces.unescapeHtml($('#cadet-profile-password').val());
								}
								
								var saveFunc = function(data) {
									self.app.nao.send('cadet_userset', data, function(result) {
										if(result['error_code'] == 0) {
											if('password' in data) {
												self.app.nao.reauth(self.app.userName, data['password']);
											}
											
											self.app.workspace.toolboxMode((self.app.userOptions['advanced'] ? 'advanced' : 'simple'));
										
											self.app.userName = self.laces.unescapeHtml($('#cadet-profile-name').val());
										
											self.laces.modal('user-profile').close();
										} else {
											self.laces.alert({
												'title': self.app.i18n(self, 'TITLE_SAVE_PROFILE_ERROR', 'Save Profile Error'),
												'message': self.app.i18n(self, 'ERROR_SAVE_PROFILE', 'Your profile could not be saved because an error occurred. Your password has not been changed'),
												'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(result['error_code']) + ('error_message' in result ? '<br><br>' + result['error_message'] : ''),
											});
										}
									});
								}

								if('password' in data && passwordSet) {
									self.app.askName(self, self.app.i18n(self, 'MSG_CURRENT_PASSWORD', 'Current password'), '', self.app.i18n(self, 'BTN_VERIFY', 'Verify'), function(self, value) {
										data['currentPassword'] = value;
										saveFunc(data);
									}, true);
								} else {
									saveFunc(data);
								}

								break;
						}

						break;
				}
			}
		}).show();
	}

/*
 *	View Workspace
 */
	this.viewWorkspace = function(self, action, data) {
		switch(action) {
			case '_ready':
				if(self.app.userNew) {
// 					self.laces.tinkerbellEvent('tinkerbell_newuserscript');
				}
				
				break;
			case '_show':
				self.laces.navbar()
					.hide()
					.clear()
					.append('cadet-workspace-stop', self.app.i18n(self, 'BTN_STOP', 'Stop'), function(self, id) {
						self.app.workspace.stopXml(self.app.nao);
						self.laces.navbar()
							.showItem('cadet-workspace-run')
							.showItem('cadet-workspace-save')
							.showItem('cadet-workspace-export')
							.showItem('cadet-workspace-close')
							.showItem('cadet-script-dropdown')
							.hideItem('cadet-workspace-stop');
					}, {backgroundColor: '#f00'})
					.hideItem('cadet-workspace-stop')
					.append('cadet-workspace-run', self.app.i18n(self, 'BTN_RUN', 'Run'), function(self, id) { 
						self.laces.navbar().disable();
						self.app.workspace.runXml(self.app.nao, function(state, self) {
							self.laces.navbar().enable();
							switch(state.state) {
								case 'run':
									self.laces.navbar()
										.hideItem('cadet-workspace-run')
										.hideItem('cadet-workspace-save')
										.hideItem('cadet-workspace-export')
										.hideItem('cadet-workspace-close')
										.hideItem('cadet-script-dropdown')
										.showItem('cadet-workspace-stop');
									break;
								case 'stop':
									self.laces.navbar()
										.showItem('cadet-workspace-run')
										.showItem('cadet-workspace-save')
										.showItem('cadet-workspace-export')
										.showItem('cadet-workspace-close')
										.showItem('cadet-script-dropdown')
										.hideItem('cadet-workspace-stop');
									break;
								case 'wait':
									break;
								case 'error':
									self.laces.alert({
										'title': self.app.i18n(self, 'TITLE_NAO_ERROR', 'NAO Error'),
										'message': self.app.i18n(self, 'ERROR_RUN_SCRIPT', 'An error occurred trying to run your script'),
										'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(state.error_code) + (state.error_message != '' ? '<br><br>' + state.error_message : '')
									});
									break;
								default:
									alert(state.state);
									break;
							}
						}, self);
					})
					.append('cadet-workspace-save', self.app.i18n(self, 'BTN_SAVE', 'Save'), function(self, id) {
						var xml = self.app.workspace.getXml()
						
						self.app.nao.send('cadet_scriptset', {'id': self.scriptId, 'xml': xml}, function(r) {
							if(r['error_code'] == 0) {
								self.scriptXml = xml;
								self.app.workspace.status('<i class="fa fa-check-circle-o fa-fw"></i> ' + self.app.i18n(self, 'MSG_SCRIPT_SAVED', 'Script saved!'), 2000);
							} else if(r['error_code'] == 16) {
								self.app.askName(self, self.app.i18n(self, 'MSG_SAVE_SCRIPT_AS', 'Save script as'), self.scriptName, self.app.i18n(self, 'BTN_SAVE', 'Save'), function(self, value) {
									var data = {
										'id': 0,
										'user': self.app.userId,
										'name': value,
										'xml': xml
									};
									
									try {
										data['options'] = JSON.stringify(self.scriptOptions);
									} catch(e) {
										//...
									}
									
									self.app.nao.send('cadet_scriptset', data, function(r) {
										if(r['error_code'] == 0) {
											self.scriptId = r['id'];
											self.scriptName = value;
											self.laces.navbar().text(self.scriptName);
										} else {
											self.laces.alert({
												'title': self.app.i18n(self, 'TITLE_SAVE_SCRIPT_ERROR', 'Script Save Error'),
												'message': self.app.i18n(self, 'ERROR_SAVE_SCRIPT', 'Your script could not be saved because an error occurred'),
												'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
											});
										}
									});
								});
							} else {
								self.laces.alert({
									'title': self.app.i18n(self, 'TITLE_SAVE_SCRIPT_ERROR', 'Script Save Error'),
									'message': self.app.i18n(self, 'ERROR_SAVE_SCRIPT', 'Your script could not be saved because an error occurred'),
									'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
								});
							}
						});
					})
					.append('cadet-workspace-close', self.app.i18n(self, 'BTN_CLOSE', 'Close'), function(self, id) {
						if(self.scriptXml != self.app.workspace.getXml()) {
							self.laces.modal('workspace-save', {
								'html':		'<p>' + self.app.i18n(self, 'MSG_SAVE_SCRIPT_CONFIRM', 'Do you want to save the changes to your script?') + '</p>',
								'width':	'30rem',
								'buttons':	[{
									'id':		'save',
									'title':	self.app.i18n(self, 'BTN_SAVE', 'Save'),
									'style':	'primary'
								},{
									'id':		'no',
									'title':	self.app.i18n(self, 'BTN_NO', 'No'),
									'style':	'secondary'
								},{
									'id':		'cancel',
									'title':	self.app.i18n(self, 'BTN_CANCEL', 'Cancel'),
									'style':	'outline-secondary',
									'left':		true
								}],
								'callback':	function(self, action, data) {
									if(action == '_click') {
										if(data.id == 'save') {
											self.laces.jumbotron('workspace-save').loading(true);
											self.app.nao.send('cadet_scriptset', {'id': self.scriptId, 'xml': self.app.workspace.getXml()}, function(r) {
												self.laces.jumbotron('workspace-save').loading(false);
												self.laces.modal('workspace-save').close();
												if(r['error_code'] == 0) {
													self.laces.view('scripts').show();
												} else {
													self.laces.alert({
														'title': self.app.i18n(self, 'TITLE_SAVE_SCRIPT_ERROR', 'Script Save Error'),	
														'message': self.app.i18n(self, 'ERROR_SAVE_SCRIPT', 'Your script could not be saved because an error occurred'),
														'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
													});
												}
											});
										} else if(data.id == 'no') {
											self.laces.modal('workspace-save').close();
											self.laces.view('scripts').show();
										} else {
											self.laces.modal('workspace-save').close();
										}
									}
								}
							}).show();
						} else {
							self.laces.view('scripts').show();
						}
					})
					.appendDropdown('cadet-script-dropdown', '<i class="fa fa-bars"></i>', [
						{id: 'cadet-workspace-export',		title: self.app.i18n(self, 'MENU_EXPORT_SCRIPT', 'Export script')},
						{id: 'sep'},
						{id: 'cadet-view-sounds',		title: self.app.i18n(self, 'MENU_SOUNDS', 'Sounds')},
						{id: 'cadet-view-videos',		title: self.app.i18n(self, 'MENU_PHOTOSVIDEOS', 'Photos/Videos')},
						{id: 'cadet-view-behaviors',	title: self.app.i18n(self, 'MENU_BEHAVIORS', 'Behaviors')},
						{id: 'cadet-view-motions',		title: self.app.i18n(self, 'MENU_MOTIONS', 'Motions')},
						{id: 'sep'},
						{id: 'cadet-user-profile',		title: self.app.i18n(self, 'MENU_MY_PROFILE', 'My profile')},
						{id: 'cadet-user-logout',		title: self.app.i18n(self, 'MENU_LOGOUT', 'Logout')
					}], function(self, id, enabled) {
							switch(id) {
								case 'cadet-view-sounds':
									self.app.actionViewSounds(self);
									break;
								case 'cadet-view-videos':
									self.app.actionViewVideos(self);
									break;
								case 'cadet-view-behaviors':
									self.app.actionViewBehaviors(self);
									break;
								case 'cadet-view-motions':
									self.app.actionViewMotions(self);
									break;
								case 'cadet-user-profile':
									self.app.actionUserProfile(self);
									break;
								case 'cadet-user-logout':
									self.laces.view('login').show();
									break;
								case 'cadet-workspace-export':
									self.app.scriptExport(self, self.scriptName, self.app.workspace.getXml());
									break;
						}
					}
				)
// 				.append('cadet-script-tbell', '<i class="fa fa-bell"></i>', function(self, id) { self.laces.tinkerbellEvent('tinkerbell_menu'); })
				.show();
				
				//DEBUG
				//var showWorkspaceFunc = function(xml = '', advanced=false) {
				var showWorkspaceFunc = function(xml = '', advanced=true) {
					self.app.workspaceUpdateBehaviors(self);
					self.app.workspaceUpdateMotions(self);
					self.app.workspaceUpdateSounds(self);

					self.laces.status();
					self.app.workspace.show(xml, advanced);
					self.app.workspace.registerButton('view-sounds', function() { self.app.actionViewSounds(self); });
					self.app.workspace.registerButton('view-motions', function() { self.app.actionViewMotions(self); });
					self.app.workspace.registerButton('view-behaviors', function() { self.app.actionViewBehaviors(self); });
					self.app.workspace.registerButton('view-joints', function() { self.app.actionViewJoints(self); });
					self.app.workspace.registerEventCallback(self.app.workspaceEvent, self);
				}
 				
 				self.scriptId = parseInt(data);
 				if(self.scriptId != 0) {
 					self.app.nao.send('cadet_scriptget', {'id': self.scriptId}, function(r) {
 						if(r['error_code'] == 0) {
 							self.scriptName = r['script']['name'];
 							self.scriptXml = r['script']['xml'];
 							self.scriptOptions = r['script']['options'];
 							
 							self.laces.navbar().text(self.scriptName);
 							
							showWorkspaceFunc(r['script']['xml'], ('advanced' in self.app.userOptions ? self.app.userOptions['advanced'] : false));
 						} else {
							self.laces.alert({
								'title': self.app.i18n(self, 'TITLE_LOAD_SCRIPT_ERROR', 'Load script error'),
								'message': self.app.i18n(self, 'ERROR_LOADING_SCRIPT', 'Error loading script'),
								'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
							});
							
							self.laces.view('scripts').show();
 						}
 					});
 				} else {
					showWorkspaceFunc();
 				}
		}
	}

/*
 *	Workspace Event
 */
	this.workspaceEvent = function(event, data, self) {
		switch(event) {
			case 'block-create':
				break;
			case 'block-delete':
				break;
			case 'view-sounds':
				self.app.actionViewSounds(self);
				break;
			default:
				alert(event);
		}
	}

/*
 *	View Admin
 */
	this.viewAdmin = function(self, action) {
		switch(action) {
			case '_show':
				self.laces.navbar()
					.hide()
					.brand(self.app.i18n(self, 'NAO_CADET', 'NAO Cadet'), function(self) {
						self.app.viewAbout(self);
					})
					.clear()
					.append('cadet-admin-logout', self.app.i18n(self, 'MENU_LOGOUT', 'Logout'), function(self, id) { 
						self.laces.view('login').show();
					})
					.show();
				
				
				var html = '';
				
				html += '<div class="card cadet-admin-card"><div class="card-body"><div><a href="#" id="cadet-admin-location" class="btn btn-secondary float-right">' + self.app.i18n(self, 'BTN_CHANGE_LOCATION', 'Change Location') + '</a><a href="#" id="cadet-admin-location-view" class="btn btn-secondary float-right">' + self.app.i18n(self, 'BTN_VIEW_LOCATIONS', 'View Locations') + '</a></div><i class="fa fa-map-marker fa-fw"></i><p>' + self.app.i18n(self, 'MSG_LOCATION_SET_TO', 'Location set to') + ' <strong class="cadet-viewadmin-domain">' + self.app.nao.domain() + '</strong></p></div></div>';
				html += '<div class="card cadet-admin-card"><div class="card-body"><div><a href="#" id="cadet-admin-colour" class="btn btn-secondary float-right">' + self.app.i18n(self, 'BTN_CHANGE_COLOUR', 'Change Colour') + '</a></div><i class="fa fa-paint-brush fa-fw"></i><p>' + self.app.i18n(self, 'MSG_COLOUR_SET_TO', 'Colour currently set to') + ' <strong class="cadet-viewadmin-colour">' + self.app.nao.colour() + '</strong></p></div></div>';
				html += '<div class="card cadet-admin-card"><div class="card-body"><div><a href="#" id="cadet-admin-backup" class="btn btn-secondary float-right">' + self.app.i18n(self, 'BTN_BACKUP', 'Backup') + '</a><a href="#" id="cadet-admin-restore" class="btn btn-secondary float-right">' + self.app.i18n('BTN_RESTORE', 'Restore') + '</a></div><i class="fa fa-file-zip-o fa-fw"></i><p>' + self.app.i18n('MSG_BACKUP_RESTORE', 'Backup / Restore') + '</p></div></div>';
				html += '<div class="card cadet-admin-card"><div class="card-body"><div><a href="#" id="cadet-admin-users" class="btn btn-secondary float-right">' + self.app.i18n(self, 'BTN_VIEW_USERS', 'View Users') + '</a></div><i class="fa fa-users fa-fw"></i><p><strong></strong> ' + self.app.i18n(self, 'MSG_USERS', 'Users') + '</p></div></div>';
				html += '<div class="card cadet-admin-card"><div class="card-body"><div><a href="#" id="cadet-admin-scripts" class="btn btn-secondary float-right">' + self.app.i18n(self, 'BTN_VIEW_SCRIPTS', 'View Scripts') + '</a></div><i class="fa fa-code fa-fw"></i><p><strong></strong> ' + self.app.i18n(self, 'MSG_SCRIPTS', 'Scripts') + '</p></div></div>';
				html += '<div class="card cadet-admin-card"><div class="card-body"><div><a href="#" id="cadet-admin-files" class="btn btn-secondary float-right">' + self.app.i18n(self, 'BTN_VIEW_FILES', 'View Files') + '</a><a href="#" id="cadet-admin-temp-clear" class="btn btn-secondary float-right">' + self.app.i18n(self, 'BTN_CLEAR_TEMP_FILES', 'Clear Temp Files') + '</a></div><i class="fa fa-files-o fa-fw"></i><p><strong></strong> ' + self.app.i18n(self, 'MSG_FILES', 'Files') + '</p></div></div>';
				html += '<div class="card cadet-admin-card"><div class="card-body"><div><a href="#" id="cadet-admin-password" class="btn btn-secondary float-right">' + self.app.i18n(self, 'BTN_CHANGE_PASSWORD', 'Change Password') + '</a></div><i class="fa fa-vcard-o fa-fw"></i><p>' + self.app.i18n(self, 'MSG_CHANGE_ADMIN_PASSWORD', 'Change Admin Password') + '</p></div></div>';
				if(self.app.userName == 'root') {
					html += '<div class="card cadet-admin-card"><div class="card-body"><div><a href="#" id="cadet-root-password" class="btn btn-secondary float-right">' + self.app.i18n(self, 'BTN_CHANGE_PASSWORD', 'Change Password') + '</a></div><i class="fa fa-vcard-o fa-fw"></i><p>' + self.app.i18n(self, 'MSG_CHANGE_ROOT_PASSWORD', 'Change Root Password') + '</p></div></div>';
				}
				
				self.app.nao.subscribe('viewadmin_domainchanged', 'event_domain_changed', function(event, self) {
					self.app.nao.send('cadet_domainlist', null, function(r) {
						if(r['error_code'] == 0) {
							for(var i=0; i<r['domains'].length; i++) {
								if(r['domains'][i]['id'] == self.app.nao.domainId()) {
									$('.cadet-viewadmin-domain').html(r['domains'][i]['name']);
									break;
								}
							}
						}
					});
				}, self);
				
				return html;
			case '_ready':
				var locationsAllFunc = function() {
					var rowsFunc = function(self) {
						self.app.nao.send('cadet_domainlist', null, function(r) {
							var rows = [];

							if(r['error_code'] == 0) {
								if(r['domains'].length > 0) {
									for(var i=0; i<r['domains'].length; i++) {
										rows.push({'columns': [
											r['domains'][i]['name'],
											r['domains'][i]['userCount'],
											r['domains'][i]['scriptCount'],
											'<a href="#" class="btn btn-link" data-id="edit" data-value="' + r['domains'][i]['id'] + '"><i class="fa fa-pencil"></i></a>' +
											(r['domains'][i]['id'] != self.app.nao.domainId() ? (r['domains'][i]['deleted'] == 1 ? '<a href="#" class="btn btn-link" data-id="restore" data-value="' + r['domains'][i]['id'] + '"><i class="fa fa-undo"></i></a>' : '<a href="#" class="btn btn-link" data-id="delete" data-value="' + r['domains'][i]['id'] + '"><i class="fa fa-trash"></i></a>') : '')
										],
										'rowClass': (r['domains'][i]['deleted'] == 1 ? 'cadet-row-deleted' : '')
										});
									}
								}
							} else {
								self.laces.alert({
									'title': self.app.i18n(self, 'TITLE_LOAD_FILES_ERROR', 'Error loading files'),
									'message': self.app.i18n(self, 'ERROR_GET_FILE_LIST', 'There was a error getting the list of files on the NAO'),
									'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
								});
							}
				
							self.laces.listView('view-locations').rows(rows);
						});
					}
	
					self.laces.listView('view-locations', {
						'title':	self.app.i18n(self, 'TITLE_LOCATIONS', 'Locations'),
						'item':		self.app.i18n(self, 'ITEM_LOCATION', 'location'),
						'buttons':	[{
							'id':		'close',
							'title':	self.app.i18n(self, 'BTN_CLOSE', 'Close'),
							'style':	'primary'
						},{
							'id':		'add',
							'title':	self.app.i18n(self, 'BTN_CREATE_MORE', 'Create...'),
							'style':	'secondary'
						}],
						'columns':	[self.app.i18n(self, 'TITLE_NAME', 'Name'), self.app.i18n(self, 'TITLE_USERS', 'Users'), self.app.i18n(self, 'TITLE_SCRIPTS', 'Scripts'), self.app.i18n(self, 'TITLE_ACTIONS', 'Actions')],
						'widths': ['40%', '20%', '20%', '20%'],
						'callback':	function(self, action, data) {
							switch(action) {
								case '_ready':
									rowsFunc(self);
									break;
								case '_click':
									switch(data.id) {
										case 'edit':
											self.app.nao.send('cadet_domainget', {'id': data.value}, function(r) {
												if(r['error_code'] == 0) {
													self.app.askName(self, self.app.i18n(self, 'TITLE_RENAME_LOCATION', 'Rename location'), r['domain']['name'], self.app.i18n(self, 'BTN_RENAME', 'Rename'), function(self, value) {
														self.app.nao.send('cadet_domainset', {'id': data.value, 'name': value}, function(r) {
															if(r['error_code'] == 0) {
																rowsFunc(self);
															} else {
																self.laces.alert({
																	'title': self.app.i18n(self, 'TITLE_RENAME_LOCATION_ERROR', 'Rename location error'),
																	'message': self.app.i18n(self, 'ERROR_RENAME_LOCATION', 'Could not rename the location because an error occurred'),
																	'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
																});
															}
														});
													});
												} else {
													self.laces.alert({
														'title': self.app.i18n(self, 'TITLE_GET_LOCATION_ERROR', 'Get location error'),
														'message': self.app.i18n(self, 'ERROR_GET_LOCATION', 'Could not retrieve details about the selected location'),
														'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
													});
												}
											});
										
											break;
										case 'stoprecord':
											break;
										case 'close':
											self.laces.modal('view-locations').close();
											break;
										case 'delete':
											var id = data.value;
											self.laces.modal('location-delete', {
												'html':		'<p>' + self.app.i18n(self, 'MSG_CONFIRM_DELETE_LOCATION', 'Are you sure you want to delete this location?') + '</p>',
												'width':	'30rem',
												'buttons':	[{
													'id':		'yes',
													'title':	self.app.i18n(self, 'BTN_YES', 'Yes'),
													'style':	'primary'
												},{
													'id':		'no',
													'title':	self.app.i18n(self, 'BTN_NO', 'No'),
													'style':	'secondary'
												}],
												'callback':	function(self, action, data) {
													if(action == '_click') {
														if(data.id == 'yes') {
															self.app.nao.send('cadet_domaindelete', {'id': id}, function(r) {
																self.laces.modal('location-delete').close();
																if(r['error_code'] == 0) {
																	rowsFunc(self);
																} else {
																	self.laces.alert({
																		'title': self.app.i18n(self, 'TITLE_DELETE_LOCATION_ERROR', 'Error deleting location'),
																		'message': self.app.i18n(self, 'ERROR_DELETE_LOCATION', 'An problem occurred trying to delete the location'),
																		'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
																	});
																}
															});
														} else {
															self.laces.modal('file-delete').close();
														}
													}
												}
											}).show();
								
											break;
										case 'restore':
											var id = data.value;
											
											self.app.nao.send('cadet_domainrestore', {'id': id}, function(r) {
												if(r['error_code'] == 0) {
													rowsFunc(self);
												} else {
													self.laces.alert({
														'title': self.app.i18n(self, 'TITLE_RESTORE_LOCATION_ERROR', 'Error restoring location'),
														'message': self.app.i18n(self, 'ERROR_RESTORE_LOCATION', 'An problem occurred trying to restore the location'),
														'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
													});
												}
											});
											
											break;
										case 'add':
											self.app.askName(self, self.app.i18n(self, 'TITLE_CREATE_LOCATION', 'Create location'), '', self.app.i18n(self, 'BTN_CREATE', 'Create'), function(self, value) { 
												self.app.nao.send('cadet_domainset', {'id':0, 'name':value}, function(r) {
													if(r['error_code'] == 0) {
														var val = self.laces.escapeHtml(value);
														$('<option>').val(r['id']).html(val).insertBefore('#cadet-select-location option[data-divider=true]');
														$('#cadet-select-location').val(r['id']);
														$('#cadet-select-location').lacesSelect('refresh');
													} else {
														self.laces.alert({
															'title': self.app.i18n(self, 'TITLE_LOCATION_ERROR', 'Location error'),
															'message': self.app.i18n(self, 'ERROR_CREATE_LOCATION', 'There was an error creating the location'),
															'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
														});
													}
												});
												
												rowsFunc(self);
											});
											break;
									}

									break;
								case '_close':
									self.app.nao.unsubscribe('viewadmin_domainchanged');
									break;
							}
						}
					}).show();
				}
				
				var locationChangeFunc = function() {
					self.app.nao.send('cadet_domainlist', null, function(r) {
						if(r['error_code'] == 0) {
							var html = '';
							
							html += '<div class="form-group"><label for="cadet-select-location">' + self.app.i18n(self, 'MSG_LOCATION', 'Location') + ':</label> <select id="cadet-select-location">';
							
							for(var i=0; i<r['domains'].length; i++) {
								html += '<option value="' + r['domains'][i]['id'] + '"' + (self.app.nao.domainId() == r['domains'][i]['id'] ? ' selected' : '') + '>' + self.laces.escapeHtml(r['domains'][i]['name']) + '</option>';
							}
							
							html += '<option data-divider="true"></option>';
							html += '<option value="...">' + self.app.i18n(self, 'BTN_CREATE_MORE', 'Create...') + '</option>';
							html += '</select></div>';
							
							html += '<div class="alert alert-danger"><strong>' + self.app.i18n(self, 'MSG_WARNING', 'Warning') + '</strong> ' + self.app.i18n(self, 'MSG_CHANGE_DISCONNECT_USERS', 'Changing this setting will force all connected users to be disconnected') + '</div>';

							self.laces.modal('setup', {
								'html':		html,
								'title':	self.app.i18n(self, 'TITLE_CHANGE_LOCATION', 'Change Location'),
								'width':	'28rem',
								'buttons':	[{
									'id':		'save',
									'title':	self.app.i18n(self, 'BTN_SAVE', 'Save'),
									'style':	'primary'
								},{
									'id':		'cancel',
									'title':	self.app.i18n(self, 'BTN_CANCEL', 'Cancel'),
									'style':	'secondary'
								}],
								'callback':	function(self, action, data) {
									switch(action) {
										case '_close':
											$('body').off('change', '#cadet-select-location');
											break;
										case '_ready':
											$('body').on('change', '#cadet-select-location', function() {
												if($(this).val() == '...') {
													self.app.askName(self, self.app.i18n(self, 'TITLE_CREATE_LOCATION', 'Create location'), '', self.app.i18n(self, 'BTN_CREATE', 'Create'), function(self, value) { 
														var titleNew = value.toLowerCase().replace(/[^a-z0-9]/gi, '');
														var found = false;
		
														$('#cadet-select-location option').each(function() {
															var title = $(this).html();
															
															if(title != '') {
																title = title.toLowerCase().replace(/[^a-z0-9]/gi, '');
																if(title == titleNew) {
																	$('#cadet-select-location').val($(this).val());
																	found = true;
																}
															}
														});
		
														if(found == false) {
															self.app.nao.send('cadet_domainset', {'id':0, 'name':value}, function(r) {
																if(r['error_code'] == 0) {
																	var val = self.laces.escapeHtml(value);
																	$('<option>').val(r['id']).html(val).insertBefore('#cadet-select-location option[data-divider=true]');
																	$('#cadet-select-location').val(r['id']);
																	$('#cadet-select-location').lacesSelect('refresh');
																} else {
																	self.laces.alert({
																		'title': self.app.i18n(self, 'TITLE_LOCATION_ERROR', 'Location Error'),
																		'message': self.app.i18n(self, 'ERROR_CREATE_LOCATION', 'Could not create the location on the NAO'),
																		'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
																	});
																}
															});														
														}
													});
												}
											});

											break;
										case '_valid':
											return true;
										case '_click':
											switch(data.id) {
												case 'save':
													self.laces.modal('setup').loading(true);
													
													var domainId = parseInt($('#cadet-select-location').val());
													if(!(isNaN(domainId)) && domainId > 0 && domainId != self.app.nao.domainId()) {
														self.app.nao.send('cadet_settingset', {'setting':'domain', 'value':domainId}, function(r) {
															self.laces.modal('setup').loading(false);
															
															if(r['error_code'] == 0) {
																self.app.nao.send('cadet_restart', null, null);
																self.laces.modal('setup').close();
															} else {
																self.laces.alert({
																	'title': self.app.i18n(self, 'TITLE_LOCATION_ERROR', 'Location Error'),
																	'message': self.app.i18n(self, 'ERROR_SET_LOCATION', 'Could not set the location on the NAO'),
																	'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
																});
															}
														});
													} else {
														self.laces.modal('setup').loading(false);
														
														self.laces.alert({
															'title': self.app.i18n(self, 'TITLE_SET_LOCATION_ERROR', 'Set location error'),
															'message': self.app.i18n(self, 'MSG_SET_LOCATION_TO_SAVE', 'You need to select a valid location before it can be saved')
														});
													}

													break;
												case 'cancel':
													self.laces.modal('setup').close();
													break;
											}
											
											break;
									}
								}
							}).show();
						} else {
							self.laces.alert({
								'title': self.app.i18n(self, 'TITLE_LOCATION_ERROR', 'Location Error'),
								'message': self.app.i18n(self, 'ERROR_GETTING_LOCATIONS', 'Could not retrieve the locations on the NAO'),
								'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
							});
						}
					});
				}

				var backupFunc = function() {
					self.laces.progress(self.app.i18n(self, 'TITLE_BACKUP_PROGRESS', 'Backing up...'));
					self.app.nao.send('cadet_backup', null, function(r) {
						self.laces.progress().close();
						
						if(r['error_code'] == 0) {
							window.location = '/file/backup.tar.gz';
						} else {
							self.laces.alert({
								'title': self.app.i18n(self, 'TITLE_BACKUP_ERROR', 'Backup error'),
								'message': self.app.i18n(self, 'ERROR_BACKUP', 'An error occurred backing up NAO Cadet'),
								'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
							});
						}
					});
				}

				var restoreFunc = function() {
					var uploadFunc = function(fileName, dataOffset, fileSize, data, dataLen, nextCallback, self) {
						self.app.nao.send('cadet_fileupload', {'name':fileName, 'offset':dataOffset, 'data':data}, function(result) {
							if(result['error_code'] == 0) {
								if(self.laces.progress().cancelled() == true) {
									self.laces.progress().close();
									return;
								}
		
								if(dataOffset == -1) {
									self.laces.progress().close();
									self.app.nao.send('cadet_restore', {'name': fileName}, function(r) {
										self.laces.progress().close();
								
										if(r['error_code'] == 0) {
											
										} else {
											self.laces.alert({
												'title': self.app.i18n(self, 'TITLE_RESTORE_ERROR', 'Restore error'),
												'message': self.app.i18n(self, 'ERROR_RESTORE', 'An error occurred restoring NAO Cadet'),
												'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
											});
										}
									});
								} else {
									self.laces.progress().percent(Math.floor((dataOffset / fileSize) * 100));
									nextCallback();
								}
							} else {
								self.laces.progress().close();
								self.laces.alert({
									'title': self.app.i18n(self, 'TITLE_UPLOAD_ERROR', 'Upload error'),
									'message': self.app.i18n(self, 'ERROR_UPLOADING_FILE', 'There was an error uploading the file'),
									'details': self.app.nao.errorCodeToText(result.error_code) + ('error_message' in result ? '<br><br>' + result['error_message'] : '')
								});
							}
						});
					}

					self.laces.uploader('application/tar+gzip', uploadFunc, self);
				}

				var usersListFunc = function(domainName='') {
					var search = '';
					if(domainName != '') {
						search = 'domain:' + domainName;
					}
					
					var rowsFunc = function(self) {
						self.app.nao.send('cadet_userlist', {'domain':0}, function(r) {
							var rows = [];

							if(r['error_code'] == 0) {
								if(r['users'].length > 0) {
									for(var i=0; i<r['users'].length; i++) {
										var smallExt = '';
										
										if(r['users'][i]['domainDeleted'] == 1 || r['users'][i]['deleted'] == 1) {
											if(r['users'][i]['domainDeleted'] == 1) {
												smallExt = 'Domain';
												if(r['users'][i]['deleted'] == 1) {
													smallExt += ' & User';
												}
											}
										}
									
										rows.push({'columns': [
											r['users'][i]['name'] + (smallExt != '' ? '<small> (' + smallExt + ' deleted)</small>' : ''),
											r['users'][i]['domainName'],
											r['users'][i]['scriptCount'],
											'<a href="#" class="btn btn-link" data-id="edit" data-value="' + r['users'][i]['id'] + '"><i class="fa fa-pencil"></i></a>' + 
											(r['users'][i]['deleted'] == 1 ? '<a href="#" class="btn btn-link" data-id="restore" data-value="' + r['users'][i]['id'] + '"><i class="fa fa-undo"></i></a>' : '<a href="#" class="btn btn-link" data-id="delete" data-value="' + r['users'][i]['id'] + '"><i class="fa fa-trash"></i></a>')
										],
										'rowClass': ((r['users'][i]['deleted'] == 1 || r['users'][i]['domainDeleted'] == 1) ? 'cadet-row-deleted' : '')
										});
									}
								}
							} else {
								self.laces.alert({
									'title': self.app.i18n(self, 'TITLE_LOAD_FILES_ERROR', 'Error loading files'),
									'message': self.app.i18n(self, 'ERROR_GET_FILE_LIST', 'There was a error getting the list of files on the NAO'),
									'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
								});
							}
				
							self.laces.listView('view-users').rows(rows);
						});
					}
	
					self.laces.listView('view-users', {
						'title':	self.app.i18n(self, 'TITLE_USERS', 'Users'),
						'item':		self.app.i18n(self, 'ITEM_USER', 'user'),
 						'search':	search,
						'buttons':	[{
							'id':		'close',
							'title':	self.app.i18n(self, 'BTN_CLOSE', 'Close'),
							'style':	'primary'
						}],
						'columns':	['Name', 'Domain', 'Scripts', 'Actions'],
						'widths': ['35%', '30%', '15%', '20%'],
						'callback':	function(self, action, data) {
							switch(action) {
								case '_ready':
									rowsFunc(self);
									break;
								case '_click':
									switch(data.id) {
										case 'edit':
											self.app.askName(self, self.app.i18n(self, 'TITLE_RENAME_USER', 'Rename user'), data.value, self.app.i18n(self, 'BTN_RENAME', 'Rename'), function(self, value) {
												self.app.nao.send('audiodevice_startmicrophonesrecording', {"name": value}, function(r) {
													if(r['error_code'] == 0) {
														$('#stoprecord').show();
														$('#record').hide();
													} else {
														self.laces.alert({
															'title': self.app.i18n(self, 'TITLE_NAO_ERROR', 'NAO Error'),
															'message': self.app.i18n(self, 'ERROR_RENAME_USER', 'An error occurred renaming the user'),
															'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
														});
													}
												});
											});
								
											break;
										case 'stoprecord':
											break;
										case 'close':
											self.laces.modal('view-users').close();
											break;
										case 'delete':
											var id = data.value;
											self.laces.modal('user-delete', {
												'html':		'<p>' + self.app.i18n(self, 'MSG_CONFIRM_DELETE_USER', 'Are you sure you want to delete this user?') + '</p>',
												'width':	'30rem',
												'buttons':	[{
													'id':		'yes',
													'title':	self.app.i18n(self, 'BTN_YES', 'Yes'),
													'style':	'primary'
												},{
													'id':		'no',
													'title':	self.app.i18n(self, 'BTN_NO', 'No'),
													'style':	'secondary'
												}],
												'callback':	function(self, action, data) {
													if(action == '_click') {
														if(data.id == 'yes') {
															self.app.nao.send('cadet_userdelete', {'id': id}, function(r) {
																self.laces.modal('user-delete').close();
																if(r['error_code'] == 0) {
																	rowsFunc(self);
																} else {
																	self.laces.alert({
																		'title': self.app.i18n(self, 'TITLE_NAO_ERROR', 'NAO Error'),
																		'message': self.app.i18n(self, 'ERROR_DELETE_USER', 'An problem occurred trying to delete the user'),
																		'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
																	});
																}
															});
														} else {
															self.laces.modal('user-delete').close();
														}
													}
												}
											}).show();
								
											break;
										case 'restore':
											self.app.nao.send('cadet_userrestore', {'id': data.value}, function(r) {
												if(r['error_code'] == 0) {
													rowsFunc(self);
												} else {
													self.laces.alert({
														'title': self.app.i18n(self, 'TITLE_NAO_ERROR', 'NAO Error'),
														'message': self.app.i18n(self, 'ERROR_RESTORE_USER', 'An problem occurred trying to restore the user'),
														'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
													});
												}
											});
											
											break;
										case 'add':
											break;
									}

									break;
								case '_close':
									break;
							}
						}
					}).show();
				}
								
				var scriptsListFunc = function(domainName='') {
					var search = '';
					if(domainName != '') {
						search = 'domain:' + domainName;
					}
					
					var rowsFunc = function(self) {
						self.app.nao.send('cadet_scriptlist', {'domain':0}, function(r) {
							var rows = [];

							if(r['error_code'] == 0) {
								if(r['scripts'].length > 0) {
									for(var i=0; i<r['scripts'].length; i++) {
										var smallExt = '';
										
										if(r['scripts'][i]['domainDeleted'] == 1 || r['scripts'][i]['userDeleted'] == 1) {
											if(r['scripts'][i]['domainDeleted'] == 1) {
												smallExt = ' & Domain';
											}

											if(r['scripts'][i]['userDeleted'] == 1) {
												smallExt += ' & User';
											}

											if(r['scripts'][i]['deleted'] == 1) {
												smallExt += ' & Script';
											}
											
											smallExt = smallExt.substr(3);
										}
									
										rows.push({'columns': [
											r['scripts'][i]['name'] + (smallExt != '' ? '<small> (' + smallExt + ' deleted)</small>' : ''),
											r['scripts'][i]['username'],
											r['scripts'][i]['domainName'],
											(r['scripts'][i]['domain'] != 0 ?
											'<a href="#" class="btn btn-link" data-id="edit" data-value="' + r['scripts'][i]['id'] + '"><i class="fa fa-pencil"></i></a>' + 
											(r['scripts'][i]['deleted'] == 1 ? '<a href="#" class="btn btn-link" data-id="restore" data-value="' + r['scripts'][i]['id'] + '"><i class="fa fa-undo"></i></a>' : '<a href="#" class="btn btn-link" data-id="delete" data-value="' + r['scripts'][i]['id'] + '"><i class="fa fa-trash"></i></a>')
											: '')
										],
										'rowClass': ((r['scripts'][i]['deleted'] == 1 || r['scripts'][i]['userDeleted'] == 1 || r['scripts'][i]['domainDeleted'] == 1) ? 'cadet-row-deleted' : '')
										});
									}
								}
							} else {
								self.laces.alert({
									'title': self.app.i18n(self, 'TITLE_LOADING_SCRIPTS_ERROR', 'Error loading scripts'),
									'message': self.app.i18n(self, 'ERROR_LOADING_SCRIPTS', 'Error loading scripts'),
									'details': self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
								});
							}
				
							self.laces.listView('view-scripts').rows(rows);
						});
					}
	
					self.laces.listView('view-scripts', {
						'title':	self.app.i18n(self, 'TITLE_SCRIPTS', 'Scripts'),
						'item':		self.app.i18n(self, 'ITEM_SCRIPT', 'script'),
 						'search':	search,
						'buttons':	[{
							'id':		'close',
							'title':	self.app.i18n(self, 'BTN_CLOSE', 'Close'),
							'style':	'primary'
						}],
						'columns':	[self.app.i18n(self, 'TITLE_NAME', 'Name'), self.app.i18n(self, 'TITLE_USER', 'User'), self.app.i18n(self, 'TITLE_DOMAIN', 'Domain'), self.app.i18n(self, 'TITLE_ACTIONS', 'Actions')],
						'widths': ['40%', '20%', '20%', '20%'],
						'callback':	function(self, action, data) {
							switch(action) {
								case '_ready':
									rowsFunc(self);
									break;
								case '_click':
									switch(data.id) {
										case 'edit':
											self.app.askName(self, self.app.i18n(self, 'TITLE_RECORD_AUDIO', 'Record audio'), data.value, self.app.i18n(self, 'BTN_RECORD', 'Record'), function(self, value) {
												self.app.nao.send('audiodevice_startmicrophonesrecording', {"name": value}, function(r) {
													if(r['error_code'] == 0) {
														$('#stoprecord').show();
														$('#record').hide();
													} else {
														self.laces.alert({
															'title': self.app.i18n(self, 'TITLE_NAO_ERROR', 'NAO Error'),
															'message': self.app.i18n(self, 'ERROR_RECORDING', 'The NAO could not record audio because an error occurred'),
															'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
														});
													}
												});
											});
								
											break;
										case 'stoprecord':
											break;
										case 'close':
											self.laces.modal('view-scripts').close();
											break;
										case 'delete':
											var id = data.value;
											self.laces.modal('script-delete', {
												'html':		'<p>' + self.app.i18n(self, 'MSG_CONFIRM_DELETE_SCRIPT', 'Are you sure you want to delete this script?') + '</p>',
												'width':	'30rem',
												'buttons':	[{
													'id':		'yes',
													'title':	self.app.i18n(self, 'BTN_YES', 'Yes'),
													'style':	'primary'
												},{
													'id':		'no',
													'title':	self.app.i18n(self, 'BTN_NO', 'No'),
													'style':	'secondary'
												}],
												'callback':	function(self, action, data) {
													if(action == '_click') {
														if(data.id == 'yes') {
															self.app.nao.send('cadet_scriptdelete', {'id': id}, function(r) {
																self.laces.modal('script-delete').close();
																if(r['error_code'] == 0) {
																	rowsFunc(self);
																} else {
																	self.laces.alert({
																		'title': self.app.i18n(self, 'TITLE_SCRIPT_DELETE_ERROR', 'Script Delete Script'),
																		'message': self.app.i18n(self, 'ERROR_DELETE_SCRIPT', 'There was an error deleting the script'),
																		'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
																	});
																}
															});
														} else {
															self.laces.modal('script-delete').close();
														}
													}
												}
											}).show();
								
											break;
										case 'restore':
											self.app.nao.send('cadet_scriptrestore', {'id': data.value}, function(r) {
												if(r['error_code'] == 0) {
													rowsFunc(self);
												} else {
													self.laces.alert({
														'title': self.app.i18n(self, 'TITLE_RESTORE_SCRIPT_ERROR', 'Error restoring script'),
														'message': self.app.i18n(self, 'ERROR_RESTORE_SCRIPT', 'There was an error restoring the script'),
														'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
													});
												}
											});

											break;
										case 'add':
											break;
									}

									break;
								case '_close':
									break;
							}
						}
					}).show();
				}
								
				var filesListFunc = function() {
					var rowsFunc = function(self) {
						self.app.nao.send('cadet_filelist', {'domain':0}, function(r) {
							var rows = [];
							var showAdd = self.app.workspace.visible();

							if(r['error_code'] == 0) {
								if(r['files'].length > 0) {
									for(var i=0; i<r['files'].length; i++) {
										rows.push({'columns': [
											r['files'][i]['name'],
											[formatBytes(r['files'][i]['size']), r['files'][i]['size']],
											'<a href="#" class="btn btn-link" data-id="edit" data-value="' + r['files'][i]['name'] + '"><i class="fa fa-pencil"></i></a>' +
											'<a href="#" class="btn btn-link" data-id="download" data-value="' + r['files'][i]['name'] + '"><i class="fa fa-download"></i></a>' +
											(r['files'][i]['deleted'] == 1 ? '<a href="#" class="btn btn-link" data-id="restore" data-value="' + r['files'][i]['name'] + '"><i class="fa fa-undo"></i></a>' :
											'<a href="#" class="btn btn-link" data-id="delete" data-value="' + r['files'][i]['name'] + '"><i class="fa fa-trash"></i></a>')
										],
										'rowClass': (r['files'][i]['deleted'] == 1 ? 'cadet-row-deleted' : '')
										});
									}
								}
							} else {
								self.laces.alert({
									'title': self.app.i18n(self, 'TITLE_LOAD_FILES_ERROR', 'Error loading files'),
									'message': self.app.i18n(self, 'ERROR_GET_FILE_LIST', 'There was a error getting the list of files on the NAO'),
									'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
								});
							}
				
							self.laces.listView('view-files').rows(rows);
						});
					}
					
					// TODO add callback to reload when files change
	
					self.laces.listView('view-files', {
						'title':	self.app.i18n(self, 'TITLE_FILES', 'Files'),
						'item':		self.app.i18n(self, 'ITEM_FILE', 'file'),
						'buttons':	[{
							'id':		'close',
							'title':	self.app.i18n(self, 'BTN_CLOSE', 'Close'),
							'style':	'primary'
						},{
							'id':		'upload',
							'title':	self.app.i18n(self, 'BTN_UPLOAD', 'Upload'),
							'style':	'secondary'
						}],
						'columns':	[self.app.i18n(self, 'TITLE_NAME', 'Name'), self.app.i18n(self, 'TITLE_SIZE', 'Size'), self.app.i18n(self, 'TITLE_ACTIONS', 'Actions')],
						'widths': ['50%', '20%', '30%'],
						'callback':	function(self, action, data) {
							switch(action) {
								case '_ready':
									rowsFunc(self);
									break;
								case '_click':
									switch(data.id) {
										case 'edit':
											self.app.askName(self, self.app.i18n(self, 'TITLE_RENAME_FILE', 'Rename file'), data.value, self.app.i18n(self, 'MSG_RENAME', 'Rename'), function(self, value) {
												self.app.nao.send('cadet_filerename', {'name': data.value, 'newname': value}, function(r) {
													if(r['error_code'] == 0) {
														rowsFunc(self);
													} else {
														self.laces.alert({
															'title': self.app.i18n(self, 'TITLE_NAO_ERROR', 'NAO Error'),
															'message': self.app.i18n(self, 'ERROR_RENAME_FILE', 'Could not rename the file because an error occurred'),
															'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
														});
													}
												});
											});
								
											break;
										case 'close':
											self.laces.modal('view-files').close();
											break;
										case 'delete':
											name = data.value;
											self.laces.modal('file-delete', {
												'html':		'<p>' + self.app.i18n(self, 'MSG_CONFIRM_DELETE_FILE', 'Are you sure you want to delete this file?') + '</p>',
												'width':	'30rem',
												'buttons':	[{
													'id':		'yes',
													'title':	self.app.i18n(self, 'BTN_YES', 'Yes'),
													'style':	'primary'
												},{
													'id':		'no',
													'title':	self.app.i18n(self, 'BTN_NO', 'No'),
													'style':	'secondary'
												}],
												'callback':	function(self, action, data) {
													if(action == '_click') {
														if(data.id == 'yes') {
															self.app.nao.send('cadet_filedelete', {'name': name}, function(r) {
																self.laces.modal('file-delete').close();
																if(r['error_code'] == 0) {
																	rowsFunc(self);
																} else {
																	self.laces.alert({
																		'title': self.app.i18n(self, 'TITLE_DELETE_FILE_ERROR', 'Error deleting file'),
																		'message': self.app.i18n(self, 'ERROR_DELETE_FILE', 'There was an error deleting the file'),
																		'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
																	});
																}
															});
														} else {
															self.laces.modal('file-delete').close();
														}
													}
												}
											}).show();
								
											break;
										case 'restore':
											self.app.nao.send('cadet_filerestore', {'name': data.value}, function(r) {
												if(r['error_code'] == 0) {
													rowsFunc(self);
												} else {
													self.laces.alert({
														'title': self.app.i18n(self, 'TITLE_ERROR_RESTORE_FILE', 'Error restoring file'),
														'message': self.app.i18n(self, 'ERROR_RESTORING_FILE', 'An problem occurred trying to restore the file'),
														'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
													});
												}
											});
											break;
										case 'download':
											self.app.fileDownload('file/' + data.value);
											break;
										case 'upload':
											self.laces.uploader('audio/mp3, audio/wav, video/avi', self.app.naoUploader, self);
											// TODO ask to rename if already exists
											break;
									}

									break;
								case '_close':
									break;
							}
						}
					}).show();
				}
				
				var filesClearTempFunc = function() {
					self.app.nao.send('cadet_filecleartmp', null, function(r) {
						if(r['error_code'] == 0) {
							self.laces.alert({
								'style': 'success',
								'title': self.app.i18n(self, 'TITLE_CLEAR_TEMP_FILES_SUCCESS', 'Clear Temp Files Success'),
								'message': self.app.i18n(self, 'MSG_CLEAR_TEMP_FILES_SUCCESS', 'Temporary files have been cleared successfully')
							});
						} else {
							self.laces.alert({
								'title': self.app.i18n(self, 'TITLE_CLEAR_TEMP_FILES_ERROR', 'Clear Temp Files Error'),
								'message': self.app.i18n(self, 'ERROR_CLEAR_TEMP_FILES', 'There was an error clearing the temporary files from NAO Cadet'),
								'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
							});
						}
					});
				}
				
				var passwordChangeFunc = function(user) {
					var html = '';
				
					html += '<div class="form-group">' +
						'<label for="cadet-setup-admin">' + self.app.i18n(self, 'MSG_CURRENT_PASSWORD', 'Current password') + '</label>' +
						'<input type="password" class="form-control" id="cadet-password-current">' +
					'</div>';
					
					html += '<div class="form-group">' +
						'<label for="cadet-setup-admin">' + self.app.i18n(self, 'MSG_NEW_PASSWORD', 'New password') + '</label>' +
						'<input type="password" class="form-control" id="cadet-password-new">' +
					'</div>';
					
					html += '<div class="form-group">' +
						'<label for="cadet-setup-admin">' + self.app.i18n(self, 'MSG_NEW_PASSWORD_AGAIN', 'New password (again)') + '</label>' +
						'<input type="password" class="form-control" id="cadet-password-repeat">' +
					'</div>';
					
					self.laces.modal('change-password', {
						'html':		html,
						'title':	self.app.i18n(self, 'TITLE_CHANGE_USER_PASSWORD', 'Change %USERNAME% password'),
						'buttons':	[{
							'id':		'save',
							'title':	self.app.i18n(self, 'BTN_SAVE', 'Save'),
							'style':	'primary'
						},{
							'id':		'cancel',
							'title':	self.app.i18n(self, 'BTN_CANCEL', 'Cancel'),
							'style':	'outline-secondary'
						}],
						'callback':	function(self, action, data) {
							switch(action) {
								case '_ready':														
									break;
								case '_valid':
									if(data.id == 'cadet-password-current' && data.value == '') {
										return false;
									}
									if(data.id == 'cadet-password-new' && data.value == '') {
										return false;
									}
									if(data.id == 'cadet-password-repeat') {
										if(data.value != $('#cadet-password-new').val()) {
											return false;
										}
									}
							
									return true;
								case '_click':
									if(data.id == 'save') {
										this.loading(true);

										self.app.nao.send('cadet_userset', {'id':(user == 'admin' ? -1 : -2), 'password':$('#cadet-password-new').val(), 'currentPassword':$('#cadet-password-current').val()}, function(r) {
											self.laces.modal('change-password').loading(false);
											if(r['error_code'] == 0) {
												self.laces.alert({
													'style': 'success',
													'title': self.app.i18n(self, 'TITLE_CHANGE_PASSWORD_SUCCESS', 'Password changed'),
													'message': self.app.i18n(self, 'MSG_PASSWORD_CHANGED', 'The password for the %ACCOUNT% account has been changed', {ACCOUNT: {content: name}})
												});
											} else if(r['error_code'] == 15) {
												self.laces.alert({
													'title': self.app.i18n(self, 'TITLE_CHANGE_PASSWORD_ERROR', 'Change Password Error'),
													'message': self.app.i18n(self, 'ERROR_CHANGE_PASSWORD_INCORRECT', 'The current password you entered was incorrect. The password for the %ACCOUNT% account has not been changed', {ACCOUNT: {content: name}}),
												});
											} else {
												self.laces.alert({
													'title': self.app.i18n(self, 'TITLE_CHANGE_PASSWORD_ERROR', 'Change Password Error'),
													'message': self.app.i18n(self, 'ERROR_CHANGE_PASSWORD', 'Your password could not be changed because an error occurred'),
													'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
												});
											}

											self.laces.modal('change-password').close();
										});
									} else {
										self.laces.modal('change-password').close();
									}

									break;
							}
						}
					}).show();
				}
								
				var colourChangeFunc = function(user) {
					var html = '';
				
					html += '<div class="form-group">' +
						'<label for="cadet-colour" class="mr-3">' + self.app.i18n(self, 'MSG_COLOUR', 'Colour') + '</label>' +
						'<select id="cadet-colour" class="custom-select custom-select-lg mb-3">' +
							'<option value="aqua">' + self.app.i18n(self, 'MSG_COLOUR_AQUA', 'Aqua') + '</option>' +
							'<option value="blue">' + self.app.i18n(self, 'MSG_COLOUR_BLUE', 'Blue') + '</option>' +
							'<option value="green">' + self.app.i18n(self, 'MSG_COLOUR_GREEN', 'Green') + '</option>' +
							'<option value="grey">' + self.app.i18n(self, 'MSG_COLOUR_GREY', 'Grey') + '</option>' +
							'<option value="orange">' + self.app.i18n(self, 'MSG_COLOUR_ORANGE', 'Orange') + '</option>' +
							'<option value="red">' + self.app.i18n(self, 'MSG_COLOUR_RED', 'Red') + '</option>' +
						'</select>' +
					'</div>';
					
					self.laces.modal('change-colour', {
						'html':		html,
						'title':	'Change NAO colour',
						'buttons':	[{
							'id':		'save',
							'title':	self.app.i18n(self, 'BTN_SAVE', 'Save'),
							'style':	'primary'
						},{
							'id':		'cancel',
							'title':	self.app.i18n(self, 'BTN_CANCEL', 'Cancel'),
							'style':	'outline-secondary'
						}],
						'callback':	function(self, action, data) {
							switch(action) {
								case '_ready':
									$('#cadet-colour').val(self.app.nao.colour());
									break;
								case '_valid':
									return true;
								case '_click':
									if(data.id == 'save') {
										this.loading(true);

										self.app.nao.send('cadet_settingset', {'setting':'colour', 'value':$('#cadet-colour').val()}, function(r) {
											$('.cadet-viewadmin-colour').html($('#cadet-colour').val());
											self.laces.modal('change-colour').loading(false);
											self.laces.modal('change-colour').close();
										});
									} else {
										self.laces.modal('change-colour').close();
									}

									break;
							}
						}
					}).show();
				}
				
				$('body').on('click', '#cadet-admin-location-view', locationsAllFunc);				
				$('body').on('click', '#cadet-admin-location', locationChangeFunc);
				$('body').on('click', '#cadet-admin-colour', colourChangeFunc);				
				$('body').on('click', '#cadet-admin-backup', backupFunc);				
 				$('body').on('click', '#cadet-admin-restore', restoreFunc);
				
				$('body').on('click', '#cadet-admin-users', function() { usersListFunc(self.app.nao.domain()); });
				$('body').on('click', '#cadet-admin-scripts', function() { scriptsListFunc(self.app.nao.domain()); });
				$('body').on('click', '#cadet-admin-files', filesListFunc);
				$('body').on('click', '#cadet-admin-temp-clear', filesClearTempFunc);
				$('body').on('click', '#cadet-admin-password', function() { passwordChangeFunc('admin'); });
				$('body').on('click', '#cadet-root-password', function() { passwordChangeFunc('root'); });

				break;
			case '_close':
				$('body').off('click', '#cadet-admin-location');
				$('body').off('click', '#cadet-admin-location-view');
				$('body').off('click', '#cadet-admin-colour');				
				$('body').off('click', '#cadet-admin-backup');
				$('body').off('click', '#cadet-admin-restore');
				$('body').off('click', '#cadet-admin-users');
				$('body').off('click', '#cadet-admin-scripts');
				$('body').off('click', '#cadet-admin-files');
				$('body').off('click', '#cadet-admin-temp-clear');
				$('body').off('click', '#cadet-admin-password');
				$('body').off('click', '#cadet-root-password');
				break;
		}
	}

/*
 *	View Sounds
 */
	this.actionViewSounds = function(self) {
		var rowsFunc = function(self) {
			self.app.nao.send('cadet_filelist', null, function(r) {
				var rows = [];
				var showAdd = self.app.workspace.visible();

				if(r['error_code'] == 0) {
					if(r['files'].length > 0) {
						for(var i=0; i<r['files'].length; i++) {
							var fileName = splitFilename(r['files'][i]['name']);
							
							if(fileName.ext.toLowerCase() == 'mp3' || fileName.ext.toLowerCase() == 'wav') {
								rows.push({'columns': [r['files'][i]['name'], formatBytes(r['files'][i]['size']), '<a href="#" class="btn btn-link" data-id="play" data-value="' + r['files'][i]['name'] + '"><i class="fa fa-play"></i></a>' + (showAdd ? '<a href="#" class="btn btn-link" data-id="add" data-value="' + r['files'][i]['name'] + '"><i class="fa fa-plus"></i></a>' : '') + '<a href="#" class="btn btn-link" data-id="export" data-value="' + r['files'][i]['name'] + '"><i class="fa fa-download"></i></a><a href="#" class="btn btn-link" data-id="delete" data-value="' + r['files'][i]['name'] + '"><i class="fa fa-trash"></i></a>']});
							}
						}
					}
				} else {
					self.laces.alert({
						'title': self.app.i18n(self, 'TITLE_LOAD_FILES_ERROR', 'Error loading files'),
						'message': self.app.i18n(self, 'ERROR_GET_FILE_LIST', 'There was a error getting the list of files on the NAO'),
						'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
					});
				}
				
				self.laces.listView('view-sounds').rows(rows);
			});
		}
	
		self.laces.listView('view-sounds', {
			'title':	self.app.i18n(self, 'TITLE_SOUNDS', 'Sounds'),
			'item':		self.app.i18n(self, 'ITEM_SOUND', 'sound'),
			'buttons':	[{
				'id':		'close',
				'title':	self.app.i18n(self, 'BTN_CLOSE', 'Close'),
				'style':	'primary'
			},{
				'id':		'upload',
				'title':	self.app.i18n(self, 'BTN_UPLOAD', 'Upload...'),
				'style':	'secondary'
			},{
				'id':		'record',
				'title':	'<i class="fa fa-microphone"></i>',
				'style':	'outline-danger',
				'icon':		true,
				'left':		true
			},{
				'id':		'stoprecord',
				'title':	'<i class="fa fa-stop"></i>',
				'style':	'outline-danger',
				'icon':		true,
				'left':		true
			}],
			'columns':	[self.app.i18n(self, 'TITLE_NAME', 'Name'), self.app.i18n(self, 'TITLE_SIZE', 'Size'), self.app.i18n(self, 'TITLE_ACTION', 'Actions')],
			'widths': ['50%', '25%', '25%'],
			'callback':	function(self, action, data) {
				switch(action) {
					case '_ready':
						$('#stoprecord').hide();
					
						rowsFunc(self);
						
						//cadet_cmdrunning - check which sound is currently playing
						
						self.app.nao.subscribe('viewsounds', 'event_command_change', function(event, self) {
							if(event.state == true) {
								self.laces.listView('view-sounds').find('a[data-value="' + event.action + '"]').
									attr('data-id', 'stop').
									find('i.fa-play').removeClass('fa-play').addClass('fa-stop');
							} else {
								self.laces.listView('view-sounds').find('a[data-value="' + event.action + '"]').
									attr('data-id', 'play').
									find('i.fa-stop').removeClass('fa-stop').addClass('fa-play');
							}
						}, self);

						break;
					case '_click':
						switch(data.id) {
							case 'record':
								self.app.askName(self, self.app.i18n(self, 'MSG_RECORDING_NAME', 'Recording name'), self.app.i18n(self, 'MSG_MY_RECORDING', 'My recording'), self.app.i18n(self, 'BTN_RECORD', 'Record'), function(self, value) {
									self.app.nao.send('audiodevice_startmicrophonesrecording', {"name": value}, function(r) {
										if(r['error_code'] == 0) {
											$('#stoprecord').show();
											$('#record').hide();
										} else {
											self.laces.alert({
												'title': self.app.i18n(self, 'TITLE_NAO_ERROR', 'NAO Error'),
												'message': self.app.i18n(self, 'ERROR_RECORDING', 'The NAO could not record audio because an error occurred'),
												'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
											});
										}
									});
								});
								
								break;
							case 'stoprecord':
								self.app.nao.send('audiodevice_stopmicrophonesrecording', null, function(r) {
									$('#stoprecord').hide();
									$('#record').show();
								});
								
								break;
							case 'close':
								self.laces.modal('view-sounds').close();
								break;
							case 'upload':
								self.laces.uploader('audio/mp3, audio/wav', self.app.naoUploader, self);
								// TODO when fail, ask to rename
								break;
							case 'play':
								self.app.nao.send('audioplayer_playfile', {'name': data.value}, function(r) {
									if(r['error_code']) {
										self.laces.alert({
											'title': self.app.i18n(self, 'TITLE_SOUND_PLAYBACK_ERROR', 'Play sound error'),
											'message': self.app.i18n(self, 'ERROR_SOUND_PLAYBACK', 'There was an error playing sound'),
											'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
										});
									} else {
										self.laces.listView('view-sounds').find('a[data-value="' + data.value + '"]').
											attr('data-id', 'stop').
											find('i.fa-play').removeClass('fa-play').addClass('fa-stop');
									}
								});
								
								break;
							case 'delete':
								name = data.value;
								self.laces.modal('file-delete', {
									'html':		'<p>' + self.app.i18n(self, 'MSG_CONFIRM_DELETE_SOUND', 'Are you sure you want to delete this sound?') + '</p>',
									'width':	'30rem',
									'buttons':	[{
										'id':		'yes',
										'title':	self.app.i18n(self, 'BTN_YES', 'Yes'),
										'style':	'primary'
									},{
										'id':		'no',
										'title':	self.app.i18n(self, 'BTN_NO', 'No'),
										'style':	'secondary'
									}],
									'callback':	function(self, action, data) {
										if(action == '_click') {
											if(data.id == 'yes') {
												self.app.nao.send('cadet_filedelete', {'name': name}, function(r) {
													self.laces.modal('file-delete').close();
													if(r['error_code'] == 0) {

													} else {
														self.laces.alert({
															'title': self.app.i18n(self, 'TITLE_DELETE_SOUND_ERROR', 'Error deleting sound'),
															'message': self.app.i18n(self, 'ERROR_DELETE_SOUND', 'There was an error deleting the sound'),
															'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
														});
													}
												});
											} else {
												self.laces.modal('file-delete').close();
											}
										}
									}
								}).show();
								
								break;
							case 'export':
								self.app.fileDownload('files/' + data.value);
								var event = new MouseEvent('click', { 'view': window, 'bubbles': true, 'cancelable': false });

								var a = document.createElement('a');
								a.href = 'files/' + data.value;
								a.download = data.value;
								a.dispatchEvent(event);
								break;
							case 'add':
								if(self.app.workspace.getToolboxMode() == 'simple') {
									self.app.workspace.addBlock('audioplayer_playfile_dropdown', {
										'values': {
											'text':	data.value
										}
									});
								} else {
									self.app.workspace.addBlock('audioplayer_playfilestring', {
										'blocks': [{
											'type':	'text',
											'values': {'TEXT': data.value},
											'input': 'text'
										}]
									});
								}

								self.app.workspace.status('<i class="fa fa-check-circle-o fa-fw"></i> ' + self.app.i18n(self, 'MSG_SOUND_ADDED', 'Sound added!'), 2000);
								break;
						}

						break;
					case '_close':
						self.app.nao.unsubscribe('viewsounds');
						break;
				}
			}
		}).show();
	}
	
/*
 *	View Videos
 */
	this.actionViewVideos = function(self) {
		var rowsFunc = function(self) {
			self.app.nao.send('cadet_filelist', null, function(r) {
				var rows = [];
				
				if(r['error_code'] == 0) {
					if(r['files'].length > 0) {
						for(var i=0; i<r['files'].length; i++) {
							var fileName = splitFilename(r['files'][i]['name']);
							
							if(fileName.ext.toLowerCase() == 'avi' || fileName.ext.toLowerCase() == 'jpg') {
								rows.push({'columns': [r['files'][i]['name'], formatBytes(r['files'][i]['size']), '<a href="/file/' + r['files'][i]['name'] + '" class="btn btn-link" target="_blank"><i class="fa fa-play"></i></a><a href="#" class="btn btn-link" data-id="delete" data-value="' + r['files'][i]['name'] + '"><i class="fa fa-trash"></i></a>']});
							}
						}
					}
				} else {
					self.laces.alert({
						'title': self.app.i18n(self, 'TITLE_LOAD_FILES_ERROR', 'Error loading files'),
						'message': self.app.i18n(self, 'ERROR_GET_FILE_LIST', 'There was a error getting the list of files on the NAO'),
						'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
					});
				}
				
				self.laces.listView('view-videos').rows(rows);
			});
		}
	
		self.laces.listView('view-videos', {
			'title':	self.app.i18n(self, 'TITLE_PHOTOSVIDEOS', 'Photos/Videos'),
			'item':		self.app.i18n(self, 'ITEM_FILE', 'file'),
			'buttons':	[{
				'id':		'close',
				'title':	self.app.i18n(self, 'BTN_CLOSE', 'Close'),
				'style':	'primary'
			},{
				'id':		'upload',
				'title':	self.app.i18n(self, 'BTN_UPLOAD', 'Upload...'),
				'style':	'secondary'
			}],
			'columns':	[self.app.i18n(self, 'TITLE_NAME', 'Name'), self.app.i18n(self, 'TITLE_SIZE', 'Size'), self.app.i18n(self, 'TITLE_ACTIONS', 'Actions')],
			'callback':	function(self, action, data) {
				switch(action) {
					case '_ready':
						rowsFunc(self);
						
						self.app.nao.subscribe('viewvideo', 'event_files_changed', function(event, self) {
							rowsFunc(self);
						}, self);

						break;
					case '_click':
						switch(data.id) {
							case 'close':
								self.laces.modal('view-videos').close();
								break;
							case 'upload':
								self.laces.uploader('video/avi, image/jpg', self.app.naoUploader, self);
								// TODO ask to rename if already exists
								break;
							case 'delete':
								name = data.value;
								self.laces.modal('file-delete', {
									'html':		'<p>' + self.app.i18n(self, 'MSG_CONFIRM_DELETE_PHOTOVIDEO', 'Are you sure you want to delete this photo/video?') + '</p>',
									'width':	'30rem',
									'buttons':	[{
										'id':		'yes',
										'title':	self.app.i18n(self, 'BTN_YES', 'Yes'),
										'style':	'primary'
									},{
										'id':		'no',
										'title':	self.app.i18n(self, 'BTN_NO', 'No'),
										'style':	'secondary'
									}],
									'callback':	function(self, action, data) {
										if(action == '_click') {
											if(data.id == 'yes') {
												self.app.nao.send('cadet_filedelete', {'name': name}, function(r) {
													self.laces.modal('file-delete').close();
													if(r['error_code'] == 0) {

													} else {
														self.laces.alert({
															'title': self.app.i18n(self, 'TITLE_NAO_ERROR', 'NAO Error'),
															'message': self.app.i18n(self, 'ERROR_DELETE_PHOTOVIDEO', 'An problem occurred trying to delete the photo/video'),
															'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
														});
													}
												});
											} else {
												self.laces.modal('file-delete').close();
											}
										}
									}
								}).show();
						}

						break;
					case '_close':
						self.app.nao.unsubscribe('viewvideo');
						break;
				}
			}
		}).show();
	}
	
/*
 *	View Behaviors
 */
	this.actionViewBehaviors = function(self) {
		var rowsFunc = function(self) {
			self.app.nao.send('behavior_getinstalledbehaviors', null, function(r) {
				var rows = [];
				var showAdd = self.app.workspace.visible();
				
				if(r['error_code'] == 0) {
					if(r['behaviors'].length > 0) {
						for(var i=0; i<r['behaviors'].length; i++) {
							var name = r['behaviors'][i];
							
							var actions = (showAdd == true ? '<a href="#" class="btn btn-link" data-id="add" data-value="' + name + '"><i class="fa fa-plus"></i></a>' : '') +
							'<a href="#" class="btn btn-link" data-id="play" data-value="' + name + '"><i class="fa fa-play"></i></a>';
							
							if(self.app.behaviorIsValid(name)) {
								rows.push({'columns': [name, actions]});
							}
						}
					}
				} else {
					self.laces.alert({
						'title': self.app.i18n(self, 'TITLE_LOADING_BEHAVIORS_ERROR', 'Error loading behaviors'),
						'message': self.app.i18n(self, 'ERROR_LOADING_BEHAVIORS', 'There was a error getting the list of behaviors on the NAO'),
						'details': self.app.i18n(self, 'ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
					});
				}
				
				self.laces.listView('view-behaviors').rows(rows);
			});
		}
	
		self.laces.listView('view-behaviors', {
			'title':	self.app.i18n(self, 'TITLE_BEHAVIORS', 'Behaviors'),
			'item':		self.app.i18n(self, 'ITEM)_BEHAVIOR', 'behavior'),
			'buttons':	[{
				'id':		'close',
				'title':	self.app.i18n(self, 'BTN_CLOSE', 'Close'),
				'style':	'primary'
			}],
			'columns':	[self.app.i18n(self, 'TITLE_NAME', 'Name'), self.app.i18n(self, 'TITLE_ACTIONS', 'Actions')],
			'widths': ['80%', '20%'],
			'callback':	function(self, action, data) {
				switch(action) {
					case '_ready':
						rowsFunc(self);
						
						self.app.nao.subscribe('viewbehavior', 'event_behavior_running', function(event, self) {
							var behaviors = event.behaviors;

							self.laces.listView('view-behaviors').find('a[data-id="stop"]').each(function(index, elem) {
								var name = $(elem).attr('data-value');
								if(name != undefined) {
									if(behaviors.indexOf(name) == -1) {
										$(elem).attr('data-id', 'play');
										$(elem).find('i.fa-stop').removeClass('fa-stop').addClass('fa-play');
									}
								}
							});
							
							self.laces.listView('view-behaviors').find('a[data-id="play"]').each(function(index, elem) {
								var name = $(elem).attr('data-value');
								if(name != undefined) {
									if(behaviors.indexOf(name) != -1) {
										$(elem).attr('data-id', 'stop');
										$(elem).find('i.fa-play').removeClass('fa-play').addClass('fa-stop');
									}
								}
							});
						}, self);

						self.app.nao.send('behavior_getrunningbehaviors', null, function(r) {
							if(r['error_code'] == 0) {
								for(var i=0; i<r['behaviors'].length; i++) {
									var name = r['behaviors'][i];
									var len = name.indexOf('/');
									if(len != -1) {
										name = name.substr(0, len);
									}
									
									self.laces.listView('view-behaviors')
										.find('a[data-id="play"][data-value="' + name + '"] i.fa-play')
										.removeClass('fa-play')
										.addClass('fa-stop')
										.parent()
										.attr('data-id', 'stop');
								}
							}
						});

						break;
					case '_click':
						switch(data.id) {
							case 'close':
								self.laces.modal('view-behaviors').close();
								break;
							case 'play':
								self.laces.listView('view-behaviors').find('a[data-value="' + data.value + '"]').
									attr('data-id', 'stop').
									find('i.fa-play').removeClass('fa-play').addClass('fa-stop');
								self.app.nao.send('behavior_startbehavior', {'name': data.value}, null);
								break;
							case 'stop':
								self.app.nao.send('behavior_stopbehavior', {'name': data.value}, function(r) {
									self.app.nao.send('posture_gotoposture', {'name':'Stand', 'speed':3.0}, null);
								});
								break;
							case 'add':
								self.app.workspace.addBlock('behavior_run', {
									'blocks': [{
										'type':	'text',
										'values': {'TEXT': data.value},
										'input': 'name'
									}]
								});

								self.app.workspace.status('<i class="fa fa-check-circle-o fa-fw"></i> ' + self.app.i18n(self, 'MSG_BEHAVIOR_ADDED', 'Behavior added!'), 2000);
								break;
						}

						break;
					case '_close':
 						self.app.nao.unsubscribe('viewbehavior');
						break;
				}
			}
		}).show();
	}
	
/*
 *	View Joint Help
 */
	this.viewJointHelp = function(self) {
		var html = '';
		
		html += '<ul class="nav nav-tabs" id="jointTab" role="tablist">';
			html += '<li class="nav-item"><a class="nav-link active" id="jointhead-tab" data-toggle="tab" href="#jointhead" aria-controls="jointhead" aria=selected="true">' + self.app.i18n(self, 'MSG_HEAD', 'Head') + '</a></li>';
			html += '<li class="nav-item"><a class="nav-link" id="jointlarm-tab" data-toggle="tab" href="#jointlarm" aria-controls="jointlarm" aria=selected="false">' + self.app.i18n(self, 'MSG_LEFT_ARM', 'Left Arm') + '</a></li>';
			html += '<li class="nav-item"><a class="nav-link" id="jointrarm-tab" data-toggle="tab" href="#jointrarm" aria-controls="jointrarm" aria=selected="false">' + self.app.i18n(self, 'MSG_RIGHT_ARM', 'Right Arm') + '</a></li>';
		html += '</ul>';
		html += '<div class="tab-content" id="jointTabContent">';
			html += '<div class="tab-pane fade show active text-center" id="jointhead" role="tabpanel" aria-labelledby="jointhead-tab"><img src="/img/hardware_headjoint_3.3.png"></div>';
			html += '<div class="tab-pane fade text-center" id="jointlarm" role="tabpanel" aria-labelledby="jointlarm-tab"><img src="/img/hardware_larmjoint_3.3.png"></div>';
			html += '<div class="tab-pane fade text-center" id="jointrarm" role="tabpanel" aria-labelledby="jointrarm-tab"><img src="/img/hardware_rarmjoint_3.3.png"></div>';
		html += '</div>';
		
		self.laces.modal('view-jointhelp', {
			'title':	self.app.i18n(self, 'TITLE_JOINT_INFORMATION', 'Joint Information'),
			'html':		html,
			'buttons':	[{
				'id':		'close',
				'title':	self.app.i18n(self, 'BTN_CLOSE', 'Close'),
				'style':	'primary'
			}],
			'callback':	function(self, action, data) {
				switch(action) {
					case '_ready':
						break;
					case '_valid':
						return true;
					case '_click':
						switch(data.id) {
							case 'close':
								self.laces.modal('view-jointhelp').close();
								break;
						}
						
						break;
					case '_close':
						break;
				}
			}
		}).show();
	}

/*
 *	View Joints
 */
	this.actionViewJoints = function(self) {
		var html = '';
		
		html += '<table class="table cadet-edit-motion">';
			html += '<thead>';
				html += '<tr class="border-right no-border-bottom no-border-top">';
					html += '<th colspan="2" rowspan="2">' + self.app.i18n(self, 'MSG_HEAD', 'Head') + '</th><th colspan="5">' + self.app.i18n(self, 'MSG_LEFT', 'Left') + '</th><th colspan="5">' + self.app.i18n(self, 'MSG_RIGHT', 'Right') + '</th><th rowspan="3" class="speed text-upwards">' + self.app.i18n(self, 'MSG_SPEED', 'Speed') + '</th><th rowspan="3" class="action text-upwards">' + self.app.i18n(self, 'MSG_ACTION', 'Action') + '</th>';
				html += '</tr>';
				html += '<tr class="border-right no-border-bottom no-border-top">';
					html += '<th colspan="2">' + self.app.i18n(self, 'MSG_SHOULDER', 'Shoulder') + '</th><th colspan="2">' + self.app.i18n(self, 'MSG_ELBOW', 'Elbow') + '</th><th class="border-right">' + self.app.i18n(self, 'MSG_WRIST', 'Wrist') + '</th><th colspan="2">' + self.app.i18n(self, 'MSG_SHOULDER', 'Shoulder') + '</th><th colspan="2">' + self.app.i18n(self, 'MSG_ELBOW', 'Elbow') + '</th><th>Wrist</th>';
				html += '</tr>';
				html += '<tr class="border-right no-border-top">';
					html += '<th>' + self.app.i18n(self, 'MSG_PITCH', 'Pitch') + '</th><th>' + self.app.i18n(self, 'MSG_YAW', 'Yaw') + '</th><th>' + self.app.i18n(self, 'MSG_ROLL', 'Roll') + '</th><th>' + self.app.i18n(self, 'MSG_PITCH', 'Pitch') + '</th><th>' + self.app.i18n(self, 'MSG_YAW', 'Yaw') + '</th><th>' + self.app.i18n(self, 'MSG_ROLL', 'Roll') + '</th><th>' + self.app.i18n(self, 'MSG_YAW', 'Yaw') + '</th><th>' + self.app.i18n(self, 'MSG_ROLL', 'Roll') + '</th><th>' + self.app.i18n(self, 'MSG_PITCH', 'Pitch') + '</th><th>' + self.app.i18n(self, 'MSG_YAW', 'Yaw') + '</th><th>' + self.app.i18n(self, 'MSG_ROLL', 'Roll') + '</th><th>' + self.app.i18n(self, 'MSG_YAW', 'Yaw') + '</th>';
				html += '</tr>';
			html += '</thead>';
			html += '<tbody class="cadet-edit-joint">';
				html += '<tr>';
					html += '<td><input type="number" class="form-control" data-validate="false" data-min="-38.5" data-max="29.5" data-name="Head Pitch" data-joint="HeadPitch"></td>';
					html += '<td><input type="number" class="form-control" data-validate="false" data-min="-119.5" data-max="119.5" data-name="Head Yaw" data-joint="HeadYaw"></td>';
					html += '<td><input type="number" class="form-control" data-validate="false" data-min="-18" data-max="76" data-name="Left Shoulder Roll" data-joint="LShoulderRoll"></td>';
					html += '<td><input type="number" class="form-control" data-validate="false" data-min="-119.5" data-max="119.5" data-name="Left Shoulder Pitch" data-joint="LShoulderPitch"></td>';
					html += '<td><input type="number" class="form-control" data-validate="false" data-min="-88.5" data-max="-2" data-name="Left Elbow Roll" data-joint="LElbowRoll"></td>';
					html += '<td><input type="number" class="form-control" data-validate="false" data-min="-119.5" data-max="119.5" data-name="Left Elbow Yaw" data-joint="LElbowYaw"></td>';
					html += '<td><input type="number" class="form-control" data-validate="false" data-min="-104.5" data-max="104.5" data-name="Left Wrist Yaw" data-joint="LWristYaw"></td>';
					html += '<td><input type="number" class="form-control" data-validate="false" data-min="-76" data-max="18" data-name="Right Shoulder Roll" data-joint="RShoulderRoll"></td>';
					html += '<td><input type="number" class="form-control" data-validate="false" data-min="-119.5" data-max="119.5" data-name="Right Shoulder Pitch" data-joint="RShoulderPitch"></td>';
					html += '<td><input type="number" class="form-control" data-validate="false" data-min="2" data-max="88.5" data-name="Right Elbow Roll" data-joint="RElbowRoll"></td>';
					html += '<td><input type="number" class="form-control" data-validate="false" data-min="-119.5" data-max="119.5" data-name="Right Elbow Yaw" data-joint="RElbowYaw"></td>';
					html += '<td><input type="number" class="form-control" data-validate="false" data-min="-104.5" data-max="104.5" data-name="Right Wrist Yaw" data-joint="RWristYaw"></td>';
					html += '<td class="speed"><input type="number" class="form-control" data-validate="false" data-required="true" data-min="0" data-max="10" data-name="Speed" value="2" data-id="speed"></td>';
					html += '<td class="action"><a href="#" class="btn btn-link" data-id="play"><i class="fa fa-play"></i></a></td>';
				html += '</tr>';
			html += '</tbody>';
		html += '</table>';
		
		self.laces.modal('view-createeditmotion', {
			'title':	self.app.i18n(self, 'TITLE_SET_JOINTS', 'Set Joints'),
			'help':		function() {self.app.viewJointHelp(self);},
			'html':		html,
			'width':	'63rem',
			'buttons':	[{
				'id':		'save',
				'title':	self.app.i18n(self, 'BTN_ADD', 'Add'),
				'style':	'primary'
			},{
				'id':		'cancel',
				'title':	self.app.i18n(self, 'BTN_CANCEL', 'Cancel'),
				'style':	'secondary'
			},{
				'id':		'stand',
				'title':	'<i class="fa fa-male"></i>',
				'style':	'outline-secondary',
				'icon':		true,
				'left':		true
			}],
			'callback':	function(self, action, data) {
				switch(action) {
					case '_ready':
						$('body').on('keypress', '.cadet-edit-motion input[type=number]', function(e) {
							var val = this.value;
							if(this.selectionStart != this.selectionEnd) {
							val = val.substr(0, this.selectionStart) + val.substr(this.selectionEnd, val.length - this.selectionEnd);
							}

							if(e.which >= 48 && e.which <= 57 && (this.selectionStart != 0 || val.charAt(0) != '-')) return true;
							if(e.which == 45 && this.selectionStart == 0 && val.charAt(0) != '-') return true;
							if(e.which == 46 && val.indexOf('.') == -1 && (this.selectionStart != 0 || val.charAt(0) != '-')) return true;
							return false;
						});
						
						$('body').on('focusout', '.cadet-edit-motion input[type=number]', function() {
							self.laces.modal('view-createeditmotion').footer('');
							
							if($(this).val() != '' || $(this).attr('data-required') == 'true') {
								var min = parseFloat($(this).attr('data-min'));
								var max = parseFloat($(this).attr('data-max'));
								var name = $(this).attr('data-name');
							
								if(!isNaN(min) && !isNaN(max) && name != undefined) {
									var val = parseFloat($(this).val());
									var newVal = val;
								
									if(isNaN(val)) {
										newVal = 0;
										if(newVal < min) newVal = min;
									} else {
										if(val > max) newVal = max;
										if(val < min) newVal = min;
									}
								
									if(newVal != val) {
										$(this).val(newVal);
										$(this).removeClass('fade-error').addClass('fade-error');
										self.laces.modal('view-createeditmotion').footer('<span class="footer-error"><i class="fa fa-exclamation-triangle"></i> ' + name + ' must be between ' + min + ' and ' + max + ' <a href="#" class="btn btn-link" data-id="help">more info</a></span>');
									}
								}
							}
						});
						
						break;
					case '_valid':
						return true;
					case '_click':
						switch(data.id) {
							case 'help':
								self.app.viewJointHelp(self);
								break;
							case 'stand':
								self.app.nao.send('posture_gotoposture', {'name':'Stand', 'speed':3.0}, null);
								break;
							case 'save':
								var speed = parseFloat($('table.cadet-edit-motion tbody td input[data-id=speed]').val());
								var jointNames = [];
								var jointAngles = [];
								
								$('table.cadet-edit-motion tbody td input[data-joint]').each(function(idx, elem) {
									if(!(isNaN(parseFloat($(elem).val())))) {
										jointNames.push({'type': 'text', 'values': {'TEXT': $(elem).attr('data-joint')}});
										jointAngles.push({'type': 'math_number', 'values': {'NUM': parseFloat($(elem).val())}});
									}
								});
								
								if(isNaN(speed)) {
									speed = 2;
								}

								self.app.workspace.addBlock('motion_setjointall', {
									'blocks': [{
										'type':	'lists_create_with',
										'blocks': jointNames,
										'input': 'joints'
									},{
										'type':	'lists_create_with',
										'blocks': jointAngles,
										'input': 'angles'
									},{
										'type': 'math_number',
										'values': {'NUM': speed},
										'input': 'speed'
									}]
								});
								
								self.laces.modal('view-createeditmotion').close();
								break;
							case 'cancel':
								self.laces.modal('view-createeditmotion').close();
								break;
							case 'play':
								var row = $(data.object).parent().parent();
								var jointName = [];
								var radians = [];
								var speed = parseInt($(row).find('[data-id=speed]').val());
								
								$(row).find('[data-joint]').each(function(idx, elem) {
									if($(elem).val() != '') {
										jointName.push($(elem).attr('data-joint'));
										radians.push($(elem).val() * 0.0174532923847);
									}
								});

								data = {
									'name': jointName,
									'radians': radians,
									'speed': speed,
									'absolute': true
								};
								
								self.app.nao.send('motion_angleinterpolation', data, function(r) {
									if(r['error_code'] == 0) {
									
									} else {
										self.laces.alert({
											'title': self.app.i18n(self, 'TITLE_NAO_ERROR', 'NAO Error'),
											'message': self.app.i18n(self, 'ERROR_MOVE_JOINTS', 'There was a problem moving the joints'),
											'details': self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
										});
									}
								});
								
								break;
						}

						break;
					case '_close':
						$('body').off('keypress', '.cadet-edit-motion input[type=number]');
						$('body').off('focusout', '.cadet-edit-motion input[type=number]');

						break;
				}
			}
		}).show();
	}
	
/*
 *	NAO Uploader
 */
	this.naoUploader = function(fileName, dataOffset, fileSize, data, dataLen, nextCallback, self) {
		self.app.nao.send('cadet_fileupload', {'name':fileName, 'offset':dataOffset, 'data':data}, function(result) {
			if(result['error_code'] == 0) {
				if(self.laces.progress().cancelled() == true) {
					self.laces.progress().close();
					return;
				}
			
				if(dataOffset == -1) {
					self.laces.progress().close();
				} else {
					self.laces.progress().percent(Math.floor((dataOffset / fileSize) * 100));
					nextCallback();
				}
			} else {
				self.laces.progress().close();
				self.laces.alert({
					'title': self.app.i18n(self, 'TITLE_NAO_ERROR', 'NAO Error'),
					'message': self.app.i18n(self, 'ERROR_UPLOADING_FILE', 'There was an error uploading the file'),
					'details': self.app.nao.errorCodeToText(result.error_code) + ('error_message' in result ? '<br><br>' + result['error_message'] : '')
				});
			}
		});
	}

/*
 *	View About
 */
	this.viewAbout = function(self) {
		var html = '<p class="cadet-about-section-main">';
			html += '<span class="cadet-about-line"><strong>Version</strong>' + self.app.version + '<span>';
			html += '<span class="cadet-about-line"><strong>Created by</strong>James Collins<span>';
			html += '<span class="cadet-about-line"><br><i>Copyright &copy; 2018, <a href="http://www.slq.qld.gov.au/" target="_blank">State Library of Queensland</a></i><span>';
		html += '</p>';
		html += '<hr>';
		html += '<p class="cadet-about-section">';
			html += 'NAO Cadet is distributed under the <a href="/licenses/gnugplv3.txt" target="_blank">GNU GPL v3 license</a>. Contributions to the code are welcome over on <a href="https://github.com/slqic/naocadet" target="_blank">GitHub</a>.';
		html += '</p>';
		html += '<p class="cadet-about-section">';
			html += 'Portions of this product are based on <a href="https://developers.google.com/blockly/" target="_blank">Blockly</a> created and shared by <a href="http://google.com.au/" target="_blank">Google</a> and used according to terms described in the <a href="/licenses/apache2license.txt" target="_blank">Apache 2.0 license</a>. Blockly is Copyright 2018 Google Inc.';
		html += '</p>';
		html += '<p class="cadet-about-section">';
			html += '<a href="https://neil.fraser.name/software/JS-Interpreter/docs.html" target="_blank">JS-Interpreter</a> Copyright 2013 Google Inc. and used according to terms described in the <a href="/licenses/apache2license.txt" target="_blank">Apache 2.0 license</a>.';
		html += '</p>';
		html += '<p class="cadet-about-section">';
			html += '<a href="http://marijnhaverbeke.nl/acorn/" target="_blank">Acorn</a> Copyright 2012-2018 by its <a href="/licenses/acornauthors.txt" target="_blank">Authors</a> and used according to terms described in the <a href="/licenses/mitlicense.txt" target="_blank">MIT license</a>.';
		html += '</p>';
		html += '<p class="cadet-about-section">';
			html += '<a href="https://getbootstrap.com/" target="_blank">Bootstrap</a> Copyright 2018 by Twitter and used according to terms described in the <a href="/licenses/mitlicense.txt" target="_blank">MIT license</a>.';
		html += '</p>';
		html += '<p class="cadet-about-section">';
			html += 'This product uses sounds from <a href="http://freesound.org/" target="_blank">Freesound.org</a> and used according to terms described in the <a href="/licenses/cc0.txt" target="_blank">Creative Commons Zero license</a>. A full list of authors are available <a href="/licenses/soundauthors.txt" target="_blank">here</a>.';
		html += '</p>';

		self.laces.modal('cadet-about', {
			'html':		html,
			'title':	self.app.i18n(self, 'TITLE_ABOUT', 'About NAO Cadet'),
			'buttons':	[
				{'id': 'close', 'title':self.app.i18n(self, 'BTN_CLOSE', 'Close'), 'style': 'primary'},
				{'id': 'quit', 'title':self.app.i18n(self, 'BTN_QUIT', 'Quit NAO Cadet'), 'style': 'danger', 'left':true}
			],
			'callback':	function(self, action, data) {
				switch(action) {
					case '_click':
						if(data.id == 'quit') {
							self.laces.modal('cadet-quit', {
								'html':		'<p>' + self.app.i18n(self, 'MSG_CONFIRM_QUIT_CADET', 'Are you sure you want to quit NAO Cadet for all users?') + '</p>',
								'width':	'30rem',
								'buttons':	[{
									'id':		'yes',
									'title':	self.app.i18n(self, 'BTN_YES', 'Yes'),
									'style':	'primary'
								},{
									'id':		'no',
									'title':	self.app.i18n(self, 'BTN_NO', 'No'),
									'style':	'secondary'
								}],
								'callback':	function(self, action, data) {
									if(action == '_click') {
										if(data.id == 'yes') {
											self.app.nao.send('cadet_quit', null, function(r) {
												self.laces.modal('cadet-quit').close();
												if(r['error_code'] == 0) {
													window.location.href = '/close.html';
												} else {
													self.laces.alert({
														'title': self.app.i18n(self, 'TITLE_NAO_ERROR', 'NAO Error'),
														'message': self.app.i18n(self, 'ERROR_QUITTING_CADET', 'An problem occurred trying to quit NAO Cadet'),
														'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
													});
												}
											});
										} else {
											self.laces.modal('cadet-quit').close();										
										}
									}
								}
							}).show();
						} else {
							self.laces.modal('cadet-about').close();
						}

						break;
				}
			}
		}).show();
	}
	
/*
 *	View Motions
 */
	this.actionViewMotions = function(self) {
		var rowsFunc = function(self) {
			self.app.nao.send('cadet_motionlist', null, function(r) {
				var rows = [];
				var showAdd = self.app.workspace.visible();
				
				if(r['error_code'] == 0) {
 					if(r['motions'].length > 0) {
 						for(var i=0; i<r['motions'].length; i++) {
							rows.push({'columns': [
								r['motions'][i]['name'],
								r['motions'][i]['movementcount'],
								r['motions'][i]['movementtime'] + ' sec' + (r['motions'][i]['movementtime'] != 1 ? 's' : ''),
								'<a href="#" class="btn btn-link" data-id="edit" data-value="' + r['motions'][i]['name'] + '"><i class="fa fa-pencil"></i></a><a href="#" class="btn btn-link" data-id="play" data-value="' + r['motions'][i]['name'] + '"><i class="fa fa-play"></i></a>' + (showAdd ? '<a href="#" class="btn btn-link" data-id="add" data-value="' + r['motions'][i]['name'] + '"><i class="fa fa-plus"></i></a>' : '' ) + '<a href="#" class="btn btn-link" data-id="export" data-value="' + r['motions'][i]['name'] + '"><i class="fa fa-download"></i></a><a href="#" class="btn btn-link" data-id="delete" data-value="' + r['motions'][i]['name'] + '"><i class="fa fa-trash"></i></a>',
							]});
						}
					}
				} else {
					self.laces.alert({
						'title': self.app.i18n(self, 'TITLE_LOADING_MOTIONS_ERROR', 'Error loading motions'),
						'message': self.app.i18n(self, 'ERROR_LOADING_MOTIONS', 'There was a error getting the list of motions on the NAO'),
						'details': self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
					});
				}
				
				self.laces.listView('view-motions').rows(rows);
			});
		}
	
		self.laces.listView('view-motions', {
			'title':	self.app.i18n(self, 'TITLE_MOTIONS', 'Motions'),
			'item':		self.app.i18n(self, 'ITEM_MOTION', 'motion'),
			'buttons':	[{
				'id':		'close',
				'title':	self.app.i18n(self, 'BTN_CLOSE', 'Close'),
				'style':	'primary'
			},{
				'id':		'stand',
				'title':	'<i class="fa fa-male"></i>',
				'style':	'outline-secondary',
				'icon':		true,
				'left':		true
			},{
				'id':		'create',
				'title':	'<i class="fa fa-plus"></i>',
				'style':	'outline-secondary',
				'icon':		true,
				'left':		true
			},{
				'id':		'import',
				'title':	self.app.i18n(self, 'BTN_UPLOAD', 'Upload...'),
				'style':	'secondary'
			}],
			'columns':	[self.app.i18n(self, 'TITLE_NAME', 'Name'), self.app.i18n(self, 'TITLE_MOVEMENTS', 'Movements'), self.app.i18n(self, 'TITLE_TIME', 'Time'), self.app.i18n(self, 'TITLE_ACTIONS', 'Actions')],
			'widths':	['40%', '15%', '15%', '30%'],
			'callback':	function(self, action, data) {
				switch(action) {
					case '_ready':
						rowsFunc(self);
						
// 						self.app.nao.subscribe('viewmotions', 'event_motions_changed', function(event, self) {
// 							if(event.state == true) {
// 								self.laces.listView('view-sounds').find('a[data-value="' + event.action + '"]').
// 									attr('data-id', 'stop').
// 									find('i.fa-play').removeClass('fa-play').addClass('fa-stop');
// 							} else {
// 								self.laces.listView('view-sounds').find('a[data-value="' + event.action + '"]').
// 									attr('data-id', 'play').
// 									find('i.fa-stop').removeClass('fa-stop').addClass('fa-play');
// 							}
// 						}, self);
						
						break;
					case '_click':
						switch(data.id) {
							case 'close':
								self.laces.modal('view-motions').close();
								break;
							case 'import':
								var motion = '';
	
								var importFunc = function(fileName, dataOffset, fileSize, data, dataLen, nextCallback, self) {
									if(dataOffset == -1) {
										self.laces.progress().close();
										
										try {
											var motionObj = JSON.parse(motion);

											fileName = splitFilename(fileName);
											self.app.askName(self, 'Save motion', fileName['name'], 'Save', function(self, value) {
												self.app.nao.send('cadet_motionexists', {'name':value}, function(r) {
													if(r['error_code'] == 0) {
														if(r['exists'] == 1) {
															self.laces.alert({
																'title': self.app.i18n(self, 'TITLE_MOTION_EXISTS', 'Motion already exists'),
																'message': self.app.i18n(self, 'ERROR_MOTION_EXISTS', 'You cannot use that name for this motion as it already exists')
															});
														} else {
															self.app.askNameClose(self);

															var movements = [];
															for(var i=0; i<motionObj.length; i++) {
																var movement = {
																	'speed':	parseFloat(motionObj[i]['speed']),
																	'delay':	parseFloat(motionObj[i]['delay']),
																	'joints':	JSON.stringify(motionObj[i]['joints'])
																};

																movements.push(movement);
															}
															
															var data = {
																'name':			value,
																'movements':	movements
															};

															self.app.nao.send('cadet_motionset', data, function(r) {
																if(r['error_code'] == 0) {
																	// TODO here!
																} else {
																	self.laces.alert({
																		'title': self.app.i18n(self, 'TITLE_UPLOAD_MOTION_ERROR', 'Motion upload error'),
																		'message': self.app.i18n(self, 'ERROR_MOTION_UPLOAD', 'An problem occurred trying to upload the motion'),
																		'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
																	});
																}
															});
														}
													} else {
														self.laces.alert({
															'title': self.app.i18n(self, 'TITLE_UPLOAD_MOTION_ERROR', 'Motion upload error'),
															'message': self.app.i18n(self, 'ERROR_MOTION_UPLOAD', 'An problem occurred trying to upload the motion'),
															'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
														});
													}
												});
												
												return false;
											});
										} catch(e) {
											self.laces.alert({
												'title': self.app.i18n(self, 'TITLE_UPLOAD_MOTION_ERROR', 'Motion upload error'),
												'message': self.app.i18n(self, 'ERROR_MOTION_UPLOAD', 'An problem occurred trying to upload the motion'),
												'details': self.app.i18n(self, 'ERROR_JSON_PARSE', 'JSON parse error')
											});
										}
										
									} else if(dataOffset == 0) {
										motion = '';
										nextCallback();
									} else {
										motion += atob(data);
										self.laces.progress().percent(Math.floor((dataOffset / fileSize) * 100));
										nextCallback();
									}
								}
	
								self.laces.uploader('application/json', importFunc, self);
								break;
							case 'create':
								self.app.actionCreateEditMotion(self, 0);
								break;
							case 'stand':
								self.app.nao.send('posture_gotoposture', {'name':'Stand', 'speed':3.0}, null);
								break;
							case 'play':
								self.app.actionPlayMotion(self, data.value);
								break;
							case 'stop':
								break;
							case 'edit':
								self.app.actionCreateEditMotion(self, data.value);
								break;
							case 'delete':
								var name = data.value;
								self.laces.modal('motion-delete', {
									'html':		'<p>' + self.app.i18n(self, 'MSG_CONFIRM_DELETE_MOTION', 'Are you sure you want to delete this motion?') + '</p>',
									'width':	'30rem',
									'buttons':	[{
										'id':		'yes',
										'title':	self.app.i18n(self, 'BTN_YES', 'Yes'),
										'style':	'primary'
									},{
										'id':		'no',
										'title':	self.app.i18n(self, 'BTN_NO', 'No'),
										'style':	'secondary'
									}],
									'callback':	function(self, action, data) {
										if(action == '_click') {
											if(data.id == 'yes') {
												self.app.nao.send('cadet_motiondelete', {'name': name}, function(r) {
													self.laces.modal('motion-delete').close();
													if(r['error_code'] == 0) {

													} else {
														self.laces.alert({
															'title': self.app.i18n(self, 'TITLE_NAO_ERROR', 'NAO Error'),
															'message': self.app.i18n(self, 'ERROR_MOTION_DELETE', 'An problem occurred trying to delete the motion'),
															'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
														});
													}
												});
											} else {
												self.laces.modal('motion-delete').close();
											}
										}
									}
								}).show();

								break;
							case 'export':
								var name = data.value;
								self.app.nao.send('cadet_motionget', {'name': name}, function(r) {
									if(r['error_code'] == 0) {
										for(var i=0; i<r['motion']['movements'].length; i++) {
											r['motion']['movements'][i]['joints'] = JSON.parse(r['motion']['movements'][i]['joints']);
										}
										
										self.app.scriptExport(self, name, JSON.stringify(r['motion']['movements']), 'json');
									} else {
										self.laces.alert({
											'title': self.app.i18n(self, 'TITLE_NAO_ERROR', 'NAO Error'),
											'message': self.app.i18n(self, 'ERROR_MOTION_EXPORT', 'An problem occurred trying to export the motion'),
											'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error Code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
										});
									}
								});
								break;
							case 'add':
								if(self.app.workspace.getToolboxMode() == 'simple') {
									self.app.workspace.addBlock('motion_run_dropdown', {
										'values': {
											'text':	data.value
										}
									});
								} else {
									self.app.workspace.addBlock('motion_run_string', {
										'blocks': [{
											'type':	'text',
											'values': {'TEXT': data.value},
											'input': 'text'
										}]
									});
								}

								self.app.workspace.status('<i class="fa fa-check-circle-o fa-fw"></i> ' + self.app.i18n(self, 'MSG_MOTION_ADDED', 'Motion added!'), 2000);
								break;
						}

						break;
					case '_close':
 						self.app.nao.unsubscribe('viewmotions');
						break;
				}
			}
		}).show();
	}

/*
 *	Create Edit Motion
 */
	this.actionCreateEditMotion = function(self, name) {
		var html = '';
		
		var addRowFunc = function() {
			var html = '';
			
			html += '<tr>';
				html += '<td><input type="number" class="form-control" data-validate="false" data-min="-38.5" data-max="29.5" data-name="Head Pitch" data-joint="HeadPitch"></td>';
				html += '<td><input type="number" class="form-control" data-validate="false" data-min="-119.5" data-max="119.5" data-name="Head Yaw" data-joint="HeadYaw"></td>';
				html += '<td><input type="number" class="form-control" data-validate="false" data-min="-18" data-max="76" data-name="Left Shoulder Roll" data-joint="LShoulderRoll"></td>';
				html += '<td><input type="number" class="form-control" data-validate="false" data-min="-119.5" data-max="119.5" data-name="Left Shoulder Pitch" data-joint="LShoulderPitch"></td>';
				html += '<td><input type="number" class="form-control" data-validate="false" data-min="-88.5" data-max="-2" data-name="Left Elbow Roll" data-joint="LElbowRoll"></td>';
				html += '<td><input type="number" class="form-control" data-validate="false" data-min="-119.5" data-max="119.5" data-name="Left Elbow Yaw" data-joint="LElbowYaw"></td>';
				html += '<td><input type="number" class="form-control" data-validate="false" data-min="-104.5" data-max="104.5" data-name="Left Wrist Yaw" data-joint="LWristYaw"></td>';
				html += '<td><input type="number" class="form-control" data-validate="false" data-min="-76" data-max="18" data-name="Right Shoulder Roll" data-joint="RShoulderRoll"></td>';
				html += '<td><input type="number" class="form-control" data-validate="false" data-min="-119.5" data-max="119.5" data-name="Right Shoulder Pitch" data-joint="RShoulderPitch"></td>';
				html += '<td><input type="number" class="form-control" data-validate="false" data-min="2" data-max="88.5" data-name="Right Elbow Roll" data-joint="RElbowRoll"></td>';
				html += '<td><input type="number" class="form-control" data-validate="false" data-min="-119.5" data-max="119.5" data-name="Right Elbow Yaw" data-joint="RElbowYaw"></td>';
				html += '<td><input type="number" class="form-control" data-validate="false" data-min="-104.5" data-max="104.5" data-name="Right Wrist Yaw" data-joint="RWristYaw"></td>';
				html += '<td class="speed"><input type="number" class="form-control" data-validate="false" data-required="true" data-min="0" data-max="10" data-name="Speed" value="2" data-id="speed"></td>';
				html += '<td class="delay"><input type="number" class="form-control" data-validate="false" data-required="true" data-min="0" data-max="10" data-name="Delay" value="0" data-id="delay"></td>';
				html += '<td class="action"><a href="#" class="btn btn-link" data-id="play"><i class="fa fa-play"></i></a><a href="#" class="btn btn-link" data-id="delete"><i class="fa fa-trash-o"></i></a></td>';
			html += '</tr>';
			
			$('table.cadet-edit-motion tbody tr.movement-none').hide();
			$('table.cadet-edit-motion tbody').append(html);			
			$('table.cadet-edit-motion tbody').scrollTop($('table.cadet-edit-motion tbody')[0].scrollHeight);
		}
		
		html += '<table class="table cadet-edit-motion">';
			html += '<thead>';
				html += '<tr class="border-right no-border-bottom no-border-top">';
					html += '<th colspan="2" rowspan="2">' + self.app.i18n(self, 'MSG_HEAD', 'Head') + '</th><th colspan="5">' + self.app.i18n(self, 'MSG_LEFT', 'Left') + '</th><th colspan="5">' + self.app.i18n(self, 'MSG_RIGHT', 'Right') + '</th><th rowspan="3" class="speed text-upwards">' + self.app.i18n(self, 'MSG_SPEED', 'Speed') + '</th><th rowspan="3" class="delay text-upwards">' + self.app.i18n(self, 'MSG_DELAY', 'Delay') + '</th><th rowspan="3" class="action text-upwards">' + self.app.i18n(self, 'MSG_ACTION', 'Action') + '</th>';
				html += '</tr>';
				html += '<tr class="border-right no-border-bottom no-border-top">';
					html += '<th colspan="2">' + self.app.i18n(self, 'MSG_SHOULDER', 'Shoulder') + '</th><th colspan="2">' + self.app.i18n(self, 'MSG_ELBOW', 'Elbow') + '</th><th class="border-right">' + self.app.i18n(self, 'MSG_WRIST', 'Wrist') + '</th><th colspan="2">' + self.app.i18n(self, 'MSG_SHOULDER', 'Shoulder') + '</th><th colspan="2">' + self.app.i18n(self, 'MSG_ELBOW', 'Elbow') + '</th><th>' + self.app.i18n(self, 'MSG_WRIST', 'Wrist') + '</th>';
				html += '</tr>';
				html += '<tr class="border-right no-border-top">';
					html += '<th>' + self.app.i18n(self, 'MSG_PITCH', 'Pitch') + '</th><th>' + self.app.i18n(self, 'MSG_YAW', 'Yaw') + '</th><th>' + self.app.i18n(self, 'MSG_ROLL', 'Roll') + '</th><th>' + self.app.i18n(self, 'MSG_PITCH', 'Pitch') + '</th><th>' + self.app.i18n(self, 'MSG_YAW', 'Yaw') + '</th><th>' + self.app.i18n(self, 'MSG_ROLL', 'Roll') + '</th><th>' + self.app.i18n(self, 'MSG_YAW', 'Yaw') + '</th><th>' + self.app.i18n(self, 'MSG_ROLL', 'Roll') + '</th><th>' + self.app.i18n(self, 'MSG_PITCH', 'Pitch') + '</th><th>' + self.app.i18n(self, 'MSG_YAW', 'Yaw') + '</th><th>' + self.app.i18n(self, 'MSG_ROLL', 'Roll') + '</th><th>' + self.app.i18n(self, 'MSG_YAW', 'Yaw') + '</th>';
				html += '</tr>';
			html += '</thead>';
			html += '<tbody>';
				html += '<tr class="movement-none"><td colspan="15"><i class="fa fa-exclamation fa-5x fa-fw"></i><br>' + self.app.i18n(self, 'MSG_NO_MOVEMENTS_FOUND', 'No movements found') + '</td></tr>';
			html += '</tbody>';
		html += '</table>';
		
		self.laces.modal('view-createeditmotion', {			
			'title':	self.app.i18n(self, 'TITLE_CREATE_MOTION', 'Create motion') + ' <input type="text" class="form-control" id="cadet-motion-name" value="' + self.laces.escapeHtml((name != '' ? name : self.app.userName + '\'s move')) + '">',
			'help':		function() {self.app.viewJointHelp(self);},
			'html':		html,
			'width':	'63rem',
			'buttons':	[{
				'id':		'save',
				'title':	self.app.i18n(self, 'BTN_SAVE', 'Save'),
				'style':	'primary'
			},{
				'id':		'cancel',
				'title':	self.app.i18n(self, 'BTN_CANCEL', 'Cancel'),
				'style':	'secondary'
			},{
				'id':		'stand',
				'title':	'<i class="fa fa-male"></i>',
				'style':	'outline-secondary',
				'icon':		true,
				'left':		true
			},{
				'id':		'addrow',
				'title':	'<i class="fa fa-plus"></i>',
				'style':	'outline-secondary',
				'icon':		true,
				'left':		true
			}],
			'callback':	function(self, action, data) {
				switch(action) {
					case '_ready':
						if(name != '') {
							self.laces.modal('view-createeditmotion').loading(true, true);
							self.app.nao.send('cadet_motionget', {'name': name}, function(r) {
								if(r['error_code'] == 0) {
									for(var i=0; i<r['motion']['movements'].length; i++) {
										addRowFunc();
										var row = $('table.cadet-edit-motion tbody tr').last();
										var joints = {};
										
										try {
											joints = JSON.parse(r['motion']['movements'][i]['joints']);
										} catch(e) {
											//...
										}
										
										$(row).find('[data-id=speed]').val(r['motion']['movements'][i]['speed']);
										$(row).find('[data-id=delay]').val(r['motion']['movements'][i]['delay']);
										
										for(var item in joints) {
											if(joints.hasOwnProperty(item)) {
												$(row).find('[data-joint=' + item + ']').val(joints[item]);
											}
										}
									}
									
									self.laces.modal('view-createeditmotion').loading(false, true);
								} else {
									self.laces.alert({
										'title': self.app.i18n(self, 'TITLE_LOADING_MOVEMENT_ERROR', 'Cannot load movement'),
										'message': self.app.i18n(self, 'ERROR_LOADING_MOVEMENT', 'There was a problem loading the movement'),
										'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
									});
									
									self.laces.modal('view-createeditmotion').close();
								}
							});
						} else {
							addRowFunc();
						}
						
						$('body').on('keypress', '.cadet-edit-motion input[type=number]', function(e) {
							var val = this.value;
							if(this.selectionStart != this.selectionEnd) {
							val = val.substr(0, this.selectionStart) + val.substr(this.selectionEnd, val.length - this.selectionEnd);
							}

							if(e.which >= 48 && e.which <= 57 && (this.selectionStart != 0 || val.charAt(0) != '-')) return true;
							if(e.which == 45 && this.selectionStart == 0 && val.charAt(0) != '-') return true;
							if(e.which == 46 && val.indexOf('.') == -1 && (this.selectionStart != 0 || val.charAt(0) != '-')) return true;
							return false;
						});
						
						$('body').on('focusout', '.cadet-edit-motion input[type=number]', function() {
							self.laces.modal('view-createeditmotion').footer('');
							
							if($(this).val() != '' || $(this).attr('data-required') == 'true') {
								var min = parseFloat($(this).attr('data-min'));
								var max = parseFloat($(this).attr('data-max'));
								var name = $(this).attr('data-name');
							
								if(!isNaN(min) && !isNaN(max) && name != undefined) {
									var val = parseFloat($(this).val());
									var newVal = val;
								
									if(isNaN(val)) {
										newVal = 0;
										if(newVal < min) newVal = min;
									} else {
										if(val > max) newVal = max;
										if(val < min) newVal = min;
									}
								
									if(newVal != val) {
										$(this).val(newVal);
										$(this).removeClass('fade-error').addClass('fade-error');
										self.laces.modal('view-createeditmotion').footer('<span class="footer-error"><i class="fa fa-exclamation-triangle"></i> ' + name + ' must be between ' + min + ' and ' + max + ' <a href="#" class="btn btn-link" data-id="help">more info</a></span>');
									}
								}
							}
						});
						
						break;
					case '_valid':
						return true;
					case '_click':
						switch(data.id) {
							case 'help':
								self.app.viewJointHelp(self);
								break;
							case 'addrow':
								addRowFunc();
								break;
							case 'stand':
								self.app.nao.send('posture_gotoposture', {'name':'Stand', 'speed':3.0}, null);
								break;
							case 'save':
								var movements = [];
								
								$('table.cadet-edit-motion tbody tr').not('.movement-none').each(function(rowIdx, rowElem) {
									var movement = {
										'speed':	parseFloat($(rowElem).find('[data-id=speed]').val()),
										'delay':	parseFloat($(rowElem).find('[data-id=delay]').val()),
										'joints':	{}
									};
								
									$(rowElem).find('input[data-joint]').each(function(idx, elem) {
										if($(elem).attr('data-joint') != '') {
											if($(elem).val() != '') {
												movement['joints'][$(elem).attr('data-joint')] = parseFloat($(elem).val());
											}
										}
									});
									
									movement['joints'] = JSON.stringify(movement['joints'])
									movements.push(movement);
								});
							
								var data = {
									'name':			name,
									'movements':	movements
								};
								
								var nameCheck = '';
								
								if(name == '') {
									data['name'] = self.laces.unescapeHtml($('#cadet-motion-name').val());
									nameCheck = data['name'];
								} else {
									if(self.laces.unescapeHtml($('#cadet-motion-name').val()) != name) {
										data['newname'] = self.laces.unescapeHtml($('#cadet-motion-name').val());
										nameCheck = data['newname'];
									}
								}
								
								var updateMotionFunc = function() {
									self.app.nao.send('cadet_motionset', data, function(r) {
										if(r['error_code'] == 0) {
											self.laces.modal('view-createeditmotion').close()
										} else {
											self.laces.alert({
												'title': self.app.i18n(self, 'TITLE_SAVING_MOTION_ERROR', 'Cannot save motion'),
												'message': self.app.i18n(self, 'ERROR_SAVING_JOINTS', 'There was a problem saving the joints'),
												'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': '+ self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
											});
										}
									});
								}
								
								if(nameCheck != '') {
									self.app.nao.send('cadet_motionexists', {'name':nameCheck}, function(r) {
										if(r['error_code'] == 0) {
											if(r['exists'] == 1) {
												self.laces.alert({
													'title': self.app.i18n(self, 'TITLE_MOTION_EXISTS', 'Motion already exists'),
													'message': self.app.i18n(self, 'ERROR_MOTION_EXISTS', 'You cannot use that name for this motion as it already exists')
												});
											} else {
												updateMotionFunc();
											}
										} else {
											self.laces.alert({
												'title': self.app.i18n(self, 'TITLE_SAVING_MOTION_ERROR', 'Cannot save motion'),
												'message': self.app.i18n(self, 'ERROR_SAVING_MOTION', 'There was a problem saving the motion'),
												'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
											});
										}
									});
								} else {
									updateMotionFunc();
								}
								
								break;
							case 'cancel':
								self.laces.modal('view-createeditmotion').close();
								break;
							case 'play':
								var row = $(data.object).parent().parent();
								var jointName = [];
								var radians = [];
								var speed = parseInt($(row).find('[data-id=speed]').val());
								
								$(row).find('[data-joint]').each(function(idx, elem) {
									if($(elem).val() != '') {
										jointName.push($(elem).attr('data-joint'));
										radians.push($(elem).val() * 0.0174532923847);
									}
								});

								data = {
									'name': jointName,
									'radians': radians,
									'speed': speed,
									'absolute': true
								};
								
								self.app.nao.send('motion_angleinterpolation', data, function(r) {
									if(r['error_code'] == 0) {
									
									} else {
										self.laces.alert({
											'title': self.app.i18n(self, 'TITLE_MOVE_JOINTS_ERROR', 'Cannot move joints'),
											'message': self.app.i18n(self, 'ERROR_MOVE_JOINTS', 'There was a problem moving the joints'),
											'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
										});
									}
								});
								
								break;
							case 'delete':
								$(data.object).parent().parent().remove();
								if($('table.cadet-edit-motion tbody tr').length <= 1) {
									$('table.cadet-edit-motion tbody tr.movement-none').show();
								}
								
								break;
						}

						break;
					case '_close':
						$('body').off('keypress', '.cadet-edit-motion input[type=number]');
						$('body').off('focusout', '.cadet-edit-motion input[type=number]');

						break;
				}
			}
		}).show();
	}
	
/*
 *	Action Play Motion
 */
	this.actionPlayMotion = function(self, name) {
		self.app.nao.send('cadet_motionget', {'name': name}, function(r) {
			if(r['error_code'] == 0) {
				var movements = [];
				
				for(var i=0; i<r['motion']['movements'].length; i++) {
					var joints = [];
					try {
						joints = JSON.parse(r['motion']['movements'][i]['joints']);
					} catch(e) {
						//...
					}
					
					var speed = r['motion']['movements'][i]['speed'];
					var delay = r['motion']['movements'][i]['delay'];
					var nameList = [];
					var radiansList = [];
					
					for(var item in joints) {
						if(joints.hasOwnProperty(item)) {
							nameList.push(item);
							radiansList.push(joints[item] * 0.0174532923847);
						}
					}
					
					var movement = {
						'name': nameList,
						'radians': radiansList,
						'speed': speed,
						'delay': delay
					};
					
					movements.push(movement);
				}
				
				var playMotionFunc = function(movementList) {
					if(movementList.length > 0) {
						var data = {
							'name': movementList[0].name,
							'radians': movementList[0].radians,
							'speed': movementList[0].speed,
							'absolute': true
						}
						
						self.app.nao.send('motion_angleinterpolation', data, function(r) {
							if(r['error_code'] == 0) {
								movementList.shift();
								
								if(movementList.length > 0) {
									window.setTimeout(playMotionFunc, movementList[0].delay * 1000, movementList);
								}
							} else {
								self.laces.alert({
									'title': self.app.i18n(self, 'TITLE_RUNNING_MOVEMENT_ERROR', 'Cannot run movement'),
									'message': self.app.i18n(self, 'ERROR_RUNNING_MOVEMENT', 'There was a problem running the movement'),
									'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
								});
							}
						});
					}
				}

				window.setTimeout(playMotionFunc, 0, movements);				
			} else {
				self.laces.alert({
					'title': self.app.i18n(self, 'TITLE_LOADING_MOVEMENT_ERROR', 'Cannot load movement'),
					'message': self.app.i18n(self, 'ERROR_LOADING_MOVEMENT', 'There was a problem loading the movement'),
					'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
				});
			}
		});
	}
	
	this.workspaceUpdateSounds = function(self) {
		var sounds = [];
		
		self.app.nao.send('cadet_filelist', null, function(r) {
			var rows = [];
			var showAdd = self.app.workspace.visible();

			if(r['error_code'] == 0) {
				if(r['files'].length > 0) {
					for(var i=0; i<r['files'].length; i++) {
						var fileName = splitFilename(r['files'][i]['name']);
						
						if(fileName.ext.toLowerCase() == 'mp3' || fileName.ext.toLowerCase() == 'wav') {
							sounds.push([r['files'][i]['name'], r['files'][i]['name']]);
						}
					}
				}
			} else {
				self.laces.alert({
					'title': self.app.i18n(self, 'TITLE_LOADING_SOUNDS_ERROR', 'Error loading sounds'),
					'message': self.app.i18n(self, 'ERROR_LOADING_SOUNDS', 'There was a error getting the list of sounds on the NAO'),
					'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
				});
			}
			
			self.app.workspace.updateBlockDropDown('sounds', sounds);
		});
	}
	
	this.workspaceUpdateMotions = function(self) {
		var motions = [];
		
		self.app.nao.send('cadet_motionlist', null, function(r) {
			if(r['error_code'] == 0) {
				for(var i=0; i<r['motions'].length; i++) {
					motions.push([r['motions'][i]['name'], r['motions'][i]['name']]);
				}
			} else {
				self.laces.alert({
					'title': self.app.i18n(self, 'TITLE_LOADING_MOTIONS_ERROR', 'Error loading motions'),
					'message': self.app.i18n(self, 'ERROR_LOADING_MOTIONS', 'There was a error getting the list of motions on the NAO'),
					'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
				});
			}
		
			self.app.workspace.updateBlockDropDown('motions', motions);
		});
	}
	
	this.workspaceUpdateBehaviors = function(self) {
		var motions = [];
		
		self.app.nao.send('behavior_getinstalledbehaviors', null, function(r) {
			var behaviors = [];
			
			if(r['error_code'] == 0) {
				for(var i=0; i<r['behaviors'].length; i++) {
					var name = r['behaviors'][i];
					
					if(self.app.behaviorIsValid(name)) {
						behaviors.push([name, name]);
					}
				}
			} else {
				self.laces.alert({
					'title': self.app.i18n(self, 'TITLE_LOADING_BEHAVIORS_ERROR', 'Error loading behaviors'),
					'message': self.app.i18n(self, 'ERROR_LOADING_BEHAVIORS', 'There was a error getting the list of behaviors on the NAO'),
					'details': self.app.i18n(self, 'MSG_ERROR_CODE', 'Error code') + ': ' + self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
				});
			}
			
 			self.app.workspace.updateBlockDropDown('behaviors', behaviors);
		});
	}
	
	this.behaviorIsValid = function(name) {
		if(name != 'naocadet' && name != '.lastUploadedChoregrapheBehavior' && name != 'animationMode' && name != 'boot-config' && name != 'diagnostic' && name.replace(/[^\/]/g, '').length < 2) {
			return true;
		}
		
		return false;
	}
	
	this.fileDownload = function(url) {
		var event = new MouseEvent('click', { 'view': window, 'bubbles': true, 'cancelable': false });

		var a = document.createElement('a');
		a.download = url;
		a.dispatchEvent(event);
	}
	
/*
 *	i18n
 */
	this.i18n = function(self, id, def = '', operations = {}) {
		var s = def;
	
		if(typeof self.app.i18nData !== 'undefined' && self.app.i18nData != null && self.app.i18nData.hasOwnProperty(id) && self.app.i18nData[id].hasOwnProperty(self.app.i18nLang) && self.app.i18nData[id][self.app.i18nLang].length > 0) {
			s = self.app.i18nData[id][self.app.i18nLang];
		}
		
		// Add operations
		for(var item in operations) {
			if(operations[item].hasOwnProperty('prefix')) {
				var idx = s.indexOf('%'+item+'%');
				if(idx > -1) s = s.substring(0, idx) + operations[item]['prefix'] + s.substring(idx);
			}
	
			if(operations[item].hasOwnProperty('prefix')) {
				var idx = s.indexOf('%'+item+'%');
				if(idx > -1) s = s.substring(0, idx + item.length + 2) + operations[item]['postfix'] + s.substring(idx + item.length + 2);
			}
	
			if(operations[item].hasOwnProperty('content')) {
				s = s.replace('%'+item+'%', operations[item]['content']);
			}
		}
		
		// Replace value placeholders
		if(typeof self.app.nao !== 'undefined' && self.app.nao != null) {
			s = s.replace('%NAME%', self.app.nao.name());
			s = s.replace('%LOCATION%', self.app.nao.domain());
		}
		
		s = s.replace('%USERNAME%', self.app.userName);

		if(s.indexOf('%TIME_GREETING%') > -1) {
			var d = new Date();
			var n = d.getHours();
			var tg = 'MSG_GOOD_MORNING';
	
			if(n < 12) {
				tg = 'MSG_GOOD_MORNING';
			} else if(n < 18) {
				tg = 'MSG_GOOD_AFTERNOON';
			} else {
				tg = 'MSG_GOOD_EVENING';
			}
		
			if(self.app.i18nData != null && self.app.i18nData.hasOwnProperty(tg) && self.app.i18nData[tg].hasOwnProperty(self.app.i18nLang)) {
				s = s.replace('%TIME_GREETING%', self.app.i18nData[tg][self.app.i18nLang]);
			} else {
				s = s.replace('%TIME_GREETING%', 'Welcome');
			}
		}
		
		return s;
	}
	
/*
 *	i18n Language Name
 */
	this.i18nLanguageName = function(languageCode) {
			if(this.i18nData != null && this.i18nData.hasOwnProperty('languageNames') && this.i18nData.langaugeNames.hasOwnProperty(code)) {
				return this.i18nData.langaugeNames[languageCode];
			}
			
			return ('Unknown');
	}

/*
 *	i18n Languages Available
 */
	this.i18nLangaugesAvail = function() {
			var languages = Array();
	
			if(this.i18nData != null && this.i18nData.hasOwnProperty('languageNames') && this.i18nData.languageNames) {
					for(var prop in this.i18nData.languageNames) {
						languages.push(prop);
					}
			}
			
			return languages;
	}

/*
 *	i18n Get Language
 */
	this.i18nGetLanguage = function() {
		return(this.i18nLang);
	}

/*
 *	i18n Set Language
 */
	this.i18nSetLanguage = function(code) {
		this.i18nLang = code;
	}

/*
 *	i18n Set Data
 */
 	this.i18nSetData = function(self, data) {
 		self.app.i18nData = data;
 	}
}

window.onerror = function(error, url, line) {
	$('body').html((window.location.href.indexOf('tablet=1') >= 0 ? '<a href="/close.html" class="cadet-error-close"><i class="fa fa-close"></i></a>' : '') + '<div class="laces-status"><i class="fa fa-exclamation fa-5x fa-fw"></i><br><p>An error occurred</p><p class="cadet-bad-error">The following error occurred:<br><br><span style="color:#000">version: ' + cadetVersion + '<br>line: ' + line + '<br>sourceURL: ' + url + '<br>ReferenceError: ' + error + '</span><br><br>Please let State Library of Queensland - Inclusive Communities know about this problem on:<br><br>Phone: +61 7 3842 9978<br>Email: james.collins@slq.qld.gov.au</p></div>');
};

function strStartsWith(str, starting, caseSensitive=false) {
	if(!caseSensitive) {
		str = str.toLowerCase();
		starting = starting.toLowerCase();
	}
	
	return(str.substr(0, starting.length) == starting);
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

$(document).ready(function() {
	var lang = getUrlParam('lang', 'EN');
 	new lacesApp(new cadetApp(lang.toUpperCase()));
	
	$('body').on('input', 'input[type=text]', function(event) {
		var map = {0x2018:'\'', 0x201B:'\'', 0x201C:'"', 0x201F:'"', 0x2019:'\'', 0x201D:'"', 0x2032: '\'', 0x2033:'"', 0x2035:'\'', 0x2036:'"', 0x2014:'-', 0x2013:'-'};
		var output = '';
		var value = $(this).val();

		for(var i=0; i<value.length; i++) {
			var code = value.charCodeAt(i);

			if(code > 255) {
				if(code in map) {
					output += map[code];
				}
			} else {
				output += value[i];
			}
		}

		$(this).val(output);
	});
});
