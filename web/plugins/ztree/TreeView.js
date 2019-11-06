var tree_async = {}, tree_callback = {};
var backFlag=false;
var treeListObj,treeListUserObj;
//单击操作
function zTreeOnClick(event, treeId, treeNode) {
    treeSelectId = treeNode.id; //DWNM@YHNM
    expandNode(treeId, treeNode); //展开节点
   /* TableReload();*/ //加载数据
    if (flag){
        $("#chatList").css("display","none");
        $("#messageBox").css("display","inline");
        $("#messageBox").css("width","100%");
        $(".ng-scope .mobile").css("margin-right","5px");
        $(".ng-scope .mobile").css("padding-left","5px");
    }
    backFlag=true;
}

function zTreeNodeOnClick(event, treeId, treeNode) {
    //一级节点不执行
    if (treeNode.level == 0) {
        treeSelectId = "";
    } else {
        treeSelectId = treeNode.id;
        TableReload();
    }
    expandNode(treeId, treeNode); //展开节点
}
function zTreeNodeOnClick_2(event, treeId, treeNode) {
    //一级节点不执行
    treeSelectId = "";
    if (treeNode.level == 2) {
        treeSelectId = treeNode.id;
        TableReload();
    }
    expandNode(treeId, treeNode); //展开节点
}
function zTreeNodeOnClick_3(event, treeId, treeNode) {
    treeSelectId = "";
    if (treeNode.level == 3) {
        treeSelectId = treeNode.id;
        TableReload();
    }
    expandNode(treeId, treeNode); //展开节点
}

function zTreeUserOnClick(event, treeId, treeNode) {
    //一级节点不执行
    treeSelectId = "";
    if (treeNode.level == 0) {
    } else {
        //加载用户列表树
        GetTreeUserNodes(treeNode.id); //外部方法
    }
    expandNode(treeId, treeNode); //展开节点
}

function zTreeBeforeExpand(treeId, treeNode) {
    if (treeNode.level == 0) {
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        treeObj.selectNode(treeNode);
        treeObj.setting.callback.onClick(null, treeId, treeNode); //触发单击事件
        return false;
    }
}

function expandNode(treeId) {
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    var nodes = treeObj.getSelectedNodes();
    if (nodes.length > 0) {
        treeObj.expandNode(nodes[0]);
    }
}

//加载树
function treeLoad(node) {
    var setting = {
        data: {
            key: {
                title: 'title'
            },
            simpleData: {
                enable: true, //使用简单数据模式
                idKey: 'id', //id名称
                pIdKey: 'pid', //父id名称
                rootPId: '' //修正根节点父id内容
            }
        },
        view: {
            selectedMulti: false, //关闭多选
            showIcon: false //关闭图标
        },
        async: tree_async, //页面重新配置异步加载内容
        callback: tree_callback //页面重新配置的事件
    };
    treeListObj = $.fn.zTree.init($("#treelist"), setting, node);
}

//加载树
function treeUserLoad(node,clickFunction) {
    var setting = {
        data: {
            key: {
                title: 'title'
            },
            simpleData: {
                enable: true, //使用简单数据模式
                idKey: 'id', //id名称
                pIdKey: 'pid', //父id名称
                rootPId: '' //修正根节点父id内容
            }
        },
        view: {
            selectedMulti: false, //关闭多选
            showIcon: false //关闭图标
        },
        callback: {
            onClick: typeof (clickFunction) == 'undefined' ? zTreeOnClick : clickFunction
        } //页面重新配置的事件
    };
    treeListUserObj = $.fn.zTree.init($("#treelistuser"), setting, node);
}

function treeReload() {
    var treeObj = $.fn.zTree.getZTreeObj("treelist");
    var nodes = treeObj.getSelectedNodes();
    if (nodes.length > 0) {
        treeObj.reAsyncChildNodes(nodes[0], "refresh"); //刷新数据
    }
}
