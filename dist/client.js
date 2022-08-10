/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/bpmn-js-extension/ContextPadExtension.js":
/*!*********************************************************!*\
  !*** ./client/bpmn-js-extension/ContextPadExtension.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContextPadExtension)
/* harmony export */ });
/* harmony import */ var _TemplateSymbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TemplateSymbol */ "./client/bpmn-js-extension/TemplateSymbol.js");



class ContextPadExtension {
  constructor(contextPad, eventBus, translate) {
    this.contextPad = contextPad;
    this.eventBus = eventBus;
    this.translate = translate;

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const {
      eventBus,
      translate
    } = this;

    function createFromElementTemplate() {
      return function(event) {

        eventBus.fire('templates-palette-plugin.append-from-element-template', { originEvent: event, element });
      };
    }

    return {
      'templates-palette-plugin.append-from-element-template': {
        group: 'model',
        imageUrl: _TemplateSymbol__WEBPACK_IMPORTED_MODULE_0__.TEMPLATE_SYMBOL,
        title: translate('Append templated Element'),
        action: {
          click: createFromElementTemplate()
        }
      }
    };
  }
}

ContextPadExtension.$inject = [
  'contextPad',
  'eventBus',
  'translate'
];


/***/ }), /////////////////////////////////删除圆括号

/***/ "./client/bpmn-js-extension/CreateTemplatedElementsService.js":
/*!********************************************************************!*\
  !*** ./client/bpmn-js-extension/CreateTemplatedElementsService.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateTemplatedElementsService)
/* harmony export */ });
/* harmony import */ var domify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domify */ "./node_modules/domify/index.js");
/* harmony import */ var domify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(domify__WEBPACK_IMPORTED_MODULE_0__);


const UNSUPPORTED_TYPES = [
  'bpmn:Process',
  'bpmn:Collaboration',
  'bpmn:SequenceFlow',
  'bpmn:MessageFlow'
];

const APPEND_ACTION = 'templates-palette-plugin.append-from-element-template';
const CREATE_ACTION = 'templates-palette-plugin.create-from-element-template';

const emptyOption = domify__WEBPACK_IMPORTED_MODULE_0___default()('<option value=""></option>');
emptyOption.innerText = '<select one>';


class CreateTemplatedElementsService {

  constructor(autoPlace, bpmnFactory, canvas, commandStack, create, elementFactory, elementTemplates, eventBus) {
    this.autoPlace = autoPlace;
    this.bpmnFactory = bpmnFactory;
    this.canvas = canvas;
    this.commandStack = commandStack;
    this.create = create;
    this.elementFactory = elementFactory;
    this.elementTemplates = elementTemplates;
    this.eventBus = eventBus;

    this._elementTemplates = [];

    this.init();
  }


  init() {
    this._registerEventListener((event, element) => {
      this.updateElementTemplates();
      this._createDropdown(event);
      this._registerCreateTemplateAction(event, element);
    });
  }

  updateElementTemplates() {
    const {
      elementTemplates
    } = this;

    const allElementTemplates = elementTemplates.getAll('*');

    // only use element templates, which have one dedicated shapeType
    this._elementTemplates = allElementTemplates.filter(
      template => template.appliesTo.length === 1 && !UNSUPPORTED_TYPES.includes(template.appliesTo[0]));
  }

  _registerEventListener(func) {
    const {
      eventBus
    } = this;

    eventBus.once([ CREATE_ACTION, APPEND_ACTION ], function(event) {
      const {
        originEvent,
        element
      } = event;

      func(originEvent, element);
    });
  }

  _createDropdown(event) {
    const {
      eventBus
    } = this;

    const dropDownEle = domify__WEBPACK_IMPORTED_MODULE_0___default()(
      `<div class="templates-palette-plugin"><label for="elementTemplates">Available Templates:</label>
        <select id="elementTemplates"></select>
      </div>`);

    const select = dropDownEle.querySelector('select');

    select.appendChild(emptyOption);

    this._elementTemplates.forEach((template) => {
      const option = domify__WEBPACK_IMPORTED_MODULE_0___default()(`<option value="${template.id}">${template.name}</option>`);

      select.appendChild(option);
    });

    event.delegateTarget.appendChild(dropDownEle);

    eventBus.once([ 'element.click', 'create.init' ], (context) => {
      dropDownEle.remove();

      this.init();
    });
  }

  _registerCreateTemplateAction(event, element) {
    const {
      canvas
    } = this;

    const select = canvas._container.querySelector('.templates-palette-plugin select');
    select.addEventListener('change', () => this._createTemplatedElement(event, element, select.value));
  }

  _createTemplatedElement(event, element, templateId) {
    const {
      autoPlace,
      commandStack,
      create,
      elementFactory
    } = this;

    const action = event.delegateTarget.getAttribute('data-action');

    const template = this._elementTemplates.find(temp => temp.id === templateId),
          type = template.appliesTo[0];

    const shape = elementFactory.createShape({ type });

    commandStack.execute('propertiesPanel.camunda.changeTemplate', {
      element: shape,
      newTemplate: template
    });

    if (action === CREATE_ACTION) {
      create.start(event, shape);
    } else if (action === APPEND_ACTION) {
      autoPlace.append(element, shape);
    }

  }

}

CreateTemplatedElementsService.$inject = [
  'autoPlace',
  'bpmnFactory',
  'canvas',
  'commandStack',
  'create',
  'elementFactory',
  'elementTemplates',
  'eventBus'
];


/***/ }),

/***/ "./client/bpmn-js-extension/PaletteExtension.js":
/*!******************************************************!*\
  !*** ./client/bpmn-js-extension/PaletteExtension.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PaletteExtension)
/* harmony export */ });
/* harmony import */ var _TemplateSymbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TemplateSymbol */ "./client/bpmn-js-extension/TemplateSymbol.js");



class PaletteExtension {
	  constructor(eventBus, palette, translate,bpmnFactory, create, elementFactory) {
	    this.eventBus = eventBus;
	    this.translate = translate;
	    
	    this.bpmnFactory = bpmnFactory;
	    this.create = create;
	    this.elementFactory = elementFactory;
	   

	    palette.registerProvider(this);
	  }

	  getPaletteEntries(element) {
	    const {
	      eventBus,
	      translate,
	      bpmnFactory,
	      create,
	      elementFactory,
	      
	    } = this;

	    function createFromElementTemplate() {
	      return function(event) {

	        eventBus.fire('templates-palette-plugin.create-from-element-template', { originEvent: event });
	      };
	    }
	    
	    function createTask() {
	        return function(event) {

	            //console.log(event.type+"taskkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")

	            const businessObject = bpmnFactory.create('bpmn:Task');
	            // businessObject['custom'] = 1

	            // const businessObject1 = bpmnFactory.create('bpmn:BoundaryEvent');

	            const shape = elementFactory.createShape({
	                type: 'bpmn:Task',
	                businessObject,
	                
	            });
	           // console.log(shape) // 只在拖动或者点击时触发
	            create.start(event, shape);
	        

	        }
	    }
	    
	    function createGateway1() {
	        return function(event) {
	            
	                
	                //添加的新元素
	                console.log(event.type+"eventt")
	                const businessObject1 = bpmnFactory.create('bpmn:ParallelGateway');
	                //businessObject1['custom'] = 1
	                const shape1 = elementFactory.createShape({
	                    type: 'bpmn:ParallelGateway',
	                    
	                    businessObject1
	                });
	                console.log(shape1) // 只在拖动或者点击时触发
	                create.start(event, shape1);
	        }
	    }

	        function createGateway2() {
	            return function(event) {
	                
	                    
	                    //添加的新元素
	                    console.log(event.type+"eventt")
	                    const businessObject1 = bpmnFactory.create('bpmn:ComplexGateway');
	                    //businessObject1['custom'] = 1
	                    const shape1 = elementFactory.createShape({
	                        type: 'bpmn:ComplexGateway',
	                        
	                        businessObject1
	                    });
	                    console.log(shape1) // 只在拖动或者点击时触发
	                    create.start(event, shape1);
	            }
	        }

	        function createGateway3() {
	            return function(event) {
	                
	                    
	                    //添加的新元素
	                    console.log(event.type+"eventt")
	                    const businessObject1 = bpmnFactory.create('bpmn:InclusiveGateway');
	                    //businessObject1['custom'] = 1
	                    const shape1 = elementFactory.createShape({
	                        type: 'bpmn:InclusiveGateway',
	                        
	                        businessObject1
	                    });
	                    console.log(shape1) // 只在拖动或者点击时触发
	                    create.start(event, shape1);
	            }
	        }

	        function createEvent1() {
	            return function(event) {
	               
	                
	                //添加的新元素
	                console.log(event.type+"eventtttttttttttttttttttttttttttttttttttttttttttttttttt")
	                const businessObject1 = bpmnFactory.create('bpmn:IntermediateThrowEvent');
	                //businessObject1['custom'] = 1
	                const shape1 = elementFactory.createShape({
	                    type: 'bpmn:IntermediateThrowEvent',
	                    
	                    businessObject1
	                });
	                console.log(shape1) // 只在拖动或者点击时触发
	                create.start(event, shape1);


	            }
	        }

	        function createEvent2() {
	            return function(event) {
	               
	                
	                //添加的新元素
	                console.log(event.type+"eventtttttttttttttttttttttttttttttttttttttttttttttttttt")
	                const businessObject1 = bpmnFactory.create('bpmn:IntermediateCatchEvent');
	                //businessObject1['custom'] = 1
	                const shape1 = elementFactory.createShape({
	                    type: 'bpmn:IntermediateCatchEvent',
	                    
	                    businessObject1
	                });
	                console.log(shape1) // 只在拖动或者点击时触发
	                create.start(event, shape1);


	            }
	        }

	        function createEvent3() {
	            return function(event) {
	               
	                
	                //添加的新元素
	                console.log(event.type+"eventt")
	                const businessObject1 = bpmnFactory.create('bpmn:BusinessRuleTask');
	                //businessObject1['custom'] = 1
	                const shape1 = elementFactory.createShape({
	                    type: 'bpmn:BusinessRuleTask',
	                    
	                    businessObject1
	                });
	                console.log(shape1) // 只在拖动或者点击时触发
	                create.start(event, shape1);


	            }
	        }
	        
	        function createEvent4() {
	            return function(event) {
	               
	                
	                //添加的新元素
	                console.log(event.type+"eventt")
	                const businessObject1 = bpmnFactory.create('bpmn:ScriptTask');
	                //businessObject1['custom'] = 1
	                const shape1 = elementFactory.createShape({
	                    type: 'bpmn:ScriptTask',
	                    
	                    businessObject1
	                });
	                console.log(shape1) // 只在拖动或者点击时触发
	                create.start(event, shape1);


	            }
	        }

	    return {
//	      'templates-palette-plugin.create-from-element-template': {
//	        group: 'extension',
//	        imageUrl: _TemplateSymbol__WEBPACK_IMPORTED_MODULE_0__.TEMPLATE_SYMBOL,
//	        title: translate('Create Task from Element Template'),
//	        action: {
//	          dragstart: createFromElementTemplate(),
//	          click: createFromElementTemplate()
//	        }
//	      },
	      
	      'create.sensor-task': {
	          group: 'model',
	          className: 'icon-custom sensor-task',
	          // className: 'bpmn-icon-user-task',
	          title: translate('这是一个传感器类型任务节点'),
	          action: {
	              dragstart: createTask(),
	              click: createTask()
	          }
	      },
	      
	      'create.image-task': {
	          group: 'model',
	          className: 'icon-custom image-task',
	          // className: 'bpmn-icon-user-task',
	          title: translate('这是一个图像捕获类型节点'),
	          action: {
	              dragstart: createEvent1(),
	              click: createEvent1()      //关键点！！！！！！！！！！！！！！！！
	      }
	  
	  },

		  'create.robot-task': {
		      group: 'model',
		      className: 'icon-custom robot-task',
		      title: '创建一个网关',
		      action: {
		          dragstart: createGateway1(),
		          click: createGateway1()
		      }
		  },
		
		  'create.lock-task': {
		      group: 'model',
		      className: 'icon-custom lock-task',
		      title: '创建一个网关',
		      action: {
		          dragstart: createGateway2(),
		          click: createGateway2()
		      }
		  },
		
		  'create.voice-task': {
		      group: 'model',
		      className: 'icon-custom voice-task',
		      title: '创建一个网关',
		      action: {
		          dragstart: createGateway3(),
		          click: createGateway3()
		      }
		  },
		
		  'create.read-task': {
		      group: 'model',
		      className: 'icon-custom read-task',
		      title: '创建一个网关',
		      action: {
		          dragstart: createEvent2(),
		          click: createEvent2()
		      }
		  },
		
		  'create.collect-task': {
		      group: 'model',
		      className: 'icon-custom collect-task',
		      title: '创建一个事件',
		      action: {
		          dragstart: createEvent3(),
		          click: createEvent3()
		      }
		  },
		  'create.transform-task': {
		      group: 'model',
		      className: 'icon-custom transform-task',
		      title: '创建一个传输事件',
		      action: {
		          dragstart: createEvent4(),
		          click: createEvent4()
		      }
		  }
	      
	    };
	  }
	}

	PaletteExtension.$inject = [
	  'eventBus',
	  'palette',
	  'translate',
	  
	  'bpmnFactory',
	  'create',
	  'elementFactory',
	];


	/***/ }),
	
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/***/ "./client/bpmn-js-extension/RenderExtension.js":
	/*!*********************************************************!*\
	  !*** ./client/bpmn-js-extension/ContextPadExtension.js ***!
	  \*********************************************************/
	/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

	"use strict";
	__webpack_require__.r(__webpack_exports__);
	/* harmony export */ __webpack_require__.d(__webpack_exports__, {
	/* harmony export */   "default": () => (/* binding */ RenderExtension)
	/* harmony export */ });
//	/* harmony import */ var _TemplateSymbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TemplateSymbol */ "./client/bpmn-js-extension/TemplateSymbol.js");
//	/* harmony import */ var diagram__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domify */ "./node_modules/diagram-js/lib/draw/BaseRenderer.js");
//	/* harmony import */ var diagram__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(diagram__WEBPACK_IMPORTED_MODULE_0__);
//	/* harmony import */ var bpmn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! domify */ "./node_modules/bpmn-js/lib/util/ModelUtil.js");
//	/* harmony import */ var bpmn__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bpmn__WEBPACK_IMPORTED_MODULE_1__);
//	/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! domify */ "./client/bpmn-js-extension/util.js");
//	/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_2__);
//	/* harmony import */ var inherit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! domify */ "inherits");
//	/* harmony import */ var inherit__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_3__);
	
	
	const HIGH_PRIORITY = 1500
	
class RenderExtension extends BaseRenderer {
    constructor(eventBus, bpmnRenderer, modeling) {
        super(eventBus, HIGH_PRIORITY);

        this.bpmnRenderer = bpmnRenderer;
        this.modeling = modeling;
    }

    canRender(element) {
        // ignore labels
        return !element.labelTarget;
    }

    drawShape(parentNode, element) {
       
        const type = element.type // 获取到类型
        
        if (customElements.includes(type)) { // or customConfig[type]
            const { url, attr } = customConfig[type]
            const customIcon = svgCreate('image', {
                ...attr,
                href: url
            })
            element['width'] = attr.width // 这里我是取了巧, 直接修改了元素的宽高
            element['height'] = attr.height
            svgAppend(parentNode, customIcon)
                // 判断是否有name属性来决定是否要渲染出label
            if (!hasLabelElements.includes(type) && element.businessObject.name) {
                const text = svgCreate('text', {
                    x: attr.x,
                    y: attr.y + attr.height + 20,
                    "font-size": "14",
                    "fill": "#000"
                })
                text.innerHTML = element.businessObject.name
                svgAppend(parentNode, text)
                
                
            }
            // this.modeling.resizeShape(element, {
            //     x: element.x,
            //     y: element.y,
            //     width: element['width'] / 2,
            //     height: element['height'] / 2
            // })
            return customIcon
        }
        // else if (type === 'bpmn:TextAnnotation' && element.businessObject.color) {
        //     console.log('我是绿色的')
        //     let color = element.businessObject.color
        //     element.businessObject.di.set('bioc:stroke', color)
        //     const shape = this.bpmnRenderer.drawShape(parentNode, element)
        //     return shape
        // }
        const shape = this.bpmnRenderer.drawShape(parentNode, element)
        if (is(element, 'bpmn:UserTask')) {
            svgAttr(shape, { fill: '#eee' });
        }
        return shape
    }

    getShapePath(shape) {
        return this.bpmnRenderer.getShapePath(shape);
    }
//    inherits(RenderExtension, BaseRenderer);
}

RenderExtension.$inject = ['eventBus', 'bpmnRenderer', 'modeling'];


/***/ }),

/***/ "./client/bpmn-js-extension/TemplateSymbol.js":
/*!****************************************************!*\
  !*** ./client/bpmn-js-extension/TemplateSymbol.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TEMPLATE_SYMBOL": () => (/* binding */ TEMPLATE_SYMBOL)
/* harmony export */ });
const TEMPLATE_SYMBOL = 'data:image/png;base64,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';


/***/ }),

/***/ "./client/bpmn-js-extension/index.js":
/*!*******************************************!*\
  !*** ./client/bpmn-js-extension/index.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);///模块加载
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ContextPadExtension__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ContextPadExtension */ "./client/bpmn-js-extension/ContextPadExtension.js");
/* harmony import */ var _CreateTemplatedElementsService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CreateTemplatedElementsService */ "./client/bpmn-js-extension/CreateTemplatedElementsService.js");
/* harmony import */ var _PaletteExtension__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PaletteExtension */ "./client/bpmn-js-extension/PaletteExtension.js");
/* harmony import */ var _RenderExtension__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PaletteExtension */ "./client/bpmn-js-extension/RenderExtension.js");

///模块加载变量


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __init__: [ 'contextPadExtension', 'createTemplatedElementsService', 'paletteExtension'],
  contextPadExtension: [ 'type', _ContextPadExtension__WEBPACK_IMPORTED_MODULE_0__.default ],
  createTemplatedElementsService: [ 'type', _CreateTemplatedElementsService__WEBPACK_IMPORTED_MODULE_1__.default ],
  paletteExtension: [ 'type', _PaletteExtension__WEBPACK_IMPORTED_MODULE_2__.default],
//  renderExtension: [ 'type', _RenderExtension__WEBPACK_IMPORTED_MODULE_3__.default]
});


/***/ }),

/***/ "./node_modules/camunda-modeler-plugin-helpers/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerClientPlugin": () => (/* binding */ registerClientPlugin),
/* harmony export */   "registerBpmnJSPlugin": () => (/* binding */ registerBpmnJSPlugin),
/* harmony export */   "registerBpmnJSModdleExtension": () => (/* binding */ registerBpmnJSModdleExtension),
/* harmony export */   "getModelerDirectory": () => (/* binding */ getModelerDirectory),
/* harmony export */   "getPluginsDirectory": () => (/* binding */ getPluginsDirectory)
/* harmony export */ });
/**
 * Validate and register a client plugin.
 *
 * @param {Object} plugin
 * @param {String} type
 */
function registerClientPlugin(plugin, type) {
  var plugins = window.plugins || [];
  window.plugins = plugins;

  if (!plugin) {
    throw new Error('plugin not specified');
  }

  if (!type) {
    throw new Error('type not specified');
  }

  plugins.push({
    plugin: plugin,
    type: type
  });
}

/**
 * Validate and register a bpmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerBpmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const BpmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerBpmnJSPlugin(BpmnJSModule);
 */
function registerBpmnJSPlugin(module) {
  registerClientPlugin(module, 'bpmn.modeler.additionalModules');
}

/**
 * Validate and register a bpmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerBpmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerBpmnJSModdleExtension(moddleDescriptor);
 */
function registerBpmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'bpmn.modeler.moddleExtension');
}

/**
 * Return the modeler directory, as a string.
 *
 * @deprecated Will be removed in future Camunda Modeler versions without replacement.
 *
 * @return {String}
 */
function getModelerDirectory() {
  return window.getModelerDirectory();
}

/**
 * Return the modeler plugin directory, as a string.
 *
 * @deprecated Will be removed in future Camunda Modeler versions without replacement.
 *
 * @return {String}
 */
function getPluginsDirectory() {
  return window.getPluginsDirectory();
}

/***/ }),

/***/ "./node_modules/domify/index.js":
/*!**************************************!*\
  !*** ./node_modules/domify/index.js ***!
  \**************************************/
/***/ ((module) => {


/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var innerHTMLBug = false;
var bugTestDiv;
if (typeof document !== 'undefined') {
  bugTestDiv = document.createElement('div');
  // Setup
  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
  // Make sure that link elements get serialized correctly by innerHTML
  // This requires a wrapper element in IE
  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
  bugTestDiv = undefined;
}

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = Object.prototype.hasOwnProperty.call(map, tag) ? map[tag] : map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*************************!*\
  !*** ./client/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! camunda-modeler-plugin-helpers */ "./node_modules/camunda-modeler-plugin-helpers/index.js");
/* harmony import */ var _bpmn_js_extension__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bpmn-js-extension */ "./client/bpmn-js-extension/index.js");




(0,camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__.registerBpmnJSPlugin)(_bpmn_js_extension__WEBPACK_IMPORTED_MODULE_1__.default);

})();

/******/ })()


//**************************************************************
///******/ (() => { // webpackBootstrap
///******/ 	var __webpack_modules__ = ({
//
///***/ "./client/bpmn-js-extension/ContextPadExtension.js":
///*!*********************************************************!*\
//  !*** ./client/bpmn-js-extension/ContextPadExtension.js ***!
//  \*********************************************************/
///***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
//
//"use strict";
//__webpack_require__.r(__webpack_exports__);
///* harmony export */ __webpack_require__.d(__webpack_exports__, {
///* harmony export */   "default": () => (/* binding */ ContextPadExtension)
///* harmony export */ });
///* harmony import */ var _TemplateSymbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TemplateSymbol */ "./client/bpmn-js-extension/TemplateSymbol.js");
//
//
//
//class ContextPadExtension {
//  constructor(contextPad, eventBus, translate) {
//    this.contextPad = contextPad;
//    this.eventBus = eventBus;
//    this.translate = translate;
//
//    contextPad.registerProvider(this);
//  }
//
//  getContextPadEntries(element) {
//    const {
//      eventBus,
//      translate
//    } = this;
//
//    function createFromElementTemplate() {
//      return function(event) {
//
//        eventBus.fire('templates-palette-plugin.append-from-element-template', { originEvent: event, element });
//      };
//    }
//
//    return {
//      'templates-palette-plugin.append-from-element-template': {
//        group: 'model',
//        imageUrl: _TemplateSymbol__WEBPACK_IMPORTED_MODULE_0__.TEMPLATE_SYMBOL,
//        title: translate('Append templated Element'),
//        action: {
//          click: createFromElementTemplate()
//        }
//      }
//    };
//  }
//}
//
//ContextPadExtension.$inject = [
//  'contextPad',
//  'eventBus',
//  'translate'
//];
//
//
///***/ }),
//
///***/ "./client/bpmn-js-extension/CreateTemplatedElementsService.js":
///*!********************************************************************!*\
//  !*** ./client/bpmn-js-extension/CreateTemplatedElementsService.js ***!
//  \********************************************************************/
///***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
//
//"use strict";
//__webpack_require__.r(__webpack_exports__);
///* harmony export */ __webpack_require__.d(__webpack_exports__, {
///* harmony export */   "default": () => (/* binding */ CreateTemplatedElementsService)
///* harmony export */ });
///* harmony import */ var domify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domify */ "./node_modules/domify/index.js");
///* harmony import */ var domify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(domify__WEBPACK_IMPORTED_MODULE_0__);
//
//
//const UNSUPPORTED_TYPES = [
//  'bpmn:Process',
//  'bpmn:Collaboration',
//  'bpmn:SequenceFlow',
//  'bpmn:MessageFlow'
//];
//
//const APPEND_ACTION = 'templates-palette-plugin.append-from-element-template';
//const CREATE_ACTION = 'templates-palette-plugin.create-from-element-template';
//
//const emptyOption = domify__WEBPACK_IMPORTED_MODULE_0___default()('<option value=""></option>');
//emptyOption.innerText = '<select one>';
//
//
//class CreateTemplatedElementsService {
//
//  constructor(autoPlace, bpmnFactory, canvas, commandStack, create, elementFactory, elementTemplates, eventBus) {
//    this.autoPlace = autoPlace;
//    this.bpmnFactory = bpmnFactory;
//    this.canvas = canvas;
//    this.commandStack = commandStack;
//    this.create = create;
//    this.elementFactory = elementFactory;
//    this.elementTemplates = elementTemplates;
//    this.eventBus = eventBus;
//
//    this._elementTemplates = [];
//
//    this.init();
//  }
//
//
//  init() {
//    this._registerEventListener((event, element) => {
//      this.updateElementTemplates();
//      this._createDropdown(event);
//      this._registerCreateTemplateAction(event, element);
//    });
//  }
//
//  updateElementTemplates() {
//    const {
//      elementTemplates
//    } = this;
//
//    const allElementTemplates = elementTemplates.getAll('*');
//
//    // only use element templates, which have one dedicated shapeType
//    this._elementTemplates = allElementTemplates.filter(
//      template => template.appliesTo.length === 1 && !UNSUPPORTED_TYPES.includes(template.appliesTo[0]));
//  }
//
//  _registerEventListener(func) {
//    const {
//      eventBus
//    } = this;
//
//    eventBus.once([ CREATE_ACTION, APPEND_ACTION ], function(event) {
//      const {
//        originEvent,
//        element
//      } = event;
//
//      func(originEvent, element);
//    });
//  }
//
//  _createDropdown(event) {
//    const {
//      eventBus
//    } = this;
//
//    const dropDownEle = domify__WEBPACK_IMPORTED_MODULE_0___default()(
//      `<div class="templates-palette-plugin"><label for="elementTemplates">Available Templates:</label>
//        <select id="elementTemplates"></select>
//      </div>`);
//
//    const select = dropDownEle.querySelector('select');
//
//    select.appendChild(emptyOption);
//
//    this._elementTemplates.forEach((template) => {
//      const option = domify__WEBPACK_IMPORTED_MODULE_0___default()(`<option value="${template.id}">${template.name}</option>`);
//
//      select.appendChild(option);
//    });
//
//    event.delegateTarget.appendChild(dropDownEle);
//
//    eventBus.once([ 'element.click', 'create.init' ], (context) => {
//      dropDownEle.remove();
//
//      this.init();
//    });
//  }
//
//  _registerCreateTemplateAction(event, element) {
//    const {
//      canvas
//    } = this;
//
//    const select = canvas._container.querySelector('.templates-palette-plugin select');
//    select.addEventListener('change', () => this._createTemplatedElement(event, element, select.value));
//  }
//
//  _createTemplatedElement(event, element, templateId) {
//    const {
//      autoPlace,
//      commandStack,
//      create,
//      elementFactory
//    } = this;
//
//    const action = event.delegateTarget.getAttribute('data-action');
//
//    const template = this._elementTemplates.find(temp => temp.id === templateId),
//          type = template.appliesTo[0];
//
//    const shape = elementFactory.createShape({ type });
//
//    commandStack.execute('propertiesPanel.camunda.changeTemplate', {
//      element: shape,
//      newTemplate: template
//    });
//
//    if (action === CREATE_ACTION) {
//      create.start(event, shape);
//    } else if (action === APPEND_ACTION) {
//      autoPlace.append(element, shape);
//    }
//
//  }
//
//}
//
//CreateTemplatedElementsService.$inject = [
//  'autoPlace',
//  'bpmnFactory',
//  'canvas',
//  'commandStack',
//  'create',
//  'elementFactory',
//  'elementTemplates',
//  'eventBus'
//];
//
//
///***/ }),
//
///***/ "./client/bpmn-js-extension/PaletteExtension.js":
///*!******************************************************!*\
//  !*** ./client/bpmn-js-extension/PaletteExtension.js ***!
//  \******************************************************/
///***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
//
//"use strict";
//__webpack_require__.r(__webpack_exports__);
///* harmony export */ __webpack_require__.d(__webpack_exports__, {
///* harmony export */   "default": () => (/* binding */ PaletteExtension)
///* harmony export */ });
///* harmony import */ var _TemplateSymbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TemplateSymbol */ "./client/bpmn-js-extension/TemplateSymbol.js");
//
//
//
////class PaletteExtension {
////  constructor(eventBus, palette, translate) {
////    this.eventBus = eventBus;
////    this.translate = translate;
////
////    palette.registerProvider(this);
////  }
////
////  getPaletteEntries(element) {
////    const {
////      eventBus,
////      translate
////    } = this;
////
////    function createFromElementTemplate() {
////      return function(event) {
////
////        eventBus.fire('templates-palette-plugin.create-from-element-template', { originEvent: event });
////      };
////    }
////
////    return {
////      'templates-palette-plugin.create-from-element-template': {
////        group: 'extension',
////        imageUrl: _TemplateSymbol__WEBPACK_IMPORTED_MODULE_0__.TEMPLATE_SYMBOL,
////        title: translate('Create Task from Element Template'),
////        action: {
////          dragstart: createFromElementTemplate(),
////          click: createFromElementTemplate()
////        }
////      }
////    };
////  }
////}
////
////PaletteExtension.$inject = [
////  'eventBus',
////  'palette',
////  'translate'
////];
//
//class PaletteExtension {
//	  constructor(eventBus, palette, translate,bpmnFactory, create, elementFactory) {
//	    this.eventBus = eventBus;
//	    this.translate = translate;
//	    
//	    this.bpmnFactory = bpmnFactory;
//	    this.create = create;
//	    this.elementFactory = elementFactory;
//	   
//
//	    palette.registerProvider(this);
//	  }
//
//	  getPaletteEntries(element) {
//	    const {
//	      eventBus,
//	      translate,
//	      bpmnFactory,
//	      create,
//	      elementFactory,
//	      
//	    } = this;
//
//	    function createFromElementTemplate() {
//	      return function(event) {
//
//	        eventBus.fire('templates-palette-plugin.create-from-element-template', { originEvent: event });
//	      };
//	    }
//	    
//	    function createTask() {
//	        return function(event) {
//
//	            //console.log(event.type+"taskkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
//
//	            const businessObject = bpmnFactory.create('bpmn:Task');
//	            // businessObject['custom'] = 1
//
//	            // const businessObject1 = bpmnFactory.create('bpmn:BoundaryEvent');
//
//	            const shape = elementFactory.createShape({
//	                type: 'bpmn:Task',
//	                businessObject,
//	                
//	            });
//	           // console.log(shape) // 只在拖动或者点击时触发
//	            create.start(event, shape);
//	        
//
//	        }
//	    }
//
//	    return {
//	      'templates-palette-plugin.create-from-element-template': {
//	        group: 'extension',
//	        imageUrl: _TemplateSymbol__WEBPACK_IMPORTED_MODULE_0__.TEMPLATE_SYMBOL,
//	        title: translate('Create Task from Element Template'),
//	        action: {
//	          dragstart: createFromElementTemplate(),
//	          click: createFromElementTemplate()
//	        }
//	      },
//	      
//	      'create.sensor-task': {
//	          group: 'extension',
//	          className: 'icon-custom sensor-task',
//	          // className: 'bpmn-icon-user-task',
//	          title: translate('这是一个传感器类型任务节点'),
//	          action: {
//	              dragstart: createTask(),
//	              click: createTask()
//	          }
//	      },
//	      
//	    };
//	  }
//	}
//
//	PaletteExtension.$inject = [
//	  'eventBus',
//	  'palette',
//	  'translate',
//	  
//	  'bpmnFactory',
//	  'create',
//	  'elementFactory',
//	  
//	];
//
//
///***/ }),
//
///***/ "./client/bpmn-js-extension/TemplateSymbol.js":
///*!****************************************************!*\
//  !*** ./client/bpmn-js-extension/TemplateSymbol.js ***!
//  \****************************************************/
///***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
//
//"use strict";
//__webpack_require__.r(__webpack_exports__);
///* harmony export */ __webpack_require__.d(__webpack_exports__, {
///* harmony export */   "TEMPLATE_SYMBOL": () => (/* binding */ TEMPLATE_SYMBOL)
///* harmony export */ });
//const TEMPLATE_SYMBOL = 'data:image/png;base64,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';
//
//
///***/ }),
//
///***/ "./client/bpmn-js-extension/index.js":
///*!*******************************************!*\
//  !*** ./client/bpmn-js-extension/index.js ***!
//  \*******************************************/
///***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
//
//"use strict";
//__webpack_require__.r(__webpack_exports__);
///* harmony export */ __webpack_require__.d(__webpack_exports__, {
///* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
///* harmony export */ });
///* harmony import */ var _ContextPadExtension__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ContextPadExtension */ "./client/bpmn-js-extension/ContextPadExtension.js");
///* harmony import */ var _CreateTemplatedElementsService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CreateTemplatedElementsService */ "./client/bpmn-js-extension/CreateTemplatedElementsService.js");
///* harmony import */ var _PaletteExtension__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PaletteExtension */ "./client/bpmn-js-extension/PaletteExtension.js");
//
//
//
//
///* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
//  __init__: [ 'contextPadExtension', 'createTemplatedElementsService', 'paletteExtension' ],
//  contextPadExtension: [ 'type', _ContextPadExtension__WEBPACK_IMPORTED_MODULE_0__.default ],
//  createTemplatedElementsService: [ 'type', _CreateTemplatedElementsService__WEBPACK_IMPORTED_MODULE_1__.default ],
//  paletteExtension: [ 'type', _PaletteExtension__WEBPACK_IMPORTED_MODULE_2__.default]
//});
//
//
///***/ }),
//
///***/ "./node_modules/camunda-modeler-plugin-helpers/index.js":
///*!**************************************************************!*\
//  !*** ./node_modules/camunda-modeler-plugin-helpers/index.js ***!
//  \**************************************************************/
///***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
//
//"use strict";
//__webpack_require__.r(__webpack_exports__);
///* harmony export */ __webpack_require__.d(__webpack_exports__, {
///* harmony export */   "registerClientPlugin": () => (/* binding */ registerClientPlugin),
///* harmony export */   "registerBpmnJSPlugin": () => (/* binding */ registerBpmnJSPlugin),
///* harmony export */   "registerBpmnJSModdleExtension": () => (/* binding */ registerBpmnJSModdleExtension),
///* harmony export */   "getModelerDirectory": () => (/* binding */ getModelerDirectory),
///* harmony export */   "getPluginsDirectory": () => (/* binding */ getPluginsDirectory)
///* harmony export */ });
///**
// * Validate and register a client plugin.
// *
// * @param {Object} plugin
// * @param {String} type
// */
//function registerClientPlugin(plugin, type) {
//  var plugins = window.plugins || [];
//  window.plugins = plugins;
//
//  if (!plugin) {
//    throw new Error('plugin not specified');
//  }
//
//  if (!type) {
//    throw new Error('type not specified');
//  }
//
//  plugins.push({
//    plugin: plugin,
//    type: type
//  });
//}
//
///**
// * Validate and register a bpmn-js plugin.
// *
// * @param {Object} module
// *
// * @example
// *
// * import {
// *   registerBpmnJSPlugin
// * } from 'camunda-modeler-plugin-helpers';
// *
// * const BpmnJSModule = {
// *   __init__: [ 'myService' ],
// *   myService: [ 'type', ... ]
// * };
// *
// * registerBpmnJSPlugin(BpmnJSModule);
// */
//function registerBpmnJSPlugin(module) {
//  registerClientPlugin(module, 'bpmn.modeler.additionalModules');
//}
//
///**
// * Validate and register a bpmn-moddle extension plugin.
// *
// * @param {Object} descriptor
// *
// * @example
// * import {
// *   registerBpmnJSModdleExtension
// * } from 'camunda-modeler-plugin-helpers';
// *
// * var moddleDescriptor = {
// *   name: 'my descriptor',
// *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
// *   prefix: 'mydesc',
// *
// *   ...
// * };
// *
// * registerBpmnJSModdleExtension(moddleDescriptor);
// */
//function registerBpmnJSModdleExtension(descriptor) {
//  registerClientPlugin(descriptor, 'bpmn.modeler.moddleExtension');
//}
//
///**
// * Return the modeler directory, as a string.
// *
// * @deprecated Will be removed in future Camunda Modeler versions without replacement.
// *
// * @return {String}
// */
//function getModelerDirectory() {
//  return window.getModelerDirectory();
//}
//
///**
// * Return the modeler plugin directory, as a string.
// *
// * @deprecated Will be removed in future Camunda Modeler versions without replacement.
// *
// * @return {String}
// */
//function getPluginsDirectory() {
//  return window.getPluginsDirectory();
//}
//
///***/ }),
//
///***/ "./node_modules/domify/index.js":
///*!**************************************!*\
//  !*** ./node_modules/domify/index.js ***!
//  \**************************************/
///***/ ((module) => {
//
//
///**
// * Expose `parse`.
// */
//
//module.exports = parse;
//
///**
// * Tests for browser support.
// */
//
//var innerHTMLBug = false;
//var bugTestDiv;
//if (typeof document !== 'undefined') {
//  bugTestDiv = document.createElement('div');
//  // Setup
//  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
//  // Make sure that link elements get serialized correctly by innerHTML
//  // This requires a wrapper element in IE
//  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
//  bugTestDiv = undefined;
//}
//
///**
// * Wrap map from jquery.
// */
//
//var map = {
//  legend: [1, '<fieldset>', '</fieldset>'],
//  tr: [2, '<table><tbody>', '</tbody></table>'],
//  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
//  // for script/link/style tags to work in IE6-8, you have to wrap
//  // in a div with a non-whitespace character in front, ha!
//  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
//};
//
//map.td =
//map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];
//
//map.option =
//map.optgroup = [1, '<select multiple="multiple">', '</select>'];
//
//map.thead =
//map.tbody =
//map.colgroup =
//map.caption =
//map.tfoot = [1, '<table>', '</table>'];
//
//map.polyline =
//map.ellipse =
//map.polygon =
//map.circle =
//map.text =
//map.line =
//map.path =
//map.rect =
//map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];
//
///**
// * Parse `html` and return a DOM Node instance, which could be a TextNode,
// * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
// * instance, depending on the contents of the `html` string.
// *
// * @param {String} html - HTML string to "domify"
// * @param {Document} doc - The `document` instance to create the Node for
// * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
// * @api private
// */
//
//function parse(html, doc) {
//  if ('string' != typeof html) throw new TypeError('String expected');
//
//  // default to the global `document` object
//  if (!doc) doc = document;
//
//  // tag name
//  var m = /<([\w:]+)/.exec(html);
//  if (!m) return doc.createTextNode(html);
//
//  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace
//
//  var tag = m[1];
//
//  // body support
//  if (tag == 'body') {
//    var el = doc.createElement('html');
//    el.innerHTML = html;
//    return el.removeChild(el.lastChild);
//  }
//
//  // wrap map
//  var wrap = Object.prototype.hasOwnProperty.call(map, tag) ? map[tag] : map._default;
//  var depth = wrap[0];
//  var prefix = wrap[1];
//  var suffix = wrap[2];
//  var el = doc.createElement('div');
//  el.innerHTML = prefix + html + suffix;
//  while (depth--) el = el.lastChild;
//
//  // one element
//  if (el.firstChild == el.lastChild) {
//    return el.removeChild(el.firstChild);
//  }
//
//  // several elements
//  var fragment = doc.createDocumentFragment();
//  while (el.firstChild) {
//    fragment.appendChild(el.removeChild(el.firstChild));
//  }
//
//  return fragment;
//}
//
//
///***/ })
//
///******/ 	});
///************************************************************************/
///******/ 	// The module cache
///******/ 	var __webpack_module_cache__ = {};
///******/ 	
///******/ 	// The require function
///******/ 	function __webpack_require__(moduleId) {
///******/ 		// Check if module is in cache
///******/ 		var cachedModule = __webpack_module_cache__[moduleId];
///******/ 		if (cachedModule !== undefined) {
///******/ 			return cachedModule.exports;
///******/ 		}
///******/ 		// Create a new module (and put it into the cache)
///******/ 		var module = __webpack_module_cache__[moduleId] = {
///******/ 			// no module.id needed
///******/ 			// no module.loaded needed
///******/ 			exports: {}
///******/ 		};
///******/ 	
///******/ 		// Execute the module function
///******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
///******/ 	
///******/ 		// Return the exports of the module
///******/ 		return module.exports;
///******/ 	}
///******/ 	
///************************************************************************/
///******/ 	/* webpack/runtime/compat get default export */
///******/ 	(() => {
///******/ 		// getDefaultExport function for compatibility with non-harmony modules
///******/ 		__webpack_require__.n = (module) => {
///******/ 			var getter = module && module.__esModule ?
///******/ 				() => (module['default']) :
///******/ 				() => (module);
///******/ 			__webpack_require__.d(getter, { a: getter });
///******/ 			return getter;
///******/ 		};
///******/ 	})();
///******/ 	
///******/ 	/* webpack/runtime/define property getters */
///******/ 	(() => {
///******/ 		// define getter functions for harmony exports
///******/ 		__webpack_require__.d = (exports, definition) => {
///******/ 			for(var key in definition) {
///******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
///******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
///******/ 				}
///******/ 			}
///******/ 		};
///******/ 	})();
///******/ 	
///******/ 	/* webpack/runtime/hasOwnProperty shorthand */
///******/ 	(() => {
///******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
///******/ 	})();
///******/ 	
///******/ 	/* webpack/runtime/make namespace object */
///******/ 	(() => {
///******/ 		// define __esModule on exports
///******/ 		__webpack_require__.r = (exports) => {
///******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
///******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
///******/ 			}
///******/ 			Object.defineProperty(exports, '__esModule', { value: true });
///******/ 		};
///******/ 	})();
///******/ 	
///************************************************************************/
//var __webpack_exports__ = {};
//// This entry need to be wrapped in an IIFE because it need to be in strict mode.
//(() => {
//"use strict";
///*!*************************!*\
//  !*** ./client/index.js ***!
//  \*************************/
//__webpack_require__.r(__webpack_exports__);
///* harmony import */ var camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! camunda-modeler-plugin-helpers */ "./node_modules/camunda-modeler-plugin-helpers/index.js");
///* harmony import */ var _bpmn_js_extension__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bpmn-js-extension */ "./client/bpmn-js-extension/index.js");
//
//
//
//
//(0,camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__.registerBpmnJSPlugin)(_bpmn_js_extension__WEBPACK_IMPORTED_MODULE_1__.default);
//
//})();
//
///******/ })()
//;
////# sourceMappingURL=client.js.map
////;
