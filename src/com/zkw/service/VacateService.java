package com.zkw.service;

import com.zkw.com.zkw.utils.CommonUtil;
import com.zkw.common.SessionFactorySingleton;
import com.zkw.constant.Constants;
import com.zkw.constant.VariablePrefix;
import com.zkw.mapper.BaseDao;
import org.activiti.bpmn.model.*;
import org.activiti.bpmn.model.Process;
import org.activiti.engine.*;
import org.activiti.engine.history.*;
import org.activiti.engine.identity.Group;
import org.activiti.engine.identity.User;
import org.activiti.engine.impl.identity.Authentication;
import org.activiti.engine.runtime.Execution;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Comment;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class VacateService {

    @Autowired
    private RuntimeService runtimeService;
    @Autowired
    private IdentityService identityService;
    @Autowired
    private RepositoryService repositoryService;
    @Autowired
    private TaskService taskService;
    @Autowired
    private HistoryService historyService;

    /** 开启一个新的流程实例
     * @param session   session域
     * @param params    页面传过来的request参数
     * @throws IOException
     */
    public void startProcessInstance(HttpSession session,Map<String,Object> params) throws IOException {
        Object userId = session.getAttribute(Constants.SESSION_USER_ID);

        /* 学生点击提交按钮 */
        Map<String, Object> variables = new HashMap<>();
        // 开启一个流程实例并配置流程变量
        variables.put(VariablePrefix.APPLY_+"id", userId);
        variables.put(VariablePrefix.APPLY_+"name", session.getAttribute(Constants.SESSION_USER_NAME));
        variables.put(VariablePrefix.APPLY_+"days", new Integer((String)params.get(VariablePrefix.APPLY_+"days")));
        variables.put("days", new Integer((String)params.get(VariablePrefix.APPLY_+"days")));
        variables.put("result", 1);
        variables.put(VariablePrefix.APPLY_+"reason", params.get(VariablePrefix.APPLY_+"reason"));

        ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("vacationRequest",variables);

        // 手动完成“请假申请”task
        HistoricTaskInstance firstTask = historyService
                .createHistoricTaskInstanceQuery()
                .processInstanceId(processInstance.getId()).unfinished().list().get(0);

        taskService.complete(firstTask.getId(),variables);

        insertMessage(processInstance.getId(),false);
    }

    /** 获取流程实例所有的流程变量
     * @param processInstanceId 流程实例id
     * @return
     */
    public List<HistoricVariableInstance> listVariablesFromProcessInstance(String processInstanceId){
        List<HistoricVariableInstance> infoForProcess = historyService.createHistoricVariableInstanceQuery()
                .processInstanceId(processInstanceId)
                .list();
        return infoForProcess;
    }

    public List<HistoricTaskInstance> listTaskInstancesForUser(String userId,String processInstanceId){
        HistoricTaskInstanceQuery historicTaskInstanceQuery = historyService
                .createHistoricTaskInstanceQuery();
        if (StringUtils.isNotEmpty(userId)){
            historicTaskInstanceQuery = historicTaskInstanceQuery.taskAssignee(userId);
        }

        if (StringUtils.isNotEmpty(processInstanceId)){
            historicTaskInstanceQuery = historicTaskInstanceQuery.processInstanceId(processInstanceId);
        }

        List<HistoricTaskInstance> tasks = historicTaskInstanceQuery.list()
                .stream()
                .sorted(Comparator.comparingInt(m -> Integer.valueOf(m.getId())))
                .collect(Collectors.toList());
        return tasks;
    }

    /** 获取该用户参与的所有的流程实例的id，去重
     * @param userId    用户id
     * @return
     */
    public List<String> listProcessInstancesIdForUser(String userId){
        List<HistoricTaskInstance> tasks = historyService
                .createHistoricTaskInstanceQuery()
                .taskAssignee(userId)
                .list();

        // 对于撤回完成的task直接删除，不显示
        for (int i=0;i<tasks.size();){
            HistoricTaskInstance task = tasks.get(i);
            List<Comment> taskComments = taskService.getTaskComments(task.getId());
            if (taskComments.size() > 0){
                tasks.remove(i);
                i=0;
                continue;
            }
            i++;
        }

        List<String> processInstancesId = tasks.stream()
                .map(HistoricTaskInstance::getProcessInstanceId)
                .distinct()
                .collect(Collectors.toList());
        return processInstancesId;
    }

    /** 处理任务
     * @param session
     * @param params
     */
    public void dealApply(HttpSession session, Map<String, Object> params) throws IOException {
        String processInstanceId = (String)params.get("processInstanceId");
        String userId = session.getAttribute(Constants.SESSION_USER_ID).toString();
        String userName = session.getAttribute(Constants.SESSION_USER_NAME).toString();
        String groupName = session.getAttribute(Constants.SESSION_GROUP_NAME).toString();

        // 获取当前处理的流程实例的待办任务
        HistoricTaskInstance currTask = historyService
                .createHistoricTaskInstanceQuery()
                .processInstanceId(processInstanceId)
                .unfinished()
                .list().get(0);

        // 配置任务实例的实例变量
        String prefix = getVariablePrefixByGroupName(groupName);
        Map<String,Object> variables = new HashMap<>();
        variables.put("result", params.get("deal_result"));
        variables.put(prefix+"id", userId);
        variables.put(prefix+"name", userName);
        variables.put(prefix+"result", params.get("deal_result"));
        variables.put(prefix+"comment", params.get("deal_comment"));

        // 完成当前任务
        taskService.complete(currTask.getId(),variables);

        // 如果整个流程还未结束，则插入提醒消息
        HistoricProcessInstance historicProcessInstance = historyService.createHistoricProcessInstanceQuery().processInstanceId(processInstanceId).list().get(0);
        boolean isEnd = historicProcessInstance.getEndTime() != null;
        if (!isEnd){
            insertMessage(processInstanceId,true);
        }
    }

    /** 往数据库插入消息记录，用来提醒前后环节的审批人或流程申请人
     * @param processInstanceId 流程实例id
     * @throws IOException
     */
    public void insertMessage(String processInstanceId,boolean isSendMessage2PreUser) throws IOException {
        // 获取待办任务的处理用户
        String nextTaskUserId = taskService.createTaskQuery().processInstanceId(processInstanceId).list().get(0).getAssignee();

        // 插入提醒消息记录
        SqlSessionFactory sessionFactory = SessionFactorySingleton.getSessionFactory();
        try( SqlSession sqlSession = sessionFactory.openSession()){
            boolean isInsertError = false;

            Map<String,Object> map = new HashMap<>();
            map.put("id",CommonUtil.getUUID());
            map.put("userId",nextTaskUserId);
            map.put("proinstId",processInstanceId);
            map.put("type","1");

            BaseDao mapper = sqlSession.getMapper(BaseDao.class);
            Integer num = mapper.insertMessage(map);
            if (num <= 0){
                isInsertError = true;
            }

            if (isSendMessage2PreUser){
                List<String> userIds = historyService.createHistoricTaskInstanceQuery().processInstanceId(processInstanceId)
                        .finished().list().stream().map(HistoricTaskInstance::getAssignee).collect(Collectors.toList());
                for (String userId : userIds){
                    map.put("id",CommonUtil.getUUID());
                    map.put("userId",userId);
                    map.put("type","0");

                    num = mapper.insertMessage(map);
                    if (num <= 0){
                        isInsertError = true;
                    }
                }
            }

            if (!isInsertError){
                sqlSession.commit();
            }
        }
    }

    /** 通过当前task的审批用户所属group的名字来获取为该task设置的变量的前缀
     * @param groupName 组名称
     * @return
     */
    public String getVariablePrefixByGroupName(String groupName){
        String prefix = "";
        switch (groupName){
            case Constants.GROUP_STUDENT:
                prefix = VariablePrefix.APPLY_;
                break;
            case Constants.GROUP_COUNSELOR:
                prefix = VariablePrefix.TASK1_;
                break;
            case Constants.GROUP_HEAD_TEACHER:
                prefix = VariablePrefix.TASK2_;
                break;
            case Constants.GROUP_DEPUTY_SECRETARY:
                prefix = VariablePrefix.TASK3_;
                break;
            case Constants.GROUP_DEAN:
                prefix = VariablePrefix.TASK4_;
                break;
        }
        return prefix;
    }

    /** 对于已处理的任务，在下个任务还没被处理之前进行撤回
     * @param session
     * @param params
     */
    // 撤回。修改流程定义，完成当前未处理的任务（不添加流程变量），使下一个任务是提出撤回的任务。
    public void recall(HttpSession session, Map<String, Object> params){
        String userId = (String) session.getAttribute(Constants.SESSION_USER_ID);
        String groupName = session.getAttribute(Constants.SESSION_GROUP_NAME).toString();
        String processInstanceId = params.get("processInstanceId").toString();

        // 若在“学生申请”环节就撤回，则直接删除整个流程实例
        if (Objects.equals(groupName,Constants.GROUP_STUDENT)){
            runtimeService.deleteProcessInstance(processInstanceId,"学生撤销了");
            historyService.deleteHistoricProcessInstance(processInstanceId);
            return ;
        }

        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
        if (processInstance == null){
            throw new RuntimeException("流程未启动或已执行完成，无法撤回");
        }

        String processDefinitionId = processInstance.getProcessDefinitionId();

        // 获取当前用户参与的该流程实例的最后一个任务
        List<HistoricTaskInstance> myTasks = listTaskInstancesForUser(userId,processInstanceId)
                                            .stream()
                                            .sorted(Comparator.comparing(HistoricTaskInstance::getStartTime))
                                            .collect(Collectors.toList());
        Collections.reverse(myTasks);
        HistoricTaskInstance myLastTask = myTasks.get(0);

        // 获取该流程实例的已完成的最后一个任务
        HistoricTaskInstance finishedLastTask = historyService.createHistoricTaskInstanceQuery().processInstanceId(processInstanceId)
                .finished().orderByHistoricTaskInstanceStartTime().desc().list().get(0);

        HistoricTaskInstance unfinishedLastTask = historyService.createHistoricTaskInstanceQuery().processInstanceId(processInstanceId).unfinished().list().get(0);

        // 判断两个任务是否是同一个任务，不是则说明数据过时，即提交后任务已被处理
        if(!Objects.equals(myLastTask.getId(),finishedLastTask.getId())) {
            throw new RuntimeException("该任务非当前用户提交，无法撤回");
        }

        BpmnModel bpmnModel = repositoryService.getBpmnModel(processDefinitionId);                      // 获取流程定义的模型

        String myActivityId = null;
        List<HistoricActivityInstance> haiList = historyService.createHistoricActivityInstanceQuery()   // 获取当前excution的所有activity，即流程定义中的每一个node
                .executionId(myLastTask.getExecutionId()).finished().list();
        for(HistoricActivityInstance hai : haiList) {                                                   // 获取我想撤回的任务的activityId
            if(myLastTask.getId().equals(hai.getTaskId())) {
                myActivityId = hai.getActivityId();
                break;
            }
        }
        FlowNode myFlowNode = (FlowNode) bpmnModel.getMainProcess().getFlowElement(myActivityId);       // 获取我想撤回的任务的流程对象

        // 获取该流程实例所执行的execution
        Execution execution = runtimeService.createExecutionQuery().executionId(myLastTask.getExecutionId()).singleResult();

        // 备份要撤回任务的下一个流程对象（任务）
        String activityId = execution.getActivityId();
        FlowNode flowNode = (FlowNode) bpmnModel.getMainProcess().getFlowElement(activityId);

        //记录原活动方向
        List<SequenceFlow> oriSequenceFlows = new ArrayList<>();
        oriSequenceFlows.addAll(flowNode.getOutgoingFlows());

        //清理活动方向
        flowNode.getOutgoingFlows().clear();
        //建立新方向
        List<SequenceFlow> newSequenceFlowList = new ArrayList<>();
        SequenceFlow newSequenceFlow = new SequenceFlow();
        newSequenceFlow.setId("newSequenceFlowId");
        newSequenceFlow.setSourceFlowElement(flowNode);
        newSequenceFlow.setTargetFlowElement(myFlowNode);
        newSequenceFlowList.add(newSequenceFlow);
        flowNode.setOutgoingFlows(newSequenceFlowList);

        Authentication.setAuthenticatedUserId(userId);
        taskService.addComment(unfinishedLastTask.getId(), unfinishedLastTask.getProcessInstanceId(), "撤回");

        //完成任务
        taskService.complete(unfinishedLastTask.getId());
        //恢复原方向
        flowNode.setOutgoingFlows(oriSequenceFlows);

        // 删除用户参与的task的历史实例变量以及后面的unfinishedLastTask，但是对应task的实例变量不会被删除
        historyService.deleteHistoricTaskInstance(myLastTask.getId());
        historyService.deleteHistoricTaskInstance(unfinishedLastTask.getId());
    }


    /**  获取当前申请（流程实例）的处理进度的详细信息
     * @param processInstanceId 流程实例id
     * @return 流程实例每个环节的信息
     */
    public Map<String, List<Object>> scan(String processInstanceId) {
        // 获取所有已经完成的task
        List<HistoricTaskInstance> tasks = historyService.createHistoricTaskInstanceQuery().processInstanceId(processInstanceId).finished().list();

        // 将所有已完成的task的用户对应的变量前缀存入list中
        List<String> prefixs = new ArrayList<>();
        for (HistoricTaskInstance task : tasks){
            String groupName = identityService.createGroupQuery().groupMember(task.getAssignee()).list().get(0).getName();
            String variablePrefix = getVariablePrefixByGroupName(groupName);
            prefixs.add(variablePrefix);
        }

        // 获取所有的已完成task的实例变量
        Map<String, List<Object>> collect = historyService.createHistoricVariableInstanceQuery().processInstanceId(processInstanceId).list().stream().filter(m -> {
            for (String prefix : prefixs) {
                if (m.getVariableName().lastIndexOf(prefix) != -1) {
                    return true;
                }
            }
            return false;
        }).collect(Collectors.toMap(HistoricVariableInstance::getVariableName, m -> {
            List<Object> values = new ArrayList<>();
            values.add(m.getValue());
            values.add(CommonUtil.date2String(m.getCreateTime()));

            return values;
        }));

        return collect;
    }

    /** 获取当前用户所有的未读消息
     * @param userId
     * @return
     */
    public List<String> listMessages(String userId) throws IOException {
        boolean isDeleteError = false;
        List<Map<String, Object>> messages = null;
        List<String> wordMessages = new ArrayList<>();
        SqlSessionFactory sessionFactory = SessionFactorySingleton.getSessionFactory();
        try( SqlSession session = sessionFactory.openSession()){
            BaseDao mapper = session.getMapper(BaseDao.class);
            messages = mapper.listMessages(userId);

            // 构造页面展示的消息数据结构
            String record = "";
            for (Map<String, Object> message : messages){
                String type = message.get("type").toString();
                if (Objects.equals(type,"0")){
                    record = "您id为"+message.get("proinst_id").toString()+"的请假申请的处理进度已更新！";
                }else{
                    record = "id为"+message.get("proinst_id").toString()+"的请假申请需要您进行处理！";
                }
                wordMessages.add(record);

                // 删掉数据库记录
                Integer num = mapper.deleteMessage(message.get("id").toString());
                if (num <= 0){
                    isDeleteError = true;
                }
            }

            if (!isDeleteError){
                session.commit();
            }
        }

        return wordMessages;
    }

    /** 获取流程定义的信息，转换成方便在页面进行展示的数据结构
     * @return
     */
    public List<Map<String,Object>> getProcessDefinitionInfo() {
        BpmnModel bpmnModel = repositoryService.getBpmnModel("vacationRequest:1:38");
        Process mainProcess = bpmnModel.getMainProcess();
        List<FlowElement> flowElements = (ArrayList<FlowElement>)mainProcess.getFlowElements();
        
        List<Map<String,Object>> list = new ArrayList<>();
        // 遍历所有流程节点
        for (FlowElement flowElement : flowElements){
            // 如果是排他网关
            if (flowElement instanceof ExclusiveGateway){
                Map<String,Object> map = new HashMap<>();
                ExclusiveGateway egw = (ExclusiveGateway) flowElement;  //排他网关

                //获取前一个task的assignee
                SequenceFlow incoming = egw.getIncomingFlows().get(0);
                UserTask userTask = (UserTask)incoming.getSourceFlowElement();
                String assignee = userTask.getAssignee();
                map.put("assignee",assignee);
                map.put("taskId",userTask.getId());
                
                //获取后一天sequenFlow的条件
                List<SequenceFlow> outgoingFlows = egw.getOutgoingFlows();
                map.put("refuse_id",outgoingFlows.get(0).getId());
                map.put("agree_id",outgoingFlows.get(1).getId());

                String conditionExpression = outgoingFlows.get(0).getConditionExpression();
                int length = conditionExpression.length();
                conditionExpression = conditionExpression.substring(conditionExpression.indexOf("<="), length - 1);
                int days = Integer.valueOf(conditionExpression.replace("<=", "").trim());
                map.put("days",days);

                list.add(map);
            }
        }

        for (FlowElement flowElement : flowElements){
            // 如果是结束节点，则获取前面的校长审批任务节点
            if (flowElement instanceof EndEvent){
                Map<String,Object> map = new HashMap<>();
                EndEvent endEvent = (EndEvent) flowElement;
                UserTask deanTask = (UserTask)endEvent.getIncomingFlows().get(0).getSourceFlowElement();
                map.put("assignee",deanTask.getAssignee());
                map.put("taskId",deanTask.getId());
                list.add(map);
            }
        }

        return list;
    }

    /** 获取所有组的所有用户信息
     * @return
     */
    public Map<String,List<User>> listUsersByGroup(){
        Map<String,List<User>> map = new HashMap<>();

        // 获取所有组信息
        List<Group> groups = identityService.createGroupQuery().list();

        for (Group group : groups){
            List<User> users = identityService.createUserQuery().memberOfGroup(group.getId()).list();
            map.put(group.getName(),users);
        }

        return map;
    }

    /** 更新流程定义信息
     * @param params request请求参数
     */
    public void updateProcessInfo(Map<String, Object> params) {
        BpmnModel bpmnModel = repositoryService.getBpmnModel("vacationRequest:1:38");
        Process mainProcess = bpmnModel.getMainProcess();
        Map<String, FlowElement> flowElementMap = mainProcess.getFlowElementMap();
        String[] prefixArr = new String[]{"c_","ht_","ds_"};

        // 设置辅导员审批、班主任审批、副校长审批这三个环节的相关信息
        for (String prefix : prefixArr){
            // 重设审批人
            UserTask task = (UserTask)flowElementMap.get(params.get(prefix+"taskId"));
            task.setAssignee((String)params.get(prefix+"assignee"));

            // 重设审批天数
            String conditionId = (String)params.get(prefix+"conditionId");
            String[] ids = conditionId.split("@");
            SequenceFlow refuse_flow = (SequenceFlow) flowElementMap.get(ids[0]);
            refuse_flow.setConditionExpression("${result == 0 || result == 1  &&  days <= "+params.get(prefix+"days")+"}");
            SequenceFlow agree_flow = (SequenceFlow) flowElementMap.get(ids[1]);
            agree_flow.setConditionExpression("${result == 1  &&  days > "+params.get(prefix+"days")+"}");
        }

        // 设置校长审批环节的审批人
        UserTask task = (UserTask)flowElementMap.get(params.get("d_taskId"));
        task.setAssignee((String)params.get("d_assignee"));
    }

    /** 更新params参数中的分页属性的值
     * @param params
     */
    public void updatePageAttr(Map<String,Object> params){
        String page = (String) params.get("page");
        if (page != null){
            Integer limit = Integer.valueOf((String) params.get("limit"));
            params.put("page",(Integer.valueOf(page)-1)*limit);
            params.put("limit",limit);
        }
    }
}
