<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>请假申请</title>
    <link href="${pageContext.request.contextPath}/layui/css/layui.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery-1.11.2.min.js"></script>
</head>

<body>
<form class="layui-form">
    <input type="hidden" name="processInstanceId" value="${processInstanceId}" />
    <div class="layui-form-item">
        <label class="layui-form-label">意见</label>
        <div class="layui-input-block">
            <select name="deal_result" lay-verify="required">
                <option value=""></option>
                <option value="1">同意</option>
                <option value="0">否决</option>
            </select>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">处理意见</label>
        <div class="layui-input-block">
            <textarea name="deal_comment" placeholder="请输入处理意见" class="layui-textarea"></textarea>
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
                "/vacate/dealApply",
                $("form:first").serializeArray(),
                function (result) {
                    if (result.code == '0'){
                        window.parent.location.reload();
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
