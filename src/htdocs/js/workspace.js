"use strict";

function workspace(i18nApp, i18nFunc) {
	this.runCb					= null;
	this.runCbData				= null;
	this.runEventCode			= {};
	this.runTimerCode			= [];
	this.workspaceEventCb		= null;
	this.workspaceEventCbData	= null;
	this.interpreter			= [];
	this.interpreterStack		= [];
	this.interpreterNao			= null;
	this.interpreterWait		= false;
	this.toolboxMode_			= '';
	this.naoBlockEvents			= false;
	this.scriptTimerId			= null;
	this.scriptTimer			= 0;
	this.i18nApp_				= i18nApp;
	this.i18nFunc_			= i18nFunc;

	var self = this;

	this.toolboxXml = '<xml xmlns="http://www.w3.org/1999/xhtml" id="blockly-toolbox" style="display:none">' + 
		'<category name="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_EVENTS', 'Events') + '" colour="#E6AC00">' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_EVENTS_LABEL_EVENTS', 'Looks') + '"></label>' + 
			'<block type="nao_event_bumper_left" singleton="true"></block>' + 
			'<block type="nao_event_bumper_right" singleton="true"></block>' + 
			'<block type="nao_event_hand_left" singleton="true"></block>' + 
			'<block type="nao_event_hand_right" singleton="true"></block>' + 
			'<block type="nao_event_head_front" singleton="true"></block>' + 
			'<block type="nao_event_head_middle" singleton="true"></block>' + 
			'<block type="nao_event_head_rear" singleton="true"></block>' + 
			'<block type="nao_event_timer" mode="advanced"></block>' + 
			'<block type="nao_touchstate" mode="advanced"></block>' + 
			'<block type="nao_event_block" mode="advanced"></block>' + 
			'<block type="nao_event_ignoring" mode="advanced"></block>' + 
		'</category>' + 
		'<category name="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_MOTION', 'Motion') + '" colour="#C0CA33">' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_MOTION_LABEL_MOVE', 'Move') + '"></label>' + 
			'<block type="motion_move_steps"><value name="steps"><shadow type="math_number"><field name="NUM">5</field></shadow></value></block>' + 
			'<block type="motion_turn_leftright"></block>' + 
			'<block type="motion_step_leftright"></block>' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_MOTION_LABEL_MOTION', 'Motion') + '"></label>' + 
			'<block type="robotposture_sitting"></block>' + 
			'<block type="robotposture_standing"></block>' + 
			'<block type="motion_sethead" mode="advanced"><value name="degrees"><shadow type="math_number"><field name="NUM">30.0</field></shadow></value></block>' + 
			'<block type="motion_openclose_hand" mode="advanced"></block>' + 
			'<block type="motion_sethand" mode="advanced"><value name="degrees"><shadow type="math_number"><field name="NUM">30.0</field></shadow></value></block>' + 
			'<block type="motion_setjoint" mode="advanced"><value name="degrees"><shadow type="math_number"><field name="NUM">30.0</field></shadow></value></block>' + 
			'<block type="motion_setjointall" mode="advanced"></block>' + 
			'<button text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_MOTION_BUTTON_JOINTBUILDER', 'Joint Builder') + '" callbackKey="view-joints" mode="advanced"></button>' + 
			'<block type="motion_wakeup" mode="advanced"></block>' + 
			'<block type="motion_rest" mode="advanced"></block>' + 
			'<block type="motion_run_dropdown"></block>' + 
			'<button text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_MOTION_BUTTON_VIEWMOTIONS', 'View Motions') + '" callbackKey="view-motions"></button>' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_MOTION_LABEL_BEHAVIOR', 'Behavior') + '" mode="advanced"></label>' + 
			'<block type="behavior_run" mode="advanced"><value name="name"><shadow type="text"><field name="TEXT"></field></shadow></value></block>' + 
			'<block type="behavior_running" mode="advanced"><value name="name"><shadow type="text"><field name="TEXT"></field></shadow></value></block>' + 
			'<button text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_MOTION_BUTTON_VIEWBEHAVIORS', 'View Behaviors') + '" callbackKey="view-behaviors" mode="advanced"></button>' + 
		'</category>' + 
		'<category name="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_SOUNDS', 'Sounds') + '" colour="#4DB6AC">' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_SOUNDS_LABEL_SPEECH', 'Speech') + '"></label>' + 
			'<block type="animatedspeech_say" mode="simple"><value name="text"><shadow type="text"><field name="TEXT">' + self.i18nFunc_(self.i18nApp_, 'BLOCK_OPTION_HELLO', 'Hello') + '</field></shadow></value></block>' + 
			'<block type="texttospeech_say" mode="advanced"><value name="text"><shadow type="text"><field name="TEXT">' + self.i18nFunc_(self.i18nApp_, 'BLOCK_OPTION_HELLO', 'Hello') + '</field></shadow></value></block>' + 
			'<block type="texttospeech_wait" mode="advanced"></block>' + 
			'<block type="texttospeech_done" mode="advanced"></block>' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_SOUNDS_LABEL_SOUND', 'Sound') + '"></label>' + 
			'<block type="audioplayer_playfile_dropdown" mode="simple"></block>' + 
			'<block type="audioplayer_playfilestring" mode="advanced"><value name="text"><shadow type="text"><field name="TEXT">' + self.i18nFunc_(self.i18nApp_, 'BLOCK_OPTION_MYRECORDING', 'My recording') + '</field></shadow></value></block>' + 
			'<button text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_SOUNDS_BUTTON_VIEWSOUNDS', 'View Sounds') + '" callbackKey="view-sounds"></button>' + 
			'<block type="audioplayer_stopall" mode="advanced"></block>' + 
			'<block type="audioplayer_wait" mode="advanced"></block>' + 
			'<block type="audioplayer_playsine" mode="advanced"><value name="hertz"><shadow type="math_number"><field name="NUM">1000</field></shadow></value><value name="gain"><shadow type="math_number"><field name="NUM">75</field></shadow></value><value name="duration"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block>' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_SOUNDS_LABEL_RECORD', 'Record') + '"></label>' + 
			'<block type="audiodevice_startmicrophonesrecording"><value name="text"><shadow type="text"><field name="TEXT">' + self.i18nFunc_(self.i18nApp_, 'BLOCK_OPTION_MYRECORDING', 'My recording') + '</field></shadow></value></block>' + 
			'<block type="audiodevice_stopmicrophonesrecording"></block>' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_SOUNDS_LABEL_VOLUME', 'Volume') + '"></label>' + 
			'<block type="audiodevice_setoutputvolume" mode="advanced"><value name="volume"><shadow type="math_number"><field name="NUM">100</field></shadow></value></block>' + 
			'<block type="audiodevice_getoutputvolume" mode="advanced"></block>' + 
			'<block type="audiodevice_mute"></block>' + 
			'<block type="audiodevice_unmute"></block>' + 
		'</category>' + 
		'<category name="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_LOOKS', 'Looks') + '" colour="#26C6DA">' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_LOOKS_LABEL_LEDS', 'LEDs') + '"></label>' + 
			'<block type="leds_random_eyes"><value name="seconds"><shadow type="math_number"><field name="NUM">5</field></shadow></value></block>' + 
			'<block type="leds_rasta"><value name="seconds"><shadow type="math_number"><field name="NUM">5</field></shadow></value></block>' + 
			'<block type="leds_colour"><value name="colour"><shadow type="colour_picker"><field name="COLOUR">#ff0000</field></shadow></block>' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_LOOKS_LABEL_PHOTOS', 'Photos') + '" mode="advanced"></label>' + 
			'<block type="photo_capture" mode="advanced"><value name="name"><shadow type="text"><field name="TEXT">photo.jpg</field></shadow></value></block>' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_LOOKS_LABEL_VIDEO', 'Video') + '" mode="advanced"></label>' + 
			'<block type="video_startrecording" mode="advanced"><value name="name"><shadow type="text"><field name="TEXT">video.avi</field></shadow></value></block>' + 
			'<block type="video_stoprecording" mode="advanced"></block>' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_LOOKS_LABEL_COLOURS', 'Colours') + '"></label>' + 
			'<block type="colour_picker" mode="advanced"></block>' + 
			'<block type="colour_random"></block>' + 
			'<block type="colour_rgb" mode="advanced"><value name="RED"><shadow type="math_number"><field name="NUM">100</field></shadow></value><value name="GREEN"><shadow type="math_number"><field name="NUM">50</field></shadow></value><value name="BLUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block>' + 
			'<block type="colour_blend" mode="advanced"><value name="COLOUR1"><shadow type="colour_picker"><field name="COLOUR">#ff0000</field></shadow></value><value name="COLOUR2"><shadow type="colour_picker"><field name="COLOUR">#3333ff</field></shadow></value><value name="RATIO"><shadow type="math_number"><field name="NUM">0.5</field></shadow></value></block>' + 
		'</category>' + 
		'<category name="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_LOOPS', 'Loops') + '" colour="#42A5F5">' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_LOOPS_LABEL_LOOPS', 'Loops') + '"></label>' + 
			'<block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block>' + 
			'<block type="wait"><value name="seconds"><shadow type="math_number"><field name="NUM">5</field></shadow></block>' + 
			'<block type="controls_whileUntil" mode="advanced"></block>' + 
			'<block type="controls_for" mode="advanced"><value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="TO"><shadow type="math_number"><field name="NUM">10</field></shadow></value><value name="BY"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block>' + 
			'<block type="controls_forEach" mode="advanced"></block>' + 
			'<block type="controls_flow_statements" mode="advanced"></block>' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_LOOPS_LABEL_END', 'End') + '"></label>' + 
			'<block type="exit_event" mode="advanced"></block>' + 
			'<block type="exit_script"></block>' + 
		'</category>' + 
		'<category name="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_LOGIC', 'Logic') + '" colour="#7E57C2" mode="advanced">' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_LOGIC_LABEL_LOGIC', 'Logic') + '"></label>' + 
			'<block type="controls_if"></block>' + 
			'<block type="logic_compare"></block>' + 
			'<block type="logic_operation" mode="advanced"></block>' + 
			'<block type="logic_negate" mode="advanced"></block>' + 
			'<block type="logic_boolean" mode="advanced"></block>' + 
			'<block type="logic_null" mode="advanced"></block>' + 
			'<block type="logic_ternary" mode="advanced"></block>' + 
		'</category>' + 
		'<category name="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_NUMBERS', 'Numbers') + '" colour="#EC407A" mode="advanced">' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_NUMBERS_LABEL_NUMBERS', 'Numbers') + '"></label>' + 
			'<block type="math_number"></block>' + 
			'<block type="math_arithmetic"><value name="A"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="B"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block>' + 
			'<block type="math_single" mode="advanced"><value name="NUM"><shadow type="math_number"><field name="NUM">9</field></shadow></value></block>' + 
			'<block type="math_trig" mode="advanced"><value name="NUM"><shadow type="math_number"><field name="NUM">45</field></shadow></value></block>' + 
			'<block type="math_constant" mode="advanced"></block>' + 
			'<block type="math_number_property"><value name="NUMBER_TO_CHECK"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block>' + 
			'<block type="math_round"><value name="NUM"><shadow type="math_number"><field name="NUM">3.1</field></shadow></value></block>' + 
			'<block type="math_on_list" mode="advanced"></block>' + 
			'<block type="math_modulo"><value name="DIVIDEND"><shadow type="math_number"><field name="NUM">64</field></shadow></value><value name="DIVISOR"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block>' + 
			'<block type="math_constrain" mode="advanced"><value name="VALUE"><shadow type="math_number"><field name="NUM">50</field></shadow></value><value name="LOW"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="HIGH"><shadow type="math_number"><field name="NUM">100</field></shadow></value></block>' + 
			'<block type="math_random_int"><value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="TO"><shadow type="math_number"><field name="NUM">100</field></shadow></value></block>' + 
			'<block type="math_random_float" mode="advanced"></block>' + 
			'<block type="nao_msec" mode="advanced"></block>' + 
		'</category>' + 
		'<category name="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_TEXT', 'Text') + '" colour="#EF5350" mode="advanced">' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_TEXT_LABEL_TEXT', 'Text') + '"></label>' + 
			'<block type="text"></block>' + 
			'<block type="system_username"></block>' + 
			'<block type="system_robotname"></block>' + 
			'<block type="text_join"></block>' + 
			'<block type="script_alert"><value name="message"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>' + 
			'<block type="script_ask"><value name="message"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>' + 
			'<block type="text_length" mode="advanced"><value name="VALUE"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>' + 
			'<block type="text_isEmpty" mode="advanced"><value name="VALUE"><shadow type="text"><field name="TEXT"></field></shadow></value></block>' + 
			'<block type="text_indexOf" mode="advanced"><value name="VALUE"><block type="variables_get"><field name="VAR">text</field></block></value><value name="FIND"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>' + 
			'<block type="text_charAt" mode="advanced"><value name="VALUE"><block type="variables_get"><field name="VAR">text</field></block></value></block>' + 
			'<block type="text_getSubstring" mode="advanced"><value name="STRING"><block type="variables_get"><field name="VAR">text</field></block></value></block>' + 
			'<block type="text_changeCase" mode="advanced"><value name="TEXT"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>' + 
			'<block type="text_trim" mode="advanced"><value name="TEXT"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>' + 
			'<block type="comment"></block>' + 
		'</category>	' + 
		'<category name="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_LISTS', 'Lists') + '" colour="#78909C" mode="advanced">' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_LISTS_LABEL_LISTS', 'Lists') + '"></label>' + 
			'<block type="lists_create_with"><mutation items="0"></mutation></block>' + 
			'<block type="lists_create_with"></block>' + 
			'<block type="lists_repeat"><value name="NUM"><shadow type="math_number"><field name="NUM">5</field></shadow></value></block>' + 
			'<block type="lists_length"></block>' + 
			'<block type="lists_isEmpty"></block>' + 
			'<block type="lists_indexOf"><value name="VALUE"><block type="variables_get"><field name="VAR">' + self.i18nFunc_(self.i18nApp_, 'BLOCK_OPTION_LIST', 'list') + '</field></block></value></block>' + 
			'<block type="lists_getIndex"><value name="VALUE"><block type="variables_get"><field name="VAR">' + self.i18nFunc_(self.i18nApp_, 'BLOCK_OPTION_LIST', 'list') + '</field></block></value></block>' + 
			'<block type="lists_setIndex"><value name="LIST"><block type="variables_get"><field name="VAR">' + self.i18nFunc_(self.i18nApp_, 'BLOCK_OPTION_LIST', 'list') + '</field></block></value></block>' + 
			'<block type="lists_getSublist"><value name="LIST"><block type="variables_get"><field name="VAR">' + self.i18nFunc_(self.i18nApp_, 'BLOCK_OPTION_LIST', 'list') + '</field></block></value></block>' + 
			'<block type="lists_split"><value name="DELIM"><shadow type="text"><field name="TEXT">,</field></shadow></value></block>' + 
			'<block type="lists_sort"></block>' + 
			'<label text="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_LISTS_LABEL_FILES', 'Files') + '"></label>' + 
			'<block type="file_list"></block>' + 
			'<block type="file_exists"><value name="text"><shadow type="text"><field name="TEXT">' + self.i18nFunc_(self.i18nApp_, 'BLOCK_OPTION_FILE', 'file') + '</field></shadow></value></block>' + 
		'</category>' + 
		'<category name="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_VARIABLES', 'Variables') + '" colour="#8D6E63" custom="VARIABLE" mode="advanced"></category>' + 
		'<category name="' + self.i18nFunc_(self.i18nApp_, 'CATEGORY_FUNCTIONS', 'Function') + '" colour="#FF7043" custom="PROCEDURE" mode="advanced"></category>' + 
		'</xml>';
		
	this.registerEventCallback = function(cb, cbData) {
		this.workspaceEventCb = cb;
		this.workspaceEventCbData = cbData;
	}
	
	this.status = function(s=null, timeout=0) {
		if(s != null) {
			var elem;
			elem = $('<div class="blocklyFloater">' + s + '</div>');

			if($('.blocklyFloater').length > 0) {
				$('.blocklyFloater').animate({bottom:'+=2.5rem'}, 200, function() {
					$('body').append(elem);
				});
			} else {
				$('body').append(elem);
			}

			if(timeout > 0) {
				window.setTimeout(function() {
					$(elem).fadeOut(200, function(){
						$(elem).prev('.blocklyFloater').animate({bottom:'-=2.5rem'}, 200);
						$(this).remove();
					});
				}, 5000);
			}
		} else {
			$('.blocklyFloater').fadeOut(200, function() {
				$(this).remove();
			});
		}
	}
	
	this.show = function(xml = '', advanced=false) {
		$('main').append('<div id="blockly"></div>');
// 		$('main').append('<div id="blocklySlider"></div>');
// 		$('main').append('<div id="blocklyJS"></div>');
		$('main').append(this.toolboxXml);
// 		$('main').append('<div id="blocklyFloater"></div>');
		this.status();
		
		this.toolbox = document.getElementById('blockly-toolbox');
		
		Blockly.inject($('#blockly')[0], {
			media: '/blockly/media/',
			css: true,
			toolbox: '<xml><category name="Loading Blocks"></category></xml>',
			zoom: {
				controls: true,
				wheel: true,
				startScale: 1.1,
				maxScale: 3,
				minScale: 1.0,
				scaleSpeed: 1.2
			},
			grid: {
				spacing: 40,
				length: 3,
				colour: '#ddd',
				snap: false
			},
		});

		var resizeFunc = function() {
			$('#blockly').css('height', $('body').outerHeight() - 60);
			Blockly.svgResize(Blockly.mainWorkspace);
		}

		Blockly.JavaScript.init(Blockly.mainWorkspace);

		var this_ = this;
		var changeFunc = function(e) {
			
		
			var updated = false;

			if(e.type == Blockly.Events.BLOCK_CREATE) {
				if(this_.workspaceEventCb != null) this_.workspaceEventCb('block-create', {'type':e.xml.attributes.getNamedItem("type").value, 'id':e.ids[0]}, self.workspaceEventCbData);
				
				var nodes = this_.toolbox.getElementsByTagName("block");
				for(var i = 0; i < nodes.length; i++) {
					if(nodes[i].getAttribute("type") == e.xml.attributes.getNamedItem("type").value && nodes[i].getAttribute("singleton") == "true") {
						nodes[i].setAttribute("disabled", "true");
						updated = true;
					}
				}
			} else if(e.type == Blockly.Events.BLOCK_DELETE) {
				if(this_.workspaceEventCb != null) this_.workspaceEventCb('block-delete', e.oldXml.attributes.getNamedItem("type").value, self.workspaceEventCbData);

				var nodes = this_.toolbox.getElementsByTagName("block");
				for(var i = 0; i < nodes.length; i++) {
					if(nodes[i].getAttribute("type") == e.oldXml.attributes.getNamedItem("type").value && nodes[i].getAttribute("singleton") == "true") {
						nodes[i].setAttribute("disabled", "false");
						updated = true;
					}
				}
			}
		
			if(updated == true) {
				this_.toolboxUpdate();
			}

			//-----
			

// 			var code = '';
// 			var blocks = Blockly.mainWorkspace.getTopBlocks(true);
// 			for(var b = 0; b < blocks.length; b++) {
// 				var blockCode = Blockly.JavaScript.blockToCode(blocks[b]);
// 		
// 				if(blocks[b].type.substr(0, 9) == 'nao_event') {
// 					code += blockCode;
// 				}
// 			}
// 		
// 			var vars = '';
// 			for(var def in Blockly.JavaScript.definitions_) {
// 				vars += Blockly.JavaScript.definitions_[def] + "\n";
// 			}
// 
// 			code = vars + code;
// 			$('#blocklyJS').html(code);
		}

		Blockly.BlockSvg.START_HAT = true;
		
		Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), Blockly.mainWorkspace);
		Blockly.mainWorkspace.addChangeListener(Blockly.Events.disableOrphans);
		Blockly.mainWorkspace.addChangeListener(changeFunc);
		if(advanced) {
			this.toolboxMode('advanced');
		} else {
			this.toolboxMode('simple');
		}
		
		Blockly.mainWorkspace.registerButtonCallback('view-sounds', function(){
			if(self.workspaceEventCb != null) self.workspaceEventCb('view-sounds', null, self.workspaceEventCbData);
		});
		
		$(window).on('resize', resizeFunc);
		$('#blockly').show();
		resizeFunc();
	}
	
	this.hide = function() {
		$('#blockly').remove();
	}
	
	this.visible = function() {
		return $('#blockly').length != 0;
	}
	
	this.registerButton = function(id, func) {
		Blockly.mainWorkspace.registerButtonCallback(id, func);
	}

/* Toolbox */
	this.toolboxUpdate = function() {
		var xml = this.toolbox.cloneNode(true);

		var nodes = xml.getElementsByTagName("category");
		for(var i = nodes.length; i-- > 0;) {
			if(nodes[i].getAttribute("hidden") == "true") {
				nodes[i].parentNode.removeChild(nodes[i]);
			}
		}

		nodes = xml.getElementsByTagName("block");
		for(var i = nodes.length; i-- > 0;) {
			if(nodes[i].getAttribute("hidden") == "true") {
				nodes[i].parentNode.removeChild(nodes[i]);
			}
		}
        
		nodes = xml.getElementsByTagName("label");
		for(var i = nodes.length; i-- > 0;) {
			if(nodes[i].getAttribute("hidden") == "true") {
				nodes[i].parentNode.removeChild(nodes[i]);
			}
		}

		nodes = xml.getElementsByTagName("button");
		for(var i = nodes.length; i-- > 0;) {
			if(nodes[i].getAttribute("hidden") == "true") {
				nodes[i].parentNode.removeChild(nodes[i]);
			}
		}

		Blockly.mainWorkspace.updateToolbox(xml);		
	}
	
	this.toolboxMode = function(mode, force=false) {
		if($('#blockly').length > 0) {
			this.toolboxMode_ = mode;
		
			var updated = false;
		
			var nodes = document.getElementById('blockly-toolbox').getElementsByTagName("*");
			for(var i = 0; i < nodes.length; i++) {
				if((nodes[i].tagName == "CATEGORY" || nodes[i].tagName == "BLOCK" || nodes[i].tagName == "LABEL" || nodes[i].tagName == "BUTTON") && (nodes[i].hasAttribute("mode"))) {
					if(nodes[i].getAttribute("mode") != mode) {
						if(nodes[i].getAttribute("hidden") != "true") {
							nodes[i].setAttribute("hidden", "true");
							updated = true;
						}
					} else {
						if(nodes[i].getAttribute("hidden") == "true") {
							nodes[i].setAttribute("hidden", "false");
							updated = true;
						}
					}
				}
			}
		
			if(updated == true || force == true) {
				this.toolboxUpdate();
			}
		}
	}
	
	this.getToolboxMode = function() {
		return this.toolboxMode_;
	}
	
/* Workspace */
	this.workspaceLock = function(lock = true) {
		var nodes = this.toolbox.getElementsByTagName("BLOCK");
		for(var i = nodes.length - 1; i-- > 0;) {
			nodes[i].setAttribute("disabled", lock);
		}
		
		if(!lock) {
			blocks = Blockly.mainWorkspace.getTopBlocks();
			for(var i = 0; i < blocks.length; i++) {
				nodes = this.toolbox.getElementsByTagName("BLOCK");
				for(var n = 0; n < nodes.length; n++) {
					if(nodes[n].getAttribute("type") == blocks[i].type && nodes[n].getAttribute("singleton") == "true") {
						nodes[n].setAttribute("disabled", "true");
					}
				}
			}
		}
		
		this.toolboxUpdate();

		var blocks = Blockly.mainWorkspace.getAllBlocks();
		for(var i = 0; i < blocks.length; i++) {
			if(blocks[i].type != 'nao_event_run') { blocks[i].setDeletable(!lock); }
			blocks[i].setEditable(!lock);
			blocks[i].setMovable(!lock);
		}
	}
	
/* XML */
	this.getXml = function() {
		return Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
	}
	
	this.setXml = function(xml) {
		Blockly.mainWorkspace.clear();
		Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), Blockly.mainWorkspace);
	}
	
	this.runXml = function(nao, cb, cbData) {
		this.workspaceLock(true);
		
		nao.send('cadet_runlock', {'lock': true}, function(r) {
			self.runCb		= cb;
			self.runCbData	= cbData;

			if(r['error_code'] == 0) {
			
				// Load Event Blocks
				var blocks = Blockly.mainWorkspace.getTopBlocks(true);
				Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
				Blockly.JavaScript.addReservedWords('highlightBlock');

				for(var b = 0; b < blocks.length; b++) {
					var blockCode = Blockly.JavaScript.blockToCode(blocks[b]);
			
					if(blocks[b].type.substr(0, 9) == 'nao_event') {
						if(blocks[b].type == 'nao_event_timer') {
							var secs = blocks[b].getFieldValue('seconds');
							if(!isNaN(secs)) {
								self.runTimerCode.push(window.setTimeout(function(code){
									self.interpreterRun('nao_event_timer', code);
								}, secs * 1000, blockCode));
							}
						} else {
							self.runEventCode[blocks[b].type] = blockCode;
						}
					}
				}
		
				var vars = '';
				for(var def in Blockly.JavaScript.definitions_) {
					vars += Blockly.JavaScript.definitions_[def] + "\n";
				}

				self.runEventCode['nao_event_run'] = vars + self.runEventCode['nao_event_run'];
				
				$('body').append('<div class="blocklyTimer">Please wait...</div>');
				self.scriptTimer = 0;
				self.scriptTimerId = window.setInterval(function() {
					self.scriptTimer++;
					$('.blocklyTimer').html('<i class="fa fa-play-circle-o"></i> Script running: ' + self.scriptTimer + ' seconds');
				}, 1000);
				
				// Subscribe to NAO events
				nao.subscribe('event_touch', 'event_touch', function(event, self) {
					if(event['is_touching'] == true || event['is_touching'].toLowerCase() == 'true') {
						var part = event['nao_part'].toLowerCase();
						
						if(part.startsWith('lfoot/bumper') && 'nao_event_bumper_left' in self.runEventCode) {
							self.interpreterRun('nao_event_bumper_left', self.runEventCode['nao_event_bumper_left']);
						
						} else if(part.startsWith('rfoot/bumper') && 'nao_event_bumper_right' in self.runEventCode) {
							self.interpreterRun('nao_event_bumper_right', self.runEventCode['nao_event_bumper_right']);
						
						} else if(part.startsWith('lhand/touch') && 'nao_event_hand_left' in self.runEventCode) {
							self.interpreterRun('nao_event_hand_left', self.runEventCode['nao_event_hand_left']);
						
						} else if(part.startsWith('rhand/touch') && 'nao_event_hand_right' in self.runEventCode) {
							self.interpreterRun('nao_event_hand_right', self.runEventCode['nao_event_hand_right']);
						
						} else if(part.startsWith('head/touch/front') && 'nao_event_head_front' in self.runEventCode) {
							self.interpreterRun('nao_event_head_front', self.runEventCode['nao_event_head_front']);
						
						} else if(part.startsWith('head/touch/middle') && 'nao_event_head_middle' in self.runEventCode) {
							self.interpreterRun('nao_event_head_middle', self.runEventCode['nao_event_head_middle']);
						
						} else if(part.startsWith('head/touch/rear') && 'nao_event_head_rear' in self.runEventCode) {
							self.interpreterRun('nao_event_head_rear', self.runEventCode['nao_event_head_rear']);
						
						}
					}
				}, self);
				
				// Running!				
				self.runCb({
					'state':			'run',
					'error_code':		0,
					'error_message':	''
				}, self.runCbData);

				self.interpreterNao = nao;
				self.interpreter = new Interpreter('', self.interpreterFuncs2);
				self.interpreterRun('nao_event_run', self.runEventCode['nao_event_run']);
			} else {
				self.runCb({
					'state':			'error',
					'error_code':		r['error_code'],
					'error_message':	r['error_message']
				}, self.runCbData);
				
				self.stopXml(nao);
			}
		});
	}
	

/*
 *	Stop XML
 */
	this.stopXml = function(nao=null) {
		if(nao == null) {
			nao = self.interpreterNao;
		}
	
		Blockly.mainWorkspace.highlightBlock(null);

		if(nao != null) {
			nao.send('cadet_runlock', {'lock': false}, null);
			nao.unsubscribe('event_touch');
		}
				
		for(var i=0; i<self.runTimerCode.length; i++) {
			window.clearTimeout(self.runTimerCode[i]);
		}

		self.scriptTimer = 0;
		window.clearInterval(self.scriptTimerId);
		$('.blocklyTimer').remove();

		self.status();
		if(self.runCb != null) {
			self.runCb({
				'state':			'stop',
				'error_code':		0,
				'error_message':	''
			}, self.runCbData);
		}
		
		self.runCb				= null;
		self.runCbData			= null;
		self.runEventCode		= {};
		self.runTimerCode		= [];
		self.interpreter		= null;
		self.interpreterStack	= [];
		self.interpreterNao		= null;
		self.interpreterWait	= false;
		self.naoBlockEvents		= false;

		self.workspaceLock(false);
	}
	
/* Interpreter Funcs */
// 		wrapper = function(cb) {
// 			cb(self.username);
// 		};
// 		interpreter.setProperty(scope, 'username', interpreter.createAsyncFunction(wrapper));
// 
// 		wrapper = function(cb) {
// 			self.interpreterNao.send('system_robotname', null, function(e) {
// 				cb(e['name']);
// 			});
// 		};
// 		interpreter.setProperty(scope, 'naoSystemRobotName', interpreter.createAsyncFunction(wrapper));
// 
// 		wrapper = function(n, r, s, a, cb) {
// 			n = interpreter.arrayPseudoToNative(n);
// 			r = interpreter.arrayPseudoToNative(r);
// 
// 			obj = {array1: n, array2: r};
// 			removeDuplicateItems(obj);
// 			n = obj.array1;
// 			r = obj.array2;
// 
// 			for(var i=0; i<r.length; i++) {
// 				r[i] *= 0.0174532923847;
// 			}
// 
// 			args = {'name': n, 'radians':r, 'speed': s, 'absolute': a};
// 			self.interpreterNao.send('motion_angleinterpolation', args, function(e) {
// 				cb();
// 			});
// 		};
// 		interpreter.setProperty(scope, 'naoMotionAngleInterpolation', interpreter.createAsyncFunction(wrapper));
//

// 		wrapper = function(cb) {
// 			self.blocklyInterpreterStack.pop();
// 			cb();
// 		};
// 		interpreter.setProperty(scope, 'exitEvent', interpreter.createAsyncFunction(wrapper));


/*
 *	Interpreter Funcs
 */
	this.interpreterFuncs2 = function(interpreter, scope) {
		var asyncWrappers = [
			{'func': 'naoCommandRunning',				'cmd': 'cadet_cmdrunning',			'result': 'running',	'args': [{'name': 'name', 'type': 'str'}]},
			{'func': 'naoBehaviorStart',				'cmd': 'behavior_startbehavior',	'result': 'behavior',	'args': [{'name': 'name', 'type': 'str'}]},
			{'func': 'naoBehaviorRunning',				'cmd': 'behavior_isbehaviorrunning', 'result':	'running',	'args': [{'name': 'name', 'type': 'str'}]},
			{'func': 'naoMotionMove',					'cmd': 'motion_move',										'args': [{'name': 'x', 'type': 'int'}, {'name': 'y', 'type': 'int'}, {'name': 'theta', 'type': 'int'}]},
			{'func': 'naoMotionSetFootSteps',			'cmd': 'motion_setfootsteps',								'args': [{'name': 'legNames', 'type': 'array'}, {'name': 'footSteps', 'type': 'arrayarray'}, {'name': 'timeList', 'type': 'array'}, {'name': 'clearExisting', 'type': 'bool'}]},
			{'func': 'naoMotionStop',					'cmd': 'motion_stop'},
			{'func': 'naoMotionWaitUntilMoveIsFinished', 'cmd': 'motion_waituntilmoveisfinished'},
			{'func': 'naoMotionOpenHand',				'cmd': 'motion_openhand',									'args': [{'name': 'name', 'type': 'str'}]},
			{'func': 'naoMotionCloseHand',				'cmd': 'motion_closehand',									'args': [{'name': 'name', 'type': 'str'}]},
			{'func': 'naoRobotPostureGoToPosture',		'cmd': 'posture_gotoposture',								'args': [{'name': 'name', 'type': 'str'}, {'name': 'speed', 'type': 'int'}]},
			{'func': 'naoMotionSetAngles',				'cmd': 'motion_setangles',									'args': [{'name': 'name', 'type': 'str'}, {'name': 'radians', 'type': 'int'}, {'name': 'speed', 'type': 'int'}]},
			{'func': 'naoMotionGetStiffnesses',			'cmd': 'motion_getstiffnesses',		'result': 'stiffnesses', 'args': [{'name': 'name', 'type': 'str'}]},
			{'func': 'naoMotionWakeUp',					'cmd': 'motion_wakeup'},
			{'func': 'naoMotionRest',					'cmd': 'motion_rest'},
			{'func': 'naoMotionRun',					'cmd': 'cadet_motionrun',									'args': [{'name': 'motion', 'type': 'str'}]},
			{'func': 'naoTextToSpeechSay',				'cmd': 'texttospeech_say',									'args': [{'name': 'string', 'type': 'str'}]},
			{'func': 'naoTextToSpeechDone',				'cmd': 'textToSpeech_done',			'result': 'running'},
			{'func': 'naoPhotoCaptureTakePicture',		'cmd': 'photocapture_takepicture',							'args': [{'name': 'name', 'type': 'str'}]},
			{'func': 'naoVideoRecorderStartRecording',	'cmd': 'videorecorder_startrecording',						'args': [{'name': 'name', 'type': 'str'}]},
			{'func': 'naoVideoRecorderStopRecording',	'cmd': 'videorecorder_stoprecording'},
			{'func': 'naoAudioPlayerPlayFile',			'cmd': 'audioplayer_playfile',								'args': [{'name': 'name', 'type': 'str'}, {'name': 'volume', 'type': 'int'}, {'name': 'pan', 'type': 'int'}]},
			{'func': 'naoAudioPlayerStopAll',			'cmd': 'audioplayer_stopall'},
			{'func': 'naoAudioPlayerIsPlaying',			'cmd': 'audioplayer_isplaying',		'result': 'playing'},
			{'func': 'naoAudioDeviceMute',				'cmd': 'audiodevice_muteaudioout',							'args': [{'name': 'mute', 'type': 'bool'}]},
			{'func': 'naoAudioDeviceGetOutputVolume',	'cmd': 'audiodevice_getoutputvolume', 'result': 'volume'},
			{'func': 'naoAudioDeviceSetOutputVolume',	'cmd': 'audiodevice_setoutputvolume',						'args': [{'name': 'volume', 'type': 'int'}]},
			{'func': 'naoLedsRandomEyes',				'cmd': 'leds_randomeyes',									'args': [{'name': 'duration', 'type': 'int'}]},
			{'func': 'naoLedsRasta',					'cmd': 'leds_rasta',										'args': [{'name': 'duration', 'type': 'int'}]},
			{'func': 'naoLedsFadeRGB',					'cmd': 'leds_fadergb',										'args': [{'name': 'name', 'type': 'str'}, {'name': 'rgb', 'type': 'str'}, {'name': 'duration', 'type': 'int'}]},
			{'func': 'naoAudioDeviceStartMicrophonesRecording', 'cmd': 'audiodevice_startmicrophonesrecording',		'args': [{'name': 'name', 'type': 'str'}]},
			{'func': 'naoAudioDeviceStopMicrophonesRecording', 'cmd': 'audiodevice_stopmicrophonesrecording'},
			{'func': 'naoTouchState',					'cmd': 'touch_state',				'result': 'state',		'args': [{'name': 'name', 'type': 'str'}, {'name': 'rgb', 'type': 'str'}, {'name': 'duration', 'type': 'int'}]},
			{'func': 'naoAudioPlayerPlaySine',			'cmd': 'audioplayer_playsine',								'args': [{'name': 'hertz', 'type': 'int'}, {'name': 'gain', 'type': 'int'}, {'name': 'pan', 'type': 'int'}, {'name': 'duration', 'type': 'int'}]},
			{'func': 'naoMsec',							'cmd': 'cadet_msec',				'result': 'msec'},
			{'func': 'naoAnimatedSpeechSay',			'cmd': 'animatedspeech_say',								'args': [{'name': 'string', 'type': 'str'}]},
			{'func': 'naoMotionSetStiffnesses',			'cmd': 'motion_setstiffnesses',								'args': [{'name': 'name', 'type': 'array'}, {'name': 'stiffness', 'type': 'int'}]},
			{'func': 'naoMotionAngleInterpolation',		'cmd': 'motion_angleinterpolation',							'args': [{'name': 'name', 'type': 'array'}, {'name': 'radians', 'type': 'arraydeg2rad'}, {'name': 'speed', 'type': 'int'}, {'name': 'absolute', 'type': 'bool'}]},
			{'func': 'naoFileExists',					'cmd': 'cadet_fileexists',			'result': 'exists',		'args': [{'name': 'name', 'type': 'str'}]},
			{'func': 'naoFileList',						'cmd': 'cadet_filelist',			'result': 'files',		'resultIsArray': true,	'resultBuildArrayFromArrayItem': 'name'}
		];

		var wrapper = function(id) {
			id = id ? id.toString() : '';
			return interpreter.createPrimitive(Blockly.mainWorkspace.highlightBlock(id));
		};
		interpreter.setProperty(scope, 'highlightBlock', interpreter.createNativeFunction(wrapper));

		wrapper = function(b) {
			self.naoBlockEvents = b;
		};
		interpreter.setProperty(scope, 'naoBlockEvents', interpreter.createNativeFunction(wrapper));

		wrapper = function(b) {
			return self.naoBlockEvents;
		};
		interpreter.setProperty(scope, 'naoBlockingEvents', interpreter.createNativeFunction(wrapper));

		wrapper = function(s) {
			s = s ? s.toString() : '';
			self.naoInBlockingCall = true;
			interpreter.createPrimitive(alert(s));
			self.naoInBlockingCall = false;
		};
		interpreter.setProperty(scope, 'alert', interpreter.createNativeFunction(wrapper));

		wrapper = function(s) {
			s = s ? s.toString() : '';
			self.naoInBlockingCall = true;
			r = interpreter.createPrimitive(prompt(s));
			self.naoInBlockingCall = false;
			return r;
		};
		interpreter.setProperty(scope, 'ask', interpreter.createNativeFunction(wrapper));

		wrapper = function(d) {
			d = isNaN(d) ? 0 : d;
		
			if(self.interpreterStack.length > 0) {
				self.interpreterStack[self.interpreterStack.length - 1].delay = (d * 1000);
			}
		};
		interpreter.setProperty(scope, 'wait', interpreter.createNativeFunction(wrapper));

		wrapper = function() {
			self.blocklyInterpreterStack.pop();
		};
		interpreter.setProperty(scope, 'end', interpreter.createNativeFunction(wrapper));

		wrapper = function() {
			self.stopXml();
		};
		interpreter.setProperty(scope, 'exit', interpreter.createNativeFunction(wrapper));

		for(var i=0; i<asyncWrappers.length; i++) {
			var asyncFunc = function() {
				var funcInfo = arguments[0];
				var cb = arguments[arguments.length - 1];
				var args = {};
				var result = ('result' in funcInfo ? funcInfo.result : null);
				
				if('args' in funcInfo && funcInfo.args.length > 0) {
					for(var j=0; j<funcInfo.args.length; j++) {
						var value = arguments[j + 1];
					
						switch(funcInfo.args[j].type) {
							case 'bool':
								value = (!value ? false : true);
								break;
							case 'int':
								value = (!parseInt(value) ? 0 : parseInt(value));
								break;
							case 'float':
								value = (!parseFloat(value) ? 0 : parseFloat(value));
								break;
							case 'str':
								value = (value == null ? 'null' : value.toString());
								break;
							case 'array':
								value = interpreter.arrayPseudoToNative(value);
								break;
							case 'arrayarray':
								value = interpreter.arrayPseudoToNative(value);
								for(var k=0; k<value.length; k++) { value[k] = interpreter.arrayPseudoToNative(value[k]); }
								break;
							case 'arraydeg2rad':
								value = interpreter.arrayPseudoToNative(value);
								for(var k=0; k<value.length; k++) { value[k] *= 0.0174532923847; }
								break;
						}
					
						args[funcInfo.args[j].name] = value;
					}
				} else {
					args = null;
				}
				
				self.interpreterNao.send(funcInfo.cmd, args, function(e) {
					if(result != null) {
						if('resultIsArray' in funcInfo && funcInfo.resultIsArray == true) {
							if('resultBuildArrayFromArrayItem' in funcInfo) {
								var arr = [];
								
								for(var j=0; j<e[result].length; j++) {
									arr.push(e[result][j][funcInfo.resultBuildArrayFromArrayItem]);
								}
								
								cb(interpreter.arrayNativeToPseudo(arr));
							} else {
								cb(interpreter.arrayNativeToPseudo(e[result]));
							}
						} else {
							cb(e[result]);
						}
					} else {
						cb();
					}
				});
			};

			interpreter.setProperty(scope, asyncWrappers[i].func, interpreter.createAsyncFunction(asyncFunc.bind(this, asyncWrappers[i])));
		}
	}

/*
 *	Interpreter Run
 */	
	this.interpreterRun = function(action, code) {
		if(self.naoBlockEvents == false) {
			if(self.runCb != null) {
				for(var i = 0; i < self.interpreterStack.length; i++) {
					if(self.interpreterStack[i]['action'] == action) {
						return;
					}
				}
		
				var intrp = new Interpreter('');
				intrp.stateStack[0].scope = self.interpreter.global;
				intrp.appendCode(code);
				var stack = { 'interpreter': intrp, 'delay': 0, 'awake': 0, 'action': action };
			
				self.interpreterStack.push(stack);
				self.interpreterStep();
			}
		}
	}
	
	this.interpreterStep = function() {
		if(self.runCb != null) {
			if(self.interpreterStack.length > 0) {
				var stack = self.interpreterStack[self.interpreterStack.length - 1];
				
				if(stack.delay <= 0) {
					try {
						self.interpreter.stateStack = stack.interpreter.stateStack;
						if(!self.interpreter.step()) {
							self.interpreterStack.pop();
						}
					} catch(e) {
						alert('Error: ' + e);	// TODO Clean error response - send to self.runCb
						self.stopXml(self.interpreterNao);
						return;
					}
				} else {
					stack.delay -= 10;
				}
			} else {
				if(self.interpreterWait == false) {
					Blockly.mainWorkspace.highlightBlock(null);

					if(Object.keys(self.runEventCode).length == 1 && self.runTimerCode.length == 0 && self.naoBlockEvents == false) {
						self.stopXml(self.interpreterNao);
						return;
					}
					
					self.interpreterWait = true;
					self.status('<i class="fa fa-check-circle-o fa-fw"></i> Run stack finished. Waiting for events...');
					self.runCb({
						'state':			'wait',
						'error_code':		0,
						'error_message':	''
					}, self.runCbData);
				}
			}
			
			window.setTimeout(self.interpreterStep, 10);
		}
	}
	
/*
 *	Update Dropdown
 */
	this.updateBlockDropDown = function(type, values) {
		if(values.length == 0) {
			values = [['','']];
		}
		
		blocklyDropDowns[type] = values;
	}
	
/*
 *	Add Block
 */
	this.addBlock = function(blockType, data) {
		var block = Blockly.mainWorkspace.newBlock(blockType);
		block.initSvg();
		block.render();

		if(data != null) {
			if('blocks' in data) {
				for(var i=0; i<data.blocks.length; i++) {
					var shadow = Blockly.mainWorkspace.newBlock(data.blocks[i].type);

					if('blocks' in data.blocks[i] && data.blocks[i].type == 'lists_create_with') {
						shadow.itemCount_ = data.blocks[i].blocks.length;
						shadow.updateShape_();
					}

					if(data.blocks[i].type != 'lists_create_with') {
						shadow.setShadow(true);
					}
					
					shadow.initSvg();
					shadow.render();
					
					if('values' in data.blocks[i]) {
						for(var item in data.blocks[i].values) {
							if(data.blocks[i].values.hasOwnProperty(item)) {
								shadow.setFieldValue(data.blocks[i].values[item], item);
							}
						}				
					}
					
					if('blocks' in data.blocks[i] && data.blocks[i].type == 'lists_create_with') {
						for(var j=0; j<data.blocks[i].blocks.length; j++) {
							var listItem = Blockly.mainWorkspace.newBlock(data.blocks[i].blocks[j].type);
							listItem.initSvg();
							listItem.render();

							for(var item in data.blocks[i].blocks[j].values) {
								if(data.blocks[i].blocks[j].values.hasOwnProperty(item)) {
									listItem.setFieldValue(data.blocks[i].blocks[j].values[item], item);
								}
							}
							
							shadow.getInput('ADD' + j).connection.connect(listItem.outputConnection);
						}
					}
					
					var cc = block.getInput(data.blocks[i].input).connection;
					cc.connect(shadow.outputConnection);
				}
			}

			if('values' in data) {
				for(var item in data.values) {
					if(data.values.hasOwnProperty(item)) {
						block.setFieldValue(data.values[item], item);
					}
				}				
			}			
		}
		
		var blocks = Blockly.mainWorkspace.getTopBlocks(true);
		for(var i=0; i<blocks.length; i++) {
			if(blocks[i].type == 'nao_event_run') {
				var children = blocks[i].getChildren();

				if(children.length > 0) {
					var nextBlock;
				
					nextBlock = children[children.length - 1];
					while(nextBlock.getNextBlock() != null) {
						nextBlock = nextBlock.getNextBlock();
					}
				
					nextBlock.nextConnection.connect(block.previousConnection);
				} else {
					blocks[i].nextConnection.connect(block.previousConnection);
				}

				break;
			}
		}
	}
}
