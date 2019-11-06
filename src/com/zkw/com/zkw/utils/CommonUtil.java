package com.zkw.com.zkw.utils;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.zkw.constant.VariablePrefix;
import org.activiti.engine.HistoryService;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.history.HistoricTaskInstanceQuery;
import org.activiti.engine.history.HistoricVariableInstance;
import org.activiti.engine.runtime.ProcessInstance;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author zkw
 * @date 2019/10/5 15:31
 */
public class CommonUtil {

    /** 把请假申请的具体信息以JsonObject的形式返回
     * @param variableInstances     变量实例List，只包括请假申请任务设置的变量
     * @param processInstance       上面变量所属的流程实例
     * @param historyService
     * @param userId                当前用户id
     * @return
     */
    public static JsonObject variableInstances2Jsonobject(List<HistoricVariableInstance> variableInstances,
                                                          HistoricProcessInstance processInstance,
                                                          HistoryService historyService,
                                                          String userId){
        JsonObject jobj = new JsonObject();
        for (HistoricVariableInstance instance : variableInstances){
            jobj.addProperty(instance.getVariableName(),instance.getValue().toString());
        }

        boolean isEnd = processInstance.getEndTime() != null;    // 流程是否结束
        if (!isEnd){                                // 如果没有结束，获取待办task的处理人信息（userid）
            HistoricTaskInstanceQuery historicTaskInstanceQuery = historyService
                    .createHistoricTaskInstanceQuery()
                    .processInstanceId(processInstance.getId());
            List<HistoricTaskInstance> tasks = historicTaskInstanceQuery
                    .list().stream().sorted(Comparator.comparing(HistoricTaskInstance::getCreateTime)).collect(Collectors.toList());
            int size = tasks.size();

            // 待测试
            jobj.addProperty("preUser",tasks.get(size-2).getAssignee());
            jobj.addProperty("currDealUser",tasks.get(size-1).getAssignee());
        }else{
            jobj.addProperty("endTime",date2String(processInstance.getEndTime()));
        }
        jobj.addProperty("processInstanceId",variableInstances.get(0).getProcessInstanceId());
        jobj.addProperty("isEnd",isEnd);
        jobj.addProperty("startTime",date2String(processInstance.getStartTime()));

        return jobj;
    }

    /**把通过调用接口方法返回的数据转换成Map
     * @param data 调用接口方法返回的数据
     * @return
     */
    public static Map<String,Object> jsonObject2Map(JsonObject data) {
        Map<String, Object> result = new HashMap<>();
        for (Map.Entry<String, JsonElement> entry : data.entrySet()) {      //遍历json对象
            String key = entry.getKey();
            JsonElement value = entry.getValue();
            if (value.isJsonArray()){           //JsonArra
                JsonArray jarr = (JsonArray)value;
                Iterator<JsonElement> iterator = jarr.iterator();
                List<Map<String,Object>> list = new ArrayList<>();      //如果是JsonArra用List<Map<String,Object>>来存
                while (iterator.hasNext()){         //遍历JsonArra中的每个元素，用递归方法继续转化
                    JsonObject next = (JsonObject)iterator.next();
                    Map<String, Object> tmp = jsonObject2Map(next);
                    list.add(tmp);
                }
                //result.put("data",list);
                result.put(key,list);
            } else {        //如果是JsonPrimitive（字符串形式的json对象），直接存入；若是JsonObject则继续采用递归方法转化
                result.put(key, value.isJsonObject() ? jsonObject2Map((JsonObject) value) : value.getAsString());
            }
        }
        return result;
    }

    public static String date2String(Date date){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(date);
    }

    public static String getUUID(){
        return UUID.randomUUID().toString().replace("-", "").toLowerCase();
    }
}
