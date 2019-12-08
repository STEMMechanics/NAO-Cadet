"use strict";

/*
	TODO
	- Support for Jumbotron
	- Support for direct HTML
	- Support for views/actions in URL (view= & action=)
	- Support a modal/jumbotron ready function (to register clicks)
	- Support a modal/jumbotron close function (to unregister clicks)
	- Support a modal/jumbotron validate function on fields
	
	- Queue Animations to run in order
*/

function lacesApp(instance) {
	this.instance_		= {'laces': this, 'app': instance};
	this.viewList_		= [];
	this.viewDefault_	= '';
	this.actionList_	= [];
	this.popupList_		= [];
	this.tinkerbellList_	= {};
	this.isApp_			= false;
	this.options		= {};

	var self = this;

/*
 *	Status
 */
	this.status = function(icon=null, text=null, spin=false, reloadBtn=false) {
		this.icon_ = (text == null ? '' : icon);
		this.text_ = (text == null ? icon : text);
		
		if($('.laces-status').length > 0) {
			if(this.text_ != null) {
				if(this.icon_ != '') {
					$('.laces-status .fa').removeClass().addClass('fa fa-' + this.icon_ + ' fa-5x fa-fw');
					if(spin) {
						$('.laces-status .fa').addClass('fa-spin');
					}
				}
			
				if(reloadBtn) {
					this.text_ += '<br><a href="#" class="btn btn-outline-secondary laces-reload">Reconnect</a>'
				}
			
				$('.laces-status p:first').html(this.text_);
			} else {
				$('.laces-status').remove();
			}
		}
	}
	
	this.statusInsert = function() {
		return '<div class="laces-status"><i class="fa fa-cog fa-spin fa-5x fa-fw"></i><br><p></p></div>';
	}
	
/*
 *	Ready
 */
 	this.ready = function() {
		var viewFound = false;
		
 		var queryStr = window.location.href.split('?');
 		if(queryStr.length > 1) {
			if(queryStr[1].indexOf('#') >= 0) {
				queryStr[1] = queryStr[1].substr(0, queryStr[1].indexOf('#'));
			}

 			var queryItems = queryStr[1].split('&');
			for(var i=0; i<queryItems.length; i++) {
				var queryItem = queryItems[i].split('=');
				self.options[queryItem[0]] = (queryItem.length > 1 ? decodeURIComponent(queryItem[1]) : '');
			}
 		}
 		
 		if('view' in self.options) {
 			if(self.options.view in this.viewList_) {
 				viewFound = true;
	 			this.view(self.options.view).show();
	 		}
 		} else {
 			if(this.viewDefault_ in this.viewList_) {
 				viewFound = true;
 				this.viewList_[this.viewDefault_].view.show();
 			}
 		}
 		
 		if('app' in self.options) {
 			if(self.options.app == 'naocadet') {
 				this.isApp_ = true;
 			}
 		}
 		
 		if(viewFound == false) {
 			$('main').html('<div class="laces-status"><i class="fa fa-exclamation fa-5x fa-fw"></i><br><p>Page ' + ('view' in self.options ? self.options.view : 'unknown') + ' not found</p></div>');
 		}
 	}
	
/*
 *	View
 */
	this.viewRegister = function(id, title, cb) {
		if(!(id in this.viewList_)) {
			this.viewList_[id] = {'view': new this.viewObject_(this, id, title, cb)};
		}
	}
	
	this.viewDefault = function(id) {
		this.viewDefault_ = id;
	}
	
	this.view = function(id) {
		if(id in this.viewList_) {
			return this.viewList_[id].view;
		}
		
		return null;
	}
	
	this.viewCurrent = function() {
		this.prefix_	= 'laces_view_';
				
		var prevId = $('main').attr('id');
	
		if(prevId != undefined && prevId.substr(0, this.prefix_.length) == this.prefix_) {
			return prevId.substr(this.prefix_.length);
		}
		
		return '';
	}

	this.viewObject_ = function(laces, id, title, cb) {
		this.id_		= id;
		this.cb_		= cb;
		this.title_		= title;
		this.prefix_	= 'laces_view_';
	
		var self_ = this;
	
		this.show = function(data=null) {
			if($('#' + this.prefix_ + id).length == 0) {
				var prevId = $('main').attr('id');
			
				if(prevId != undefined && prevId.substr(0, this.prefix_.length) == this.prefix_) {
					laces.view(prevId.substr(this.prefix_.length)).close();
				}
			
				$('main').attr('id', this.prefix_ + this.id_);
				$('#' + this.prefix_ + id).html(laces.statusInsert());
				document.title = this.title_;
// 				if(!silent) {
// 					window.history.pushState(null, this.title_, 'index.html?view=' + this.id_);
// 				}
				var html = this.cb_(laces.instance_, '_show', data);
				if(html != false && html != '') {
					$('#' + this.prefix_ + id).css('opacity', 0).html(html).queueFadeIn(200, function(){
						$('#' + this.prefix_ + id + ' input[type=text]').attr({
							autocorrect: 'off',
							autocomplete: 'off',
							autocapitalize: 'off',
							spellcheck: 'false'
						});
					
						self_.cb_(laces.instance_, '_ready', data);
					});
				}				
			}
		}
		
		this.close = function() {
			for(var key in this.popupList_) {
				this.popupList_[key].close();
			}
			
			this.cb_(laces.instance_, '_close');
		}
		
		return this;
	}

/*
 *	popup
 */
	this.popupObject_ = function(laces=null, id='', html='', cb='', helpCb=null, slideIn=false) {
		this.id_	= id;
		this.cb_	= cb;
		this.slideIn_	= slideIn;
		this.helpCb_ = helpCb;

		this.show = function() {
			if(laces == null) return this;
			
			if($('.laces-popup').last().attr('id') == this.id_) return this;
			
			var self = this;
		
			if($(this.id_).length == 0) {
				this.cb_(laces.instance_, '_show', null);

				if($('#laces-overlay').length == 0) {
					$('body').append('<div id="laces-overlay"></div>');
					$('#laces-overlay').queueAnimation({opacity:0.5});
				} else {
					$('.laces-popup').last().css({"filter": "brightness(0.5)"});
				}
				
				$('body').append($(html).first().addClass('laces-popup'));

				$('body').on('click', '#' + this.id_ + ' .btn', function() {
					var btnId = $(this).attr('id');
					if(btnId == undefined) {
						btnId = $(this).attr('data-id');
						if(btnId == undefined) {
							return;
						}
					}

					var btnValue = $(this).attr('data-value');

					if($(this).hasClass('btn-primary')) {
						var valid = true;
						
						$('#' + self.id_ + ' input').each(function(idx, elem) {
							if($(elem).is(':visible') && $(elem).attr('data-validate') != 'false') {
								if(self.cb_(laces.instance_, '_valid', {
									'id':		$(elem).attr('id'),
									'value':	$(elem).val(),
									'object':	elem
								}) == false) {
									$(elem).addClass('is-invalid');
									valid = false;
								}
							}
						});
						
						if(valid == true) {
							self.cb_(laces.instance_, '_click', {
								'id':		btnId,
								'value':	btnValue,
								'object':	this
							});
						} else {
							$('#' + self.id_).shake();
						}
					} else {
						self.cb_(laces.instance_, '_click', {
							'id':		btnId,
							'value':	btnValue,
							'object':	this
						});
					}
				});
				
				$('body').on('click', '#' + this.id_ + ' .laces-modal-help', function() {
					if(self.helpCb_ != null) {
						self.helpCb_();
					}
				});

				if(!self.slideIn_) {
					$('#' + this.id_).queueFadeIn();
				} else {
					$('#' + this.id_).css({top:'-100px', opacity:1});
					$('#' + this.id_).queueAnimation({top:'150px'});
				}
				
				if(laces.isTablet() == false) {
					$('#' + this.id_ + ' input[type=text]').first().focus();
				}
				
				$('#' + this.id_ + ' input[type=checkbox]').lacesCheckbox();
				$('#' + this.id_ + ' select').lacesSelect();
				this.cb_(laces.instance_, '_ready', null);
			}
		}
		
		this.close = function() {
			if(laces == null) return this;

			this.cb_(laces.instance_, '_close', null);
			
			$('body').off('click', '#' + this.id_ + ' .btn');
			$('body').off('click', '#' + this.id_ + ' .laces-modal-help');
			
			$('#' + this.id_).queueFadeOutRemove(200, function() {
				if($('.laces-popup').length == 0) {
					$('#laces-overlay').queueFadeOutRemove(200, function() {
						if($('.laces-popup').length > 0) {
							$('body').append('<div id="laces-overlay"></div>');
							$('#laces-overlay').queueAnimation({opacity:0.5});
						}
					});
				} else {
					$('.laces-popup').last().css({"filter": "brightness(1)"});
				}
			})
			
			delete laces.popupList_[this.id_];
		}
		
		this.loading = function(state, overlay=false) {
			if(overlay) {
				if(state) {
					if($('#' + this.id_ + ' .laces-popup-overlay').length == 0) {
						$('#' + this.id_).prepend('<div class="laces-popup-overlay"></div>');
					}
				} else {
					$('#' + this.id_ + ' .laces-popup-overlay').remove();
				}
			} else {
				if(state) {
					$('#' + this.id_ + ' button, #' + this.id_ + ' input').each(function(){
						var w=$(this).width();
						$(this).addClass('laces-aria-loading').attr('disabled', true).width(w);
					});
				} else {
					$('#' + this.id_ + ' button, #' + this.id_ + ' input').each(function(){
						$(this).removeClass('laces-aria-loading').attr('disabled', false).css('width', '');
					});
				}
			}
		}
		
		this.find = function(identifier) {
			return($('#' + this.id_).find(identifier));
		}
		
		this.invalidate = function(elem, shake=true) {
			$('#' + this.id_ + ' ' + elem).addClass('is-invalid');
			if(shake) {
				$('#' + this.id_).shake();
			}
		}
		
		this.shake = function() {
			$('#' + this.id_).shake();
		}
		
		return this;
	}

/*
 *	Jumbotron
 */
	this.jumbotron = function(id, html=null, cb=null) {
		id = 'laces_jumbotron_' + id;
		
		if(html == null && cb == null) {
			if(id in this.popupList_) {
				return this.popupList_[id];
			}
		} else {
			html = '<div id="' + id + '" class="jumbotron">' + html + '</div>';
			
			if(!(id in this.popupList_)) {
				this.popupList_[id] = new this.popupObject_(this, id, html, cb);
				return this.popupList_[id];
			}
		}
		
		return this.popupObject_();
	}
	
/*
 *	Modal
 */
	this.modal = function(id, options=null) {
		id = 'laces_modal_' + id;
		
		if(options == null) {
			if(id in this.popupList_) {
				return this.popupList_[id];
			}
			
			return new this.popupObject_();
		} else {
			var buttons = '';
			var buttonsLeft = '';

			if('buttons' in options != null) {
				for(var i=0; i<options.buttons.length; i++) {
					var btn = '<button id="' + options.buttons[i].id + '" type="button" class="btn btn-' + options.buttons[i].style + ('left' in options.buttons[i] && options.buttons[i].left == true ? ' laces-modal-btn-left' : '') + ('icon' in options.buttons[i] && options.buttons[i].icon == true ? ' laces-modal-btn-icon' : '') + '">' + options.buttons[i].title + '</button>';
					if('left' in options.buttons[i] && options.buttons[i].left == true) {
						buttonsLeft = btn + buttonsLeft;
					} else {
						buttons = btn + buttons;
					}
				}
			} else {
				buttons = '<button id="close" type="button" class="btn btn-primary">Close</button>';
			}

			var html = '<div id="' + id + '" class="modal-dialog"' + ('width' in options ? ' style="width:' + options.width + '"' : '') + '>' + 
					'<div class="modal-content">' + 
						('title' in options ? '<div class="modal-header"><h5 class="modal-title">' + options.title + '</h5>' + ('help' in options ? '<a href="#" class="laces-modal-help"><i class="fa fa-question"></i></a>' : '') + '</div>' : '') +
						'<div class="modal-body' + ('no-padding' in options && options.no-padding == true ? ' no-padding' : '' ) + '">' + options.html + '</div>' + 
						'<div class="modal-footer">' +
							buttonsLeft + 
							'<p>' + ('footer' in options ? options.footer : '') + '</p>' + 
							buttons + 
						'</div>' + 
					'</div>' + 
			'</div>';
			
			if(!(id in this.popupList_)) {
				this.popupList_[id] = new this.popupObject_(this, id, html, options.callback, ('help' in options ? options.help : null));
				
				this.popupList_[id].footer = function(s) {
					$('#' + id + ' .modal-footer p').html(s);
				}
			}

			return this.popupList_[id];
		}
	}
	
/*
 *	Alert
 */
	this.alert = function(options=null) {
		var id = 'laces_alert';
		
		if(options == null) {
			if(id in this.popupList_) {
				return this.popupList_[id];
			}
		
			return null;
		} else {
			var html = '<div id="' + id + '" class="alert alert-' + ('style' in options ? options.style : 'danger') + ' laces-alert laces-popup" role="alert">';
			if('title' in options) { html += '<h4 class="alert-heading">' + options.title + '</h4>'; }
			html += '<p>' + options.message + '</p>';
			if('details' in options && options.details != '') {
				html += '<samp>' + options.details + '</samp>';
			}
			if('buttons' in options) {
				html += '<button type="button" id="laces_alert_button" class="btn btn-' + ('style' in options ? options.style : 'danger') + '">' + options.buttons[0] + '</button>';
			} else {
				html += '<button type="button" id="laces_alert_button" class="btn btn-' + ('style' in options ? options.style : 'danger') + '">OK</button>';
			}
			html += '</div>';
		
			var alertCallback = null;
			if('callback' in options) {
				alertCallback = options.callback;
			}
		
			var cb = function(self, action, data) {
				if(action == '_click') {
					this.close();
					if(alertCallback != null) {
						alertCallback();
					}
				}
			}
		
			if(!(id in this.popupList_)) {
				this.popupList_[id] = new this.popupObject_(this, id, html, cb);
				this.popupList_[id].show();
			}
		}
	}
	
/*
 *	List View
 */
	this.listView = function(id, options=null) {
		id = 'laces_modal_' + id;
		
		if(options == null) {
			if(id in this.popupList_) {
				return this.popupList_[id];
			}
			
			var obj = new this.popupObject_();
			obj.rows = function(data) { }
		} else {
			if(!(id in this.popupList_)) {
				var buttons = '';
				var buttonsLeft = '';

				if('buttons' in options != null) {
					for(var i=0; i<options.buttons.length; i++) {
						var btn = '<button id="' + options.buttons[i].id + '" type="button" class="btn btn-' + options.buttons[i].style + ('left' in options.buttons[i] && options.buttons[i].left == true ? ' laces-modal-btn-left' : '') + ('icon' in options.buttons[i] && options.buttons[i].icon == true ? ' laces-modal-btn-icon' : '') + '">' + options.buttons[i].title + '</button>';
						if('left' in options.buttons[i] && options.buttons[i].left == true) {
							buttonsLeft = btn + buttonsLeft;
						} else {
							buttons = btn + buttons;
						}
					}
				} else {
					buttons = '<button id="close" type="button" class="btn btn-primary">Close</button>';
				}
				
				var widths = ('widths' in options ? options.widths : ['auto','auto','auto','auto','auto']);

				var html = '';
				html += '<div id="' + id + '" class="modal-dialog">';
					html += '<div class="modal-content">';
						html += '<div class="modal-header"><h5 class="modal-title">' + options.title + '</h5><div class="laces-listview-search"><input type="text" id="laces-listview-search-field" tab-index="-1" class="form-control form-control-sm" value="' + ('search' in options ? options.search : '') + '"><a href="#" id="laces-listview-search-btn" class="btn btn-link"><i class="fa fa-search"></i></a></div></div>';
						html += '<div class="modal-body no-padding"><table class="table laces-table-sortable"><thead><tr>';
							for(var i=0; i<options.columns.length; i++) {
								html += '<th style="width:' + widths[i] + '" data-sort="' + (i != (options.columns.length - 1)) + '">' + options.columns[i] + '</th>';
							}
						html += '</tr></thead><tbody><tr class="laces-listview-none"><td colspan="' + options.columns.length + '"><i class="fa fa-exclamation fa-5x fa-fw"></i><br>' + ('item' in options ? 'No ' + options.item + 's found' : 'No files found') + '</td></tr></tbody></table></div>';
						html += '<div class="modal-footer">';
							html += buttonsLeft;
							html += '<p></p>';
							html += buttons;
						html += '</div>';
					html += '</div>';
				html += '</div>';

				this.popupList_[id] = new this.popupObject_(this, id, html, options.callback);
				this.popupList_[id].widths = widths;

				this.popupList_[id].rows = function(data) {
					var html = '';
				
					$('#' + id + '.modal-dialog table tbody tr').not('.laces-listview-none').remove();
					for(var row=0; row<data.length; row++) {
						var rowClass = '';
						
						if('rowClass' in data[row]) rowClass = data[row].rowClass;
						
						html += '<tr' + (rowClass != '' ? ' class="' + rowClass + '"' : '') + '>';
						for(var col=0; col<data[row].columns.length; col++) {
							var value = data[row].columns[col];
							var dataValue = '';
							
							if(Array.isArray(value)) {
								value = data[row].columns[col][0];
								dataValue = data[row].columns[col][1];
							}
							
							html += '<td style="width:' + this.widths[col] + '"' + (dataValue != '' ? 'data-value="' + dataValue + '"' : '') + '>' + value + '</td>';
						}
						html += '</tr>';
					}
					
					$('#' + id + '.modal-dialog table tbody').append(html);
					
					var count = $('#' + id + '.modal-dialog table tbody tr').not('.laces-listview-none').length;
					$('#' + id + '.modal-dialog .modal-footer p').html(count + ' ' + ('item' in options ? options.item : 'file') + (count == 1 ? '' : 's'));
					
					if(count > 0) {
						$('#' + id + '.modal-dialog tbody tr.laces-listview-none').hide();
					} else {
						$('#' + id + '.modal-dialog tbody tr.laces-listview-none').show();
					}

					if($('#' + id + ' #laces-listview-search-field').val() != '') {
						$('#' + id + ' #laces-listview-search-btn').trigger('click');
					}
					
					self.tableSortable($('#' + id + '.modal-dialog table'));
				};
				
				return this.popupList_[id];
			}
		}
		
		return null;
	}


/*
 *	Colour Selector
 */
	this.colourSelectorCreate = function(id, selected, colours) {
		var html = '<div id="' + id + '" class="laces-colour-dot-selector">';
		
		if(selected == '') selected = colours[0];
		
		for(var i=0; i<colours.length; i++) {
			html += '<div id="colour-' + colours[i] + '" class="laces-colour-dot' + (selected.toLowerCase() == colours[i].toLowerCase() ? ' laces-colour-dot-selected' : '') + '" style="background-color:#' + colours[i] + '"></div>';
		}

		html += '</div>';
		return html;
	}
	
	this.colourSelectorGet = function(id) {
		if($('#' + id + ' .laces-colour-dot-selected').length > 0) {
			var colour = $('#' + id + ' .laces-colour-dot-selected').css('background-color');
			if(colour != undefined) {
				return rgb2hex(colour);
			}
		}

		return '';
	}
	
	this.colourSelectorSet = function(id, val) {
		if($('#' + id + ' #colour-' + val.toUpperCase() + '.laces-colour-dot').length > 0) {
			$('#' + id + ' .laces-colour-dot').removeClass('laces-colour-dot-selected');
			$('#' + id + ' #colour-' + val.toUpperCase() + '.laces-colour-dot').addClass('laces-colour-dot-selected');
		}
	}
	
/*
 *	Icon Selector
 */
	this.iconSelectorCreate = function(id, selected, icons) {
		var html = '<div id="' + id + '" class="laces-icon-dot-selector">';
		
		if(selected == '') selected = icons[0];
		
		for(var i=0; i<icons.length; i++) {
			html += '<div id="icon-' + icons[i] + '" class="laces-icon-dot' + (selected == icons[i] ? ' laces-icon-dot-selected' : '') + ' fa fa-' + icons[i] + '"></div>';
		}

		html += '</div>';
		return html;
	}
	
	this.iconSelectorGet = function(id) {
		var icon = '';
	
		if($('#' + id + ' .laces-icon-dot-selected').length > 0) {
			var classList = $('#' + id + ' .laces-icon-dot-selected').attr('class').split(/\s+/);
			$.each(classList, function(index, item) {
				if(item.substring(0, 3) === 'fa-') {
					icon = item.substring(3);
				}
			});
		}

		return icon;
	}
	
	this.iconSelectorSet = function(id, val) {
		if($('#' + id + ' #icon-' + val + '.laces-icon-dot').length > 0) {
			$('#' + id + ' .laces-icon-dot').removeClass('laces-icon-dot-selected');
			$('#' + id + ' #icon-' + val + '.laces-icon-dot').addClass('laces-icon-dot-selected');
		}
	}

/*
 *	Setting Get
 */
	this.settingGet = function(name, session=false, defaultValue='') {
		var value = null;
		
		if(session) {
			value = sessionStorage.getItem(name);
		} else {
			value = localStorage.getItem(name);
		}

		if(value == null) return defaultValue;
		
		if(value == 'false') return false;
		if(value == 'true') return true;
		
		return value;
	}
	
/*
 *	Setting Get
 */
	this.settingSet = function(name, value=null, session=false) {
		if(value == null) {
			if(session) {
				sessionStorage.removeItem(name);
			} else {
				localStorage.removeItem(name);
			}
		} else {
			if(session) {
				sessionStorage.setItem(name, value);
			} else {
				localStorage.setItem(name, value);
			}
		}
	}
	
/*
 *	Navbar
 */
 	this.navbarObject_ = function() {
 		this.brand_			= '';
 		this.brandCb_		= null;
 		this.callbacks_		= [];
 	
 		var self_ = this;
 		
		$('body').prepend('<nav class="navbar navbar-expand navbar-dark bg-primary" style="top:-100px"><a class="navbar-brand" href="#">' + this.brand_ + '</a><ul class="navbar-nav ml-auto"></ul></nav>');
		$('body').off('click', '.navbar a.navbar-brand');
		$('body').on('click', '.navbar a.navbar-brand', function() {
			if(self_.brandCb_ != null) {
				self_.brandCb_(self.instance_);
			}
			
			return false;
		});

		$('body').off('click', '.navbar a.nav-link, .navbar a.dropdown-item');
		$('body').on('click', '.navbar a.nav-link, .navbar a.dropdown-item', function() {
			if($(this).attr('data-toggle') == 'dropdown') {
				return true;
			}
		
			var group = $(this).attr('data-group');
			var id = $(this).attr('data-id');

			if(id != undefined) {
				if(group != undefined) {
					$(this).parent().removeClass('show');
				
					if(group in self_.callbacks_) {
						var checkgroup = $(this).attr('data-checkgroup');
						if(checkgroup != undefined) {
							if($(this).find('i').length > 0) {
								return false;
							}
							
							self_.callbacks_[group](self.instance_, $('.navbar .dropdown-item[data-checkgroup="' + checkgroup + '"] i').parent().attr('data-id'), false);
							$('.navbar .dropdown-item[data-checkgroup="' + checkgroup + '"] i').remove();
							$('.navbar .dropdown-item[data-id="' + id + '"]').prepend('<i class="fa fa-check"></i>');
							self_.callbacks_[group](self.instance_, id, true);
						} else {
							if($(this).hasClass('laces-dropdown-checkable')) {
								if($(this).find('i').length == 0) {
									$(this).prepend('<i class="fa fa-check"></i>');
									self_.callbacks_[group](self.instance_, id, true);
								} else {
									$(this).find('i').remove();
									self_.callbacks_[group](self.instance_, id, false);
								}
							} else {
								self_.callbacks_[group](self.instance_, id, true);
							}
						}
					}
				} else {
					if(id in self_.callbacks_) {
						self_.callbacks_[id](self.instance_, id, true);
					}
				}
			}
			
			return false;
		});

 		this.show = function() {
			$('.navbar').queueAnimation({top:0}, 400);
			return this;
 		}
 		
 		this.hide = function() {
			$('.navbar').queueAnimation({top:-100}, 400);
			return this;
 		}
 		
 		this.brand = function(brand, cb=null) {
 			this.brand_ = brand;
 			this.brandCb_ = cb;
 			$('.navbar .navbar-brand').html(this.brand_);
			return this;
 		}
 		
 		this.clear = function() {
			$('.navbar .navbar-nav li').remove();
			$('.navbar .navbar-text').remove();
			this.callbacks_ = [];
			
			return this;
 		}
 		
 		this.text = function(str) {
 			if($('.navbar .navbar-text').length == 0) {
 				$('.navbar .navbar-brand').after('<span class="navbar-text">' + str + '</span>');
 			} else {
 				$('.navbar-text').html(str);
 			}
 		}
 		
 		this.append = function(id, title, cb, style=null) {
 			if(!(id in this.callbacks_)) {
 				this.callbacks_[id] = cb;
	 			$('.navbar .navbar-nav').append('<li class="nav-link"><a class="nav-link" data-id="' + id + '">' + title + '</a></li>').queueFadeIn(1);
				if(style != null) {
					$('.navbar .navbar-nav a[data-id="' + id + '"]').parent().css(style);
				}
 			}
 			
			return this;
 		}
 		
 		this.appendDropdown = function(id, title, items, cb) {
 			if(!(id in this.callbacks_)) {
 				this.callbacks_[id] = cb;
 				
 				var html = '<li id="' + id + '" class="nav-link dropdown">';
 				html += '<a class="nav-link" href="javascript:void()" role="button" id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' + title + '</a>';
 				html += '<div class="dropdown-menu" aria-labelledby="navbarDropdown">';
 				for(var i=0; i<items.length; i++) {
 					if(items[i].id == 'sep') {
 						html += '<div class="dropdown-divider"></div>';
 					} else {
	 					html += '<a class="dropdown-item' + ('checkGroup' in items[i] == true || 'checked' in items[i] == true ? ' laces-dropdown-checkable' : '') + ('checkGroup' in items[i] == true ? ' laces-dropdown-checkgroup' : '' ) + '" href="#" data-id="' + items[i].id + '" data-group="' + id + '"' + ('checkGroup' in items[i] == true ? ' data-checkgroup="' + items[i].checkGroup + '"' : '') + '>' + (items[i].checked == true ? '<i class="fa fa-check"></i>' : '') + items[i].title + '</a>';
	 				}
 				}
 				html += '</div>';
 				html += '</li>';
 				
	 			$('.navbar .navbar-nav').append(html).queueFadeIn(1);
 			}
 			
			return this;
 		}
 		
 		this.hideItem = function(id) {
 			$('.navbar .navbar-nav li a[data-id="' + id + '"]').parent().hide();
 			$('.navbar .navbar-nav li#' + id).hide();
 			return this;
 		}
 		
 		this.showItem = function(id) {
 			$('.navbar .navbar-nav li#' + id).show();
 			$('.navbar .navbar-nav li a[data-id="' + id + '"]').parent().show();
 			$('.dropdown-menu').css('display', '');
 			return this;
 		}
 		
 		this.check = function(id, checked=true) {
 			if($('.navbar .navbar-nav a[data-id="' + id + '"]').hasClass('laces-dropdown-checkable')) {
 				if(checked) {
					if($('.navbar .navbar-nav a[data-id="' + id + '"]').find('i').length == 0) {
						var group = $('.navbar .navbar-nav a[data-id="' + id + '"]').attr('data-group');
						
						if(group != undefined) {
							$('.navbar .navbar-nav a[data-id="' + id + '"][data-group="' + group + '"] i').remove();
						}
						
						$('.navbar .navbar-nav a[data-id="' + id + '"]').prepend('<i class="fa fa-check"></i>');
					}
				} else {
					if($('.navbar .navbar-nav a[data-id="' + id + '"]').find('i').length > 0) {
						$('.navbar .navbar-nav a[data-id="' + id + '"]').remove('i');
					}
				}
 			}
 		}

 		this.disable = function(id='') {
 			if(id != '') {
	 			$('.navbar .navbar-nav a[data-id="' + id + '"]').addClass('disabled');
	 		} else {
	 			$('.navbar .navbar-nav').addClass('disabled');
	 		}
 		}

 		this.enable = function(id='') {
 			if(id != '') {
	 			$('.navbar .navbar-nav a[data-id="' + id + '"]').removeClass('disabled');
	 		} else {
	 			$('.navbar .navbar-nav').removeClass('disabled');
	 		}
 		}
 	}

	this.navbar = function() {
		return this.navbar_;
	}

/*
 *
 */
	this.uploader = function(type, callback, cbdata) {
		if($('#laces-uploader').length == 0) {
			$('body').append('<input id="laces-uploader" type="file">');

			$('body').on('change', '#laces-uploader', function(e) {
				if($('#laces-uploader').prop('files').length > 0) {
					var file		= $('#laces-uploader').prop('files')[0];
					var chunkSize  = 32767;
					var offset     = 0;
					var chunkReaderBlock = null;
					var id			= 0;

					var readEventHandler = function(evt) {
						if (evt.target.error == null) {
							var data = evt.target.result.split(',')[1];
							callback(file.name, offset, file.size, data, evt.target.result.length, chunkReaderBlock, cbdata);
						} else {
							return;
						}
					}
					
					chunkReaderBlock = function() {
						if(offset >= file.size) {
							callback(file.name, -1, file.size, '', 0, chunkReaderBlock, cbdata);
							return;
						}
					
						var r = new FileReader();
						var blob = file.slice(offset, chunkSize + offset);
						offset += chunkSize;
						r.onload = readEventHandler;
						r.readAsDataURL(blob);
					}


					callback(file.name, 0, file.size, '', 0, chunkReaderBlock, cbdata);
					$('#laces-uploader').val(null);
					
					self.progress('Uploading File');
				}				
			});
		}
		
		$('#laces-uploader').attr('accept', type);
		this.uploaderCallback = callback;

		$('#laces-uploader').click();
	}
	
/*
 *	Progress
 */
	this.progress = function(title='') {
		var id = 'laces-progress';
		
		if(id in this.popupList_) {
			return this.popupList_[id];
		} else {
			var html = '<div id="laces-progress" class="laces-progress-dialog"><h5>' + title + '</h5><div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:100%"></div></div><button class="btn btn-secondary">Cancel</button></div>';

			var callback = function(self, action, data) { };
			var self_ = this;
			
			this.popupList_[id] = new this.popupObject_(this, id, html, callback, null, true);
			this.popupList_[id].userCancelled = false;

			$('#laces-progress button').off('click');
			this.popupList_[id].show();
			$('#laces-progress button').on('click', function() {
				self_.popupList_[id].userCancelled = true;
				$(this).attr('disabled', true);
			});
			
			this.popupList_[id].title = function(title) {
				$('#laces-progress h5').html(title);
			}

			this.popupList_[id].animate = function() {
				$('#laces-progress .progress-bar').addClass('progress-bar-striped progress-bar-animated').css('width', '100%').html('');
			}

			this.popupList_[id].percent = function(p) {
				if(p < 0) p = 0;
				if(p > 100) p = 100;
			
				$('#laces-progress .progress-bar').removeClass('progress-bar-striped progress-bar-animated').attr('aria-valuenow', p).css('width', p + '%').html(p + '%');
			}

			this.popupList_[id].cancelled = function() {
				return this.userCancelled;
			}
		
			return this.popupList_[id];
		}
		
		return null;
	}
	
/*
 *	Tinkerbell
 */
	this.tinkerbell = function(id, options) {
		this.tinkerbellList_[id] = options;
	}
	
	this.tinkerbellEvent = function(event) {
		for(var key in this.tinkerbellList_) {
			var options = this.tinkerbellList_[key];
			if('event' in options) {
				if(options.event == event) {
					this.tinkerbellShow(options);
					break;
				}
			}
		}
	}
	
	this.tinkerbellShow = function(options) {
		if($('#laces-overlay').length > 0) {
			window.setTimeout(function() {
				self.tinkerbellShow(options);
			}, 1000);
			
			return;
		}
	
		if($('.ring-container').length == 0) {
			$('.ring-container').off('click');
			$('#tinkerbell-hide').off('click');
			
			$('body').append('<div class="ring-container"><div class="ringring"></div><div class="circle"></div><div class="alert alert-success below" role="alert"><p></p><a href="#" id="tinkerbell-hide" data-id="_hide">Hide</a><a id="tinkerbell-action" class="btn btn-primary">OK</a></div></div>');
			$('.ring-container').on('click', function(e) {
				if(!$('.ring-container .alert').is(":visible")){
					$('.ring-container .alert').animate({ width: "toggle" });
    			}
			    return false;
			});
			$('#tinkerbell-hide').on('click', function(e) {
				self.tinkerbellEvent('tinkerbell_hide');
			});
  		}
  		
		var moveFunc = function() {
			if('title' in options) {
				$('.ring-container p').html('<strong>' + options.title + '</strong>' + options.message);
			} else {
				$('.ring-container p').html(options.message);
			}
		
			var buttonTitle = ('button' in options ? options.button : 'OK');
			var buttonId = ('next' in options ? options.next : '_hide');
		
			if(buttonId == '_hide' || ('hide' in options && options.hide == false)) {
				$('#tinkerbell-hide').hide();
			} else {
				$('#tinkerbell-hide').show();
			}
		
			$('.ring-container #tinkerbell-action').attr('data-id', buttonId).html(buttonTitle);
		
			$('.ring-container a').off('click');
			$('.ring-container a').on('click', function() {
				var dataid = $(this).attr('data-id');
				
				switch(dataid) {
					case '_hide':
						self.tinkerbellHide();
						break;
					case '_hidesilent':
						$('.ring-container').fadeOut(400);
						break;
					case '_idle':
						$('.ring-container .alert').fadeOut(400, function() {
							$('.ring-container').animate({left: '+=20', top: '+=20'});
						});
						
						break;
					default:
						if(dataid in self.tinkerbellList_) {
							var options = self.tinkerbellList_[dataid];
							var datanext = $(this).attr('data-next');
							
							if(typeof datanext !== undefined) {
								options['next'] = datanext;
							}
							
							self.tinkerbellShow(options);
						} else {
							self.tinkerbellHide();
						}
						
						break;
				}
			});
		
			if(!$('.ring-container').is(':visible')) {
				$('.ring-container').fadeIn(400);
			}

			var left = '40%';
			var top = '40%';

			if('left' in options.location) {
				left = options.location.left;
				top = options.location.top;
			}
			
			if('width' in options) {
				$('.ring-container .alert p').css('width', options.width);
			} else {
				$('.ring-container .alert p').css('width', '');
			}

			var move2Func = function() {
				if(left + 370 > $(window).width()) {
					$('.ring-container .alert').css('left', '-300px');
				} else {
					$('.ring-container .alert').css('left', '50px');
				}

				$('.ring-container').animate({left:left, top:top}, 400, function() {
					$('.ring-container .alert').animate({ width: "toggle" }, 400, function() {
						var height = $('.ring-container .alert').offset().top - $('body').scrollTop() + $('.ring-container .alert').height() + 50;
						if(height > $(window).height()) {
							top -= (height - $(window).height());
							$('.ring-container').animate({top:top}, 400);
						}
					});
				});
			}

			if('elem' in options.location && $(options.location.elem).length > 0) {
				left = $(options.location.elem).offset().left + (($(options.location.elem).width() / 2) - 20);
				top = $(options.location.elem).offset().top + ($(options.location.elem).height() / 2);
				
				$('body').animate({scrollTop:top - 20}, 400, function() {
					top -= $('body').scrollTop();
					move2Func();
				});
			} else {
				move2Func();
			}
		}

  		if($('.ring-container .alert').is(":visible")) {
  			$('.ring-container .alert').animate({ width: "toggle" }, function() {
  				moveFunc();
  			});
  		} else {
  			moveFunc();
  		}
	}
	
	this.tinkerbellHide = function() {
		var f = function() {
			$('.ring-container').animate({left:'100%', top:0}, 400);
			$('.ring-container').fadeOut(400);
		}
		
		if($('.ring-container .alert').is(":visible")){
			$('.ring-container .alert').animate({width: "toggle"}, f);
		} else {
			f();
		}
	}
	
	this.tinkerbellVisible = function() {
		return $('.ring-container').is(":visible");
	}


/*
 *	isTablet
 */
	this.isTablet = function() {
		if('tablet' in self.options && self.options.tablet == 1) {
			return true;
		}
		
		return false;
	}
	
	this.isApp = function() {
		return this.isApp_;
	}
	
/*
 *	un/escapeHTML
 */
	this.unescapeChars = {};
 	this.escapeChars = {
		'¢':'cent',
		'£':'pound',
		'¥':'yen',
		'€':'euro',
		'©':'copy',
		'®':'reg',
		'<':'lt',
		'>':'gt',
		'"':'quot',
		'&':'amp',
		'\'':'#39'
	};

	this.escapeStr = '[';
	for(const key in this.escapeChars) {
		this.escapeStr += key;
		this.unescapeChars[this.escapeChars[key]] = key;
	}
	this.escapeStr += ']';
	this.escapeRegEx = new RegExp(this.escapeStr, 'g');

	this.escapeHtml = function(s) {
		if(typeof s !== 'undefined') {
			s = s.toString();
	
			return s.replace(this.escapeRegEx, function(m) {
				return '&' + self.escapeChars[m] + ';';
			});
		}
		
		return '';
	}

	this.unescapeHtml = function(s) {
		if(s == null) {
			s = '';
		}
		
		s = s.toString();
	
		return s.replace(/\&([^;]+);/g, function(entity, entityCode) {
			var match;
			
			if (entityCode in self.unescapeChars) {
				return self.unescapeChars[entityCode];
			} else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
				return String.fromCharCode(parseInt(match[1], 16));
			} else if (match = entityCode.match(/^#(\d+)$/)) {
				return String.fromCharCode(~~match[1]);
			} else {
				return entity;
			}
		});
	}

/*
 *	Table Sortable
 */
	this.tableSortable = function(table) {
		$(table).addClass('laces-table-sortable');
		sortTable(table, 0);
	}


	/** Initalize **/
	this.navbar_		= new this.navbarObject_();

	window.addEventListener('popstate', function(event) {
		//self.ready();		TODO workout state
	});

	if(typeof this.instance_.app.initalize === 'function') {
		this.instance_.app.initalize(this.instance_);
	}
}

$(document).ready(function() {
	$('main').html('<div class="laces-status"><i class="fa fa-cog fa-spin fa-5x fa-fw"></i><br><p></p></div>');

	$('body').on('keyup', '.laces-popup input', function(event) {
		if(event.keyCode == 13) {
			if($(this).nextUntil('.btn-primary').first().find('.btn-primary:visible').length > 0) {
				$(this).nextUntil('.btn-primary').first().find('.btn-primary:visible').first().trigger('click');
			} else if($(this).closest('.laces-popup').find('.btn-primary:visible').first().length> 0) {
				$(this).closest('.laces-popup').find('.btn-primary:visible').first().trigger('click');
			}
		}
	});

	/* Clear invalid marked inputs */
	$('body').on('keyup', 'input.is-invalid', function(event) {
		$(this).removeClass('is-invalid');
	});
	
	/* Check Picker */
	$('body').on('click', 'input[type=checkbox]', function() {
		if($(this).find('~ .laces-checkbox').length > 0) {
			if($(this).is(':checked')) {
				$(this).find('~ .laces-checkbox .fa').addClass('fa-check');
			} else {
				$(this).find('~ .laces-checkbox .fa').removeClass('fa-check');			
			}
		}
	});

	$('body').on('click touchstart', '.laces-checkbox', function() {
		if($(this).find('.fa').hasClass('fa-check')) {
			$(this).prev('input[type=checkbox]').attr('checked', false);
			$(this).find('.fa').removeClass('fa-check');
		} else {
			$(this).prev('input[type=checkbox]').attr('checked', true);
			$(this).find('.fa').addClass('fa-check');
		}
	});	
	
	$('body').on('change', 'input[type=checkbox]', function() {
		if($(this).find('~ .laces-checkbox').length > 0) {
			if($(this).is(':checked')) {
				$(this).find('~ .laces-checkbox .fa').addClass('fa-check');
			} else {
				$(this).find('~ .laces-checkbox .fa').removeClass('fa-check');			
			}
		}
	});
	
	/* Select Picker */
	$('body').on('click', '.btn-group .dropdown-menu a', function() {
		var prevVal = $('#' + $(this).attr('data-selectid')).val();
		var currVal = $(this).attr('data-val');
		
		if(prevVal != currVal) {
			$('#' + $(this).attr('data-selectid')).val($(this).attr('data-val'));	
			$(this).parent().parent().find('.dropdown-toggle').html($(this).html());
			$('#' + $(this).attr('data-selectid')).trigger('change');
		}
	})

	/* Colour Selector */	
	$('body').on('click', '.laces-colour-dot', function() {
		$('#' + ($(this).parent().attr('id')) + ' .laces-colour-dot').removeClass('laces-colour-dot-selected');
		$(this).addClass('laces-colour-dot-selected');
	});
	
	/* Icon Selector */
	$('body').on('click', '.laces-icon-dot', function() {
		$('#' + ($(this).parent().attr('id')) + ' .laces-icon-dot').removeClass('laces-icon-dot-selected');
		$(this).addClass('laces-icon-dot-selected');
	});
	
	/* List View Search */
	$('body').on('click', '#laces-listview-search-btn', function() {
		var search = $(this).parent().find('#laces-listview-search-field').val().toLowerCase();
		var columnIndex = -1;
		
		if(search.indexOf(':') != -1) {
			var columnName = search.substr(0, search.indexOf(':'));
			search = search.substr(search.indexOf(':') + 1);

			columnIndex = -2;

			$(this).parentsUntil('.modal-body').find('.table thead th').each(function(idx, elem) {
				if(columnName == $(this).contents().text().toLowerCase()) {
					columnIndex = idx;
				}
			});
		}
	
		$(this).parentsUntil('.modal-body').find('.table tbody tr').not('.laces-listview-none').show();
		$(this).parentsUntil('.modal-body').find('.table tbody tr.laces-listview-none').hide();

		if(search == '') {
			if($(this).parentsUntil('.modal-dialog').find('tbody tr').not('.laces-listview-none').length == 0) {
				$(this).parentsUntil('.modal-dialog').find('tr.laces-listview-none').show();
			}
		} else {
			$(this).parentsUntil('.modal-body').find('.table tbody tr').not('.laces-listview-none').each(function(idx, elem) {
				var found = false;
				$(elem).find('td').each(function(idx, elem) {
					if(idx == columnIndex || columnIndex == -1) {
						if($(elem).html().toLowerCase().indexOf(search) != -1) {
							found = true;
						}
					}
				});
				
				if(!found) {
					$(this).hide();
				}
			});

			var html = ' / ' + $(this).parentsUntil('.modal-dialog').find('tbody tr:visible').not('.laces-listview-none').length + ' found - <a href="#" id="laces-listview-search-clear" class="btn btn-outline-secondary">Clear Search</a>';
			var footer = $(this).parentsUntil('.modal-dialog').find('.modal-footer p');
			if(footer.find('span').length > 0) {
				footer.find('span').html(html);
			} else {
				footer.append('<span>' + html + '</span>');
			}
			
			if(!$(this).parentsUntil('.modal-body').find('.table tbody tr').not('.laces-listview-none').is(':visible')) {
				$(this).parentsUntil('.modal-body').find('.table tbody tr.laces-listview-none').show();
			}
		}
	});
	
	$('body').on('click', '#laces-listview-search-clear', function() {
		if($(this).parentsUntil('.modal-dialog').find('tbody tr').not('.laces-listview-none').length > 0) {
			$(this).parentsUntil('.modal-dialog').find('tr.laces-listview-none').hide();
			$(this).parentsUntil('.modal-dialog').find('tbody tr').not('.laces-listview-none').show();
		} else {
			$(this).parentsUntil('.modal-dialog').find('tbody tr.laces-listview-none').show();
		}

		$(this).parentsUntil('.modal-dialog').find('#laces-listview-search-field').val('');
		$(this).parentsUntil('.modal-dialog').find('.modal-footer p span').remove();
	});
	
	$('body').on('click', '.laces-reload', function() {
		window.location.reload(true);
	});
	
	/* Table Searching */
	$('body').on('click', 'table.laces-table-sortable thead th', function() {
		if($(this).attr('data-sort') != 'false') {
			sortTable($(this).parentsUntil('table').parent(), $(this).index('th'));
		}
	});
});

(function($) {
	$.fn.shake = function() {
		var o = $.extend({
			direction: "left",
			distance: 20,
			times: 3,
			speed: 80,
			easing: "swing"
		}, o);

		return this.each(function() {
			var el = $(this), props = {
				position: el.css("position"),
				left: el.css("left"),
				right: el.css("right")
			};

			var ref = "left";
			var motion = "pos";

			var animation = {}, animation1 = {}, animation2 = {};
			animation[ref] = (motion == "pos" ? "-=" : "+=")  + o.distance;
			animation1[ref] = (motion == "pos" ? "+=" : "-=")  + o.distance * 2;
			animation2[ref] = (motion == "pos" ? "-=" : "+=")  + o.distance * 2;

			// Animate
			el.animate(animation, o.speed, o.easing);
			for (var i = 1; i < o.times; i++) { // Shakes
				el.animate(animation1, o.speed, o.easing).animate(animation2, o.speed, o.easing);
			};
			el.animate(animation1, o.speed, o.easing).
			animate(animation, o.speed / 2, o.easing, function(){ // Last shake
				el.css(props); // Restore
			});
		});
	};

	$.fn.queueFadeOut = function(d=200, cb=null) {
		$(this).queueAnimation({opacity:0}, d, cb);
	};

	$.fn.queueFadeOutRemove = function(d=200, cb=null) {
		$(this).queueAnimation({opacity:0}, d, function(){$(this).remove(); if(typeof cb === 'function'){cb();}});
	};

	$.fn.queueFadeOutHide = function(d=200, cb=null) {
		$(this).queueAnimation({opacity:0}, d, function(){$(this).css('display','none'); if(typeof cb === 'function'){cb();}});
	};

	$.fn.queueFadeIn = function(d=200, cb=null) {
		$(this).css('opacity', 0).show();
		$(this).queueAnimation({opacity:1}, d, cb);
	};	
	
	var queueList_ = [];
	var queueTimer_ = null;

	$.fn.queueAnimation = function(a, d, cb=null) {
		queueList_.push({'element': $(this), 'animate': a, 'delay': d, 'callback': cb});
		var f = function() {
			if(queueList_.length > 0) {
				if($('*').is(':animated')) {
					queueTimer_ = setTimeout(f, 20);
				} else {
					queueList_[0].element.animate(queueList_[0].animate, queueList_[0].delay, queueList_[0].callback);
					queueList_.shift();
					if(queueList_.length > 0) {
						queueTimer_ = setTimeout(f, 20);
					} else {
						queueTimer_ = null;
					}
				}
			} else {
				queueTimer_ = null;
			}
		}
		
		if(queueTimer_ == null) {
			f();
		}
	};

	$.fn.lacesCheckbox = function() {
		$(this).each(function() {
			$(this).css('display','none');
			$(this).after('<div class="laces-checkbox"><i class="fa"></i></div>');
			if($(this).prop('checked')) {
				$(this).find('~ .laces-checkbox .fa').addClass('fa-check');
			}
		});
	}

	$.fn.lacesSelect = function(option='') {
		$(this).each(function() {
			switch(option) {
				case 'refresh':
					$('#' + $(this).attr('id') + '_selectpicker').remove();
				case '':
					$(this).hide();
		
					var selectid = $(this).attr('id');
					var html = '<div class="btn-group laces-select" id="' + selectid + '_selectpicker">' + 
					'<a class="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown" href="#"></a>' + 
					'<div class="dropdown-menu">'; 
		
					$(this).find('option').each(function() {
						if($(this).attr('data-divider') == 'true') {
							html += '<div class="dropdown-divider"></div>';
						} else {
							html += '<a class="dropdown-item" data-val="' + $(this).attr('value') + '" data-selectid="' + selectid + '">' + ($(this).attr('data-icon') != undefined ? '<i class="fa fa-' + $(this).attr('data-icon') + '"></i>' : '' ) + $(this).html() + '</a>';
						}
					});
		
					html += '</div></div>';
		
					$(this).after(html);
					$('#' + selectid + '_selectpicker .dropdown-toggle').width($('#' + selectid + '_selectpicker .dropdown-menu').width());

					var value = $('#' + selectid + ' option[value="'+ $(this).val() + '"]').html();
					if($('#' + selectid + ' option[value="'+ $(this).val() + '"]').attr('data-icon') != undefined) {
						value = '<i class="fa fa-' + $('#' + selectid + ' option[value="'+ $(this).val() + '"]').attr('data-icon') + '"></i>' + value;
					}
					$('#' + selectid + '_selectpicker .dropdown-toggle').html(value);
					break;
			}
		});
	}
})(jQuery);

!function() {
	function _sortBy(attr) {
		var property = arguments[0];
		return function(a, b) {
			return (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
		}
	}
	
	Object.defineProperty(Array.prototype, 'sortBy', {
		enumerable: false,
		writeable: true,
		value: function() {
			return this.sort(_sortBy.apply(null, arguments));
		}
	});
}();

Array.prototype.unique = function() {
  return this.filter(function(elem, pos, arr) {
    return arr.indexOf(elem) == pos && elem != '';
  });
};

function rgb2hex(rgb) {
     if (  rgb.search("rgb") == -1 ) {
          return rgb;
     } else {
          rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
          function hex(x) {
               return ("0" + parseInt(x).toString(16)).slice(-2);
          }
          return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]); 
     }
}

function formatBytes(a) {
	if(0==a) {
		return "0 Bytes";
	}
	
	var c = 1024;
	var d = 2;
	var e = ["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"];
	var f = Math.floor(Math.log(a) / Math.log(c));
	
	return parseFloat((a / Math.pow(c,f)).toFixed(d)) + " " + e[f];
}

function splitFilename(name) {
	var file = {'name': '', 'ext': ''};
	
	if(name.lastIndexOf('.') != -1) {
		file['name'] = name.substring(0, name.lastIndexOf('.'));
		file['ext'] = name.substring(name.lastIndexOf('.') + 1);
	} else {
		file['name'] = name;
	}
	
	return file;
}

function getTimeGreeting() {
	var d = new Date();
	var n = d.getHours();
	
	if(n < 12) {
		return 'Good morning';
	} else if(n < 18) {
		return 'Good afternoon';
	} else {
		return 'Good evening';
	}
}

function sortTable(table, n) {
	var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
	switching = true;

	dir = "asc"; 

	while (switching) {
		switching = false;
		rows = $(table).find('tbody tr');

		for (i = 1; i < (rows.length - 1); i++) {
			shouldSwitch = false;
			x = $(rows).eq(i).find('td').eq(n);
			y = $(rows).eq(i+1).find('td').eq(n);

			var xVal = $(x).html().toLowerCase();
			var attr = $(x).attr('data-value');
			if(typeof attr !== 'undefined') xVal = attr;
			
			var yVal = $(y).html().toLowerCase();
			var attr = $(y).attr('data-value');
			if(typeof attr !== 'undefined') yVal = attr;			
			
			if(!isNaN(xVal) && !isNaN(yVal)) {
				xVal = parseFloat(xVal);
				yVal = parseFloat(yVal);
			}
			
			if (dir == "asc") {
				if (xVal > yVal) {
					shouldSwitch= true;
					break;
				}
			} else if (dir == "desc") {
					if (xVal < yVal) {
					shouldSwitch= true;
					break;
				}
			}
		}
		
		if (shouldSwitch) {
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
			switchcount ++; 
		} else {
			if (switchcount == 0 && dir == "asc") {
				dir = "desc";
				switching = true;
			}
		}
	}
	
	$(table).find('thead th').find('.laces-sort').remove();
	$(table).find('thead th').eq(n).append('<span class="laces-sort"><i class="fa fa-sort-' + dir + '"></i></span>');
}
