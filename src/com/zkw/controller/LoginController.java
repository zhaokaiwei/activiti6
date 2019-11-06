package com.zkw.controller;

import com.zkw.constant.Constants;
import com.zkw.service.VacateService;
import org.activiti.engine.*;
import org.activiti.engine.identity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

@Controller
public class LoginController {

    @Autowired
    private IdentityService identityService;
    @Autowired
    private VacateService vacateService;

    @RequestMapping("/login")
    public String login(HttpSession session,Model model, String userName, String password)  {
        boolean loginCheck = identityService.checkPassword(userName, password);
        if (loginCheck){
            User user = identityService.createUserQuery().userId(userName).list().get(0);
            String groupName = identityService.createGroupQuery().groupMember(userName).list().get(0).getName();
            session.setAttribute(Constants.SESSION_GROUP_NAME,groupName);
            session.setAttribute(Constants.SESSION_USER_ID,userName);
            session.setAttribute(Constants.SESSION_USER_PASSWORD,userName);
            session.setAttribute(Constants.SESSION_USER_NAME,user.getFirstName());

            return "redirect:/index";
        }
        model.addAttribute("message","用户名或密码错误");
        return "home/login";
    }

    @RequestMapping("/index")
    public String index(HttpSession session,Model model) throws IOException {
        String userId = session.getAttribute(Constants.SESSION_USER_ID).toString();

        // 获取当前用户所有的消息
        List<String> messages = vacateService.listMessages(userId);
        model.addAttribute("messages",messages);

        return "home/index";
    }
}
