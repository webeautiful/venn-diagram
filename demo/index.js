import VennDiagram from '../src/index'

const venn = new VennDiagram({
  domId: 'venn-diagram',
  //showDirectionLine: false,
  //hoverHighlight: false,
  //hoverScale: false,
  //showMainText: false,
  //debug: false,
  //showOutline: true,
  onHoverChanged: function() {},
  onSelectionChanged: function() {},
  preventSelect: function() {}
})
