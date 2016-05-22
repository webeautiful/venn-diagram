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

//文件分离: https://segmentfault.com/a/1190000003985802
require.ensure(['jquery'], require => {
    let $ = require('jquery')
    $(function(){
        //event
        $('.select').click(function(){
            let $this = $(this)
            let name = $this.data('name')
            circle.showCircle(name)
        })
    })
})
