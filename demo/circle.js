import $ from 'jquery';
import Circle from '../src/circle'

const circle = new Circle({
    domId: 'circle',
    width: 200,
    height: 200,
    x: 100,
    y: 100,
    radius: 50,
    startRad: 0,
    endRad: 2*Math.PI
})

$(function(){
    //event
    $('.select').click(function(){
        let $this = $(this)
        let name = $this.data('name')
        circle.showCircle(name)
    })
})
