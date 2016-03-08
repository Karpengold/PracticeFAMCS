package by.bsu.sp.lab1;

import by.bsu.sp.lab1.message.JsonMessage;
import com.google.gson.Gson;
import org.apache.log4j.Logger;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MessageManager {

    final static Logger logger = Logger.getLogger(MessageManager.class);

    private List<JsonMessage> messageList;

    public MessageManager() {
        messageList = new LinkedList<>();
    }

    public void read(String path) {
        try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
            Gson gson = new Gson();
            String json = reader.readLine();

            while (json != null) {
                JsonMessage message = gson.fromJson(json, JsonMessage.class);
                messageList.add(message);
                json = reader.readLine();
            }

            logger.info("Read messages from: " + path);
        } catch (IOException e) {
            logger.error(e.getMessage());
        }

    }

    public void messageHistory() {
        messageList.sort(new Comparator<JsonMessage>() {
            @Override
            public int compare(JsonMessage o1, JsonMessage o2) {
                return Long.valueOf(o1.getTimestamp()).compareTo(o2.getTimestamp());
            }
        });

        for (JsonMessage i : messageList) {
            System.out.println(i);
        }
        logger.info("Get message history");
    }

    public void save(String path) {
        StringBuilder json = new StringBuilder();
        Gson gson = new Gson();

        for (JsonMessage i : messageList) {
            json = json.append(gson.toJson(i)).append("\n");
        }

        try (FileWriter writer = new FileWriter(path, false)) {
            writer.write(json.toString());
            logger.info("Save messages as: " + path);
        } catch (IOException ex) {
            logger.error(ex.getMessage());
        }

    }

    public void addMessage() {
        Scanner in = new Scanner(System.in);

        System.out.print("Input author: ");
        String author = in.nextLine();

        System.out.print("Input message: ");
        String message = in.nextLine();

        messageList.add(new JsonMessage(author, message));
        logger.info("New message from: " + author);
    }

    public void searchByAuthor(String author) {
        for (JsonMessage i : messageList) {
            if (i.getAuthor().equals(author)) {
                System.out.println(i);
            }
        }
        logger.info("Search messages from author: " + author);
    }

    public void deleteById(String id) {
        for (JsonMessage i : messageList) {
            if (i.getId().equals(id)) {
                messageList.remove(i);
            }
        }
        logger.info("Delete message by id: " + id);
    }

    public void searchByLexeme(String lexeme) {
        for (JsonMessage i : messageList) {
            if (i.getMessage().toLowerCase().contains(lexeme.toLowerCase())) {
                System.out.println(i);
            }
        }
        logger.info("Search messages by lexeme: " + lexeme);
    }

    public void searchByRegex(String regex) {
        Pattern p = Pattern.compile(regex);
        Matcher m;
        for (JsonMessage i : messageList) {
            m = p.matcher(i.getMessage());
            if (m.matches())
                System.out.println(i);
        }
        logger.info("Search messages by regex: " + regex);
    }

    public void messageHistoryPeriod(String begin, String end) {
        SimpleDateFormat formatter = new SimpleDateFormat("dd MM yyyy");
        Date beginDate;
        Date endDate;
        Date messageDate;

        try {
            beginDate = formatter.parse(begin);
            endDate = formatter.parse(end);
            for (JsonMessage i : messageList) {
                messageDate = new Date(i.getTimestamp());
                if (messageDate.after(beginDate) && messageDate.before(endDate)) {
                    System.out.println(i);
                }
            }
            logger.info("Get message history by period");
        } catch (ParseException e) {
            logger.error("Parsing failed, uncorrected date");
        }
    }
}
