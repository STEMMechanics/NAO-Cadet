'use strict';

var blocklyDropDowns = {
	'motions': [['', '']],
	'sounds': [['', '']],
	'behaviors': [['', '']]
};

function cadetDefBlocks(self, i18nFunc) {

	var colourEvents = '#E6AC00';
	var colourMotion = '#C0CA33';
	var colourSounds = '#4DB6AC';
	var colourLooks = '#26C6DA';
	var colourLoops = '#42A5F5';
	var colourLogic = '#7E57C2';
	var colourNumbers = '#EC407A';
	var colourText = '#EF5350';
	var colourLists = '#78909C';
	var colourVariables = '#8D6E63';
	var colourFunctions = '#FF7043';
	
	var i18nApp_ = self;
	var i18nFunc_ = i18nFunc;

	// var colourControl = '#EC9C13';

	// var colourSensing = '#47A8D1';
	// var colourPen = '#0DA57A';
	// var colourOperators = '#46B946';
	// var colourData = '#FF8000';
	// var colourFunctions = '#FF4D6A';


	var blocklyDropDownFiles = [['', '']];
	var blocklyDropDownMotions = [['', '']];
	var blocklyDropDownHands = [[i18nFunc_(i18nApp_, 'BLOCK_OPTION_LEFT', 'Left'), 'LHand'], [i18nFunc_(i18nApp_, 'BLOCK_OPTION_RIGHT', 'Right'), 'RHand']];
	var blocklyDropDownLeftRight = [[i18nFunc_(i18nApp_, 'BLOCK_OPTION_LEFT', 'Left'), 'L'], [i18nFunc_(i18nApp_, 'BLOCK_OPTION_RIGHT', 'Right'), 'R']];
	//var blocklyDropDownJoints = [['Shoulder', 'Shoulder'], ['Elbow', 'Elbow'], ['Wrist', 'Wrist'], ['Hand', 'Hand'], ['Hip', 'Hip'], ['Knee', 'Knee'], ['Ankle', 'Ankle']];
	var blocklyDropDownJoints = [[i18nFunc_(i18nApp_, 'BLOCK_OPTION_SHOULDER', 'Shoulder'), 'Shoulder'], [i18nFunc_(i18nApp_, 'BLOCK_OPTION_ELBOW', 'Elbow'), 'Elbow'], [i18nFunc_(i18nApp_, 'BLOCK_OPTION_WRIST', 'Wrist'), 'Wrist'], [i18nFunc_(i18nApp_, 'BLOCK_OPTION_HAND', 'Hand'), 'Hand']];
	var blocklyDropDownPitchYaw = [[i18nFunc_(i18nApp_, 'BLOCK_OPTION_PITCH', 'Pitch'), 'Pitch'], [i18nFunc_(i18nApp_, 'BLOCK_OPTION_YAW', 'Yaw'), 'Yaw']];
	var blocklyDropDownPitchRoll = [[i18nFunc_(i18nApp_, 'BLOCK_OPTION_PITCH', 'Pitch'), 'Pitch'], [i18nFunc_(i18nApp_, 'BLOCK_OPTION_ROLL', 'Roll'), 'Roll']];

	changeBlocklyBlockColour('colour', colourLooks);
	changeBlocklyBlockColour('controls', colourLoops);
	changeBlocklyBlockColour('controls_if', colourLogic);
	changeBlocklyBlockColour('logic', colourLogic);
	changeBlocklyBlockColour('math', colourNumbers);
	changeBlocklyBlockColour('text', colourText);
	changeBlocklyBlockColour('lists', colourLists);
	changeBlocklyBlockColour('variables', colourVariables);
	changeBlocklyBlockColour('math_change', colourVariables);
	changeBlocklyBlockColour('procedures', colourFunctions);


	/****************************************
	 * Events
	 ****************************************/
	Blockly.Blocks['nao_event_run']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_NAO_EVENT_RUN', 'when run'),
		'nextStatement': null,
		'colour': colourEvents
	});}};
	Blockly.JavaScript['nao_event_run']=function(b){
		return '';
	};

	Blockly.Blocks['nao_event_bumper_left']={init: function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_NAO_EVENT_BUMPER_LEFT', 'when left foot pressed'),
		'nextStatement': null,
		'colour': colourEvents
	});}};
	Blockly.JavaScript['nao_event_bumper_left']=function(b){
		return '';
	};

	Blockly.Blocks['nao_event_bumper_right']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_NAO_EVENT_BUMPER_RIGHT', 'when right foot pressed'),
		'nextStatement': null,
		'colour': colourEvents
	});}};
	Blockly.JavaScript['nao_event_bumper_right']=function(b){
		return '';
	};

	Blockly.Blocks['nao_event_hand_left']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_NAO_EVENT_HAND_LEFT', 'when left hand pressed'),
		'nextStatement': null,
		'colour': colourEvents
	});}};
	Blockly.JavaScript['nao_event_hand_left']=function(b){
		return '';
	};

	Blockly.Blocks['nao_event_hand_right']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_NAO_EVENT_HAND_RIGHT', 'when right hand pressed'),
		'nextStatement': null,
		'colour': colourEvents
	});}};
	Blockly.JavaScript['nao_event_hand_right']=function(b){
		return '';
	};

	Blockly.Blocks['nao_event_head_front']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_NAO_EVENT_HEAD_FRONT', 'when head front pressed'),
		'nextStatement': null,
		'colour': colourEvents
	});}};
	Blockly.JavaScript['nao_event_head_front']=function(b){
		return '';
	};

	Blockly.Blocks['nao_event_head_middle']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_NAO_EVENT_HEAD_MIDDLE', 'when head middle pressed'),
		'nextStatement': null,
		'colour': colourEvents
	});}};
	Blockly.JavaScript['nao_event_head_middle']=function(b){
		return '';
	};

	Blockly.Blocks['nao_event_head_rear']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_NAO_EVENT_HEAD_REAR', 'when head back pressed'),
		'nextStatement': null,
		'colour': colourEvents
	});}};
	Blockly.JavaScript['nao_event_head_rear']=function(b){
		return '';
	};

	Blockly.Blocks['nao_touchstate']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_NAO_TOUCHSTATE', '%1 pressed'),
		'args0': [{
			'type': 'field_dropdown',
			'name': 'name',
			'options': [
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_LEFT_FOOT', 'left foot'), 'LFoot/Bumper'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_RIGHT_FOOT', 'right foot'), 'RFoot/Bumper'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_LEFT_HAND', 'left hand'), 'LHand/Touch'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_RIGHT_HAND', 'right hand'), 'RHand/Touch'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_HEAD_FRONT', 'head front'), 'Head/Touch/Front'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_HEAD_MIDDLE', 'head middle'), 'Head/Touch/Middle'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_HEAD_BACK', 'head back'), 'Head/Touch/Rear']
			]
		}],
		'inputsInline': true,
		'output': 'Boolean',
		'colour': colourEvents
	});}};
	Blockly.JavaScript['nao_touchstate']=function(b){
		var name = b.getFieldValue('name');
		var code = 'naoTouchState("' + name + '")';
		return [code, Blockly.JavaScript.ORDER_NONE];
	};

	Blockly.Blocks['nao_event_timer']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_NAO_EVENT_TIMER', 'on %1 seconds'),
		'args0': [{
			'type': 'field_input',
			'name': 'seconds',
			'text': '10'
		}],
		'inputsInline': true,
		'nextStatement': null,
		'colour': colourEvents
	});}};
	Blockly.JavaScript['nao_event_timer']=function(b){
		return '';
	};

	Blockly.Blocks['nao_event_block']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_NAO_EVENT_BLOCK', '%1 events'),
		'args0': [{
			'type': 'field_dropdown',
			'name': 'state',
			'options': [
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_IGNORE', 'ignore'), 'ignore'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_IGNORE', 'allow'), 'allow']
			]
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourEvents
	});}};
	Blockly.JavaScript['nao_event_block']=function(b){
		var state = b.getFieldValue('state');
		var code = 'naoBlockEvents(' + (state == 'ignore') + ')\n';

		return code;
	};

	Blockly.Blocks['nao_event_ignoring']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_NAO_EVENT_IGNORE', 'ignoring events'),
		'inputsInline': true,
		'output': 'Boolean',
		'colour': colourEvents
	});}};
	Blockly.JavaScript['nao_event_ignoring']=function(b){
		var code = 'naoBlockingEvents()';

		return [code, Blockly.JavaScript.ORDER_NONE];
	};


	/****************************************
	 * Motion
	 ****************************************/
	Blockly.Blocks['motion_move_steps']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_MOTION_MOVE_STEPS', 'move %1 steps'),
		'args0': [{
			'type': 'input_value',
			'name': 'steps',
			'check': 'Number'
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourMotion
	});}};
	Blockly.JavaScript['motion_move_steps']=function(b){
		var code = '';
		var steps = parseInt(Blockly.JavaScript.valueToCode(b, 'steps', Blockly.JavaScript.ORDER_ATOMIC));

		if(steps != 0) {
			var legName = Array();
			var footSteps = Array();
			var timeList = Array();
			var backwards = false;
	
			if(steps < 0) {
				backwards = true;
				steps = Math.abs(steps);
			}
	
			for(var i=0; i<steps; i+=2) {
				legName.push("LLeg");
				legName.push("RLeg");
				if(backwards) {
					footSteps.push("Array(-0.08, 0.1, 0)");
					footSteps.push("Array(-0.08, 0.1, 0)");
				} else {
					footSteps.push("Array(0.08, 0.1, 0)");
					footSteps.push("Array(0.08, 0.1, 0)");
				}
				timeList.push((i+1) * 0.6);
				timeList.push((i+2) * 0.6);
			}
	
			if(legName.length > steps) {
				footSteps.pop();
			} else {
				legName.push("LLeg");
				timeList.push((i+1) * 0.6);
			}

			if(backwards) {
				footSteps.push("Array(-0.001, 0.1, 0)");
			} else {
				footSteps.push("Array(0.001, 0.1, 0)");
			}

			var s = legName.toString();
			code += 'var legName = Array("' + s.replace(/,/g, '","') + '");\n';
			code += 'var footSteps = Array(' + footSteps.toString() + ');\n';
			code += 'var timeList = Array(' + timeList.toString() + ');\n';

			code += 'naoRobotPostureGoToPosture("Stand", 3.0);\n';
			code += 'naoMotionWaitUntilMoveIsFinished();\n';
			code += 'naoMotionSetFootSteps(legName, footSteps, timeList, false);\n';
			code += 'naoMotionWaitUntilMoveIsFinished();\n';
			code += 'naoRobotPostureGoToPosture("Stand", 3.0);\n';
			code += 'naoMotionWaitUntilMoveIsFinished();\n';
	
			return code;
		}
	
		return '';
	};

	Blockly.Blocks['motion_turn_leftright']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_MOTION_TURN_LEFTRIGHT', 'turn %1'),
		'args0': [{
			'type': 'field_dropdown',
			'name': 'direction',
			'options': [
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_LEFT', 'left'), 'left'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_RIGHT', 'right'), 'right']
			]
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourMotion
	});}};
	Blockly.JavaScript['motion_turn_leftright']=function(b){
		var direction = b.getFieldValue('direction');
		var move = 1;
	
		if(direction == 'right') {
			move = -1;
		}

		var code = 'naoMotionMove(0, 0, ' + move + ');\n';
		var secs = 4.0;
		code += 'wait('+ secs +');\n';
		code += 'naoMotionStop();\n';
		code += 'naoMotionWaitUntilMoveIsFinished();\n';
		return code;
	};

	Blockly.Blocks['motion_step_leftright']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_MOTION_STEP_LEFTRIGHT', 'step %1'),
		'args0': [{
			'type': 'field_dropdown',
			'name': 'direction',
			'options': [
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_LEFT', 'left'), 'left'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_RIGHT', 'right'), 'right']
			]
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourMotion
	});}};
	Blockly.JavaScript['motion_step_leftright']=function(b){
		var direction = b.getFieldValue('direction');
		var move = 1;
	
		if(direction == 'right') {
			move = -1;
		}
	
		var code = 'naoMotionMove(0, ' + move + ', 0);\n';
		var secs = 4.0;
		code += 'wait('+ secs +');\n';
		code += 'naoMotionStop();\n';
		code += 'naoMotionWaitUntilMoveIsFinished();\n';
		return code;
	};

	Blockly.Blocks['motion_openclose_hand'] = {init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_MOTION_OPENCLOSE_HAND', '%1 %2 hand'),
		'args0': [{
			'type': 'field_dropdown',
			'name': 'motion',
			'options': [
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_OPEN', 'open'), 'open'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_CLOSE', 'close'), 'close']
			]
		},{
			'type': 'field_dropdown',
			'name': 'side',
			'options': [
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_LEFT', 'left'), 'LHand'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_RIGHT', 'right'), 'RHand']
			]
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourMotion
	});}};
	Blockly.JavaScript['motion_openclose_hand'] = function(b) {
		var motion = b.getFieldValue('motion');
		var side = b.getFieldValue('side');
	
		if(motion == 'open') {
			return 'naoMotionOpenHand("' + side + '");\n';
		}

		return 'naoMotionCloseHand("' + side + '");\n';
	};

	Blockly.Blocks['motion_wakeup'] = {init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_MOTION_WAKEUP', 'wake up'),
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourMotion
	});}};
	Blockly.JavaScript['motion_wakeup'] = function(b) {
		return 'naoMotionWakeUp();\n';
	};

	Blockly.Blocks['motion_rest'] = {init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_MOTION_REST', 'rest'),
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourMotion
	});}};
	Blockly.JavaScript['motion_rest'] = function(b) {
		return 'naoMotionRest();\n';
	};

	Blockly.Blocks['robotposture_sitting']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_ROBOTPOSTURE_SITTING', 'sit down'),
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourMotion
	});}};
	Blockly.JavaScript['robotposture_sitting']=function(b){
		return 'naoRobotPostureGoToPosture("Sit", 1.0);\n';
	};

	Blockly.Blocks['robotposture_standing']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_ROBOTPOSTURE_STANDING', 'stand up'),
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourMotion
	});}};
	Blockly.JavaScript['robotposture_standing']=function(b){
		return 'naoRobotPostureGoToPosture("Stand", 3.0);\n';
	};

	Blockly.Blocks['motion_sethead'] = {init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_MOTION_SETHEAD', 'set head %1 to %2 degrees'),
		'args0': [{
			'type': 'field_dropdown',
			'name': 'direction',
			'options': [
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_PITCH', 'pitch'), 'Pitch'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_YAW', 'yaw'), 'Yaw']
			]
		},{
			'type': 'input_value',
			'name': 'degrees',
			'check': 'Number'
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourMotion
	});}};
	Blockly.JavaScript['motion_sethead']=function(b){
		var direction = b.getFieldValue('direction');
		var degrees = parseFloat(Blockly.JavaScript.valueToCode(b, 'degrees', Blockly.JavaScript.ORDER_ATOMIC));

		var name = 'Head' + direction;
		var code = 'naoMotionSetStiffnesses("' + name + '", 1);\n';
		code += 'naoMotionAngleInterpolation("' + name + '",(' + degrees + '*0.0174532923847), 1.0, true);\n';

		return code;
	};

	Blockly.Blocks['motion_sethand'] = {init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_MOTION_SETHAND', 'set %1 hand to %2 degrees'),
		'args0': [{
			'type': 'field_dropdown',
			'name': 'leftright',
			'options': [
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_LEFT', 'left'), 'L'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_RIGHT', 'right'), 'R']
			]
		},{
			'type': 'input_value',
			'name': 'degrees',
			'check': 'Number'
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourMotion
	});}};
	Blockly.JavaScript['motion_sethand']=function(b){
		var leftright = b.getFieldValue('leftright');
		var degrees = parseFloat(Blockly.JavaScript.valueToCode(b, 'degrees', Blockly.JavaScript.ORDER_ATOMIC));

		var name = leftright + 'Hand';
		var code = 'naoMotionSetStiffnesses("' + name + '", 1);\n';
		code += 'naoMotionAngleInterpolation("' + name + '",(' + degrees + '*0.0174532923847), 1.0, true);\n';

		return code;
	};

	Blockly.Blocks['motion_setjoint'] = {init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_MOTION_SETJOINT', 'set %1 %2 %3 to %4 degrees'),
		'args0': [{
			'type': 'field_dropdown',
			'name': 'leftright',
			'options': [
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_LEFT', 'left'), 'L'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_RIGHT', 'right'), 'R']
			]
		},{
			'type': 'field_dropdown',
			'name': 'joint',
			'options': [
				//[i18nFunc_(i18nApp_, 'BLOCK_OPTION_ANKLE', 'ankle'), 'Ankle'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_ELBOW', 'elbow'), 'Elbow'],
				//[i18nFunc_(i18nApp_, 'BLOCK_OPTION_HIP', 'hip'), 'Hip'],
				//[i18nFunc_(i18nApp_, 'BLOCK_OPTION_KNEE', 'knee'), 'Knee'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_SHOULDER', 'shoulder'), 'Shoulder'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_WRIST', 'wrist'), 'Wrist']
			]
		},{
			'type': 'field_dropdown',
			'name': 'motion',
			'options': [
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_PITCH', 'pitch'), 'Pitch'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_ROLL', 'roll'), 'Roll'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_YAW', 'yaw'), 'Yaw'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTION_YAW_PITCH', 'yaw pitch'), 'Yaw Pitch']
			]
		},{
			'type': 'input_value',
			'name': 'degrees',
			'check': 'Number'
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourMotion
	});}};
	Blockly.JavaScript['motion_setjoint']=function(b){
		var leftright = b.getFieldValue('leftright');
		var joint = b.getFieldValue('joint');
		var motion = b.getFieldValue('motion');
		var angle = parseFloat(Blockly.JavaScript.valueToCode(b, 'degrees', Blockly.JavaScript.ORDER_ATOMIC));

		var name = leftright + joint + motion;
		var code = '';

		code += 'var joints = ["' + name + '"];\n';
		code += 'var angles = [' + angle + '];\n';

		code += 'for(var i=0; i<angles.length; i++) {\n';
		code += '	angles[i] *= 0.0174532923847;\n';
		code += '}\n';

		code += 'naoMotionSetStiffnesses(joints, 1.0);\n';
		code += 'naoMotionAngleInterpolation(joints, angles, 1.0, true);\n';

		return code;
	};

	Blockly.Blocks['motion_setjointall'] = {init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_MOTION_SETJOINTALL', 'set joints %1 to angles %2 speed %3'),
		'args0': [{
			'type': 'input_value',
			'name': 'joints',
			'check': 'Array'
		},{
			'type': 'input_value',
			'name': 'angles',
			'check': 'Array'
		},{
			'type': 'input_value',
			'name': 'speed',
			'check': 'Number'
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourMotion
	});}};
	Blockly.JavaScript['motion_setjointall']=function(b){
		var joints = Blockly.JavaScript.valueToCode(b, 'joints', Blockly.JavaScript.ORDER_ATOMIC);
		var angles = Blockly.JavaScript.valueToCode(b, 'angles', Blockly.JavaScript.ORDER_ATOMIC);
		var speed = Blockly.JavaScript.valueToCode(b, 'speed', Blockly.JavaScript.ORDER_ATOMIC);
		var code = '';

	// 	code += 'alert("begin");\n';
		code += 'var joints = ' + joints + ';\n';
		code += 'var angles = ' + angles + ';\n';
		code += 'var speed = ' + speed + ';\n';

	// 	code += 'if(Array.isArray(joints) && Array.isArray(angles) && joints.length == angles.length){\n';

	// 	code += '	for(var i=0; i<angles.length; i++) {\n';
	// 	code += '		angles[i] *= 0.0174532923847;\n';
	// 	code += '	}\n';

	// 	code += 'alert("move");\n';
	//  	code += '	naoMotionSetStiffnesses(joints, 1.0);\n';
		code += '	naoMotionAngleInterpolation(joints, angles, speed, true);\n';
	// 	code += 'alert("finishedd");\n';
	
	// 	code += '} else {\n';
	// 	
	// 	code += '	alert("The set joint block requires joints and angles to be lists with the same amount of items.");\n';
	// 
	// 	code += '}\n';

	return code;
	};

	Blockly.Blocks['motion_run_dropdown'] = {init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_MOTION_RUN_DROPDOWN', 'run motion %1'),
		'args0': [{
			'type': 'field_dropdown',
			'name': 'text',
			'options': function() { return blocklyDropDowns['motions']; }
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourMotion
	});}};
	Blockly.JavaScript['motion_run_dropdown']=function(b){
		var motion = b.getFieldValue('text');

		var code = 'naoMotionRun("' + motion + '");\n';
		return code;
	};

	// Blockly.Blocks['behavior_run_dropdown'] = {init:function(){this.jsonInit({
	// 	'message0': 'run behavior %1',
	// 	'args0': [{
	// 		'type': 'field_dropdown',
	// 		'name': 'name',
	// 		'options': function() { return blocklyDropDowns['behaviors']; }
	// 	}],
	// 	'inputsInline': true,
	// 	'previousStatement': null,
	// 	'nextStatement': null,
	// 	'colour': colourMotion
	// });}};
	// Blockly.JavaScript['motion_setjointall']=function(b){
	// 	var joints = Blockly.JavaScript.valueToCode(b, 'name', Blockly.JavaScript.ORDER_ATOMIC);
	// 	var code = '';
	// 
	// 	return code;
	// };


	/****************************************
	 * Sounds
	 ****************************************/
	Blockly.Blocks['animatedspeech_say'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_ANIMATEDSPEECH_SAY', 'say %1'),
		'args0': [{
			'type': 'input_value',
			'name': 'text',
			'check': 'String'
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourSounds,
		'tooltip': 'Say something with animation',
		'helpUrl': ''
	});}};

	Blockly.JavaScript['animatedspeech_say'] = function(b) {
		var text = Blockly.JavaScript.valueToCode(b, 'text', Blockly.JavaScript.ORDER_ATOMIC);
		var code = '';
	
		code += 'naoAnimatedSpeechSay(' + text + ');\n';

		code += 'naoMotionWaitUntilMoveIsFinished();\n';
		code += 'naoRobotPostureGoToPosture("Stand", 3.0);\n';
		code += 'naoMotionWaitUntilMoveIsFinished();\n';
	
		return code;
	};

	Blockly.Blocks['texttospeech_say'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_TEXTTOSPEECH_SAY', 'say %1 %2 wait %3 animated'),
		'args0': [{
			'type': 'input_value',
			'name': 'text',
			'check': 'String'
		},{
			'type': 'field_checkbox',
			'name': i18nFunc_(i18nApp_, 'BLOCK_OPTION_WAIT', 'wait'),
			'checked': true
		},{
			'type': 'field_checkbox',
			'name': 'animated',
			'checked': true
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourSounds
	});}};

	Blockly.JavaScript['texttospeech_say'] = function(b) {
		var text = Blockly.JavaScript.valueToCode(b, 'text', Blockly.JavaScript.ORDER_ATOMIC);
		var animated = b.getFieldValue('animated');
		var wait = b.getFieldValue('wait');
		var code = '';

		if(animated.toUpperCase() == 'TRUE') {
			code = 'naoAnimatedSpeechSay(' + text + ');\n';

			if(wait.toUpperCase() == 'TRUE' && animated.toUpperCase() != 'TRUE') {
				code += 'while(!naoTextToSpeechDone()) {\n';
				code += 'wait(0.2);\n';
				code += '}\n';
			}
		} else {
			code = 'naoTextToSpeechSay(' + text + ');\n';
		}

		code += 'naoMotionWaitUntilMoveIsFinished();\n';
		code += 'naoRobotPostureGoToPosture("Stand", 3.0);\n';
		code += 'naoMotionWaitUntilMoveIsFinished();\n';
		return code;
	};

	Blockly.Blocks['texttospeech_wait'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_TEXTTOSPEECH_WAIT', 'wait until speech done'),
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourSounds
	});}};

	Blockly.JavaScript['texttospeech_wait'] = function(b) {
		var code = 'while(!naoTextToSpeechDone()) {\n';
		code += 'wait(0.2);\n';
		code += '}\n';
		return code;
	};

	Blockly.Blocks['texttospeech_done'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_TEXTTOSPEECH_DONE', 'speech done'),
		'inputsInline': true,
		'output': 'Boolean',
		'colour': colourSounds
	});}};

	Blockly.JavaScript['texttospeech_done'] = function(b) {
		var code = 'naoTextToSpeechDone()';	
		return [code, Blockly.JavaScript.ORDER_NONE];
	};

	Blockly.Blocks['audioplayer_playsine'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_AUDIOPLAYER_PLAYSINE', 'play frequency %1hz gain %2 for %3 seconds'),
		'args0': [{
			'type': 'input_value',
			'name': 'hertz',
			'check': 'Number'
		},{
			'type': 'input_value',
			'name': 'gain',
			'check': 'Number'
		},{
			'type': 'input_value',
			'name': 'duration',
			'check': 'Number'
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourSounds,
		'helpUrl': ''
	});}};
	Blockly.JavaScript['audioplayer_playsine'] = function(b) {
		var hertz = Blockly.JavaScript.valueToCode(b, 'hertz', Blockly.JavaScript.ORDER_ATOMIC);
		var gain = Blockly.JavaScript.valueToCode(b, 'gain', Blockly.JavaScript.ORDER_ATOMIC);
		var duration = Blockly.JavaScript.valueToCode(b, 'duration', Blockly.JavaScript.ORDER_ATOMIC);

		return 'naoAudioPlayerPlaySine(' + hertz + ', ' + gain + ', 0, ' + duration + ');\n';
	};

	Blockly.Blocks['audioplayer_stopall'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_AUDIOPLAYER_STOPALL', 'stop all sounds'),
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourSounds,
		'helpUrl': ''
	});}};
	Blockly.JavaScript['audioplayer_stopall'] = function(b) {
		return 'naoAudioPlayerStopAll();\n';
	};

	Blockly.Blocks['audioplayer_wait'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_AUDIOPLAYER_WAIT', 'wait for sound to finish'),
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourSounds,
		'helpUrl': ''
	});}};
	Blockly.JavaScript['audioplayer_wait'] = function(b) {
		var code = 'while(naoCommandRunning("audioplayer_playfile")) {\n';
		code += 'wait(0.2);\n';
		code += '}\n';
		return code;
	};

	Blockly.Blocks['audiodevice_setoutputvolume'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_AUDIODEVICE_SETOUTPUTVOLUME', 'set volume %1'),
		'args0': [{
			'type': 'input_value',
			'name': 'volume',
			'check': 'Number'
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourSounds,
		'tooltip': 'Set volume',
		'helpUrl': ''
	});}};
	Blockly.JavaScript['audiodevice_setoutputvolume'] = function(block) {
		var volume = Blockly.JavaScript.valueToCode(block, 'volume', Blockly.JavaScript.ORDER_ATOMIC);
		return 'naoAudioDeviceSetOutputVolume(' + volume + ');\n';
	};

	Blockly.Blocks['audiodevice_getoutputvolume'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_AUDIODEVICE_GETOUTPUTVOLUME', 'get volume'),
		'inputsInline': true,
		'output': 'Number',
		'colour': colourSounds
	});}};
	Blockly.JavaScript['audiodevice_getoutputvolume'] = function(block) {
		var code = 'naoAudioDeviceGetOutputVolume()';

		return [code, Blockly.JavaScript.ORDER_NONE];
	};

	Blockly.Blocks['audiodevice_mute'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_AUDIODEVICE_MUTE', 'mute volume'),
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourSounds
	});}};
	Blockly.JavaScript['audiodevice_mute'] = function(block) {
		return 'naoAudioDeviceMute(true);\n';
	};

	Blockly.Blocks['audiodevice_unmute'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_AUDIODEVICE_UNMUTE', 'unmute volume'),
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourSounds
	});}};
	Blockly.JavaScript['audiodevice_unmute'] = function(block) {
		return 'naoAudioDeviceMute(false);\n';
	};

	Blockly.Blocks['audiodevice_startmicrophonesrecording'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_AUDIODEVICE_STARTMICROPHONESRECORDING', 'start recording %1'),
		'args0': [{
			'type': 'input_value',
			'name': 'text',
			'check': 'String'
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourSounds,
	});}};
	Blockly.JavaScript['audiodevice_startmicrophonesrecording'] = function(block) {
		var name = Blockly.JavaScript.valueToCode(block, 'text', Blockly.JavaScript.ORDER_ATOMIC);

		if(name.indexOf('.') == -1) {
			name = name.substr(0, name.length - 1) + '.wav\'';
		}
	
		return 'naoAudioDeviceStartMicrophonesRecording(' + name + ');\n';
	};

	Blockly.Blocks['audiodevice_stopmicrophonesrecording'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_AUDIODEVICE_STOPMICROPHONESRECORDING', 'stop recording'),
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourSounds,
	});}};
	Blockly.JavaScript['audiodevice_stopmicrophonesrecording'] = function(block) {
		return 'naoAudioDeviceStopMicrophonesRecording();\n';
	};

	Blockly.Blocks['audioplayer_playfile_dropdown'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_AUDIOPLAYER_PLAYFILE_DROPDOWN', 'play sound %1 %2 wait'),
		'args0': [{
			'type': 'field_dropdown',
			'name': 'text',
			'options': function() { return blocklyDropDowns['sounds']; }
		},{
			'type': 'field_checkbox',
			'name': i18nFunc_(i18nApp_, 'BLOCK_OPTION_WAIT', 'wait'),
			'checked': true
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourSounds,
	});}};
	Blockly.JavaScript['audioplayer_playfile_dropdown'] = function(block) {
		var name = block.getFieldValue('text');
		var wait = block.getFieldValue('wait');
		var code = '';

		if(name.indexOf('.') == -1) {
			name = name.substr(0, name.length - 1) + '.wav\'';
		}
	
		code += 'naoAudioPlayerPlayFile("' + name + '", 1, 0);\n';

		if(wait.toUpperCase() == 'TRUE') {
			code += 'while(naoCommandRunning("audioplayer_playfile")) {\n';
			code += 'wait(0.2);\n';
			code += '}\n';
		}
	
		return code;
	};

	Blockly.Blocks['audioplayer_playfilestring'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_AUDIOPLAYER_PLAYFILESTRING', 'play sound %1 %2 wait'),
		'args0': [{
			'type': 'input_value',
			'name': 'text',
			'check': 'String'
		},{
			'type': 'field_checkbox',
			'name': i18nFunc_(i18nApp_, 'BLOCK_OPTION_WAIT', 'wait'),
			'checked': true
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourSounds,
	});}};
	Blockly.JavaScript['audioplayer_playfilestring'] = function(block) {
		var name = Blockly.JavaScript.valueToCode(block, 'text', Blockly.JavaScript.ORDER_ATOMIC);

		if(name.indexOf('.') == -1) {
			name = name.substr(0, name.length - 1) + '.wav\'';
		}
	
		return 'naoAudioPlayerPlayFile(' + name + ', 1, 0);\n';
	};


	/****************************************
	 * Looks
	 ****************************************/
	Blockly.Blocks['leds_random_eyes'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_LEDS_RANDOM_EYES', 'random eyes for %1 seconds'),
		'args0': [{
			'type': 'input_value',
			'name': 'seconds',
			'check': 'Number'
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourLooks
	});}};
	Blockly.JavaScript['leds_random_eyes'] = function(block) {
		var seconds = Blockly.JavaScript.valueToCode(block, 'seconds', Blockly.JavaScript.ORDER_ATOMIC);
		return 'naoLedsRandomEyes(' + seconds + ');\n';
	};

	Blockly.Blocks['leds_rasta'] = { init: function() { this.jsonInit({
		'message0': 'rasta leds for %1 seconds',
		'args0': [{
			'type': 'input_value',
			'name': 'seconds',
			'check': 'Number'
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourLooks
	});}};
	Blockly.JavaScript['leds_rasta'] = function(block) {
		var seconds = Blockly.JavaScript.valueToCode(block, 'seconds', Blockly.JavaScript.ORDER_ATOMIC);
		return 'naoLedsRasta(' + seconds + ');\n';
	};

	Blockly.Blocks['leds_colour'] = { init: function() { this.jsonInit({
		"message0": i18nFunc_(i18nApp_, 'BLOCK_LEDS_COLOUR', 'led %1 color %2'),
		"args0": [{
			'type': 'field_dropdown',
			'name': 'group',
			'options': [
				[i18nFunc_(i18nApp_, 'BLOCK_OPTIONS_EYES', 'eyes'), 'FaceLeds'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTIONS_HEAD', 'head'), 'BrainLeds'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTIONS_EARS', 'ears'), 'EarLeds'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTIONS_CHEST', 'chest'), 'ChestLeds'],
				[i18nFunc_(i18nApp_, 'BLOCK_OPTIONS_FEET', 'feet'), 'FeetLeds']
			]
		},{
			"type": "input_value",
			"name": "colour",
			"check": "Colour"
		}],
		"inputsInline": true,
		"previousStatement": null,
		"nextStatement": null,
		'colour': colourLooks
	});}};

	Blockly.JavaScript['leds_colour'] = function(b) {
		var colour = Blockly.JavaScript.valueToCode(b, 'colour', Blockly.JavaScript.ORDER_ATOMIC);
		var group = b.getFieldValue('group');
		colour = '0x00' + colour.substr(2, 6);
		return 'naoLedsFadeRGB("'+ group + '", "' + colour + '", 0);\n';
	};

	// Blockly.Blocks['behavior_start']={init:function(){this.jsonInit({
	// 	'message0': 'do behavior %1',
	// 	'args0': [{
	// 		'type': 'input_value',
	// 		'name': 'name',
	// 		'check': 'String'
	// 	}],
	// 	'inputsInline': true,
	// 	'previousStatement': null,
	// 	'nextStatement': null,
	// 	'colour': colourLooks
	// });}};
	// Blockly.JavaScript['behavior_start'] = function(b) {
	//  	var name = Blockly.JavaScript.valueToCode(b, 'name', Blockly.JavaScript.ORDER_ATOMIC);
	// 
	//  	var code = 'naoBehaviorStart(' + name + ');\n'; 	
	//  	return code;
	// };
	// 
	Blockly.Blocks['behavior_run']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_BEHAVIOR_RUN', 'do behavior %1 %2 wait'),
		'args0': [{
			'type': 'input_value',
			'name': 'name',
			'check': 'String'
		},{
			'type': 'field_checkbox',
			'name': i18nFunc_(i18nApp_, 'BLOCK_OPTION_WAIT', 'wait')
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourMotion
	});}};
	Blockly.JavaScript['behavior_run'] = function(b) {
		var name = Blockly.JavaScript.valueToCode(b, 'name', Blockly.JavaScript.ORDER_ATOMIC);

		var code = 'naoBehaviorStart(' + name + ');\n';

		var wait = b.getFieldValue('wait');

		if(wait) {
			code += 'while(naoBehaviorRunning(' + name + ')){\n';
			code += '	wait(0.5);\n';
			code += '}\n';
		}
		
		return code;
	};

	Blockly.Blocks['behavior_running']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_BEHAVIOR_RUNNING', 'behavior %1 running'),
		'args0': [{
			'type': 'input_value',
			'name': 'name',
			'check': 'String'
		}],
		'output': 'Boolean',
		'inputsInline': true,
		'colour': colourMotion
	});}};
	Blockly.JavaScript['behavior_running'] = function(b) {
		var name = Blockly.JavaScript.valueToCode(b, 'name', Blockly.JavaScript.ORDER_ATOMIC);
		var code = 'naoBehaviorStart(' + name + ');\n';

		return [code, Blockly.JavaScript.ORDER_NONE];
	};

	Blockly.Blocks['photo_capture']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_PHOTO_CAPTURE', 'take photo %1'),
		'args0': [{
			'type': 'input_value',
			'name': 'name',
			'check': 'String'
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourLooks
	});}};
	Blockly.JavaScript['photo_capture'] = function(b) {
		var name = Blockly.JavaScript.valueToCode(b, 'name', Blockly.JavaScript.ORDER_ATOMIC);

		var code = 'naoPhotoCaptureTakePicture(' + name + ');\n';
		return code;
	};

	Blockly.Blocks['video_startrecording']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_VIDEO_STARTRECORDING', 'record video %1'),
		'args0': [{
			'type': 'input_value',
			'name': 'name',
			'check': 'String'
		}],
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourLooks
	});}};
	Blockly.JavaScript['video_startrecording'] = function(b) {
		var name = Blockly.JavaScript.valueToCode(b, 'name', Blockly.JavaScript.ORDER_ATOMIC);

		var code = 'naoVideoRecorderStartRecording(' + name + ');\n';
		return code;
	};

	Blockly.Blocks['video_stoprecording']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_VIDEO_STOPRECORDING', 'stop video recording'),
		'inputsInline': true,
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourLooks
	});}};
	Blockly.JavaScript['video_stoprecording'] = function(b) {
		var code = 'naoVideoRecorderStopRecording();\n';
		return code;
	};

	/****************************************
	 * Control
	 ****************************************/
	Blockly.Blocks['exit_event'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_EXIT_EVENT', 'end stack'),
		'previousStatement': null,
		'colour': colourLoops
	});}};
	Blockly.JavaScript['exit_event'] = function(block) {
		return 'end();\n';
	};

	Blockly.Blocks['exit_script'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_END_SCRIPT', 'end script'),
		'previousStatement': null,
		'colour': colourLoops
	});}};
	Blockly.JavaScript['exit_script'] = function(block) {
		return 'exit();\n';
	};

	Blockly.Blocks['wait'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_WAIT', 'wait %1 seconds'),
		'args0': [{
			'type': 'input_value',
			'name': 'seconds',
			'check': 'Number'
		}],
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourLoops
	});}};

	Blockly.JavaScript['wait'] = function(block) {
		var seconds = Blockly.JavaScript.valueToCode(block, 'seconds', Blockly.JavaScript.ORDER_ATOMIC);
		return 'wait(' + seconds + ');\n';
	};


	/****************************************
	 * Numbers
	 ****************************************/
	Blockly.Blocks['nao_msec']={init:function(){this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_NAO_MSEC', 'milliseconds since active'),
		'inputsInline': true,
		'output': 'Number',
		'colour': colourNumbers
	});}};
	Blockly.JavaScript['nao_msec']=function(b){
		var code = 'naoMsec()';
		return [code, Blockly.JavaScript.ORDER_NONE];
	};


	/****************************************
	 * Text
	 ****************************************/
	Blockly.Blocks['system_username'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_SYSTEM_USERNAME', 'my username'),
		'inputsInline': true,
		'output': 'String',
		'colour': colourText
	});}};

	Blockly.JavaScript['system_username'] = function(block) {
		var code = 'username()';
		return [code, Blockly.JavaScript.ORDER_NONE];
	};

	Blockly.Blocks['system_robotname'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_SYSTEM_ROBOTNAME', 'nao name'),
		'inputsInline': true,
		'output': 'String',
		'colour': colourText
	});}};

	Blockly.JavaScript['system_robotname'] = function(block) {
		var code = 'naoSystemRobotName()';
		return [code, Blockly.JavaScript.ORDER_NONE];
	};

	Blockly.Blocks['script_alert'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_SCRIPT_ALERT', 'script alert %1'),
		'args0': [{
			'type': 'input_value',
			'name': 'message',
			'check': 'String'
		}],
		'previousStatement': null,
		'nextStatement': null,
		'colour': colourText
	});}};

	Blockly.JavaScript['script_alert'] = function(block) {
		var message = Blockly.JavaScript.valueToCode(block, 'message', Blockly.JavaScript.ORDER_ATOMIC);
		return 'alert(' + message + ');\n';
	};

	Blockly.Blocks['script_ask'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_SCRIPT_ASK', 'script ask for %1 with message %2'),
		'args0': [{
			'type': 'field_dropdown',
			'name': 'TYPE',
			'options': [[i18nFunc_(i18nApp_, 'BLOCK_OPTION_TEXT', 'text'),'string'],[i18nFunc_(i18nApp_, 'BLOCK_OPTION_NUMBER', 'number'),'number']]
		},{
			'type': 'input_value',
			'name': 'message',
			'check': 'String'
		}],
		'output': ['String', 'Number'],
		'colour': colourText
	});}};

	Blockly.JavaScript['script_ask'] = function(block) {
		var message = Blockly.JavaScript.valueToCode(block, 'message', Blockly.JavaScript.ORDER_ATOMIC);
		var code = 'ask(' + message + ')';
		return [code, Blockly.JavaScript.ORDER_NONE];
	};




	Blockly.Blocks['comment'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_COMMENT', 'comment %1'),
		'args0': [{
			'type': 'field_input',
			'name': 'comment',
			'text': i18nFunc_(i18nApp_, 'BLOCK_OPTION_ENTER_COMMENT', 'enter your comment here')
		}],
		'previousStatement': null,
		'nextStatement': null,
		'colour': '#835C3B'
	});}};

	Blockly.JavaScript['comment'] = function(b) {
		return '';
	};


	Blockly.Blocks['file_list'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_FILE_LIST', 'file list'),
		'output': 'Array',
		'colour': colourLists
	});}};

	Blockly.JavaScript['file_list'] = function(b) {
		var code = 'naoFileList()';

		return [code, Blockly.JavaScript.ORDER_NONE];
	};

	Blockly.Blocks['file_exists'] = { init: function() { this.jsonInit({
		'message0': i18nFunc_(i18nApp_, 'BLOCK_FILE_EXISTS', 'file %1 exists'),
		'args0': [{
			'type': 'input_value',
			'name': 'text',
			'check': 'String'
		}],
		'output': 'Boolean',
		'colour': colourLists
	});}};

	Blockly.JavaScript['file_exists'] = function(b) {
		var name = Blockly.JavaScript.valueToCode(b, 'text', Blockly.JavaScript.ORDER_ATOMIC);
		var code = 'naoFileExists(' + name + ')';

		return [code, Blockly.JavaScript.ORDER_NONE];
	};
}



function changeBlocklyBlockColour(str_prefix, colour, prefix=true) {
	for(var propertyName in Blockly.Blocks) {
	   if(propertyName.substr(0, str_prefix.length) == str_prefix) {
			if('init' in Blockly.Blocks[propertyName]) {
				if(!('init2' in Blockly.Blocks[propertyName])) {
					Blockly.Blocks[propertyName].init2 = Blockly.Blocks[propertyName].init;
				}
				
				Blockly.Blocks[propertyName].init = function() {
					this.init2();
					this.setColour(colour);
				};
			}
	   }
	}
}
