<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Cache-Control" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <title>请假申请</title>
    <link href="/css/common.css" rel="stylesheet" charset="gb2312" />
    <link href="/css/tables.css" rel="stylesheet" charset="gb2312" />
    <link href="/css/CommonProcess.css" rel="stylesheet" type="text/css" />
    <link href="/css/CommonSubmit.css" rel="stylesheet" type="text/css" />
    <link href="/css/subcomm.css" rel="stylesheet" type="text/css" />
    <link href="/css/tipswindown.css" rel="stylesheet" type="text/css" media="all" />
    <link href="/css/print.css" rel="stylesheet" media="print" charset="gb2312" />
    <link href="/layui/css/layui.css" rel="stylesheet" type="text/css" />
    <link href="/Scripts/jquery-ui/jquery-ui.css" rel="stylesheet" type="text/css" />
    <link href="/Scripts/v2/css/skin.css" rel="stylesheet" type="text/css" />

    <%@include file="/WEB-INF/common/head.jsp" %>
</head>
<body class="fs-11">

<form action="/" id="submitForm" method="post">

    <div class="pd-10 bd1 printTable">
        <div class="ct1">

            <table class="tb1">
                <tr style="height: 20px">
                    <td class="w100">
                    </td>
                    <td class="w210">
                    </td>
                    <td class="w100">
                    </td>
                    <td class="w210">
                    </td>
                </tr>
                <tr>
                    <td colspan="4" class="tb-ft">
                        华中科技大学软件学院请假申请
                    </td>
                </tr>

                <tr style="height: 70px;">
                    <td class="tb-bd-t tb-bd-r text-center red">
                        姓  名：
                    </td>
                    <td colspan="3" class="tb-bd-t text-center">
                        &nbsp;<span>${variables.apply_name[0]}</span>
                    </td>
                </tr>

                <tr>
                    <td class="tb-bd-t tb-bd-r text-center red">
                        学  号：
                    </td>
                    <td colspan="3" class="tb-bd-t text-center">
                        &nbsp;<span>${variables.apply_id[0]}</span>
                    </td>
                </tr>

                <tr style="height: 70px;">
                    <td class="tb-bd-t tb-bd-r text-center red">
                        请假天数：
                    </td>
                    <td colspan="3" class="tb-bd-t text-center">
                        &nbsp;<span>${variables.apply_days[0]}</span>
                    </td>
                </tr>

                <tr>
                    <td class="tb-bd-t tb-bd-r text-center red">
                        请假理由：
                    </td>
                    <td colspan="3" class="tb-bd-t text-center">
                        &nbsp;<span>${variables.apply_reason[0]}</span>
                    </td>
                </tr>
                <tr>
                    <td class="tb-bd-t tb-bd-r text-center red">
                        辅导员审批：
                    </td>
                    <td colspan="3" class="tb-bd-t text-center">
                        &nbsp;<span>
                            <c:if test="${!empty variables.task1_result[0]}" >
                                审批结果：${variables.task1_result[0] == '0' ? '否决' : '同意'}
                                </br>审批意见：${variables.task1_comment[0]}
                                </br>审批人：${variables.task1_name[0]}
                                </br>审批时间：${variables.task1_name[1]}
                            </c:if>
                        </span>
                    </td>
                </tr>

                <tr>
                    <td class="tb-bd-t tb-bd-r text-center red">
                        班主任审批：
                    </td>
                    <td colspan="3" class="tb-bd-t text-center">
                        &nbsp;<span>
                        <c:if test="${!empty variables.task2_result[0]}" >
                            审批结果：${variables.task2_result[0] == '0' ? '否决' : '同意'}
                            </br>审批意见：${variables.task2_comment[0]}
                            </br>审批人：${variables.task2_name[0]}
                            </br>审批时间：${variables.task2_name[1]}
                        </c:if>
                    </span>
                    </td>
                </tr>

                <tr>
                    <td class="tb-bd-t tb-bd-r text-center red">
                        副书记审批：
                    </td>
                    <td colspan="3" class="tb-bd-t text-center">
                        &nbsp;<span>
                        <c:if test="${!empty variables.task3_result[0]}" >
                            审批结果：${variables.task3_result[0] == '0' ? '否决' : '同意'}
                            </br>审批意见：${variables.task3_comment[0]}
                            </br>审批人：${variables.task3_name[0]}
                            </br>审批时间：${variables.task3_name[1]}
                        </c:if>
                    </span>
                    </td>
                </tr>

                <tr>
                    <td class="tb-bd-t tb-bd-r tb-bd-b text-center red">
                        院长审批：
                    </td>
                    <td colspan="3" class="tb-bd-t tb-bd-b text-center">
                        &nbsp;<span>
                        <c:if test="${!empty variables.task4_result[0]}" >
                            审批结果：${variables.task4_result[0] == '0' ? '否决' : '同意'}
                            </br>审批意见：${variables.task4_comment[0]}
                            </br>审批人：${variables.task4_name[0]}
                            </br>审批时间：${variables.task4_name[1]}
                        </c:if>
                    </span>
                    </td>
                </tr>
            </table>

        </div>
    </div>

</form>
</body>

</html>
