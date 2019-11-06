<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>请假申请</title>
    <link href="${pageContext.request.contextPath}/layui/css/layui.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery-1.11.2.min.js"></script>
</head>

<body>
    <form class="layui-form">
        <div class="layui-form-item">
            <label class="layui-form-label">请假天数</label>
            <div class="layui-input-block">
                <input type="text" name="apply_days" required  lay-verify="required" placeholder="请输入请假天数" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item layui-form-text">
            <label class="layui-form-label">请假理由</label>
            <div class="layui-input-block">
                <textarea name="apply_reason" placeholder="请输入请假理由" class="layui-textarea"></textarea>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-input-block">
                <button class="layui-btn" lay-submit lay-filter="formDemo">立即提交</button>
                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
            </div>
        </div>
    </form>

    <script type="text/javascript" src="${pageContext.request.contextPath}/layui/layui.all.js"></script>
    <script>
        //Demo
        layui.use('form', function(){
            var form = layui.form;

            //监听提交
            form.on('submit(formDemo)', function(data){
                $.post(
                    "/vacate/apply",
                    data.field,
                    function (result) {
                        if (result.code == '0'){
                            window.top.document.getElementById("allProcesses").click();
                        }else{
                            layer_alert("提交出错！");
                        }

                    }
                )
                return false;
            });
        });
    </script>
</body>
</html>
