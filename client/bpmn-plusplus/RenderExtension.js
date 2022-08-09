import BaseRenderer from '../node_modules/diagram-js/lib/draw/BaseRenderer';
//import inherits from 'inherits';

import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate
} from 'tiny-svg';
import { customElements, customConfig, hasLabelElements } from './util'
import { is } from '../node_modules/bpmn-js/lib/util/ModelUtil.js';

const HIGH_PRIORITY = 1500

export default class RenderExtension extends BaseRenderer {
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