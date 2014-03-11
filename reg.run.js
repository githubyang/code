(function($,ajax){
    // 正则匹配
    var reg=function(s,n){
        var a=/^(13[0-9]|15[0|1|2|3|6|7|8|9]|18[6|8|9]|14[7])\d{8}$/,
            b=/(^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,3}$)/,
            c=/^[0-9a-zA-Z]{6,16}$/,
            d=/^[0-9]{4,8}/;
        if(n==1){return (a.test(s));} // 匹配号码
        if(n==2){return (b.test(s));} // 匹配邮箱
        if(n==3){return (c.test(s));} // 匹配6-16位字母和数字密码
        if(n==4){return (d.test(s));} // 匹配验证码个数
    },
    // 60秒倒计时计数器
    time=function(n){
        var total=n,
            fn=function(){
                if(total>0){
                    total-=1;
                    setTimeout(fn,1000);
                }else{
                    $("#idcode").hide();
                    $("#id8").show();
                }
            };
        setTimeout(fn,0);
    },
    // 回调隐藏
    fnDis=function(a,b){
        $(a).hide();
        $(b).hide();
    },
    // 处理通信完毕之后的回调
    callback={
        name:function(data,c){
            var obj=$(c),
                n=parseInt(data,10);
            if(n===1){
                obj.html("恭喜,用户名可以用");
                obj.show();
            }else{
                obj.show();
            }
        },
        vCode:function(){
            var obj=$(c),
                n=parseInt(data,10);
            if(n===1){
                $("#id8").hide();
                $("#idcode").show();
                time(60);
                obj.show();
            }else{
                obj.hide();
            }
        }
    },
    // 服务器通信方法
    Ajax=function(m,fn,c){
        var str=m;
        ajax.run({
            type: "POST",
            async:true,
            url: str,
            data: null,
            dataType: "html",
            success: function(d){
                (function(data,c){
                    fn(data,c);
                }(d,c));
            }
        });
    },
    focusEvent=function(a,fn,k,l){
        var obj=$(a);
        obj.focus(function(){
            var a=obj.attr("value");
            obj.attr("placeholder","");
            fn(k,l);
        });
    },
    blurEvent=function(a,fn){
        var obj=$(a);
        obj.blur(function(){
            var val=obj.attr("value");
            fn(val);
        });
    },
    element=[
        {a:"#id1"},{a:"#id2"},{a:"#id3"},{a:"#id4"},{a:"#id5"}
    ],
    infoEle=[
        {a:"#id7",b:"#ida"},{a:"#id13",b:"#ide"},{a:"#id10",b:"#idb"},{a:"#idc",b:"#ide"},{a:"#id12",b:"#idd"}
    ],
    fnObj=[
        {a:function(val){
            var str=val,
                obj=$("#id1");
            if(!str){
                $("#id7").show();
                obj.attr("data-i",0);
                return;
            }
            if(reg(str,1)){
                $("#id8").show();
                obj.attr("data-i",1);
            }else if(reg(str,2)){

            }else{
                $("#id7").show();
                obj.attr("data-i",0);
                return;
            }
            if(!reg(str,1)){
                if(reg(str,2)){
                    $("#id8").hide();
                    $("#id9").hide();
                    obj.attr("data-i",1);
                }else{
                    $("#id7").show();
                    obj.attr("data-i",0);
                    return;
                }
            }
        }},
        {a:function(val){
            var str=parseInt(val,10),
                obj=$("#id2");
            if(!str){
                $("#id13").show();
                obj.attr("data-i",0);
                return;
            }
            if(!reg(str,4)){
                alert('验证码错误');
                obj.attr("data-i",0);
                return;
            }
            $("#ide").show();
            obj.attr("data-i",1);
        }},
        {a:function(val){
            var str='data='+val,// 获取用户输入的值 组合成a=b形式
                obj=$("#id3");
            if(!str){
                $("#idb").show();
                obj.attr("data-i",0);
                return;
            }
            $("#id10").show();
            Ajax(str,callback.name,'#id10');// 开始和服务器进行通信 检测用户名是否可用
            obj.attr("data-i",1);
        }},
        {a:function(val){
            var str=val,
                obj=$("#id4");
            if(!str){
                $("#id11").show();
                obj.attr("data-i",0);
                return;
            }
            var len=parseInt(str.length,10);
            if(!(len>=6 && len<=16)){
                $("#id11").show();
                obj.attr("data-i",0);
                return;
            }
            if(!reg(str,3)){
                $("#id11").show();
                obj.attr("data-i",0);
                return;
            }
            $("#idc").show();
            obj.attr("data-i",1);
        }},
        {a:function(val){
            var strA=$("#id4").attr("value"),
                strB=$("#id5").attr("value"),
                obj=$("#id5");
            if(!(strA==strB)){
                $("#id12").show();
                obj.attr("data-i",0);
                return;
            }else{
                $("#idd").show();
                obj.attr("data-i",1);
            }
        }}
    ];
    for(var i=0,n=element.length;i<n;i++){
        (function(i){
            focusEvent(this.a,fnDis,infoEle[i].a,infoEle[i].b);
        }).call(element[i],i);
    }
    for(var i=0,n=element.length;i<n;i++){
        (function(i){
            blurEvent(this.a,fnObj[i].a);
        }).call(element[i],i);
    }
    $("#id6").bind("click",function(){
        var o=$(this).prop("checked");
    });
    $("#sub").bind("click",function(){
        var o=$("#id6").prop("checked"),
            a=$("#id1").attr("data-i"),
            b=$("#id2").attr("data-i"),
            c=$("#id3").attr("data-i"),
            d=$("#id4").attr("data-i"),
            e=$("#id5").attr("data-i");
        if(!o){alert('协议');}
        if(!($("#id2").is(':visible'))){
            var boo=(function(a,c,d,e){
                if(a==0){
                    return 0;
                }else if(c==0){
                    return 0;
                }else if(d==0){
                    return 0;
                }else if(e==0){
                    return 0;
                }else{
                    return 1;
                }
            }(a,c,d,e));
        }else{
            var boo=(function(a,b,c,d,e){
                if(a==0){
                    return 0;
                }else if(b==0){
                    return 0;
                }else if(c==0){
                    return 0;
                }else if(d==0){
                    return 0;
                }else if(e==0){
                    return 0;
                }else{
                    return 1;
                }
            }(a,b,c,d,e));
        }
        if(boo==0){return false;}
    });
    $("#id8").bind("click",function(){
        $("#id9").show();
        var str='code='+1;
        Ajax(str,callback.vCode,'#id2');// 开始和服务器进行通信 发送验证码请求
    });
}(jQuery,ajax))