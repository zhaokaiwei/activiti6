package com.zkw.controller;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.zkw.com.zkw.utils.CommonUtil;
import com.zkw.common.SessionFactorySingleton;
import com.zkw.constant.Constants;
import com.zkw.constant.VariablePrefix;
import com.zkw.mapper.BaseDao;
import com.zkw.service.VacateService;
import org.activiti.engine.*;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricVariableInstance;
import org.activiti.engine.runtime.ProcessInstance;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

/** 请假处理公共类
 * @author zkw
 * @date 2019/10/5 14:41
 */
@Controller
@RequestMapping("/vacate")
public class VacateController {

    @Autowired
    private RuntimeService runtimeService;
    @Autowired
    private HistoryService historyService;
    @Autowired
    private VacateService vacateService;

    /** 加载所有的流程记录
     * @param session session域
     * @return
     */
    @RequestMapping("/loadAllProcesses")
    @ResponseBody
    public Map<String,Object> loadAllProcesses(HttpSession session){
        String userId = session.getAttribute(Constants.SESSION_USER_ID).toString();   // 当前用户的userID

        JsonArray jarr = new JsonArray();
        // 获取该用户参与的所有的流程实例的id
        List<String> processInstancesId = vacateService.listProcessInstancesIdForUser(userId);

        // 通过流程实例id求出流程实例的基本信息（请假申请的信息）
        for (String processInstanceId : processInstancesId){
            List<HistoricVariableInstance> infoForProcess = vacateService.listVariablesFromProcessInstance(processInstanceId)
                    .stream()
                    .filter(m -> m.getVariableName().contains(VariablePrefix.APPLY_) || Objects.equals(m.getVariableName(),"result"))
                    .collect(Collectors.toList());
            //ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
            HistoricProcessInstance processInstance = historyService.createHistoricProcessInstanceQuery().processInstanceId(processInstanceId).list().get(0);
            jarr.add(CommonUtil.variableInstances2Jsonobject(infoForProcess,processInstance,historyService,userId));
        }

        // 构造layui列表格式数据
        JsonObject jobj = new JsonObject();
        jobj.addProperty("code","0");
        jobj.add("data",jarr);
        jobj.addProperty("count",jarr.size());
        Map<String, Object> result = CommonUtil.jsonObject2Map(jobj);

        return result;
    }

    /** 请假申请
     * @param session   session域
     * @param params    request请求参数
     * @return
     * @throws IOException
     */
    @RequestMapping("/apply")
    @ResponseBody
    public Map<String,Object> apply(HttpSession session,@RequestParam Map<String,Object> params) throws IOException {
        vacateService.startProcessInstance(session,params);
        params.clear();
        params.put("code","0");

        return params;
    }

    /** 当前用户对提交给自己的任务进行处理
     * @param session
     * @param params
     * @return
     * @throws IOException
     */
    @RequestMapping("/dealApply")
    @ResponseBody
    public Map<String,Object> dealApply(HttpSession session,@RequestParam Map<String,Object> params) throws IOException {
        vacateService.dealApply(session, params);
        params.clear();
        params.put("code","0");

        return params;
    }

    /** 对于已处理的任务，在下个任务还没被处理之前进行撤回
     * @param session
     * @param params
     * @return
     */
    @RequestMapping("/recall")
    @ResponseBody
    public Map<String,Object> recall(HttpSession session,@RequestParam Map<String,Object> params){
        vacateService.recall(session, params);
        params.clear();
        params.put("code","0");

        return params;
    }

    /** 动态设置流程定义信息
     * @param params
     * @return
     */
    @RequestMapping("/dynamicSet")
    @ResponseBody
    public Map<String,Object> dynamicSet(@RequestParam Map<String,Object> params){
        List<ProcessInstance> list = runtimeService.createProcessInstanceQuery().list();
        if (list.size() > 0){
            params.put("message","存在流程正在审批，不允许修改流程信息！");
            return params;
        }

        vacateService.updateProcessInfo(params);
        params.clear();
        params.put("code","0");

        return params;
    }

    /*———————————————————————————————————————————————分割线————————————————————————————————————————————*/

    /** 分页展示所有的歌曲信息
     * @param params
     * @return
     * @throws IOException
     */
    @RequestMapping("/billboardList")
    @ResponseBody
    public Map<String,Object> billboardList(@RequestParam Map<String,Object> params) throws IOException {
        vacateService.updatePageAttr(params);

        Map<String,Object> map = new HashMap<>();
        SqlSessionFactory sessionFactory = SessionFactorySingleton.getSessionFactory();
        try( SqlSession sqlSession = sessionFactory.openSession(true)){
            BaseDao mapper = sqlSession.getMapper(BaseDao.class);
            List<Map<String, Object>> songs = mapper.listSongs(params);
            map.put("data",songs);
            map.put("count",mapper.getSongsCount(params));
        }
        map.put("code","0");

        return map;
    }
}
