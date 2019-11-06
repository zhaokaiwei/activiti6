<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>所有参与流程</title>
</head>

<%@include file="/WEB-INF/common/head.jsp" %>
<body>
    <table id="demo" lay-filter="test"></table>

    <script>
        layui.use('table', function(){
            var table = layui.table;

            //第一个实例
            table.render({
                elem: '#demo'
                //,height:400
                //,width:1200
                ,url: '/vacate/loadAllProcesses' //数据接口
                //,page: true //开启分页
                ,cols: [[ //表头
                    {field: 'processInstanceId', title: 'ID', width:80,  fixed: 'left'}
                    ,{field: 'apply_name', title: '申请人', width:100}
                    ,{field: 'apply_days', title: '申请天数', width:120}
                    ,{field: 'apply_reason', title: '申请原因', width:150}
                    ,{field: 'startTime', title: '开始时间', width:160}
                    ,{field: 'endTime', title: '结束时间', width: 160}
                    ,{field: 'currDealUser', title: '当前任务处理人', width:150}
                    ,{field: 'result', title: '结果', width:90,templet:function (d) { return d.result == '1' ? '同意' : '否决' }}
                    ,{title: '操作', width:130
                        ,templet: function(d){
                            var isMeToDeal = '${sessionScope.userId}' == d.currDealUser;
                            var isRecalled = '${sessionScope.userId}' == d.preUser;
                            return "<a href='/page/scan?processInstanceId="+d.processInstanceId+"' target='_blank'>查看</a>" +
                                (isMeToDeal ? "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0)' onclick='dealApply("+d.processInstanceId+")'>处理</a>" : "") +
                                (isRecalled ? "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0)' onclick='recallDeal("+d.processInstanceId+")'>撤回</a>" : "");
                        }}
                ]]
            });

        });
    </script>

    <script type="text/javascript">
        function dealApply(processInstanceId) {
            layer.open({
                title:'处理',
                type: 2,
                area: ['500px', '300px'],
                content: '/page/dealApply?processInstanceId='+processInstanceId //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
            });
        }
        
        function recallDeal(processInstanceId) {
            layer_confirm("确定要撤回处理结果吗？",function () {
                $.post(
                    "/vacate/recall",
                    {processInstanceId:processInstanceId},
                    function (result) {
                        if (result.code == '0'){
                            window.location.reload();
                        }else{
                            layer_alert("撤回出错！");
                        }
                    }
                )
            })
        }
    </script>
</body>
</html>
