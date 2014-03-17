// 简单的事件机制 绑定基本的事件 可跨浏览器
;({
    init:function(){
        var that=this;
        window.Dom=(function(){
            return that.method();
        }());
    },
    method:function(){
        var that=this;
        return {
            run:function(elem,type,handler){
                if(!elem.events){
                    elem.events={};
                }
                var handlers=elem.events[type];
                if(!handlers){
                    handlers=elem.events[type]=[];
                    if(elem['on'+type]){
                        handlers[0]=elem['on'+type];
                    }
                }
                handlers[0]=handler;
                elem['on'+type]=that.handlerEvent;
            },
            remove:function(elem,type){
                elem.events[type]=null;
            }
        }
    },
    handlerEvent:function(event){
        event=event || fixEvent(window.event);
        var handlers=this.events[event.type];
        if(handlers!==null){
            handlers[0](event);
        }
    },
    fixEvent:function(event){
        var that=this;
        event.preventDefault=that.preventDefault;
        event.stopPropagation=that.stopPropagation;
        return event;
    },
    preventDefault:function(){
        window.event.returnValue=false;
    },
    stopPropagation:function(){
        window.event.cancelBubble=true;
    }
}).init();