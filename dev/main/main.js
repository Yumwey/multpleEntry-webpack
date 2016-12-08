var dia;
//dialog模块
require('../../css/main.css');


class Dialog {
    constructor(props) {
        this.title = props;
    }
    render(cont) {
        alert(cont);
    }
    handle() {
        //输出当前页面用到的标签：某大厂高级别面试题,网上无答案，装个b..
        var alls = document.all
                , base =this
                , bf = document.getElementById('bottom-show')
                , arr = new Array()
                , i
                , finalArr = [];
        for (i of Object.keys(alls)){
            alls[i].nodeName && arr.push(alls[i].nodeName);
        }
        finalArr = new Set(arr);
        //实现方法二:ES6语法
        //var ps = document.all;
        //var simple = new Set([...ps]);
        //var outNum = [...simple];
        bf.addEventListener('click', function () {
            base.render(base.title + [...finalArr].join(','));
        }, false);
    }
}
dia = new Dialog('当前页面节点：');
dia.handle();
