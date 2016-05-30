package by.bsu.famcs.servlets;


import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;


public class AuthenticationServlet extends HttpServlet {

    private static final String PARAM_USERNAME = "username";
    public static final String COOKIE_USER_ID = "uid";
    public static final String PARAM_UID = COOKIE_USER_ID;

    private int coockieLifeTime = -1;

    @Override
    public void init(ServletConfig config) throws ServletException {
      //  super.init(config);
       // coockieLifeTime = Integer.parseInt(config.getInitParameter("cookie-live-time"));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getParameter("userName");
        String password = req.getParameter("userPass");
        if (username == null || username.trim().isEmpty()) {
            resp.sendError(400, "Bad request");
            resp.getOutputStream().println(String.format("paramater %s is required", PARAM_USERNAME));
            return;
        }
  /*      String userId = StaticKeyStorage.getByUsername(username);
        if (userId == null) {
            resp.sendError(400, "Bad request");
            resp.getOutputStream().println("Unsupporeted user: " + username);
            return;
        }

        Cookie userIdCookie = new Cookie(COOKIE_USER_ID, userId);
        userIdCookie.setMaxAge(coockieLifeTime);
        resp.addCookie(userIdCookie); */
        if(Objects.equals(username, "user") && Objects.equals(password, "pass"))
            resp.sendRedirect("/site.html");
    }
}