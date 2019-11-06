import com.zkw.constant.VariablePrefix;
import org.activiti.bpmn.model.*;
import org.activiti.bpmn.model.Process;
import org.activiti.engine.*;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.identity.Group;
import org.activiti.engine.identity.User;
import org.activiti.engine.impl.db.DbSchemaCreate;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.*;

public class Initial {

    private static RuntimeService runtimeService;
    private static IdentityService identityService;
    private static RepositoryService repositoryService;
    private static TaskService taskService;
    private static HistoryService historyService;
    private static DynamicBpmnService dynamicBpmnService;

    @BeforeAll
    public static void initAll(){
        //System.out.println("initAll");
        ProcessEngine defaultProcessEngine = ProcessEngines.getDefaultProcessEngine();
        runtimeService = defaultProcessEngine.getRuntimeService();
        identityService = defaultProcessEngine.getIdentityService();
        repositoryService = defaultProcessEngine.getRepositoryService();
        taskService = defaultProcessEngine.getTaskService();
        historyService = defaultProcessEngine.getHistoryService();
        dynamicBpmnService = defaultProcessEngine.getDynamicBpmnService();
    }

    /**
     * 初始化数据库（建表）
     */
    @Test
    public void initDB(){
        DbSchemaCreate.main(new String[3]);
    }

    /**
     * 初始化流程：创建组和用户、部署流程定义、开启一个实例、对实例的任务进行处理
     */
    @Test
    public void initProcess(){
        createGroup();
        createUsers();
        deployProcess();
    }

    /**
     * 创建角色
     */
    @Test
    public void createGroup(){
        Group students = identityService.newGroup("1");                         //学生组
        students.setName("students");
        identityService.saveGroup(students);

        Group counselors = identityService.newGroup("2");                       //辅导员组
        counselors.setName("counselor");
        identityService.saveGroup(counselors);

        Group head_teachers = identityService.newGroup("3");                    //班主任组
        head_teachers.setName("head_teachers");
        identityService.saveGroup(head_teachers);

        Group deputy_secretarys = identityService.newGroup("4");                //副书记组
        deputy_secretarys.setName("deputy_secretary");
        identityService.saveGroup(deputy_secretarys);

        Group deans = identityService.newGroup("5");                            //院长组
        deans.setName("dean");
        identityService.saveGroup(deans);
    }

    /**
     * 创建用户
     */
    @Test
    public void createUsers(){
        int id = 1;
        User user = null;

        // 20个学生
        for (;id<=20;++id){
            String userid = "s"+id;
            user = identityService.newUser(userid);
            user.setFirstName("student-"+id);
            user.setPassword("1234");
            identityService.saveUser(user);
            identityService.createMembership(userid,"1");
        }

        // 5个辅导员
        for (;id<=25;++id){
            String userid = "c"+id;
            user = identityService.newUser(userid);
            user.setFirstName("counselor-"+id);
            user.setPassword("1234");
            identityService.saveUser(user);
            identityService.createMembership(userid,"2");
        }

        // 5个班主任
        for (;id<=30;++id){
            String userid = "ht"+id;
            user = identityService.newUser(userid);
            user.setFirstName("head_teachers-"+id);
            user.setPassword("1234");
            identityService.saveUser(user);
            identityService.createMembership(userid,"3");
        }

        // 2个副书记
        for (;id<=32;++id){
            String userid = "ds"+id;
            user = identityService.newUser(userid);
            user.setFirstName("deputy_secretary-"+id);
            user.setPassword("1234");
            identityService.saveUser(user);
            identityService.createMembership(userid,"4");
        }

        // 2个院长
        for (;id<=34;++id){
            String userid = "d"+id;
            user = identityService.newUser(userid);
            user.setFirstName("dean-"+id);
            user.setPassword("1234");
            identityService.saveUser(user);
            identityService.createMembership(userid,"5");
        }
    }

    /**
     * 部署流程定义
     */
    @Test
    public void deployProcess(){
        /* 部署流程定义 */
        repositoryService.createDeployment()
                .addClasspathResource("processes/vacate.bpmn20.xml")
                .deploy();
        System.out.println("Number of process definitions: " + repositoryService.createProcessDefinitionQuery().count());

        /* 删除流程定义的部署 *//*
        repositoryService.deleteDeployment("vacationRequest");*/
    }

    /**
     * 开启一个流程实例
     */
    @Test
    public void startProcessInstance(){
        /* 学生点击提交按钮 */
        Map<String, Object> variables = new HashMap<>();
        variables.put(VariablePrefix.APPLY_+"id", "s1");
        variables.put(VariablePrefix.APPLY_+"name", "student-1");
        variables.put(VariablePrefix.APPLY_+"days", new Integer(7));
        variables.put("days", new Integer(7));
        variables.put(VariablePrefix.APPLY_+"reason", "tired");

        runtimeService.startProcessInstanceByKey("vacationRequest", variables);
    }

    @Test
    public void counselorDealTasks(){
        /* 辅导员审批 */
        List<Task> counselorTasks = taskService.createTaskQuery().taskCandidateOrAssigned("c23").list();      // 获取遍历所有的待办任务
        Task counselorTask = counselorTasks.get(0);

        Map<String, Object> taskVariables = new HashMap<>();
        taskVariables.put("result", "1");
        taskVariables.put(VariablePrefix.TASK1_+"id", "c23");
        taskVariables.put(VariablePrefix.TASK1_+"name", "counselor-23");
        taskVariables.put(VariablePrefix.TASK1_+"result", "1");
        taskVariables.put(VariablePrefix.TASK1_+"comment", "不是说好996的吗？");
        taskService.complete(counselorTask.getId(), taskVariables);
    }

    @Test
    public void head_teacherDealTasks(){
        /* 班主任审批 */
        List<Task> tasksHead_teacher = taskService.createTaskQuery().taskCandidateOrAssigned("27").list();      // 获取遍历所有的待办任务
        Task taskHead_teacher = tasksHead_teacher.get(0);

        Map<String, Object> taskVariables = new HashMap<>();
        taskVariables.put("result", "1");
        taskVariables.put(VariablePrefix.TASK2_+"id", "ht27");
        taskVariables.put(VariablePrefix.TASK2_+"name", "head_teacher-27");
        taskVariables.put(VariablePrefix.TASK2_+"result", "1");
        taskVariables.put(VariablePrefix.TASK2_+"comment", "不是说好996的吗？");
        taskService.complete(taskHead_teacher.getId(), taskVariables);
    }

    @Test
    public void deputy_secretaryDealTasks(){
        /* 副书记审批 */
        List<Task> tasksHead_teacher = taskService.createTaskQuery().taskCandidateOrAssigned("31").list();      // 获取遍历所有的待办任务
        Task taskHead_teacher = tasksHead_teacher.get(0);

        Map<String, Object> taskVariables = new HashMap<>();
        taskVariables.put("result", "1");
        taskVariables.put(VariablePrefix.TASK3_+"id", "ds31");
        taskVariables.put(VariablePrefix.TASK3_+"name", "deputy_secretary-31");
        taskVariables.put(VariablePrefix.TASK3_+"result", "1");
        taskVariables.put(VariablePrefix.TASK3_+"comment", "不是说好996的吗？");
        taskService.complete(taskHead_teacher.getId(), taskVariables);
    }

    @Test
    public void deanDealTasks(){
        /* 院长审批 */
        List<Task> tasksHead_teacher = taskService.createTaskQuery().taskCandidateOrAssigned("34").list();      // 获取遍历所有的待办任务
        Task taskHead_teacher = tasksHead_teacher.get(0);

        Map<String, Object> taskVariables = new HashMap<>();
        taskVariables.put("result", "1");
        taskVariables.put(VariablePrefix.TASK4_+"id", "d34");
        taskVariables.put(VariablePrefix.TASK4_+"name", "dean-34");
        taskVariables.put(VariablePrefix.TASK4_+"result", "1");
        taskVariables.put(VariablePrefix.TASK4_+"comment", "不是说好996的吗？");
        taskService.complete(taskHead_teacher.getId(), taskVariables);
    }

    @Test
    public void execeteAllNodes(){
        counselorDealTasks();
        head_teacherDealTasks();
        deputy_secretaryDealTasks();
        deanDealTasks();
    }

    /**
     * 查看所有的审批数据，在用户每次登陆的时候展示所有用户参与过的流程信息
     */
    @Test
    public void scanAllApprovalData(){
        List<HistoricTaskInstance> list = historyService
                .createHistoricTaskInstanceQuery()
                .taskAssignee("s1").list();
        String processInstanceId = list.get(0).getProcessInstanceId();
        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();

   /*     List<HistoricVariableInstance> list1 = historyService.createHistoricVariableInstanceQuery()
                .processInstanceId(processInstanceId)
                .orderByProcessInstanceId()
                .asc()
                .list();*/
                
        System.out.println();
    }

    @Test
    public void getTaskVariables(){
        /*ObjectNode jsonNodes = dynamicBpmnService.changeUserTaskAssignee(DynamicBpmnConstants.USER_TASK_ASSIGNEE, "24");
        dynamicBpmnService.saveProcessDefinitionInfo("vacationRequest:1:38",jsonNodes);
        ObjectNode c24 = dynamicBpmnService.getProcessDefinitionInfo("vacationRequest:1:38");*/

        BpmnModel bpmnModel = repositoryService.getBpmnModel("vacationRequest:1:38");
        Process mainProcess = bpmnModel.getMainProcess();
        /*List<FlowElement> flowElements = (ArrayList<FlowElement>)mainProcess.getFlowElements();
        FlowElement flowElement = flowElements.get(2);
        boolean flag = flowElement instanceof ExclusiveGateway;*/
        Map<String, FlowElement> flowElementMap = mainProcess.getFlowElementMap();

        /*UserTask userTask = (UserTask)flowElements.get(1);
        userTask.setAssignee("c24");*/
        System.out.printf("");
    }
    
/*    每一级任何时候都可以查看请假的处理进度和结果：.getTasks()可以获取该实例中所有的task，
    然后遍历所有task并获取所有已经处理的task的变量，并展示在用通过processInstance户参与的流程页面中*/
}
