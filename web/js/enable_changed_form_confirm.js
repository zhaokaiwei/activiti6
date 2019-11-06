var isConfig = true;
$.fn.enable_changed_form_confirm = function () {
    var _f = this;
    $(':text, :password, textarea', this).each(function () {
        $(this).attr('_value', $(this).val());
    });

    $(':checkbox, :radio', this).each(function () {
        var _v = this.checked ? 'on' : 'off';
        $(this).attr('_value', _v);
    });

    $('select', this).each(function () {
        $(this).attr('_value', this.options[this.selectedIndex].value);
    });

    $(this).submit(function () {
        window.onbeforeunload = null;
    });
    window.onbeforeunload = function () {
        if (is_form_changed(_f)) {
            return "-----------------------------------------------------\n关闭后您将丢失未保存的内容！\n-----------------------------------------------------";
        }
    }
}

$.fn.enable_changed_maintext_confirm = function () {
    //    var _f = this;
    //    $(':text, :password, textarea', this).each(function () {
    //        $(this).attr('_value', $(this).val());
    //    });

    //    $(':checkbox, :radio', this).each(function () {
    //        var _v = this.checked ? 'on' : 'off';
    //        $(this).attr('_value', _v);
    //    });

    //    $('select', this).each(function () {
    //        $(this).attr('_value', this.options[this.selectedIndex].value);
    //    });

    //    $(this).submit(function () {
    //        window.onbeforeunload = null;
    //    });
    window.onbeforeunload = function () {
        if (is_config()) {
            return "-----------------------------------------------------\n关闭后您将丢失未保存的内容！\n-----------------------------------------------------";
        }
        //        if(is_form_changed(_f)) {

        //        }     
    }
}


function is_config() {
    return isConfig;
}


function is_form_changed(f) {
    var changed = false;
    $(':text, :password, textarea', f).each(function () {
        var _v = $(this).attr('_value');
        if (typeof (_v) == 'undefined') _v = '';
        if (_v != $(this).val()) changed = true;
    });

    $(':checkbox, :radio', f).each(function () {
        var _v = this.checked ? 'on' : 'off';
        if (_v != $(this).attr('_value')) changed = true;
    });

    $('select', f).each(function () {
        var _v = $(this).attr('_value');
        if (typeof (_v) == 'undefined') _v = '';
        if (_v != this.options[this.selectedIndex].value) changed = true;
    });
    return changed;
}   
  