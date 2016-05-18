import _ from 'lodash'

class Circle{
    constructor(options){
        this.options = _.extend({
            domId: 'circle',
            x: 100,
            y: 100,
            radius: 50,
            startRad: 0,
            endRad: 2*Math.PI,
            anticlockwise: false
        }, options)
        this.canvas = document.getElementById(this.options.domId)
        this.ctx =  this.canvas.getContext('2d')
        const ctx = this.ctx
        ctx.beginPath()
        ctx.arc(this.options.x, this.options.y, this.options.radius, this.options.startRad, this.options.endRad)
        ctx.stroke()
    }
}

export default Circle
