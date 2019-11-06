<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>动态设置</title>
    <link href="${pageContext.request.contextPath}/layui/css/layui.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery-1.11.2.min.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/common.js"></script>
</head>
<body>
<form class="layui-form">
    <div class="layui-form-item">
        <label class="layui-form-label">辅导员审批</label>
        <div class="layui-input-block">
            <select name="c_assignee" lay-verify="required">
                <option value="">请选择审批人</option>
                <c:forEach items="${users.counselor}" var="user">
                    <option value="${user.id}" ${dynamicInfo[0].assignee eq user.id ? 'selected' : ''}>${user.firstName}</option>
                </c:forEach>
            </select>
        </div>
    </div>
    <div class="layui-form-item layui-form-text">
        <div class="layui-input-block">
            <input type="text" name="c_days" value="${dynamicInfo[0].days}" placeholder="请输入" autocomplete="off" class="layui-input">
        </div>
    </div>
    <input name="c_conditionId" type="hidden" value="${dynamicInfo[0].refuse_id}@${dynamicInfo[0].agree_id}"/>
    <input name="c_taskId" type="hidden" value="${dynamicInfo[0].taskId}"/>

    <div class="layui-form-item">
        <label class="layui-form-label">班主任审批</label>
        <div class="layui-input-block">
            <select name="ht_assignee" lay-verify="required">
                <option value="">请选择审批人</option>
                <c:forEach items="${users.head_teachers}" var="user">
                    <option value="${user.id}" ${dynamicInfo[1].assignee eq user.id ? 'selected' : ''}>${user.firstName}</option>
                </c:forEach>
            </select>
        </div>
    </div>
    <div class="layui-form-item layui-form-text">
        <div class="layui-input-block">
            <input type="text" name="ht_days" value="${dynamicInfo[1].days}" placeholder="请输入" autocomplete="off" class="layui-input">
        </div>
    </div>
    <input name="ht_conditionId" type="hidden" value="${dynamicInfo[1].refuse_id}@${dynamicInfo[1].agree_id}"/>
    <input name="ht_taskId" type="hidden" value="${dynamicInfo[1].taskId}"/>

    <div class="layui-form-item">
        <label class="layui-form-label">副书记审批</label>
        <div class="layui-input-block">
            <select name="ds_assignee" lay-verify="required">
                <option value="">请选择审批人</option>
                <c:forEach items="${users.deputy_secretary}" var="user">
                    <option value="${user.id}" ${dynamicInfo[2].assignee eq user.id ? 'selected' : ''}>${user.firstName}</option>
                </c:forEach>
            </select>
        </div>
    </div>
    <div class="layui-form-item layui-form-text">
        <div class="layui-input-block">
            <input type="text" name="ds_days" value="${dynamicInfo[2].days}" placeholder="请输入" autocomplete="off" class="layui-input">
        </div>
    </div>
    <input name="ds_conditionId" type="hidden" value="${dynamicInfo[2].refuse_id}@${dynamicInfo[2].agree_id}"/>
    <input name="ds_taskId" type="hidden" value="${dynamicInfo[2].taskId}"/>

    <div class="layui-form-item">
        <label class="layui-form-label">院长审批</label>
        <div class="layui-input-block">
            <select name="d_assignee" lay-verify="required">
                <option value="">请选择审批人</option>
                <c:forEach items="${users.dean}" var="user">
                    <option value="${user.id}" ${dynamicInfo[3].assignee eq user.id ? 'selected' : ''}>${user.firstName}</option>
                </c:forEach>
            </select>
        </div>
    </div>
    <input name="d_taskId" type="hidden" value="${dynamicInfo[3].taskId}"/>

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
                "/vacate/dynamicSet",
                data.field,
                function (result) {
                    if (result.code == '0'){
                        window.top.document.getElementById("allProcesses").click();
                    }else{
                        layer_alert(result.message);
                    }
                }
            )
            return false;
        });
    });
</script>
</body>
</html>
