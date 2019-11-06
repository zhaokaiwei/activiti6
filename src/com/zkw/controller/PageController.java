package com.zkw.controller;

import com.zkw.common.SessionFactorySingleton;
import com.zkw.mapper.BaseDao;
import com.zkw.service.VacateService;
import org.activiti.engine.history.HistoricVariableInstance;
import org.activiti.engine.identity.User;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.*;

/** 匈中柳廬陣崙蚊
 * @author zkw
 * @date 2019/10/5 14:43
 */
@Controller
@RequestMapping("/page")
public class PageController {

    @Autowired
    private VacateService vacateService;

    @RequestMapping("/my_processes")
    public String my_processes(){
        return "home/myAllProcesses";
    }

    @RequestMapping("/vacate_apply")
    public String vacate_apply(){
        return "home/vacate_apply";
    }

    @RequestMapping("/scan")
    public String scan(Model model, String processInstanceId){
        Map<String,List<Object>> variables = vacateService.scan(processInstanceId);
        model.addAttribute("variables",variables);

        return "home/scan";
    }

    @RequestMapping("/dealApply")
    public String dealApply(Model model, String processInstanceId){
        List<HistoricVariableInstance> historicVariableInstances = vacateService.listVariablesFromProcessInstance(processInstanceId);
        model.addAttribute("processInfo",historicVariableInstances);
        model.addAttribute("processInstanceId",processInstanceId);

        return "home/dealApply";
    }

    @RequestMapping("/dynamicSet")
    public String dynamicSet(Model model){
        //資函匈中婢幣佚連
        List<Map<String, Object>> dynamicInfo = vacateService.getProcessDefinitionInfo();

        //資函侭嗤議喘薩佚連旺蛍窃
        Map<String, List<User>> users = vacateService.listUsersByGroup();

        model.addAttribute("dynamicInfo",dynamicInfo);
        model.addAttribute("users",users);

        return "home/dynamicSet";
    }


    /*！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！蛍護�漾�！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！*/

    @RequestMapping("/billboardList")
    public String billboardList(){

        return "billboard/list";
    }

    @RequestMapping("/printArtists")
    public String printArtists(Model model) throws IOException {

        SqlSessionFactory sessionFactory = SessionFactorySingleton.getSessionFactory();
        try( SqlSession sqlSession = sessionFactory.openSession(true)){
            BaseDao mapper = sqlSession.getMapper(BaseDao.class);
            List<String> artists = mapper.listArtists();
            model.addAttribute("artists",artists);
        }

        return "billboard/printArtists";
    }

    @RequestMapping("/listTop5SongsAndNum")
    public String listTop5SongsAndNum(Model model) throws IOException {

        SqlSessionFactory sessionFactory = SessionFactorySingleton.getSessionFactory();
        try( SqlSession sqlSession = sessionFactory.openSession(true)){
            BaseDao mapper = sqlSession.getMapper(BaseDao.class);
            List<Map<String, Object>> maps = mapper.listTop5SongsAndNum();
            model.addAttribute("maps",maps);
        }

        return "billboard/top5";
    }
}
