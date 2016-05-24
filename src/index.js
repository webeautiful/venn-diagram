/**
 * @name Canvas Venn Diagram
 * @description venn diagram composed by seven sections which are intersected with three circles
   each section can be hovered and clicked
 * @author jinlingxi@gmail.com

   about three circles
   circleOne: on the left top, represents business similarity
   circleTwo: on the right top, represents technology similarity
   circleThree: on the bottom, represents departments similarity

   about these seven sections:
   section 1: include circleOne, exclude circleTwo and circleThree
   section 2: include circleTwo, exclude circleOne and circleThree
   section 4: include circleThree, exclude circleOne and circleTwo
   section 3: include circleOne and circleTwo, exclude circleThree
   section 6: include circleTwo and circleThree, exclude circleOne
   section 5: include circleOne and circleThree, exclude circleTwo
   section 7: include circleOne and circleTwo and circleThree

 * @usage
   no params: const venn = VennDiagram()

   with params:
   const venn = VennDiagram({
            domId: 'venn-diagram',
            showDirectionLine: false,
            hoverHighlight: false,
            hoverScale: false,
            showMainText: false,
            debug: false,
            showOutline: true,
            onHoverChanged: function() {},
            onSelectionChanged: function() {},
            preventSelect: function() {}
        })

   debug: true, show all intersection points in the map. VennDiagram uses these points to draw the arcs
   showOutline: show outline around the diagram, default value is false
   onHoverChanged: function(sectionNumber) {}
   if sectionNumber is not valid, sectionNumber will be 0
   onSelectionChanged: function(currentSelections) {}
   preventSelect: its return value is used to decide whether selection should take effect

 * @methods
   venn.updateSections(newSections)
   newSections should be an array, which values should only be section number
   example newSections = [2,5]

   drawText(html, x, y, align)
   draw some html content on the canvas
   align is the attribute of text-align in css
 **/
import util from './util'
import _ from 'lodash'

// (x,y) is the center and r is the radius of the circle
const circleOne = {
  x: 197,
  y: 123,
  r: 114
}
const circleTwo = {
  x: 267,
  y: 158,
  r: 114
}
const circleThree = {
  x: 201,
  y: 200,
  r: 114
}

const CIRCLES = {
  1: circleOne,
  2: circleTwo,
  3: circleThree
}

const SECTIONS = {
  1: {
    rgb: [119, 173, 218],
    steps: [
      // [circleNumber, point1 number, point2 number, counterclockwise]
      [1, 3, 0, false],
      [2, 0, 5, true],
      [3, 5, 3, true]
    ],
    scale: {x: 1.02, y: 1.02},
    translateOffset: {x: -3, y: -3}, // TODO this  should be calculated dynamically
    center: {x: 144, y: 70} // TODO this  should be calculated dynamically
  }, // circleOne - circleTwo - circleThree
  2: {
    rgb: [141, 196, 79],
    steps: [
      // [circleNumber, point1 number, point2 number, counterclockwise]
      [2, 0, 4, false],
      [3, 4, 2, true],
      [1, 2, 0, true]
    ],
    scale: {x: 1.02, y: 1.02},
    translateOffset: {x: -8, y: -2},
    center: {x: 340, y: 144}
  }, // circleTwo - circleOne - circleThree
  4: {
    rgb: [114, 128, 188],
    steps: [
      // [circleNumber, point1 number, point2 number, counterclockwise]
      [3, 4, 3, false],
      [1, 3, 1, true],
      [2, 1, 4, true]
    ],
    scale: {x: 1.01, y: 1.01},
    translateOffset: {x: -3, y: -4},
    center: {x: 167, y: 275}
  }, // circleThree - circleOne - circleTwo
  3: {
    rgb: [79, 148, 199],
    steps: [
      // [circleNumber, point1 number, point2 number, counterclockwise]
      [1, 0, 2, false],
      [3, 2, 5, true],
      [2, 5, 0, false]
    ],
    scale: {x: 1.03, y: 1.03},
    translateOffset: {x: -8, y: -3},
    center: {x: 263, y: 82}
  }, // (circleOne & circleTwo) - circleThree
  6: {
    rgb: [116, 101, 150],
    steps: [
      // [circleNumber, point1 number, point2 number, counterclockwise]
      [3, 2, 4, false],
      [2, 4, 1, false],
      [1, 1, 2, true]
    ],
    scale: {x: 1.03, y: 1.03},
    translateOffset: {x: -10, y: -6},
    center: {x: 271, y: 243}
  }, // (circleTwo & circleThree) - circleOne
  5: {
    rgb: [93, 120, 181],
    steps: [
      // [circleNumber, point1 number, point2 number, counterclockwise]
      [1, 1, 3, false],
      [3, 3, 5, false],
      [2, 5, 1, true]
    ],
    scale: {x: 1.04, y: 1.04},
    translateOffset: {x: -8, y: -8},
    center: {x: 125, y: 175}
  }, // (circleOne & circleThree) - circleTwo
  7: {
    rgb: [71, 103, 146],
    steps: [
      // [circleNumber, point1 number, point2 number, counterclockwise]
      [1, 2, 1, false],
      [2, 1, 5, false],
      [3, 5, 2, false]
    ],
    scale: {x: 1.05, y: 1.05},
    translateOffset: {x: -13, y: -8},
    center: {x: 212, y: 170}
  }// circleOne & circleTwo & circleThree
}

class VennDiagram {
  constructor(options) {
    this.options = _.extend({
      domId: 'venn-diagram', // canvas domId
      width: 600,
      height: 600,
      showDirectionLine: true,
      hoverHighlight: true,
      disableHover: false,
      disableClick: false,
      showMainText: true,
      hoverScale: true,
      showOutline: false,
      onHoverChanged: _.noop,
      onSelectionChanged: _.noop,
      translate: {x: 0, y: 0}, // translate the whole canvas
      preventSelect: () => true,
      debug: false, // setting it to true will show the control points
      /*
       debugTarget: circle/section/canvas. default value is circle
       define the circles, sections or the whole canvas should be moved on mouse up
       */
      debugTarget: 'circle'
    }, options)
    this.canvas = document.getElementById(this.options.domId)
    this.ctx = this.canvas.getContext('2d')
    this.hoveredSection = 0
    this.selectedSections = []
    this._init()
  }

  updateSelected(newSelection) {
    const allowedSelections = _.map(_.keys(SECTIONS), item => Number(item))
    const selectedSections = _.filter(newSelection, (item) => {
      return _.includes(allowedSelections, item)
    })
    if (selectedSections.length !== this.selectedSections.length) {
      this.selectedSections = selectedSections
      this._drawAll()
      this.options.onSelectionChanged(selectedSections)
    }
  }

  drawText(text, x, y, align) {
    this.canvas.parentNode.style.position = 'relative'
    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.top = `${y}px`
    div.style.left = `${x}px`
    div.style.textAlign = align || 'left'
    div.style.fontWeight = '600'
    div.innerHTML = text
    this.canvas.parentNode.insertBefore(div, this.canvas.nextSibling)
  }

  _init() {
    this.canvas.style.width = `${this.options.width}px`
    this.canvas.style.height = `${this.options.height}px`
    this.canvas.width = this.options.width
    this.canvas.height = this.options.height
    this._drawAll()
    // draw text around the circle
    if (this.options.showMainText) {
      this._drawMainText()
    }
    if (this.options.showOutline) {
      this.canvas.classList.add('outline')
    }
    this._bindEvent()
  }

  _bindEvent() {
    if (!this.options.disableHover) {
      this.canvas.addEventListener('mousemove', this._doMouseOver.bind(this), false)
    }
    if (!this.options.disableClick) {
      this.canvas.addEventListener('click', this._doClick.bind(this), false)
    }
    if (this.options.debug) {
      window.addEventListener('keydown', (e) => {
        this._doKeyUp(e)
      }, false)
    }
  }

  _checkSelected(selectionId) {
    return _.indexOf(this.selectedSections, selectionId) > -1
  }

  // keyboard debug tools
  _doKeyUp(event) {
    let dx = 0
    let dy = 0
    const code = event.which || event.keyCode
    const keyCodeOffsetMap = {
      37: [-1, 0],
      39: [1, 0],
      38: [0, -1],
      40: [0, 1]
    }
    const target = this.options.debugTarget
    if (code in keyCodeOffsetMap) {
      [dx, dy] = keyCodeOffsetMap[event.keyCode]
      if (target === 'section') {
        this._moveCenter(dx, dy)
      } else if (target === 'circle') {
        this._moveCircle(dx, dy)
      } else if (target === 'canvas') {
        this._moveCanvas(dx, dy)
      }
    }
  }

  _doMouseOver(event) {
    const translate = this.options.translate
    const canvasPos = util.getMousePos(this.canvas, event)
    canvasPos.x -= translate.x
    canvasPos.y -= translate.y
    const point = {x: canvasPos.x, y: canvasPos.y}  
    const sectionId = util.detectShape(point, circleOne, circleTwo, circleThree)
    // section changed
    this._setHoveredSection(sectionId)
  }

  _doClick(event) {
    const translate = this.options.translate
    const canvasPos = util.getMousePos(this.canvas, event)
    canvasPos.x -= translate.x
    canvasPos.y -= translate.y
    const point = {x: canvasPos.x, y: canvasPos.y}  
    const sectionId = util.detectShape(point, circleOne, circleTwo, circleThree)
    if (sectionId < 1) {
      return
    }

    const index = _.indexOf(this.selectedSections, sectionId)
    // can not select any more, but can deselect
    if (index < 0 && this.options.preventSelect()) {
      return
    }
    if (index > -1) {
      this.selectedSections.splice(index, 1)
    } else {
      this.selectedSections.push(sectionId)
    }
    this._drawAll()
    this.options.onSelectionChanged(this.selectedSections)
  }

  // arc by two points on the border of a circle
  _arcFromP1toP2(ctx, circle, p1, p2, counterclockwise) {
    const rad1 = util.getRadByPoint(circle, p1)
    const rad2 = util.getRadByPoint(circle, p2)
    ctx.arc(circle.x, circle.y, circle.r, rad1, rad2, !!counterclockwise)
  }

  // draw a line from the section center to summary area on the right
  _drawLine(point) {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.moveTo(point.x, Number(point.y.toFixed(1)) + 0.5)
    this.ctx.lineTo(449, 58.5)
    this.ctx.lineTo(600, 58.5)
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = 'black'
    this.ctx.stroke()
    this.ctx.restore()
  }

  _drawMainText() {
    this.drawText('BUSINESS<br/>SIMILARITY', 9, 60, 'right')
    this.drawText('TECHNOLOGY<br/>SIMILARITY', 417, 104)
    this.drawText('DEPARTMENT<br/>SIMILARITY', 80, 330, 'center')
  }

  _showOriginPoint() {
    this.ctx.save()
    const point = this.options.translate
    const text = ['O', '(', point.x.toFixed(0), ',', point.y.toFixed(0), ')'].join('')
    this.ctx.fillRect(point.x, point.y, 2, 2)
    this.ctx.strokeText(text, point.x, point.y)
    this.ctx.restore()
  }

  _showSectionCenters() {
    this.ctx.save()
    for (const key in SECTIONS) {
      const section = SECTIONS[key]
      const point = section.center
      const text = [key, '(', point.x.toFixed(0), ',', point.y.toFixed(0), ')'].join('')
      this.ctx.fillRect(point.x, point.y, 2, 2)
      this.ctx.strokeText(text, point.x, point.y)
    }
    this.ctx.restore()
  }

  _showControlPoints(points) {
    const _points = _.concat(points, [circleOne, circleTwo, circleThree])
    this.ctx.save()
    _points.forEach((point, index) => {
      this.ctx.fillRect(point.x, point.y, 2, 2)
      const text = [index, '(', point.x.toFixed(0), ',', point.y.toFixed(0), ')'].join('')
      this.ctx.strokeText(text, point.x, point.y)
    })
    this.ctx.restore()
  }

  _drawAll() {
    const points = util.getAllInterSectionPoints(circleOne, circleTwo, circleThree)
    const translate = this.options.translate
    let drawOrder = [1, 2, 3, 4, 5, 6, 7]
    if (this.hoveredSection > 0) {
      drawOrder = _.filter(drawOrder, (item) => {
        return item !== this.hoveredSection
      })
      drawOrder.push(this.hoveredSection)
    }

    this.ctx.save()
    this.ctx.translate(translate.x, translate.y)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    _.forEach(drawOrder, (section) => {
      this._drawSection(section, points)
    })

    // draw hover line to summary
    if (this.options.showDirectionLine && this.hoveredSection > 0) {
      this._drawLine(SECTIONS[this.hoveredSection].center)
    }

    if (this.options.debug) {
      const target = this.options.debugTarget
      if (target === 'section') {
        this._showSectionCenters()
      } else if (target === 'circle') {
        this._showControlPoints(points)
      } else if (target === 'canvas') {
        this._showOriginPoint()
      }
    }
    this.ctx.restore()
  }

  _moveCanvas(dx, dy) {
    this.options.translate.x += dx
    this.options.translate.y += dy
    this._drawAll()
  }

  _moveCircle(dx, dy) {
    const section = _.last(this.selectedSections)
    const circleMap = {1: 1, 2: 2, 4: 3}
    if (_.includes([1, 2, 4], section)) {
      const index = circleMap[section]
      CIRCLES[index].x += dx
      CIRCLES[index].y += dy
      this._drawAll()
    }
  }

  // move center of each section
  _moveCenter(dx, dy) {
    const section = _.last(this.selectedSections)
    if (_.includes([1, 2, 4, 3, 5, 6, 7], section)) {
      SECTIONS[section].center.x += dx
      SECTIONS[section].center.y += dy
      this._drawAll()
    }
  }

  _drawSection(section, points) {
    const options = SECTIONS[section]
    const color = util.getRGBA(options.rgb)
    const selected = this._checkSelected(section)
    const orderNumber = _.indexOf(this.selectedSections, section) + 1
    const hover = this.hoveredSection === section
    const steps = options.steps
    const center = options.center
    // TODO use the following line instead
    // center = util.findCenterOfSection(section, points),
    const offset = options.translateOffset

    this.ctx.save()
    if (this.options.hoverScale && !selected && hover) {
      this.ctx.translate(offset.x, offset.y)
      this.ctx.scale(options.scale.x, options.scale.y)
    }
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    steps.forEach((item) => {
      this._arcFromP1toP2(this.ctx, CIRCLES[item[0]], points[item[1]],
        points[item[2]], item[3])
    })
    this.ctx.closePath()
    this.ctx.fill()

    if (this.options.hoverHighlight && hover) {
      this.ctx.strokeStyle = 'white'
      this.ctx.lineWidth = 2
      this.ctx.stroke()
    }

    // draw the order number when the section is selected, from 1
    if (selected) {
      // TODO use Proxima Nova instead if webfont for canvas is ok
      this.ctx.font = "30px Arial"
      this.ctx.fillStyle = "white"
      this.ctx.textAlign = "center"
      this.ctx.fillText(orderNumber, center.x, center.y)
    }
    this.ctx.restore()
  }

  _setHoveredSection(section) {
    // set cursor
    if (this.hoveredSection > 0 && section <= 0) {
      this._setCursor()
    } else if (this.hoveredSection <= 0 && section > 0) {
      this._setCursor('pointer')
    }

    if (this.hoveredSection !== section) {
      this.hoveredSection = section
      this._drawAll()
      this.options.onHoverChanged(section)
    }
  }

  _setCursor(name) {
    this.canvas.style.cursor = name || 'default'
  }
}

export default VennDiagram
