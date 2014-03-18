/*------------------------------------------------
* CSS属性选择器
* 相关的核心API getElementsByTagName querySelectorAll
* 
*------------------------------------------------*/

/*
* *[title]{} 包含标题(title)的所有元素
* a[href]{} 对href属性的a元素应用样式
* a[href][title]{} 将同时有href和title属性的a元素应用样式
* [attribute=value] 选取带有指定属性值的每个元素
* [attribute~=value] 选取带有指定词汇的每个元素
* [attribute|=value] 选取指定属性值开头的所有元素，但必须是整个单词，后面可以跟-号
* [attribute^=value] 选取指定属性值开头的所有元素
* [attribute$=value] 选取指定属性值结尾的每个元素
* [attribute*=value] 选取包含属性指定值的每个元素
* [attribute!=value] 选取不等于指定属性值的每一个元素 jquery里面的
*/
// 调用方法 getAttr.run();
;({
    Reg:{}, // 缓存正则 由于重复匹配可以提升性能
    init:function(){
        var that=this;
        window.getAttr=(function(){
            return that.method();
        }());
    },
    method:function(){
        var that=this;
        return {
            run:function(){
                if(that.Reg.reg){
                    reg=that.Reg.reg;
                }else{
                    var reg=/([\*a-zA-Z1-6]*)?(\[(\w+)\s*(\^|\$|\*|\||~|!)?=?\s*([\w\u00C0-\uFFFF\s\-_\.]+)?\])?/;
                    that.Reg['reg']=reg;
                }
                var node=arguments[1] || document,
                    search=arguments[0],
                    str=search.match(reg),
                    tag=str[1],// 属性选择器假如为e[k=v]形式 tag为e
                    key=str[3],// 属性选择器假如为e[k=v]形式 key为k
                    type=str[4]+'=',// 属性选择器假如为e[k=v]形式 type为符号
                    val=str[5],// 属性选择器假如为e[k=v]形式 val为v
                    arr=[],
                    attr,
                    i,
                    value,
                    elem=node.getElementsByTagName(tag),
                    len=elem.length;
                // 如果支持 IE8+以上都支持
                if((!!document.querySelectorAll) && type != "!="){
                    value = document.querySelectorAll(search);
                    for(var i=0,length = value.length;i < length;i++){
                        arr.push(value[i]);
                    }
                    return arr;
                }
                for(i=0;i<len;i++){
                    attr=elem[i];
                    value=attr[key];
                    if(typeof value==='string'){
                        if(!value===false){
                            var where=false;
                            if(type==='*='){
                                where=(value.indexOf(val)>=0)?true:false;
                            }else if(type==='!='){
                                where=(value!=val)?true:false;// 将会选取所有属性值不等于条件值的元素 例: 条件值a title="a b" title="a" 将会选取title="a b"
                            }else if(type==='^='){
                                where=(value.indexOf(val)===0)?true:false;// 选取以xx开头的所有元素
                            }else if(type==='$='){
                                (function(a,b){
                                    var i=b.length;
                                    where=(a.slice(-i)===b)?true:false;// 选取以xx结尾的所有元素
                                }(value,val));
                            }else if(type==='~='){
                                where=((''+value+'').indexOf(val)>=0)?true:false;// 选取指定词汇的元素
                            }else if(type==='|='){//匹配属性值为XX或以XX-打头的元素
                                where=( (value===val) ||value.substring(0,val.length+1)===(val+'-') )?true:false;
                            }else if(type==='='){
                                where=(value===val)?true:false;
                            }
                            where && arr.push(attr);
                        }
                    }
                }
                return arr;
            }
        }
    }
}).init();