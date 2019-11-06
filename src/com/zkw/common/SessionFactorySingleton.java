package com.zkw.common;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

public class SessionFactorySingleton {
    private static SqlSessionFactory sessionFactory;

    public static SqlSessionFactory getSessionFactory() throws IOException {
        if (sessionFactory == null){
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        }

        return sessionFactory;
    }
}
