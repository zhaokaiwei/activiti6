<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>歌曲列表</title>
    <link href="${pageContext.request.contextPath}/css/common.css" rel="stylesheet" type="text/css" />
    <link href="${pageContext.request.contextPath}/css/ifrm.css" rel="stylesheet" type="text/css" />
    <link href="${pageContext.request.contextPath}/layui/css/layui.css" rel="stylesheet" type="text/css" />

    <script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery-1.11.2.min.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/common.js"></script>

    <style type="text/css">
        .mybtn {
            margin:5px;
            float: left;
        }
        .input-box-size{
            width:180px;
        }
    </style>
</head>

<body>
    <div>
        <button id="add" type="button" onclick="printArtists()" class="layui-btn mg-r-10 mybtn"
                title="打印榜单中所有出现过的歌手名（不重复，按字母顺序排序）">
            打印歌手名
        </button>
        <button id="update" type="button" onclick="listTop5SongsAndNum()" class="layui-btn mg-r-10 mybtn"
                title="打印榜单中上榜次数最多的5首歌曲及对应的次数">
            打印上榜歌曲
        </button>
        <div class="layui-input-block mybtn mg-r-10">
            <input type="text" id="input_year" name="input_year" placeholder="请输入年份" autocomplete="off" class="layui-input input-box-size ">
        </div>
        <button type="button" onclick="searchByYear()" class="layui-btn mg-r-10 mybtn"
                title="给定年份，打印榜单中该年份所有的上榜歌曲名">
            搜索歌曲
        </button>
    </div>
    <table id="demo" lay-filter="test"></table>

    <script type="text/javascript" src="${pageContext.request.contextPath}/layui/layui.all.js"></script>
    <script>
        layui.use('table', function(){
            var table = layui.table;

            //第一个实例
            table.render({
                elem: '#demo'
                //,height:400
                //,width:800
                ,page:true
                ,limit:10
                ,url: '/vacate/billboardList' //数据接口
                ,cols: [[ //表头
                    {field: 'id', title: '编号', width:80,  fixed: 'left'}
                    ,{field: 'title', title: '歌曲名称', width:400}
                    ,{field: 'artist', title: '作者', width:200}
                    ,{field: 'year', title: '发行年份', width:100}
                ]]
            });

        });
    </script>

    <script type="text/javascript">
        function searchByYear() {
            var year = $("#input_year").val();
            layui.table.reload('demo',{
                url:'/vacate/billboardList?year='+year,
                page:{
                    curr:1
                }
            });
        }
        
        function printArtists() {
            layer.open({
                title:'所有歌手',
                type: 2,
                content: '/page/printArtists',
                area: ['500px', '300px']
            });
        }
        
        function listTop5SongsAndNum() {
            layer.open({
                title:'上榜最多',
                type: 2,
                content: '/page/listTop5SongsAndNum',
                area: ['500px', '300px']
            });
        }
    </script>
</body>
</html>
