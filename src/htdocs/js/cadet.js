"use strict";

/*
TODO
- Recent users should also have the domain name and robot name (incase ipad is used on multiple robots, domains)
*/

/*
?view=scripts&dir=4&showall=0&action=renamescript&id=9
*/

function cadetApp() {
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
	
/*
 *	Initalize
 */
	this.initalize = function(self) {
		self.laces.status('Loading NAO Cadet...');
	
		self.app.nao = new nao();
		self.app.workspace = new workspace();

		self.laces.status('Connecting to NAO...');
		self.app.nao.connect(self, {
			'eventFunc':	self.app.naoEvent,
			'readyFunc':	function() { self.app.naoReady(self); },
			'closeFunc':	function(state) { self.app.naoClose(self, state); },
			'errorFunc':	function(state, errorCode, errorMessage) { self.app.naoError(self, state, errorCode, errorMessage); }
		});
		
		self.laces.viewRegister('setup', 'NAO Cadet Setup', self.app.viewSetup);
		self.laces.viewRegister('login', 'NAO Cadet Login', self.app.viewLogin);
		self.laces.viewRegister('admin', 'NAO Cadet Admin', self.app.viewAdmin);
		self.laces.viewRegister('scripts', 'NAO Cadet Scripts', self.app.viewScripts);
		self.laces.viewRegister('workspace', 'NAO Cadet Workspace', self.app.viewWorkspace);
		self.laces.viewDefault('login');

		if('tablet' in self.laces.options && self.laces.options.tablet == 1) {
			self.app.nao.tablet = true;
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
			alert('password required');
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
					'title': 'Restart required',
					'message': 'There has been a system change with ' + self.app.nao.name() + ' and a restart of NAO Cadet is required.',
					'buttons': ['Restart'],
					'callback': function() {
						location.reload(true);
					}
				});
				
				break;
			case 'event_shutdown':
				self.laces.alert({
					'title': 'NAO Cadet has quit',
					'message': 'NAO Cadet has quit on ' + self.app.nao.name() + '. Thanks for playing!',
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
							'title': 'Battery low on ' + self.app.nao.name(),
							'message': self.app.nao.name() + ' is running low on charge. You may need to connect ' + self.app.nao.name() + ' to power soon'
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
							'title': 'Disk space low on ' + self.app.nao.name(),
							'message': self.app.nao.name() + ' is running low on storage. An administrator may need to remove sounds/videos from NAO Cadet or programs from Choregraphe'
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
		self.laces.status('exclamation', 'Error connecting to NAO', false, true);
		self.laces.alert({
			'title': 'Could not connect to NAO',
			'message': self.app.nao.name() + ' has unexpectedly disconnected from us. There maybe a network issue or the NAO may need to be restarted.',
			'details': 'Error Code: ' + self.app.nao.errorCodeToText(errorCode) + '<br><br>' + errorMessage
		});
	}

/*
 *	NAO Close
 */
	this.naoClose = function(self, state) {
		self.laces.status('exclamation', 'Error connecting to NAO', false, true);
		self.laces.alert({
			'title': 'NAO disconnected',
			'message': self.app.nao.name() + ' has unexpectedly disconnected from us. There maybe a network issue or the NAO may need to be restarted.'
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
				
				html += '<p class="alert alert-info">We\'ve noticed that this is the first time NAO Cadet has been run on <strong>' + self.app.nao.name() + '</strong>, and we need the following information before we continue:</p>';

				html += '<div class="form-group">' +
					'<label for="cadet-setup-location">Location</label>' +
					'<input type="text" class="form-control" id="cadet-setup-location" aria-describedby="cadet-setup-location-help">' +
					'<small id="cadet-setup-location-help" class="form-text text-muted">NAO Cadet identifies users and scripts per location. If <strong>' + self.app.nao.name() + '</strong> moves to a different location, it will not affect the users and scripts at this location.<br><br>Users will be able to view scripts at other locations, but not modify them.</small>' +
				'</div>';
					
				html += '<div class="form-group">' +
					'<label for="cadet-setup-admin">Admin password</label>' +
					'<input type="text" class="form-control" id="cadet-setup-admin" aria-describedby="cadet-setup-admin-help">' +
					'<small id="cadet-setup-admin-help" class="form-text text-muted">The <strong>admin</strong> account is used to modify NAO Cadet settings and perform bulk activities.</small>' +
				'</div>';
					
				html += '<div class="form-group">' +
					'<label for="cadet-setup-root">Root password</label>' +
					'<input type="text" class="form-control" id="cadet-setup-root" aria-describedby="cadet-setup-root-help">' +
					'<small id="cadet-setup-root-help" class="form-text text-muted">The <strong>root</strong> account is used as an emergency account and can permanently delete data.</small>' +
				'</div>';
				
				self.laces.modal('setup', {
					'html':		html,
					'title':	'Setup',
					'buttons':	[{
						'id':		'save',
						'title':	'Save',
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
											'title': 'NAO Cadet Setup Error',
											'message': 'There was an error setting up NAO Cadet.',
											'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
				html += '<h1 class="display-4">Welcome to NAO Cadet</h1>';
				html += '<div class="cadet-jumbotron-slider">';
					html += '<div class="cadet-jumbotron-slider-item">';
						html += '<p class="lead">' + getTimeGreeting() + ', It\'s great to be in <strong id="cadet-location-name">' + self.app.nao.domain() + '</strong> <a class="btn btn-link fa fa-info-circle" id="cadet-btn-locationinfo"></a><br><br>Before we start, what is your name?</p>';
					html += '</div>';
					html += '<div class="cadet-jumbotron-slider-item">';
						html += '<p class="lead">Hi <strong id="cadet-login-name"></strong>!<br><br>Enter your password to login:</p>';
					html += '</div>';
				html += '</div>';
				html += '<hr class="my-4">';
				html += '<div class="row" id="cadet-section-recent"></div>';
				html += '<div class="cadet-jumbotron-slider">';
					html += '<div class="cadet-jumbotron-slider-item">';
						html += '<label class="sr-only" for="cadet-username">Name</label>';
						html += '<input type="text" class="form-control form-control-lg mb-2 mr-sm-2" id="cadet-login-username">';
						html += '<div class="text-center"><button type="submit" class="btn btn-primary btn-lg mb-2" id="cadet-btn-go">Lets Go</button></div>';
					html += '</div>';
					html += '<div class="cadet-jumbotron-slider-item">';
						html += '<label class="sr-only" for="cadet-password">Password</label>';
						html += '<input type="password" class="form-control form-control-lg mb-2 mr-sm-2" id="cadet-login-password">';
						html += '<div class="text-center"><button type="button" class="btn btn-secondary btn-lg mb-2 mr-2" id="cadet-btn-back">Back</button><button type="submit" class="btn btn-primary btn-lg mb-2" id="cadet-btn-login">Login</button></div>';
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
													'title': 'NAO Error',
													'message': 'The NAO could not log you in because an error occurred.',
													'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
													'title': 'NAO Error',
													'message': 'The NAO could not log you in because an error occurred.',
													'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
										'title': 'Location setting',
										'message': 'This NAO is currently set for the location <strong>' + self.app.nao.domain() + '</strong> and will default to the scripts and users at <strong>' + self.app.nao.domain() + '</strong>.<br><br>If this is not correct and you would like to change this, login using the <i>admin</i> account and select <i>Change Location</i>.',
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
					.brand('<img src="/img/naohead.png">NAO Cadet', function(self) {
						self.app.viewAbout(self);
					})
					.clear()
					.append('cadet-script-create', 'Create', function(self, id) { 
// 						if(self.laces.tinkerbellVisible()) {
// 							self.laces.tinkerbellEvent('cadet-script-create')
// 						} else {
							self.app.scriptEdit(self, 0);
// 						}
					})
					.appendDropdown('cadet-script-dropdown', '<i class="fa fa-bars"></i>', [
						{id: 'cadet-script-import',		title: 'Upload Script'},
						{id: 'sep'},
						{id: 'cadet-view-mine',			title: 'My scripts',			checkGroup: 'view'},
						{id: 'cadet-view-all',			title: 'All scripts',			checkGroup: 'view'},
						{id: 'sep'},
						{id: 'cadet-view-empty',		title: 'Show empty folders'},
						{id: 'sep'},
						{id: 'cadet-view-sounds',		title: 'Sounds'},
						{id: 'cadet-view-videos',		title: 'Photos/Videos'},
						{id: 'cadet-view-behaviors',	title: 'Behaviors'},
						{id: 'cadet-view-motions',		title: 'Motions'},
						{id: 'sep'},
						{id: 'cadet-user-profile',		title: 'My profile'},
						{id: 'cadet-user-logout',		title: 'Logout'
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
				 		self.app.askName(self, 'Rename folder', name, 'Rename', function(self, value) {
				 			self.app.nao.send('cadet_scriptchangedir', {'olddir': name, 'newdir': value, 'domain': self.app.userOptions['scriptDomain']}, function(r) {
				 				if(r['error_code'] != 0) {
									self.laces.alert({
										'title': 'NAO Error',
										'message': 'The NAO could not log you in because an error occurred.',
										'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
						'title': 'Script locked',
						'message': 'This script is locked because it was created by someone else or is currently being edited.<br><br>You are able to view this script however you will need to save it as a copy.',
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
			html += '<ol class="breadcrumb"><li class="breadcrumb-item"><i class="fa fa-folder-open-o"></i> Home</li></ol>';
		} else {
			html += '<ol class="breadcrumb"><li class="breadcrumb-item"><i class="fa fa-folder-open-o"></i> <a href="#" id="cadet-folder-home">Home</a></li><li class="breadcrumb-item active" aria-current="page" data-name="' + self.app.userOptions.scriptDir + '">' + self.app.userOptions.scriptDir + '</li></ol>';
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
												'<p class="card-text"><small class="text-muted">' + scriptList[i].count + ' script' + (scriptList[i].count != 1 ? 's' : '') + '</small></p>' :
												'<p class="card-text"><small class="text-muted">' + scriptList[i].mine + ' script' + (scriptList[i].mine != 1 ? 's' : '') + ' (' + scriptList[i].count + ' total)</small></p>'
											) :
											'<p class="card-text"><small class="text-muted">Created by ' + self.laces.escapeHtml(scriptList[i]['username']) + '</small></p>'
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
							self.laces.status('exclamation', 'No scripts found');
							$('#cadet-script-items').queueFadeIn();
						});
					}
				} else {
					self.laces.status('exclamation', 'No scripts found');
				}
			} else {
				self.laces.status('exclamation', 'Error loading scripts', false, true);
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
				'<label class="col-sm-1 col-form-label" for="cadet-script-name">Name</label>' +
				'<div class="col-sm-11"><input id="cadet-script-name" type="text" class="form-control" value="' + self.laces.escapeHtml(self.app.userName + '\'s Script') + '"></div>' +
			'</div>' +
		
			'<div class="form-group row">' +
				'<div class="col-sm-1">' +
					'<label class="col-form-label" for="cadet-script-dir-home">Folder</label>' +
				'</div>' +
			
				'<div class="col-sm-11">' +
					'<select id="cadet-script-dir">' +
					'<option selected id="cadet-script-dir-home" value="">Home</option>' +
					'<option data-divider="true"></option>' +
					'<option value="...">Other</option>' +
					'</select>' +
				'</div>' +
			'</div>' +

			'<div class="row">' +
			'<div class="col-sm-1"><label class="col-form-label" style="margin-top:0.8rem">Colour</label></div>' +
			'<div class="col-sm-11">' +
			self.laces.colourSelectorCreate('cadet-script-colour', '', ['F44336', 'D81B60', '9C27B0', '3F51B5', '03A9F4', '00897B', '7CB342', 'FDD835', 'FB8C00', '6D4C41', '546E7A']) + 
			'</div></div>' +

			'<div class="row">' +
			'<div class="col-sm-1"><label class="col-form-label" style="margin-top:0.8rem">Icon</label></div>' +
			'<div class="col-sm-11">' +
			self.laces.iconSelectorCreate('cadet-script-icon', '', ['address-card-o','ambulance','anchor','angellist','automobile','bank','bath','bed','binoculars','birthday-cake','blind','bomb','bug','bullhorn','cab','camera-retro','cloud','code','codiepie','compass','dashboard','database','dribbble','feed','female','futbol-o','gitlab','glass','headphones','heart','info-circle','key','location-arrow']) +
			'</div></div>' +
		'</div>';
 		
		self.laces.modal('script-edit', {
			'html':		html,
			'title':	(id == 0 ? 'Create script' : 'Edit script'),
			'buttons':	[
				{'id': 'save',		'title': 'Save',	'style': 'primary'},
				{'id': 'saveas',	'title': 'Save As',	'style': 'primary'},
				{'id': 'cancel',	'title': 'Cancel',	'style': 'secondary'},
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
												'title': 'Get script error',
												'message': 'There was an error getting information about the script.',
												'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
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
									'title': 'Get folders error',
									'message': 'There was an error getting what folders are on ' + self.app.nao.name(),
									'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
								});
							}
						});

						$('body').on('change', '#cadet-script-dir', function() {
							if($(this).val() == '...') {
								self.app.askName(self, 'Create folder', 'New folder', 'Create', function(self, value) { 
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
											'title': 'Script Save Error',
											'message': 'Your script could not be saved because an error occured.',
											'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
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
													'title': 'Save script error',
													'message': 'There was an error saving the script.',
													'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
												});
												
												self.laces.modal('script-edit').close();
											}
										})
									} else {
										self.laces.alert({
											'title': 'Save script error',
											'message': 'There was an error getting the original script.',
											'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
										});
										
										self.laces.modal('script-edit').close();
									}
								});
								break;
							case 'delete':
								self.laces.modal('delete-script', {
									'html':		'<p>Are you sure you want to delete this script?</p>',
									'width':	'30rem',
									'buttons':	[{
										'id':		'yes',
										'title':	'Yes',
										'style':	'primary'
									},{
										'id':		'no',
										'title':	'No',
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
															'title': 'Script Delete Error',
															'message': 'Your script could not be saved because an error occured.',
															'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
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
											'name':		r['script']['name'] + ' copy',
											'user':		self.app.userId,
											'options':	r['script']['options'],
											'xml':		r['script']['xml']
										};
									
										self.app.nao.send('cadet_scriptset', data, function(r) {
											if(r['error_code'] == 0) {
												self.laces.modal('script-edit').close();
											} else {
												self.laces.alert({
													'title': 'Duplicate script error',
													'message': 'There was an error saving the duplicate script.',
													'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
												});
												
												self.laces.modal('script-edit').close();
											}
										})
									} else {
										self.laces.alert({
											'title': 'Duplicate script error',
											'message': 'There was an error getting the original script.',
											'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
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
											'title': 'Export script error',
											'message': 'Could not retrieve the details of the script to export',
											'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
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
		var buttons = [{'id':'create', 'title':button, 'style':'primary'},{'id':'cancel', 'title':'Cancel', 'style':'secondary'}];
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
			'<label class="col-sm-4 col-form-label" for="cadet-profile-name">Name</label>' +
			'<div class="col-sm-8"><input type="text" id="cadet-profile-name" class="form-control" value="' + self.laces.escapeHtml(self.app.userName) + '"></div>' +
		'</div>' +
		'<h5>Options</h5>' +
			'<div class="form-check">' +
 			'<input class="form-check-input" type="checkbox" value="" id="cadet-profile-advanced"' + ('advanced' in self.app.userOptions && self.app.userOptions['advanced'] == true ? ' checked="checked"' : '') + '>' +
			'<label class="form-check-label" for="cadet-profile-advanced">Show advanced blocks</label>' +
			'</div>' +
		'<h5>Change Password</h5>' +
		'<div class="form-group row">' +
			'<label class="col-sm-4 col-form-label" for="cadet-profile-password">New Password</label>' +
			'<div class="col-sm-8"><input type="password" id="cadet-profile-password" class="form-control"></div>' +
			'<small class="offset-sm-4 col-sm-8 form-text text-muted">Leave blank unless you want to change your password</small>' +
		'</div>' +
		'<div id="cadet-profile-password-set-row" class="form-group row">' +
			'<div class="offset-sm-4 col-sm-8"><button class="btn btn-outline-secondary" id="cadet-profile-password-clear" class="form-control">Remove Password</button></div>' +
		'</div>' +
		'<div id="cadet-profile-password-noset-row" class="form-group row laces-hidden">' +
			'<div class="offset-sm-3 col-sm-6"><p class="alert alert-info"><small><i class="fa fa-info-circle" style="margin-right:1rem"></i>No password has been set</small></p></div>' +
		'</div>' +
		'</div>';
		
		var buttons = [{'id':'save', 'title':'Save', 'style':'primary'},{'id':'cancel', 'title':'Cancel', 'style':'secondary'}];
		var passwordSet = false;

		self.laces.modal('user-profile', {
			'html':		html,
			'title':	'My Profile',
			'buttons':	[{
				'id':		'save',
				'title':	'Save',
				'style':	'primary'
			},{
				'id':		'cancel',
				'title':	'Cancel',
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
									'title': 'Load profile error',
									'message': 'Could not load the details of your profile',
									'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
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
								self.app.askName(self, 'Current password', '', 'Verify', function(self, value) {
									self.app.nao.send('cadet_userset', {'id':self.app.userId, 'password':-1, 'currentPassword': value}, function(r) {
										if(r['error_code'] == 0) {
											$('#cadet-profile-password-set-row').hide();
											$('#cadet-profile-password-noset-row').show();
											passwordSet = false;
											
											self.app.nao.reauth(self.app.userName, '');
										} else {
											self.laces.alert({
												'title': 'Change Password Error',
												'message': 'Your password could not be changed because an error occured.',
												'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : ''),
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
												'title': 'Save Profile Error',
												'message': 'Your profile could not be saved because an error occurred. Your password has not been changed.',
												'details': 'Error Code: ' + self.app.nao.errorCodeToText(result['error_code']) + ('error_message' in result ? '<br><br>' + result['error_message'] : ''),
											});
										}
									});
								}

								if('password' in data && passwordSet) {
									self.app.askName(self, 'Current password', '', 'Verify', function(self, value) {
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
					.append('cadet-workspace-stop', 'Stop', function(self, id) {
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
					.append('cadet-workspace-run', 'Run', function(self, id) { 
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
										'title': 'NAO Error',
										'message': 'An error occurred trying to run your script.',
										'details': 'Error Code: ' + self.app.nao.errorCodeToText(state.error_code) + (state.error_message != '' ? '<br><br>' + state.error_message : '')
									});
									break;
								default:
									alert(state.state);
									break;
							}
						}, self);
					})
					.append('cadet-workspace-save', 'Save', function(self, id) {
						var xml = self.app.workspace.getXml()
						
						self.app.nao.send('cadet_scriptset', {'id': self.scriptId, 'xml': xml}, function(r) {
							if(r['error_code'] == 0) {
								self.scriptXml = xml;
								self.app.workspace.status('<i class="fa fa-check-circle-o fa-fw"></i> Script saved!', 2000);
							} else if(r['error_code'] == 16) {
								self.app.askName(self, 'Save script as', self.scriptName, 'Save', function(self, value) {
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
												'title': 'Error saving script',
												'message': 'An error occurred trying to save your script.',
												'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
											});
										}
									});
								});
							} else {
								self.laces.alert({
									'title': 'Error saving script',
									'message': 'An error occurred trying to save your script.',
									'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
								});
							}
						});
					})
					.append('cadet-workspace-close', 'Close', function(self, id) {
						if(self.scriptXml != self.app.workspace.getXml()) {
							self.laces.modal('workspace-save', {
								'html':		'<p>Do you want to save the changes to your script?</p>',
								'width':	'30rem',
								'buttons':	[{
									'id':		'save',
									'title':	'Save',
									'style':	'primary'
								},{
									'id':		'no',
									'title':	'No',
									'style':	'secondary'
								},{
									'id':		'cancel',
									'title':	'Cancel',
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
														'title': 'Error saving script',
														'message': 'An error occurred trying to save your script.',
														'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
						{id: 'cadet-workspace-export',		title: 'Export script'},
						{id: 'sep'},
						{id: 'cadet-view-sounds',		title: 'Sounds'},
						{id: 'cadet-view-videos',		title: 'Photos/Videos'},
						{id: 'cadet-view-behaviors',	title: 'Behaviors'},
						{id: 'cadet-view-motions',		title: 'Motions'},
						{id: 'sep'},
						{id: 'cadet-user-profile',		title: 'My profile'},
						{id: 'cadet-user-logout',		title: 'Logout'
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
				
				var showWorkspaceFunc = function(xml = '', advanced=false) {
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
								'title': 'Error loading script',
								'message': 'There was a error getting the script on the ' + self.app.nao.name(),
								'details': self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
					.brand('NAO Cadet', function(self) {
						self.app.viewAbout(self);
					})
					.clear()
					.append('cadet-admin-logout', 'Logout', function(self, id) { 
						self.laces.view('login').show();
					})
					.show();
				
				
				var html = '';
				
				html += '<div class="card cadet-admin-card"><div class="card-body"><div><a href="#" id="cadet-admin-location" class="btn btn-secondary float-right">Change Location</a><a href="#" id="cadet-admin-location-view" class="btn btn-secondary float-right">View Locations</a></div><i class="fa fa-map-marker fa-fw"></i><p>Location set to <strong class="cadet-viewadmin-domain">' + self.app.nao.domain() + '</strong></p></div></div>';
				html += '<div class="card cadet-admin-card"><div class="card-body"><div><a href="#" id="cadet-admin-colour" class="btn btn-secondary float-right">Change Colour</a></div><i class="fa fa-paint-brush fa-fw"></i><p>Colour currently set to <strong class="cadet-viewadmin-colour">' + self.app.nao.colour() + '</strong></p></div></div>';
				html += '<div class="card cadet-admin-card"><div class="card-body"><div><a href="#" id="cadet-admin-backup" class="btn btn-secondary float-right">Backup</a><a href="#" id="cadet-admin-restore" class="btn btn-secondary float-right">Restore</a></div><i class="fa fa-file-zip-o fa-fw"></i><p>Backup / Restore</p></div></div>';
				html += '<div class="card cadet-admin-card"><div class="card-body"><div><a href="#" id="cadet-admin-users" class="btn btn-secondary float-right">View Users</a></div><i class="fa fa-users fa-fw"></i><p><strong></strong> Users</p></div></div>';
				html += '<div class="card cadet-admin-card"><div class="card-body"><div><a href="#" id="cadet-admin-scripts" class="btn btn-secondary float-right">View Scripts</a></div><i class="fa fa-code fa-fw"></i><p><strong></strong> Scripts</p></div></div>';
				html += '<div class="card cadet-admin-card"><div class="card-body"><div><a href="#" id="cadet-admin-files" class="btn btn-secondary float-right">View Files</a><a href="#" id="cadet-admin-temp-clear" class="btn btn-secondary float-right">Clear Temp Files</a></div><i class="fa fa-files-o fa-fw"></i><p><strong></strong> Files</p></div></div>';
				html += '<div class="card cadet-admin-card"><div class="card-body"><div><a href="#" id="cadet-admin-password" class="btn btn-secondary float-right">Change Password</a></div><i class="fa fa-vcard-o fa-fw"></i><p>Change Admin Password</p></div></div>';
				if(self.app.userName == 'root') {
					html += '<div class="card cadet-admin-card"><div class="card-body"><div><a href="#" id="cadet-root-password" class="btn btn-secondary float-right">Change Password</a></div><i class="fa fa-vcard-o fa-fw"></i><p>Change Root Password</p></div></div>';
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
									'title': 'Error loading files',
									'message': 'There was a error getting the list of files on the NAO.',
									'details': self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
								});
							}
				
							self.laces.listView('view-locations').rows(rows);
						});
					}
	
					self.laces.listView('view-locations', {
						'title':	'Locations',
						'item':		'location',
						'buttons':	[{
							'id':		'close',
							'title':	'Close',
							'style':	'primary'
						},{
							'id':		'add',
							'title':	'Create...',
							'style':	'secondary'
						}],
						'columns':	['Name', 'Users', 'Scripts', 'Actions'],
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
													self.app.askName(self, 'Rename location', r['domain']['name'], 'Rename', function(self, value) {
														self.app.nao.send('cadet_domainset', {'id': data.value, 'name': value}, function(r) {
															if(r['error_code'] == 0) {
																rowsFunc(self);
															} else {
																self.laces.alert({
																	'title': 'Rename location error',
																	'message': 'Could not rename the location because an error occured.',
																	'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
																});
															}
														});
													});
												} else {
													self.laces.alert({
														'title': 'Get location error',
														'message': 'Could not retrieve details about the selected location.',
														'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
												'html':		'<p>Are you sure you want to delete this location?</p>',
												'width':	'30rem',
												'buttons':	[{
													'id':		'yes',
													'title':	'Yes',
													'style':	'primary'
												},{
													'id':		'no',
													'title':	'No',
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
																		'title': 'Error deleting location',
																		'message': 'An problem occurred trying to delete the location.',
																		'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
														'title': 'Error restoring location',
														'message': 'An problem occurred trying to restore the location.',
														'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
													});
												}
											});
											
											break;
										case 'add':
											self.app.askName(self, 'Create location', '', 'Create', function(self, value) { 
												self.app.nao.send('cadet_domainset', {'id':0, 'name':value}, function(r) {
													if(r['error_code'] == 0) {
														var val = self.laces.escapeHtml(value);
														$('<option>').val(r['id']).html(val).insertBefore('#cadet-select-location option[data-divider=true]');
														$('#cadet-select-location').val(r['id']);
														$('#cadet-select-location').lacesSelect('refresh');
													} else {
														self.laces.alert({
															'title': 'NAO Cadet Location Error',
															'message': 'Could not create the location on the NAO.',
															'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
							
							html += '<div class="form-group"><label for="cadet-select-location">Location:</label> <select id="cadet-select-location">';
							
							for(var i=0; i<r['domains'].length; i++) {
								html += '<option value="' + r['domains'][i]['id'] + '"' + (self.app.nao.domainId() == r['domains'][i]['id'] ? ' selected' : '') + '>' + self.laces.escapeHtml(r['domains'][i]['name']) + '</option>';
							}
							
							html += '<option data-divider="true"></option>';
							html += '<option value="...">Create...</option>';
							html += '</select></div>';
							
							html += '<div class="alert alert-danger"><strong>Warning</strong> Changing this setting will force all connected users to be disconnected</div>';

							self.laces.modal('setup', {
								'html':		html,
								'title':	'Change Location',
								'width':	'28rem',
								'buttons':	[{
									'id':		'save',
									'title':	'Save',
									'style':	'primary'
								},{
									'id':		'cancel',
									'title':	'Cancel',
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
													self.app.askName(self, 'Create location', '', 'Create', function(self, value) { 
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
																		'title': 'NAO Cadet Location Error',
																		'message': 'Could not create the location on the NAO.',
																		'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
																	'title': 'NAO Cadet Location Error',
																	'message': 'Could not set the location on the NAO.',
																	'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
																});
															}
														});
													} else {
														self.laces.modal('setup').loading(false);
														
														self.laces.alert({
															'title': 'Could not set Location',
															'message': 'You need to select a valid location before it can be saved'
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
								'title': 'NAO Cadet Location Error',
								'message': 'Could not retrieve the locations on the NAO.',
								'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
							});
						}
					});
				}

				var backupFunc = function() {
					self.laces.progress('Backing up');
					self.app.nao.send('cadet_backup', null, function(r) {
						self.laces.progress().close();
						
						if(r['error_code'] == 0) {
							window.location = '/file/backup.tar.gz';
						} else {
							self.laces.alert({
								'title': 'NAO Cadet Backup Failed',
								'message': 'An error occurred backing up NAO Cadet.',
								'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
												'title': 'NAO Cadet Restore Failed',
												'message': 'An error occurred restoring NAO Cadet.',
												'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
									'title': 'Error loading file',
									'message': 'There was an error uploading the file to the ' + self.app.nao.name() + '.',
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
									'title': 'Error loading files',
									'message': 'There was a error getting the list of files on the NAO.',
									'details': self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
								});
							}
				
							self.laces.listView('view-users').rows(rows);
						});
					}
	
					self.laces.listView('view-users', {
						'title':	'Users',
						'item':		'user',
 						'search':	search,
						'buttons':	[{
							'id':		'close',
							'title':	'Close',
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
											self.app.askName(self, 'Rename user', data.value, 'Record', function(self, value) {
												self.app.nao.send('audiodevice_startmicrophonesrecording', {"name": value}, function(r) {
													if(r['error_code'] == 0) {
														$('#stoprecord').show();
														$('#record').hide();
													} else {
														self.laces.alert({
															'title': 'NAO Error',
															'message': 'The NAO could not record audio because an error occurred.',
															'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
												'html':		'<p>Are you sure you want to delete this user?</p>',
												'width':	'30rem',
												'buttons':	[{
													'id':		'yes',
													'title':	'Yes',
													'style':	'primary'
												},{
													'id':		'no',
													'title':	'No',
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
																		'title': 'Error deleting user',
																		'message': 'An problem occurred trying to delete the user.',
																		'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
														'title': 'Error restoring user',
														'message': 'An problem occurred trying to restore the user.',
														'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
									'title': 'Error loading scripts',
									'message': 'There was a error getting the list of scripts on the NAO.',
									'details': self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
								});
							}
				
							self.laces.listView('view-scripts').rows(rows);
						});
					}
	
					self.laces.listView('view-scripts', {
						'title':	'Scripts',
						'item':		'script',
 						'search':	search,
						'buttons':	[{
							'id':		'close',
							'title':	'Close',
							'style':	'primary'
						}],
						'columns':	['Name', 'User', 'Domain', 'Actions'],
						'widths': ['40%', '20%', '20%', '20%'],
						'callback':	function(self, action, data) {
							switch(action) {
								case '_ready':
									rowsFunc(self);
									break;
								case '_click':
									switch(data.id) {
										case 'edit':
											self.app.askName(self, 'Rename script', data.value, 'Record', function(self, value) {
												self.app.nao.send('audiodevice_startmicrophonesrecording', {"name": value}, function(r) {
													if(r['error_code'] == 0) {
														$('#stoprecord').show();
														$('#record').hide();
													} else {
														self.laces.alert({
															'title': 'NAO Error',
															'message': 'The NAO could not record audio because an error occurred.',
															'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
												'html':		'<p>Are you sure you want to delete this script?</p>',
												'width':	'30rem',
												'buttons':	[{
													'id':		'yes',
													'title':	'Yes',
													'style':	'primary'
												},{
													'id':		'no',
													'title':	'No',
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
																		'title': 'Error deleting script',
																		'message': 'An problem occurred trying to delete the script.',
																		'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
														'title': 'Error restoring script',
														'message': 'An problem occurred trying to restore the script.',
														'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
									'title': 'Error loading files',
									'message': 'There was a error getting the list of files on the NAO.',
									'details': self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
								});
							}
				
							self.laces.listView('view-files').rows(rows);
						});
					}
					
					// TODO add callback to reload when files change
	
					self.laces.listView('view-files', {
						'title':	'Files',
						'item':		'file',
						'buttons':	[{
							'id':		'close',
							'title':	'Close',
							'style':	'primary'
						},{
							'id':		'upload',
							'title':	'Upload',
							'style':	'secondary'
						}],
						'columns':	['Name', 'Size', 'Actions'],
						'widths': ['50%', '20%', '30%'],
						'callback':	function(self, action, data) {
							switch(action) {
								case '_ready':
									rowsFunc(self);
									break;
								case '_click':
									switch(data.id) {
										case 'edit':
											self.app.askName(self, 'Rename file', data.value, 'Rename', function(self, value) {
												self.app.nao.send('cadet_filerename', {'name': data.value, 'newname': value}, function(r) {
													if(r['error_code'] == 0) {
														rowsFunc(self);
													} else {
														self.laces.alert({
															'title': 'NAO Error',
															'message': 'The NAO could not record audio because an error occurred.',
															'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
												'html':		'<p>Are you sure you want to delete this file?</p>',
												'width':	'30rem',
												'buttons':	[{
													'id':		'yes',
													'title':	'Yes',
													'style':	'primary'
												},{
													'id':		'no',
													'title':	'No',
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
																		'title': 'Error deleting file',
																		'message': 'An problem occurred trying to delete the file.',
																		'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
														'title': 'Error restoring file',
														'message': 'An problem occurred trying to restore the file.',
														'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
								'title': 'Clear Temp Files Success',
								'message': 'Temp files cleared'
							});
						} else {
							self.laces.alert({
								'title': 'Clear Temp Files Error',
								'message': 'There was an error clearing the temporary files from NAO Cadet.',
								'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
							});
						}
					});
				}
				
				var passwordChangeFunc = function(user) {
					var html = '';
				
					html += '<div class="form-group">' +
						'<label for="cadet-setup-admin">Current password</label>' +
						'<input type="password" class="form-control" id="cadet-password-current">' +
					'</div>';
					
					html += '<div class="form-group">' +
						'<label for="cadet-setup-admin">New password</label>' +
						'<input type="password" class="form-control" id="cadet-password-new">' +
					'</div>';
					
					html += '<div class="form-group">' +
						'<label for="cadet-setup-admin">New password (again)</label>' +
						'<input type="password" class="form-control" id="cadet-password-repeat">' +
					'</div>';
					
					self.laces.modal('change-password', {
						'html':		html,
						'title':	'Change ' + user + ' password',
						'buttons':	[{
							'id':		'save',
							'title':	'Save',
							'style':	'primary'
						},{
							'id':		'cancel',
							'title':	'Cancel',
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
													'title': 'Password changed',
													'message': 'The password for the ' + name + ' account has not changed.'
												});
											} else if(r['error_code'] == 15) {
												self.laces.alert({
													'title': 'Cannot change password',
													'message': 'The current password you entered was incorrect. The password for the ' + name + ' account has not been changed.'
												});
											} else {
												self.laces.alert({
													'title': 'Change password error',
													'message': 'There was an error changing the password NAO Cadet.',
													'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
						'<label for="cadet-colour" class="mr-3">Colour</label>' +
						'<select id="cadet-colour" class="custom-select custom-select-lg mb-3">' +
							'<option value="aqua">Aqua</option>' +
							'<option value="blue">Blue</option>' +
							'<option value="green">Green</option>' +
							'<option value="grey">Grey</option>' +
							'<option value="orange">Orange</option>' +
							'<option value="red">Red</option>' +
						'</select>' +
					'</div>';
					
					self.laces.modal('change-colour', {
						'html':		html,
						'title':	'Change NAO colour',
						'buttons':	[{
							'id':		'save',
							'title':	'Save',
							'style':	'primary'
						},{
							'id':		'cancel',
							'title':	'Cancel',
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
						'title': 'Error loading files',
						'message': 'There was a error getting the list of files on the NAO.',
						'details': self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
					});
				}
				
				self.laces.listView('view-sounds').rows(rows);
			});
		}
	
		self.laces.listView('view-sounds', {
			'title':	'Sounds',
			'item':		'sound',
			'buttons':	[{
				'id':		'close',
				'title':	'Close',
				'style':	'primary'
			},{
				'id':		'upload',
				'title':	'Upload...',
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
			'columns':	['Name', 'Size', 'Actions'],
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
								self.app.askName(self, 'Recording name', 'My recording', 'Record', function(self, value) {
									self.app.nao.send('audiodevice_startmicrophonesrecording', {"name": value}, function(r) {
										if(r['error_code'] == 0) {
											$('#stoprecord').show();
											$('#record').hide();
										} else {
											self.laces.alert({
												'title': 'NAO Error',
												'message': 'The NAO could not record audio because an error occurred.',
												'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
											'title': 'Cannot play sound',
											'message': 'There was a problem playing the sound on ' + self.app.nao.name(),
											'details': self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
									'html':		'<p>Are you sure you want to delete this sound?</p>',
									'width':	'30rem',
									'buttons':	[{
										'id':		'yes',
										'title':	'Yes',
										'style':	'primary'
									},{
										'id':		'no',
										'title':	'No',
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
															'title': 'Error deleting sound',
															'message': 'An problem occurred trying to delete the sound.',
															'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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

								self.app.workspace.status('<i class="fa fa-check-circle-o fa-fw"></i> Sound added!', 2000);
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
						'title': 'Error loading files',
						'message': 'There was a error getting the list of files on the NAO.',
						'details': self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
					});
				}
				
				self.laces.listView('view-videos').rows(rows);
			});
		}
	
		self.laces.listView('view-videos', {
			'title':	'Photos/Videos',
			'item':		'file',
			'buttons':	[{
				'id':		'close',
				'title':	'Close',
				'style':	'primary'
			},{
				'id':		'upload',
				'title':	'Upload...',
				'style':	'secondary'
			}],
			'columns':	['Name', 'Size', 'Actions'],
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
									'html':		'<p>Are you sure you want to delete this photo/video?</p>',
									'width':	'30rem',
									'buttons':	[{
										'id':		'yes',
										'title':	'Yes',
										'style':	'primary'
									},{
										'id':		'no',
										'title':	'No',
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
															'title': 'Error deleting photo/video',
															'message': 'An problem occurred trying to delete the photo/video.',
															'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
						'title': 'Error loading behaviors',
						'message': 'There was a error getting the list of behaviors on the NAO.',
						'details': self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
					});
				}
				
				self.laces.listView('view-behaviors').rows(rows);
			});
		}
	
		self.laces.listView('view-behaviors', {
			'title':	'Behaviors',
			'item':		'behavior',
			'buttons':	[{
				'id':		'close',
				'title':	'Close',
				'style':	'primary'
			}],
			'columns':	['Name', 'Actions'],
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

								self.app.workspace.status('<i class="fa fa-check-circle-o fa-fw"></i> Behavior added!', 2000);
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
			html += '<li class="nav-item"><a class="nav-link active" id="jointhead-tab" data-toggle="tab" href="#jointhead" aria-controls="jointhead" aria=selected="true">Head</a></li>';
			html += '<li class="nav-item"><a class="nav-link" id="jointlarm-tab" data-toggle="tab" href="#jointlarm" aria-controls="jointlarm" aria=selected="false">Left Arm</a></li>';
			html += '<li class="nav-item"><a class="nav-link" id="jointrarm-tab" data-toggle="tab" href="#jointrarm" aria-controls="jointrarm" aria=selected="false">Right Arm</a></li>';
		html += '</ul>';
		html += '<div class="tab-content" id="jointTabContent">';
			html += '<div class="tab-pane fade show active text-center" id="jointhead" role="tabpanel" aria-labelledby="jointhead-tab"><img src="/img/hardware_headjoint_3.3.png"></div>';
			html += '<div class="tab-pane fade text-center" id="jointlarm" role="tabpanel" aria-labelledby="jointlarm-tab"><img src="/img/hardware_larmjoint_3.3.png"></div>';
			html += '<div class="tab-pane fade text-center" id="jointrarm" role="tabpanel" aria-labelledby="jointrarm-tab"><img src="/img/hardware_rarmjoint_3.3.png"></div>';
		html += '</div>';
		
		self.laces.modal('view-jointhelp', {
			'title':	'Joint Information',
			'html':		html,
			'buttons':	[{
				'id':		'close',
				'title':	'Close',
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
					html += '<th colspan="2" rowspan="2">Head</th><th colspan="5">Left</th><th colspan="5">Right</th><th rowspan="3" class="speed text-upwards">Speed</th><th rowspan="3" class="action text-upwards">Action</th>';
				html += '</tr>';
				html += '<tr class="border-right no-border-bottom no-border-top">';
					html += '<th colspan="2">Shoulder</th><th colspan="2">Elbow</th><th class="border-right">Wrist</th><th colspan="2">Shoulder</th><th colspan="2">Elbow</th><th>Wrist</th>';
				html += '</tr>';
				html += '<tr class="border-right no-border-top">';
					html += '<th>Pitch</th><th>Yaw</th><th>Roll</th><th>Pitch</th><th>Yaw</th><th>Roll</th><th>Yaw</th><th>Roll</th><th>Pitch</th><th>Yaw</th><th>Roll</th><th>Yaw</th>';
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
			'title':	'Set Joints',
			'help':		function() {self.app.viewJointHelp(self);},
			'html':		html,
			'width':	'63rem',
			'buttons':	[{
				'id':		'save',
				'title':	'Add',
				'style':	'primary'
			},{
				'id':		'cancel',
				'title':	'Cancel',
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
											'title': 'Cannot move joints',
											'message': 'There was a problem moving the joints on ' + self.app.nao.name(),
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
					'title': 'Error loading file',
					'message': 'There was an error uploading the file to the ' + self.app.nao.name() + '.',
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
			html += '<span class="cadet-about-line"><strong>Version</strong>' + self.app.nao.version() + '<span>';
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
			'title':	'About NAO Cadet',
			'buttons':	[
				{'id': 'close', 'title':'Close', 'style': 'primary'},
				{'id': 'quit', 'title':'Quit NAO Cadet', 'style': 'danger', 'left':true}
			],
			'callback':	function(self, action, data) {
				switch(action) {
					case '_click':
						if(data.id == 'quit') {
							self.laces.modal('cadet-quit', {
								'html':		'<p>Are you sure you want to quit NAO Cadet for all users?</p>',
								'width':	'30rem',
								'buttons':	[{
									'id':		'yes',
									'title':	'Yes',
									'style':	'primary'
								},{
									'id':		'no',
									'title':	'No',
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
														'title': 'Error quitting NAO Cadet',
														'message': 'An problem occurred trying to quit NAO Cadet.',
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
						'title': 'Error loading motions',
						'message': 'There was a error getting the list of motions on the NAO.',
						'details': self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
					});
				}
				
				self.laces.listView('view-motions').rows(rows);
			});
		}
	
		self.laces.listView('view-motions', {
			'title':	'Motions',
			'item':		'motion',
			'buttons':	[{
				'id':		'close',
				'title':	'Close',
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
				'title':	'Upload...',
				'style':	'secondary'
			}],
			'columns':	['Name', 'Movements', 'Time', 'Actions'],
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
																'title': 'Motion already exists',
																'message': 'You cannot use that name for this motion as it already exists'
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
																		'title': 'Error uploading motion',
																		'message': 'An problem occurred trying to upload the motion.',
																		'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
																	});
																}
															});
														}
													} else {
														self.laces.alert({
															'title': 'Error uploading motion',
															'message': 'An problem occurred trying to upload the motion.',
															'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
														});
													}
												});
												
												return false;
											});
										} catch(e) {
											self.laces.alert({
												'title': 'Error uploading motion',
												'message': 'An problem occurred trying to upload the motion.',
												'details': 'JSON parse error'
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
									'html':		'<p>Are you sure you want to delete this motion?</p>',
									'width':	'30rem',
									'buttons':	[{
										'id':		'yes',
										'title':	'Yes',
										'style':	'primary'
									},{
										'id':		'no',
										'title':	'No',
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
															'title': 'Error deleting motion',
															'message': 'An problem occurred trying to delete the motion.',
															'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
											'title': 'Error exporting motion',
											'message': 'An problem occurred trying to export the motion.',
											'details': 'Error Code: ' + self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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

								self.app.workspace.status('<i class="fa fa-check-circle-o fa-fw"></i> Motion added!', 2000);
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
					html += '<th colspan="2" rowspan="2">Head</th><th colspan="5">Left</th><th colspan="5">Right</th><th rowspan="3" class="speed text-upwards">Speed</th><th rowspan="3" class="delay text-upwards">Delay</th><th rowspan="3" class="action text-upwards">Action</th>';
				html += '</tr>';
				html += '<tr class="border-right no-border-bottom no-border-top">';
					html += '<th colspan="2">Shoulder</th><th colspan="2">Elbow</th><th class="border-right">Wrist</th><th colspan="2">Shoulder</th><th colspan="2">Elbow</th><th>Wrist</th>';
				html += '</tr>';
				html += '<tr class="border-right no-border-top">';
					html += '<th>Pitch</th><th>Yaw</th><th>Roll</th><th>Pitch</th><th>Yaw</th><th>Roll</th><th>Yaw</th><th>Roll</th><th>Pitch</th><th>Yaw</th><th>Roll</th><th>Yaw</th>';
				html += '</tr>';
			html += '</thead>';
			html += '<tbody>';
				html += '<tr class="movement-none"><td colspan="15"><i class="fa fa-exclamation fa-5x fa-fw"></i><br>No movements found</td></tr>';
			html += '</tbody>';
		html += '</table>';
		
		self.laces.modal('view-createeditmotion', {
			'title':	'Create motion <input type="text" class="form-control" id="cadet-motion-name" value="' + self.laces.escapeHtml((name != '' ? name : self.app.userName + '\'s move')) + '">',
			'help':		function() {self.app.viewJointHelp(self);},
			'html':		html,
			'width':	'63rem',
			'buttons':	[{
				'id':		'save',
				'title':	'Save',
				'style':	'primary'
			},{
				'id':		'cancel',
				'title':	'Cancel',
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
										'title': 'Cannot load movement',
										'message': 'There was a problem loading the movement on ' + self.app.nao.name(),
										'details': self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
												'title': 'Cannot save motion',
												'message': 'There was a problem saving the joints on ' + self.app.nao.name(),
												'details': self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
											});
										}
									});
								}
								
								if(nameCheck != '') {
									self.app.nao.send('cadet_motionexists', {'name':nameCheck}, function(r) {
										if(r['error_code'] == 0) {
											if(r['exists'] == 1) {
												self.laces.alert({
													'title': 'Motion already exists',
													'message': 'You cannot use that name for this motion as it already exists'
												});
											} else {
												updateMotionFunc();
											}
										} else {
											self.laces.alert({
												'title': 'Cannot save motion',
												'message': 'There was a problem saving the motion on ' + self.app.nao.name(),
												'details': self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
											'title': 'Cannot move joints',
											'message': 'There was a problem moving the joints on ' + self.app.nao.name(),
											'details': self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
									'title': 'Cannot run movement',
									'message': 'There was a problem loading the movement on ' + self.app.nao.name(),
									'details': self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
								});
							}
						});
					}
				}

				window.setTimeout(playMotionFunc, 0, movements);				
			} else {
				self.laces.alert({
					'title': 'Cannot load movement',
					'message': 'There was a problem loading the movement on ' + self.app.nao.name(),
					'details': self.app.nao.errorCodeToText(r['error_code']) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
					'title': 'Error loading sounds',
					'message': 'There was a error getting the list of sounds on the NAO.',
					'details': self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
					'title': 'Error loading motions',
					'message': 'There was a error getting the list of motions on the NAO.',
					'details': self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
					'title': 'Error loading behaviors',
					'message': 'There was a error getting the list of behaviors on the NAO.',
					'details': self.app.nao.errorCodeToText(r.error_code) + ('error_message' in r ? '<br><br>' + r['error_message'] : '')
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
}

window.onerror = function(error, url, line) {
	$('body').html((window.location.href.indexOf('tablet=1') >= 0 ? '<a href="/close.html" class="cadet-error-close"><i class="fa fa-close"></i></a>' : '') + '<div class="laces-status"><i class="fa fa-exclamation fa-5x fa-fw"></i><br><p>An error occurred</p><p class="cadet-bad-error">The following error occurred:<br><br><span style="color:#000">version: %APP_VERSION%<br>line: ' + line + '<br>sourceURL: ' + url + '<br>ReferenceError: ' + error + '</span><br><br>Please let State Library of Queensland - Inclusive Communities know about this problem on:<br><br>Phone: +61 7 4042 5207<br>Email: james.collins@slq.qld.gov.au</p></div>');
};

function strStartsWith(str, starting, caseSensitive=false) {
	if(!caseSensitive) {
		str = str.toLowerCase();
		starting = starting.toLowerCase();
	}
	
	return(str.substr(0, starting.length) == starting);
}

$(document).ready(function() {
 	new lacesApp(new cadetApp());
	
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
