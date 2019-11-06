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

    /** ����һ���µ�����ʵ��
     * @param session   session��
     * @param params    ҳ�洫������request����
     * @throws IOException
     */
    public void startProcessInstance(HttpSession session,Map<String,Object> params) throws IOException {
        Object userId = session.getAttribute(Constants.SESSION_USER_ID);

        /* ѧ������ύ��ť */
        Map<String, Object> variables = new HashMap<>();
        // ����һ������ʵ�����������̱���
        variables.put(VariablePrefix.APPLY_+"id", userId);
        variables.put(VariablePrefix.APPLY_+"name", session.getAttribute(Constants.SESSION_USER_NAME));
        variables.put(VariablePrefix.APPLY_+"days", new Integer((String)params.get(VariablePrefix.APPLY_+"days")));
        variables.put("days", new Integer((String)params.get(VariablePrefix.APPLY_+"days")));
        variables.put("result", 1);
        variables.put(VariablePrefix.APPLY_+"reason", params.get(VariablePrefix.APPLY_+"reason"));

        ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("vacationRequest",variables);

        // �ֶ���ɡ�������롱task
        HistoricTaskInstance firstTask = historyService
                .createHistoricTaskInstanceQuery()
                .processInstanceId(processInstance.getId()).unfinished().list().get(0);

        taskService.complete(firstTask.getId(),variables);

        insertMessage(processInstance.getId(),false);
    }

    /** ��ȡ����ʵ�����е����̱���
     * @param processInstanceId ����ʵ��id
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

    /** ��ȡ���û���������е�����ʵ����id��ȥ��
     * @param userId    �û�id
     * @return
     */
    public List<String> listProcessInstancesIdForUser(String userId){
        List<HistoricTaskInstance> tasks = historyService
                .createHistoricTaskInstanceQuery()
                .taskAssignee(userId)
                .list();

        // ���ڳ�����ɵ�taskֱ��ɾ��������ʾ
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

    /** ��������
     * @param session
     * @param params
     */
    public void dealApply(HttpSession session, Map<String, Object> params) throws IOException {
        String processInstanceId = (String)params.get("processInstanceId");
        String userId = session.getAttribute(Constants.SESSION_USER_ID).toString();
        String userName = session.getAttribute(Constants.SESSION_USER_NAME).toString();
        String groupName = session.getAttribute(Constants.SESSION_GROUP_NAME).toString();

        // ��ȡ��ǰ���������ʵ���Ĵ�������
        HistoricTaskInstance currTask = historyService
                .createHistoricTaskInstanceQuery()
                .processInstanceId(processInstanceId)
                .unfinished()
                .list().get(0);

        // ��������ʵ����ʵ������
        String prefix = getVariablePrefixByGroupName(groupName);
        Map<String,Object> variables = new HashMap<>();
        variables.put("result", params.get("deal_result"));
        variables.put(prefix+"id", userId);
        variables.put(prefix+"name", userName);
        variables.put(prefix+"result", params.get("deal_result"));
        variables.put(prefix+"comment", params.get("deal_comment"));

        // ��ɵ�ǰ����
        taskService.complete(currTask.getId(),variables);

        // ����������̻�δ�����������������Ϣ
        HistoricProcessInstance historicProcessInstance = historyService.createHistoricProcessInstanceQuery().processInstanceId(processInstanceId).list().get(0);
        boolean isEnd = historicProcessInstance.getEndTime() != null;
        if (!isEnd){
            insertMessage(processInstanceId,true);
        }
    }

    /** �����ݿ������Ϣ��¼����������ǰ�󻷽ڵ������˻�����������
     * @param processInstanceId ����ʵ��id
     * @throws IOException
     */
    public void insertMessage(String processInstanceId,boolean isSendMessage2PreUser) throws IOException {
        // ��ȡ��������Ĵ����û�
        String nextTaskUserId = taskService.createTaskQuery().processInstanceId(processInstanceId).list().get(0).getAssignee();

        // ����������Ϣ��¼
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

    /** ͨ����ǰtask�������û�����group����������ȡΪ��task���õı�����ǰ׺
     * @param groupName ������
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

    /** �����Ѵ�����������¸�����û������֮ǰ���г���
     * @param session
     * @param params
     */
    // ���ء��޸����̶��壬��ɵ�ǰδ��������񣨲�������̱�������ʹ��һ��������������ص�����
    public void recall(HttpSession session, Map<String, Object> params){
        String userId = (String) session.getAttribute(Constants.SESSION_USER_ID);
        String groupName = session.getAttribute(Constants.SESSION_GROUP_NAME).toString();
        String processInstanceId = params.get("processInstanceId").toString();

        // ���ڡ�ѧ�����롱���ھͳ��أ���ֱ��ɾ����������ʵ��
        if (Objects.equals(groupName,Constants.GROUP_STUDENT)){
            runtimeService.deleteProcessInstance(processInstanceId,"ѧ��������");
            historyService.deleteHistoricProcessInstance(processInstanceId);
            return ;
        }

        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
        if (processInstance == null){
            throw new RuntimeException("����δ��������ִ����ɣ��޷�����");
        }

        String processDefinitionId = processInstance.getProcessDefinitionId();

        // ��ȡ��ǰ�û�����ĸ�����ʵ�������һ������
        List<HistoricTaskInstance> myTasks = listTaskInstancesForUser(userId,processInstanceId)
                                            .stream()
                                            .sorted(Comparator.comparing(HistoricTaskInstance::getStartTime))
                                            .collect(Collectors.toList());
        Collections.reverse(myTasks);
        HistoricTaskInstance myLastTask = myTasks.get(0);

        // ��ȡ������ʵ��������ɵ����һ������
        HistoricTaskInstance finishedLastTask = historyService.createHistoricTaskInstanceQuery().processInstanceId(processInstanceId)
                .finished().orderByHistoricTaskInstanceStartTime().desc().list().get(0);

        HistoricTaskInstance unfinishedLastTask = historyService.createHistoricTaskInstanceQuery().processInstanceId(processInstanceId).unfinished().list().get(0);

        // �ж����������Ƿ���ͬһ�����񣬲�����˵�����ݹ�ʱ�����ύ�������ѱ�����
        if(!Objects.equals(myLastTask.getId(),finishedLastTask.getId())) {
            throw new RuntimeException("������ǵ�ǰ�û��ύ���޷�����");
        }

        BpmnModel bpmnModel = repositoryService.getBpmnModel(processDefinitionId);                      // ��ȡ���̶����ģ��

        String myActivityId = null;
        List<HistoricActivityInstance> haiList = historyService.createHistoricActivityInstanceQuery()   // ��ȡ��ǰexcution������activity�������̶����е�ÿһ��node
                .executionId(myLastTask.getExecutionId()).finished().list();
        for(HistoricActivityInstance hai : haiList) {                                                   // ��ȡ���볷�ص������activityId
            if(myLastTask.getId().equals(hai.getTaskId())) {
                myActivityId = hai.getActivityId();
                break;
            }
        }
        FlowNode myFlowNode = (FlowNode) bpmnModel.getMainProcess().getFlowElement(myActivityId);       // ��ȡ���볷�ص���������̶���

        // ��ȡ������ʵ����ִ�е�execution
        Execution execution = runtimeService.createExecutionQuery().executionId(myLastTask.getExecutionId()).singleResult();

        // ����Ҫ�����������һ�����̶�������
        String activityId = execution.getActivityId();
        FlowNode flowNode = (FlowNode) bpmnModel.getMainProcess().getFlowElement(activityId);

        //��¼ԭ�����
        List<SequenceFlow> oriSequenceFlows = new ArrayList<>();
        oriSequenceFlows.addAll(flowNode.getOutgoingFlows());

        //��������
        flowNode.getOutgoingFlows().clear();
        //�����·���
        List<SequenceFlow> newSequenceFlowList = new ArrayList<>();
        SequenceFlow newSequenceFlow = new SequenceFlow();
        newSequenceFlow.setId("newSequenceFlowId");
        newSequenceFlow.setSourceFlowElement(flowNode);
        newSequenceFlow.setTargetFlowElement(myFlowNode);
        newSequenceFlowList.add(newSequenceFlow);
        flowNode.setOutgoingFlows(newSequenceFlowList);

        Authentication.setAuthenticatedUserId(userId);
        taskService.addComment(unfinishedLastTask.getId(), unfinishedLastTask.getProcessInstanceId(), "����");

        //�������
        taskService.complete(unfinishedLastTask.getId());
        //�ָ�ԭ����
        flowNode.setOutgoingFlows(oriSequenceFlows);

        // ɾ���û������task����ʷʵ�������Լ������unfinishedLastTask�����Ƕ�Ӧtask��ʵ���������ᱻɾ��
        historyService.deleteHistoricTaskInstance(myLastTask.getId());
        historyService.deleteHistoricTaskInstance(unfinishedLastTask.getId());
    }


    /**  ��ȡ��ǰ���루����ʵ�����Ĵ�����ȵ���ϸ��Ϣ
     * @param processInstanceId ����ʵ��id
     * @return ����ʵ��ÿ�����ڵ���Ϣ
     */
    public Map<String, List<Object>> scan(String processInstanceId) {
        // ��ȡ�����Ѿ���ɵ�task
        List<HistoricTaskInstance> tasks = historyService.createHistoricTaskInstanceQuery().processInstanceId(processInstanceId).finished().list();

        // ����������ɵ�task���û���Ӧ�ı���ǰ׺����list��
        List<String> prefixs = new ArrayList<>();
        for (HistoricTaskInstance task : tasks){
            String groupName = identityService.createGroupQuery().groupMember(task.getAssignee()).list().get(0).getName();
            String variablePrefix = getVariablePrefixByGroupName(groupName);
            prefixs.add(variablePrefix);
        }

        // ��ȡ���е������task��ʵ������
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

    /** ��ȡ��ǰ�û����е�δ����Ϣ
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

            // ����ҳ��չʾ����Ϣ���ݽṹ
            String record = "";
            for (Map<String, Object> message : messages){
                String type = message.get("type").toString();
                if (Objects.equals(type,"0")){
                    record = "��idΪ"+message.get("proinst_id").toString()+"���������Ĵ�������Ѹ��£�";
                }else{
                    record = "idΪ"+message.get("proinst_id").toString()+"�����������Ҫ�����д���";
                }
                wordMessages.add(record);

                // ɾ�����ݿ��¼
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

    /** ��ȡ���̶������Ϣ��ת���ɷ�����ҳ�����չʾ�����ݽṹ
     * @return
     */
    public List<Map<String,Object>> getProcessDefinitionInfo() {
        BpmnModel bpmnModel = repositoryService.getBpmnModel("vacationRequest:1:38");
        Process mainProcess = bpmnModel.getMainProcess();
        List<FlowElement> flowElements = (ArrayList<FlowElement>)mainProcess.getFlowElements();
        
        List<Map<String,Object>> list = new ArrayList<>();
        // �����������̽ڵ�
        for (FlowElement flowElement : flowElements){
            // �������������
            if (flowElement instanceof ExclusiveGateway){
                Map<String,Object> map = new HashMap<>();
                ExclusiveGateway egw = (ExclusiveGateway) flowElement;  //��������

                //��ȡǰһ��task��assignee
                SequenceFlow incoming = egw.getIncomingFlows().get(0);
                UserTask userTask = (UserTask)incoming.getSourceFlowElement();
                String assignee = userTask.getAssignee();
                map.put("assignee",assignee);
                map.put("taskId",userTask.getId());
                
                //��ȡ��һ��sequenFlow������
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
            // ����ǽ����ڵ㣬���ȡǰ���У����������ڵ�
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

    /** ��ȡ������������û���Ϣ
     * @return
     */
    public Map<String,List<User>> listUsersByGroup(){
        Map<String,List<User>> map = new HashMap<>();

        // ��ȡ��������Ϣ
        List<Group> groups = identityService.createGroupQuery().list();

        for (Group group : groups){
            List<User> users = identityService.createUserQuery().memberOfGroup(group.getId()).list();
            map.put(group.getName(),users);
        }

        return map;
    }

    /** �������̶�����Ϣ
     * @param params request�������
     */
    public void updateProcessInfo(Map<String, Object> params) {
        BpmnModel bpmnModel = repositoryService.getBpmnModel("vacationRequest:1:38");
        Process mainProcess = bpmnModel.getMainProcess();
        Map<String, FlowElement> flowElementMap = mainProcess.getFlowElementMap();
        String[] prefixArr = new String[]{"c_","ht_","ds_"};

        // ���ø���Ա��������������������У���������������ڵ������Ϣ
        for (String prefix : prefixArr){
            // ����������
            UserTask task = (UserTask)flowElementMap.get(params.get(prefix+"taskId"));
            task.setAssignee((String)params.get(prefix+"assignee"));

            // ������������
            String conditionId = (String)params.get(prefix+"conditionId");
            String[] ids = conditionId.split("@");
            SequenceFlow refuse_flow = (SequenceFlow) flowElementMap.get(ids[0]);
            refuse_flow.setConditionExpression("${result == 0 || result == 1  &&  days <= "+params.get(prefix+"days")+"}");
            SequenceFlow agree_flow = (SequenceFlow) flowElementMap.get(ids[1]);
            agree_flow.setConditionExpression("${result == 1  &&  days > "+params.get(prefix+"days")+"}");
        }

        // ����У���������ڵ�������
        UserTask task = (UserTask)flowElementMap.get(params.get("d_taskId"));
        task.setAssignee((String)params.get("d_assignee"));
    }

    /** ����params�����еķ�ҳ���Ե�ֵ
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
