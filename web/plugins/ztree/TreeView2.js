var tree_async = {}, tree_callback = {};
var backFlag=false;
var user = {};
//单击操作
function zTreeOnClick(event, treeId, treeNode) {
    treeSelectId = treeNode.id; //DWNM@FJNM
    expandNode(treeId, treeNode); //展开节点
    /* TableReload();*/ //加载数据
    /*        $("#chatList").css("display","none");
            $("#messageBox").css("display","inline");
            $("#messageBox").css("width","100%");
            $(".ng-scope .mobile").css("margin-right","5px");
            $(".ng-scope .mobile").css("padding-left","5px");*/
/*
    window.location.href="/user/getChatMsg?treeSelectId="+treeSelectId;
*/
    var yhnm = treeNode.id.split('@')[1];
    if ($("#div_"+yhnm).length > 0) userClick(treeNode.name,yhnm);
    else {
        // 没有就直接跳转到聊天界面
        window.location.href ='/user/getChatMsg?yhnm=' + yhnm + '&yhxm=' + treeNode.name;

        // 将当前用户的信息存在user中
        user.name = treeNode.name;
        user.yhnm = treeNode.id.split('@')[1];
        user.BMMC = treeNode.title;
    }
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
            showIcon: false,//关闭图标
            /*  addHoverDom: addHoverDom,
              removeHoverDom: removeHoverDom*/
            addDiyDom: addDiyDom

        },
        async: tree_async, //页面重新配置异步加载内容
        callback: tree_callback //页面重新配置的事件
    };
    $.fn.zTree.init($("#treelist"), setting, node);
    var treeObj = $("#treelist");

    treeObj.hover(function () {
        if (!treeObj.hasClass("showIcon")) {
            treeObj.addClass("showIcon");
        }
    }, function() {
        treeObj.removeClass("showIcon");
    });
}

function addDiyDom(treeId, treeNode) {
    var spaceWidth = 5;
    var switchObj = $("#" + treeNode.tId + "_switch"),
        icoObj = $("#" + treeNode.tId + "_ico");
    switchObj.remove();
    icoObj.before(switchObj);

    if (treeNode.level > 1) {
        var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
        switchObj.before(spaceStr);
    }
}
var newCount = 1;
function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_"+treeNode.tId);
    if (btn) btn.bind("click", function(){
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
        return false;
    });
};
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
};

//加载树
function treeUserLoad(node) {
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
            showIcon: false//关闭图标
        },
        callback: {
            onClick: zTreeOnClick
        } //页面重新配置的事件
    };
    $.fn.zTree.init($("#treelistuser"), setting, node);
}

/*function addDiyDom(treeId, treeNode) {
    var spaceWidth = 5;
    var switchObj = $("#" + treeNode.tId + "_switch"),
        icoObj = $("#" + treeNode.tId + "_ico");
    switchObj.remove();
    icoObj.before(switchObj);

    if (treeNode.level > 1) {
        var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
        switchObj.before(spaceStr);
    }
}*/


function treeReload() {
    var treeObj = $.fn.zTree.getZTreeObj("treelist");
    var nodes = treeObj.getSelectedNodes();
    if (nodes.length > 0) {
        treeObj.reAsyncChildNodes(nodes[0], "refresh"); //刷新数据
    }
}
