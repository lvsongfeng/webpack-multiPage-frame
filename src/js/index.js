import { commonText } from '../utils/index'
import '../less/common/common.less'
_.forEach([1,2,3,4], (item) => {
    console.log('index.js' + item)
})
console.log(commonText)
require('../less/index.less')
console.log($('#login').html())
 var loginTpl = require('../handlebars/login.handlebars')
$('#login').click(function(){
    var div = document.createElement('div')
    div.innerHTML = loginTpl({
        name:'login dialog handlebars haha!!'
    })
    $('body').prepend(div)
})

