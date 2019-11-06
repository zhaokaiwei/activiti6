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

    /** ���������ľ�����Ϣ��JsonObject����ʽ����
     * @param variableInstances     ����ʵ��List��ֻ������������������õı���
     * @param processInstance       �����������������ʵ��
     * @param historyService
     * @param userId                ��ǰ�û�id
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

        boolean isEnd = processInstance.getEndTime() != null;    // �����Ƿ����
        if (!isEnd){                                // ���û�н�������ȡ����task�Ĵ�������Ϣ��userid��
            HistoricTaskInstanceQuery historicTaskInstanceQuery = historyService
                    .createHistoricTaskInstanceQuery()
                    .processInstanceId(processInstance.getId());
            List<HistoricTaskInstance> tasks = historicTaskInstanceQuery
                    .list().stream().sorted(Comparator.comparing(HistoricTaskInstance::getCreateTime)).collect(Collectors.toList());
            int size = tasks.size();

            // ������
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

    /**��ͨ�����ýӿڷ������ص�����ת����Map
     * @param data ���ýӿڷ������ص�����
     * @return
     */
    public static Map<String,Object> jsonObject2Map(JsonObject data) {
        Map<String, Object> result = new HashMap<>();
        for (Map.Entry<String, JsonElement> entry : data.entrySet()) {      //����json����
            String key = entry.getKey();
            JsonElement value = entry.getValue();
            if (value.isJsonArray()){           //JsonArra
                JsonArray jarr = (JsonArray)value;
                Iterator<JsonElement> iterator = jarr.iterator();
                List<Map<String,Object>> list = new ArrayList<>();      //�����JsonArra��List<Map<String,Object>>����
                while (iterator.hasNext()){         //����JsonArra�е�ÿ��Ԫ�أ��õݹ鷽������ת��
                    JsonObject next = (JsonObject)iterator.next();
                    Map<String, Object> tmp = jsonObject2Map(next);
                    list.add(tmp);
                }
                //result.put("data",list);
                result.put(key,list);
            } else {        //�����JsonPrimitive���ַ�����ʽ��json���󣩣�ֱ�Ӵ��룻����JsonObject��������õݹ鷽��ת��
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
