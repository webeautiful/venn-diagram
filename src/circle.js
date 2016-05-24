import {extend} from 'lodash'
import util from './util'

class Circle {
    constructor(options) {
        this.options = extend({
            domId: 'circle',
            width: 100,
            height: 100,
            x: 50,
            y: 50,
            radius: 50,
            startRad: 0,
            endRad: 2*Math.PI,
            anticlockwise: false
        }, options)
        this.canvas = document.getElementById(this.options.domId)
        this.ctx =  this.canvas.getContext('2d')
        this._init()
    }

    showCircle(type) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        if (type === 'disc') {
            this._drawDisc()
        } else if (type === 'hollow') {
            this._drawHollowCircle()
        } else {
            this._drawCombination()
        }
    }

    _init() {
        this.canvas.width = this.options.width
        this.canvas.height = this.options.height

        this.showCircle()
        //event
        this._bindEvent()
    }

    _bindEvent() {
        this.canvas.addEventListener('mousemove', this._doMouseOver.bind(this) , false)
    }

    _doMouseOver(event) {
        const mousePos = util.getMousePos(this.canvas, event)
        const circle = {x: this.options.x, y: this.options.y, r: this.options.radius}
        const isInner = util.isInCircle(circle, mousePos)
        if (isInner) {
        }
    }

    //hollow circle
    _drawHollowCircle() {
        const ctx = this.ctx
        ctx.beginPath()
        ctx.arc(this.options.x, this.options.y, this.options.radius, this.options.startRad, this.options.endRad)
        ctx.lineWidth = 3
        ctx.strokeStyle = 'green'
        ctx.stroke()//画空心圆
        ctx.closePath()
    }

    //disc
    _drawDisc() {
        const ctx = this.ctx
        ctx.beginPath()
        ctx.arc(this.options.x, this.options.y, this.options.radius, this.options.startRad, this.options.endRad)
        ctx.fillStyle="red"//填充颜色,默认是黑色
        ctx.fill()//画实心圆
        ctx.closePath()
    }

    //concentric circles
    _drawCombination() {
        const ctx = this.ctx
        ctx.beginPath()
        ctx.arc(this.options.x, this.options.y, this.options.radius-10, this.options.startRad, this.options.endRad)
        ctx.fillStyle="red"
        ctx.closePath()
        ctx.fill()
        ctx.beginPath()
        ctx.arc(this.options.x, this.options.y, this.options.radius, this.options.startRad, this.options.endRad)
        ctx.lineWidth = 10
        ctx.strokeStyle = 'green'
        ctx.stroke()
        ctx.closePath()
    }

}

export default Circle
