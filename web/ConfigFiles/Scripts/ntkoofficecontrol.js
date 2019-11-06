
// 请勿修改，否则可能出错
var userAgent = navigator.userAgent,
				rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
				rFirefox = /(firefox)\/([\w.]+)/,
				rOpera = /(opera).+version\/([\w.]+)/,
				rChrome = /(chrome)\/([\w.]+)/,
				rSafari = /version\/([\w.]+).*(safari)/;
var browser;
var version;
var ua = userAgent.toLowerCase();
function uaMatch(ua) {
    var match = rMsie.exec(ua);
    if (match != null) {
        return { browser: "IE", version: match[2] || "0" };
    }
    match = rFirefox.exec(ua);
    if (match != null) {
        return { browser: match[1] || "", version: match[2] || "0" };
    }
    match = rOpera.exec(ua);
    if (match != null) {
        return { browser: match[1] || "", version: match[2] || "0" };
    }
    match = rChrome.exec(ua);
    if (match != null) {
        return { browser: match[1] || "", version: match[2] || "0" };
    }
    match = rSafari.exec(ua);
    if (match != null) {
        return { browser: match[2] || "", version: match[1] || "0" };
    }
    if (match != null) {
        return { browser: "", version: "0" };
    }
}
var browserMatch = uaMatch(userAgent.toLowerCase());
if (browserMatch.browser) {
    browser = browserMatch.browser;
    version = browserMatch.version;
}
				//document.write(browser);
/*
谷歌浏览器事件接管
*/
//异步打开
function ondocopen(url, doc) {
    DisplayRulers();
}
//异步保存
function ondocsave(type, code, html) {
    //    TANGER_OCX_OBJ.ShowTipMessage("来自网页的消息", html);
    if (html == "Error False") {
        TANGER_OCX_OBJ.ShowTipMessage("来自网页的消息", "保存过程中出现异常！");
        return false;
    } else if (html == "Conflict False") {
        TANGER_OCX_OBJ.ShowTipMessage("来自网页的消息", "保存失败，在过程中您打开的文档被他人编缉过，请重新打开文档查看！");
        isConfig = false;
        return false;
    } else if (html == "NoLogin") {
        TANGER_OCX_OBJ.ShowTipMessage("来自网页的消息", "保存失败，您的用户信息已过期，请在重新登录（可不关闭当前页面，另外打开系统进行登录）！");
        return false;
    }
    if (isNaN(html)) {
        TANGER_OCX_OBJ.ShowTipMessage("来自网页的消息", html);
        return false;
    }

    //保存成功
    if (SaveType == 0) {
        if (SubId == "bc") {
            TANGER_OCX_OBJ.ShowTipMessage("来自网页的消息", "保存成功！");
            //                    alert("保存成功！");
        }
        else {
            TANGER_OCX_OBJ.ShowTipMessage("来自网页的消息", "保存成功！");
            isConfig = false;
            wclose();
        }
    }
    $("#BBBH").val(html);
}


var classid = "A64E3073-2016-4baf-A89D-FFE1FAA10EC0";
var codebase = '/ConfigFiles/DownLoad/OfficeControl.cab#version=6.0.1.0';

var classid64 = "A64E3073-2016-4baf-A89D-FFE1FAA10EE0";
var codebase64 = '/ConfigFiles/DownLoad/OfficeControl_x64.cab#version=6.0.1.0';

var productCaption = '湖南农业大学';
var productKey = '8B23D17155F7D183E9D329A86AAF4464409C014E';

if (browser == "IE") {

    if (window.navigator.platform == "Win32") {
        document.write('<!-- 用来产生编辑状态的ActiveX控件的JS脚本-->   ');
        document.write('<!-- 因为微软的ActiveX新机制，需要一个外部引入的js-->   ');
        document.write('<object id="TANGER_OCX" classid="clsid:' + classid + '"');
        document.write('codebase="' + codebase + '" width="100%" height="100%">   ');
        document.write('<param name="IsUseUTF8URL" value="-1">   ');
        document.write('<param name="IsUseUTF8Data" value="-1">   ');
        document.write('<param name="BorderStyle" value="1">   ');
        document.write('<param name="BorderColor" value="14402205">   ');
        document.write('<param name="TitlebarColor" value="15658734">   ');
        document.write('<param name="isoptforopenspeed" value="0">   ');

        document.write('<param name="ProductCaption" value="' + productCaption + '"> ');
        document.write('<param name="ProductKey" value="' + productKey + '">');

        document.write('<param name="TitlebarTextColor" value="0">   ');
        document.write('<param name="MenubarColor" value="14402205">   ');
        document.write('<param name="MenuButtonColor" VALUE="16180947">   ');
        document.write('<param name="MenuBarStyle" value="3">   ');
        document.write('<param name="MenuButtonStyle" value="7">   ');
        //        document.write('<param name="WebUserName" value="NTKO">   ');
        //        document.write('<param name="Caption" value="NTKO OFFICE文档控件示例演示 http://www.ntko.com">   ');
        document.write('<SPAN STYLE="color:red">不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>   ');
        document.write('</object>');
    }
    if (window.navigator.platform == "Win64") {
        document.write('<!-- 用来产生编辑状态的ActiveX控件的JS脚本-->   ');
        document.write('<!-- 因为微软的ActiveX新机制，需要一个外部引入的js-->   ');
        document.write('<object id="TANGER_OCX" classid="clsid:' + classid64 + '"');
        document.write('codebase="' + codebase64 + '" width="100%" height="100%">   ');
        document.write('<param name="IsUseUTF8URL" value="-1">   ');
        document.write('<param name="IsUseUTF8Data" value="-1">   ');
        document.write('<param name="BorderStyle" value="1">   ');
        document.write('<param name="BorderColor" value="14402205">   ');
        document.write('<param name="TitlebarColor" value="15658734">   ');
        document.write('<param name="isoptforopenspeed" value="0">   ');
        document.write('<param name="TitlebarTextColor" value="0">   ');

        document.write('<param name="ProductCaption" value="' + productCaption + '"> ');
        document.write('<param name="ProductKey" value="' + productKey + '">');

        document.write('<param name="MenubarColor" value="14402205">   ');
        document.write('<param name="MenuButtonColor" VALUE="16180947">   ');
        document.write('<param name="MenuBarStyle" value="3">   ');
        document.write('<param name="MenuButtonStyle" value="7">   ');
        document.write('<param name="WebUserName" value="NTKO">   ');
        //        document.write('<param name="Caption" value="NTKO OFFICE文档控件示例演示 http://www.ntko.com">   ');
        document.write('<SPAN STYLE="color:red">不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>   ');
        document.write('</object>');
    }
}
else if (browser == "firefox") {
    var hg = $(this).height() - 45;

    document.write('<object id="TANGER_OCX" type="application/ntko-plug" clsid="{' + classid + '}"  codebase="' + codebase + '" width="100%"  height="' + hg + 'px" ');

       document.write('ForOnBeginOpenFromURL="OnComplete" ');
    document.write('ForOndocumentopened="ondocopen" ');
    //    document.write('ForOnSaveToURL="OnSaveToURL" ');
    document.write('ForOnSaveAsOtherFormatToUrl="ondocsave" ');

    //    document.write('ForOnpublishAshtmltourl="publishashtml" ');
    //    document.write('ForOnpublishAspdftourl="publishaspdf" ');
    //    document.write('ForOnDoWebGet="dowebget" ');
    //    document.write('ForOnDoWebExecute="webExecute" ');
    //    document.write('ForOnDoWebExecute2="webExecute2" ');
    //    document.write('ForOnFileCommand="FileCommand" ');
    //    document.write('ForOnCustomMenuCmd2="CustomMenuCmd" ');

    document.write('_IsUseUTF8URL="-1"   ');
    document.write('_ProductCaption="' + productCaption + '" ');
    document.write('_ProductKey="' + productKey + '" ');

    document.write('_IsUseUTF8Data="-1"   ');
    document.write('_BorderStyle="1"   ');
    document.write('_BorderColor="14402205"   ');
    document.write('_MenubarColor="14402205"   ');
    document.write('_MenuButtonColor="16180947"   ');
    document.write('_MenuBarStyle="3"  ');
    document.write('_MenuButtonStyle="7"   ');
    //    document.write('_WebUserName="NTKO"   ');
    document.write('>');
    document.write('<SPAN STYLE="color:red">尚未安装NTKO Web FireFox跨浏览器插件。请点击<a href="/ConfigFiles/DownLoad/officeControl.exe">安装包</a></SPAN>   ');
    document.write('</object>   ');

} else if (browser == "chrome") {
    document.write('<object id="TANGER_OCX" type="application/ntko-plug" clsid="{' + classid + '}" codebase="' + codebase + '" width="100%" height="100%" ');
    //    document.write('ForOnBeginOpenFromURL="OnComplete" ');
    document.write('ForOndocumentopened="ondocopen" ');
    //    document.write('ForOnSaveToURL="OnSaveToURL" ');
    document.write('ForOnSaveAsOtherFormatToUrl="ondocsave" ');

    //    document.write('ForOnpublishAshtmltourl="publishashtml" ');
    //    document.write('ForOnpublishAspdftourl="publishaspdf" ');
    //    document.write('ForOnDoWebGet="dowebget" ');
    //    document.write('ForOnDoWebExecute="webExecute" ');
    //    document.write('ForOnDoWebExecute2="webExecute2" ');
    //    document.write('ForOnFileCommand="FileCommand" ');

    document.write('_ProductCaption="' + productCaption + '" ');
    document.write('_ProductKey="' + productKey + '" ');

    document.write('ForOnCustomMenuCmd2="CustomMenuCmd" ');
    document.write('_IsUseUTF8URL="-1"   ');
    document.write('_IsUseUTF8Data="-1"   ');
    document.write('_BorderStyle="1"   ');
    document.write('_BorderColor="14402205"   ');
    document.write('_MenubarColor="14402205"   ');
    document.write('_MenuButtonColor="16180947"   ');
    document.write('_MenuBarStyle="3"  ');
    document.write('_MenuButtonStyle="7"   ');
    //    document.write('_WebUserName="NTKO"   ');
    //    document.write('_Caption="NTKO OFFICE文档控件示例演示 http://www.ntko.com">    ');
    document.write('>');
    document.write('<SPAN STYLE="color:red">尚未安装NTKO Web Chrome跨浏览器插件。请点击<a href="/ConfigFiles/DownLoad/officeControl.exe">安装包</a></SPAN>   ');
    document.write('</object>');

} else if (browser == "opera") {
    alert("sorry,ntko web印章暂时不支持opera!");
} else if (browser == "safari") {
    alert("sorry,ntko web印章暂时不支持safari!");
}