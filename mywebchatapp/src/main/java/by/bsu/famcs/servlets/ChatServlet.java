package by.bsu.famcs.servlets;


import message.Message;
import messagestorage.InMemoryMessageStorage;
import messagestorage.MessageStorage;
import messagestorage.Portion;
import org.apache.log4j.Logger;
import org.json.simple.parser.ParseException;
import utils.Constants;
import utils.InvalidTokenException;
import utils.MessageHelper;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ChatServlet extends HttpServlet {
    private static final Logger logger = Logger.getLogger(ChatServlet.class);
    private MessageStorage messageStorage = new InMemoryMessageStorage();

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String query = request.getQueryString();
        Map<String, String> map = queryToMap(query);
        String token = map.get(Constants.REQUEST_PARAM_TOKEN);
        try {
            int index = MessageHelper.parseToken(token);
            if (index > messageStorage.size()) {
               /* return Response.badRequest(
                        String.format("Incorrect token in request: %s. Server does not have so many messages", token)); */
            }

            Portion portion = new Portion(index);
            List<Message> messages = messageStorage.getPortion(portion);
            String responseBody = MessageHelper.buildServerResponseBody(messages, messageStorage.size());
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(responseBody);
        } catch (InvalidTokenException e) {
            //return Response.badRequest(e.getMessage());
        }


    }
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            Message message = MessageHelper.getClientMessage(request.getInputStream());
            logger.info(String.format("Received new message from user: %s", message));
            messageStorage.addMessage(message);
            response.setStatus(Constants.RESPONSE_CODE_OK);
        } catch (ParseException e) {
            logger.error("Could not parse message.", e);
        }
    }

    public void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String query = request.getQueryString();
        if (query == null) {
           // return Response.badRequest("Absent query in request");
        }
        Map<String, String> map = queryToMap(query);
        String token = map.get(Constants.REQUEST_PARAM_MESSAGE_ID);


        if(messageStorage.removeMessage(token)){
            logger.info("delete message "+ token);
            response.setStatus(Constants.RESPONSE_CODE_OK);
        }
        else {
            // logger.error("Message does not exist ",);
            response.setStatus(Constants.RESPONSE_CODE_BAD_REQUEST);
        }
    }

    public void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            Message message = MessageHelper.getClientUpdateMessage(request.getInputStream());
            if(messageStorage.updateMessage(message)){
                logger.info(String.format("Update message "+ message));
                response.setStatus(Constants.RESPONSE_CODE_OK);
            }
            else {
                logger.info("Message does not found");
                response.setStatus(Constants.RESPONSE_CODE_BAD_REQUEST);
            }

        } catch (ParseException e) {
            logger.error("Could not parse message.", e);
            response.setStatus(Constants.RESPONSE_CODE_BAD_REQUEST);
        }
    }

    private Map<String, String> queryToMap(String query) {
        Map<String, String> result = new HashMap<>();

        for (String queryParam : query.split(Constants.REQUEST_PARAMS_DELIMITER)) {
            String paramKeyValuePair[] = queryParam.split("=");
            if (paramKeyValuePair.length > 1) {
                result.put(paramKeyValuePair[0], paramKeyValuePair[1]);
            } else {
                result.put(paramKeyValuePair[0], "");
            }
        }
        return result;
    }
}
