//判断浏览器是否支持 placeholder属性  
function isPlaceholder() {
    var input = document.createElement('input');
    return 'placeholder' in input;
}
$(function () {
    if (!isPlaceholder()) {
        var pwdField = $("#passWord");
        if (pwdField.val() == undefined || pwdField.val() == '') {
            pwdField.after('<input id="pwdPlaceholder" type="text" value="请输入密码" class="login-ipt2 dhide" />');

            var pwdPlaceholder = $('#pwdPlaceholder');
            pwdField.hide(); 
            pwdPlaceholder.show();

            pwdPlaceholder.focus(function () {
                pwdPlaceholder.hide();
                pwdField.show();
                pwdField.focus();
            });

            pwdField.blur(function () {
                if (pwdField.val() == undefined || pwdField.val() == '') {
                    pwdField.hide();
                    pwdPlaceholder.show();
                }
            });
        }
    }
});
