import { TEMPLATE_SYMBOL } from './TemplateSymbol';


export default class PaletteExtension {
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

//    function createFromElementTemplate() {
//      return function(event) {
//
//        eventBus.fire('templates-palette-plugin.create-from-element-template', { originEvent: event });
//      };
//      
//    }
    
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
//                console.log(event.type+"eventt")
                const businessObject1 = bpmnFactory.create('bpmn:ParallelGateway');
                //businessObject1['custom'] = 1
                const shape1 = elementFactory.createShape({
                    type: 'bpmn:ParallelGateway',
                    
                    businessObject1
                });
//                console.log(shape1) // 只在拖动或者点击时触发
                create.start(event, shape1);
        }
    }

        function createGateway2() {
            return function(event) {
                
                    
                    //添加的新元素
//                    console.log(event.type+"eventt")
                    const businessObject1 = bpmnFactory.create('bpmn:ComplexGateway');
                    //businessObject1['custom'] = 1
                    const shape1 = elementFactory.createShape({
                        type: 'bpmn:ComplexGateway',
                        
                        businessObject1
                    });
//                    console.log(shape1) // 只在拖动或者点击时触发
                    create.start(event, shape1);
            }
        }

        function createGateway3() {
            return function(event) {
                
                    
                    //添加的新元素
//                    console.log(event.type+"eventt")
                    const businessObject1 = bpmnFactory.create('bpmn:InclusiveGateway');
                    //businessObject1['custom'] = 1
                    const shape1 = elementFactory.createShape({
                        type: 'bpmn:InclusiveGateway',
                        
                        businessObject1
                    });
//                    console.log(shape1) // 只在拖动或者点击时触发
                    create.start(event, shape1);
            }
        }

        function createEvent1() {
            return function(event) {
               
                
                //添加的新元素
//                console.log(event.type+"eventtttttttttttttttttttttttttttttttttttttttttttttttttt")
                const businessObject1 = bpmnFactory.create('bpmn:IntermediateThrowEvent');
                //businessObject1['custom'] = 1
                const shape1 = elementFactory.createShape({
                    type: 'bpmn:IntermediateThrowEvent',
                    
                    businessObject1
                });
//                console.log(shape1) // 只在拖动或者点击时触发
                create.start(event, shape1);


            }
        }

        function createEvent2() {
            return function(event) {
               
                
                //添加的新元素
//                console.log(event.type+"eventtttttttttttttttttttttttttttttttttttttttttttttttttt")
                const businessObject1 = bpmnFactory.create('bpmn:IntermediateCatchEvent');
                //businessObject1['custom'] = 1
                const shape1 = elementFactory.createShape({
                    type: 'bpmn:IntermediateCatchEvent',
                    
                    businessObject1
                });
//                console.log(shape1) // 只在拖动或者点击时触发
                create.start(event, shape1);


            }
        }

        function createEvent3() {
            return function(event) {
               
                
                //添加的新元素
//                console.log(event.type+"eventt")
                const businessObject1 = bpmnFactory.create('bpmn:BusinessRuleTask');
                //businessObject1['custom'] = 1
                const shape1 = elementFactory.createShape({
                    type: 'bpmn:BusinessRuleTask',
                    
                    businessObject1
                });
//                console.log(shape1) // 只在拖动或者点击时触发
                create.start(event, shape1);


            }
        }
        
        function createEvent4() {
            return function(event) {
               
                
                //添加的新元素
//                console.log(event.type+"eventt")
                const businessObject1 = bpmnFactory.create('bpmn:ScriptTask');
                //businessObject1['custom'] = 1
                const shape1 = elementFactory.createShape({
                    type: 'bpmn:ScriptTask',
                    
                    businessObject1
                });
//                console.log(shape1) // 只在拖动或者点击时触发
                create.start(event, shape1);


            }
        }

    return {
      'templates-palette-plugin.create-from-element-template': {
        group: 'extension',
        imageUrl: _TemplateSymbol__WEBPACK_IMPORTED_MODULE_0__.TEMPLATE_SYMBOL,
        title: translate('Create Task from Element Template'),
        action: {
          dragstart: createFromElementTemplate(),
          click: createFromElementTemplate()
        }
      },
      
      'create.sensor-task': {
          group: 'extension',
          className: 'icon-custom sensor-task',
          // className: 'bpmn-icon-user-task',
          title: translate('这是一个传感器类型任务节点'),
          action: {
              dragstart: createTask(),
              click: createTask()
          }
      },
      
      'create.image-task': {
          group: 'extension',
          className: 'icon-custom image-task',
          // className: 'bpmn-icon-user-task',
          title: translate('这是一个图像捕获类型节点'),
          action: {
              dragstart: createEvent1(),
              click: createEvent1()      //关键点！！！！！！！！！！！！！！！！
      }
  
  },

	  'create.extension': {
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
