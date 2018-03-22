
Date.prototype.Format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(), 
        "h+": this.getHours(), 
        "m+": this.getMinutes(), 
        "s+": this.getSeconds(), 
        "q+": Math.floor((this.getMonth() + 3) / 3), 
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var Safe = {
    serverurl: "",
    encodedes: function (instr) {
        var ciphertext = stringToHex(des(getkey(), instr, 1, 0));
        return ciphertext;
    },
    getsign: function (parm) {
        var inparm = {
            p1: parm,
        }
        var adate = new Date();
        inparm.timestamp = adate.Format("yyyy-MM-dd hh:mm:ss S");
        var parmstr = "";
        for (key in parm) {
            parmstr = parmstr + key + "=" + parm[key] + "&";
        }
        parmstr = parmstr.substring(0, parmstr.length - 1);
        parmstr = parmstr.toUpperCase();
        inparm.Fsupersign = $.md5(parmstr);
        return inparm;
    },
    post: function (url, parm, callback) {
        var signparm = Safe.getsign(parm);
        var enstr = Safe.encodedes(JSON.stringify(signparm));
        appcan.ajax({
            url: Serverurl+url,
            type: "POST",
            dataType: "json",
            async: false,
            data: {
                parm: enstr
            },
            success: function (result) {
                var code = result.code;
                var msg = result.msg;
                var debug = result.debug;
                if (code > 10000) {
                    if (Fsuperdbg)
                    {
                        alert(debug);
                    }
                    return;
                }
                callback(result);
            }
        });
    },
    apppost: function (url, parm, callback) {
        var signparm = Safe.getsign(parm);
        var enstr = Safe.encodedes(JSON.stringify(signparm));
        appcan.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            async: false,
            data: {
                parm: enstr
            },
            success: function (result) {
                var code = result.code;
                var msg = result.msg;
                var debug = result.debug;
                if (code > 10000) {
                    if (Fsuperdbg)
                    {
                        alert(debug);
                    }
                    return;
                }
                callback(result);
            }
        });
    }
}