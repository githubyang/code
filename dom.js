// 简单实现class选择器
;({
    selector:null,
    init:function(){
        var that=this;
        if(document.getElementsByClassName){
            that.selector=1;
        }
        window.dom=(function(){
            return that.method();
        }());
    },
    method:function(){
        var that=this;
        return {
            className:function(){
                var args=Array.prototype.slice.call(arguments),
                    arr=[],
                    i=0,
                    a,
                    b,
                    n,
                    tag=args[1]||'*',
                    reg,
                    className;
                if(args===false){return;}
                if(that.selector){
                    a=document.getElementsByClassName(args[0]);
                    n=a.length;
                    for(;i<n;i++){
                        arr.push(a[i]);
                    }
                    return arr;
                }else{
                    classNmae=args[0].replace('/\-/','\\-');
                    reg=new RegExp('(^|\\s)'+classNmae+'(\\s|$)');
                    a=document.getElementsByTagName(tag);
                    n=a.length;
                    for(;i<n;i++){
                        b=a[i];
                        if(reg.test(b.className)){
                            arr.push(b);
                        }
                    }
                    return arr;
                }
            }
        }
    }
}).init();
// 调用方法
alert(dom.className('wo'));