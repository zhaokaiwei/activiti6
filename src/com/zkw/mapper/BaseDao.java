package com.zkw.mapper;

import java.util.List;
import java.util.Map;

public interface BaseDao {

    List<Map<String,Object>> listMessages(String userId);

    Integer insertMessage(Map<String,Object> params);

    Integer deleteMessage(String messageId);




    List<Map<String,Object>> listSongs(Map<String,Object> params);

    Integer getSongsCount(Map<String,Object> params);

    List<String> listArtists();

    List<Map<String,Object>> listTop5SongsAndNum();
}
