<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<div class="gid-b">
    <ul>
        <li>
            <button id="add" type="button" onclick="operate('1')" class="Abutton mg-r-10" >
                新建
            </button>
            <button id="update" type="button" onclick="operate('3')" class="Abutton mg-r-10" >
                修改
            </button>
            <button id="delete" type="button" onclick="operate('2')" class="Abutton mg-r-10" >
                删除
            </button>
            &nbsp;
        </li>
        <li>
            <div class="ipt2 mg-r-20">
                <input type="text" name="searchContent" id="selectWhere" value="">
                <input type="button" title="搜索" onclick="operate('0')" id="search">
            </div>
        </li>
        <li id="morefun">
            <button type="button" onclick="" class="Abutton mg-r-10" >
                高级搜索
            </button>
            <button type="button" onclick="showAll()" class="Abutton mg-r-10" >
                全部显示
            </button>
        </li>
    </ul>
</div>