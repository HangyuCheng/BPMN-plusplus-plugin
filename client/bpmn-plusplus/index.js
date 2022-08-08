import ContextPadExtension from './ContextPadExtension';
import CreateTemplatedElementsService from './CreateTemplatedElementsService';
import PaletteExtension from './PaletteExtension';
import RenderExtension from './RenderExtension';

export default {
  __init__: [ 'contextPadExtension', 'createTemplatedElementsService', 'paletteExtension', 'renderExtension' ],
  contextPadExtension: [ 'type', ContextPadExtension ],
  createTemplatedElementsService: [ 'type', CreateTemplatedElementsService ],
  paletteExtension: [ 'type', PaletteExtension],
  renderExtension: [ 'type', RenderExtension]

};
