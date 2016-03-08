package by.bsu.sp.lab1.message;

import java.text.SimpleDateFormat;
import java.util.UUID;

public class JsonMessage {

    private String message;
    private String author;
    private String id;
    private long timestamp;

    public JsonMessage(String author, String message){
        this.message = message;
        this.author = author;
        id = (UUID.randomUUID()).toString();
        timestamp = System.currentTimeMillis();
    }

    public String getMessage() {
        return message;
    }
    public String getAuthor() { return author; }
    public long getTimestamp() { return  timestamp; }
    public String getId() { return id; }

    @Override
    public String toString() {
        SimpleDateFormat formatting = new SimpleDateFormat("YYYY:MM:dd HH:mm:ss");
        return "id: " + id + "\n" +
                "timestamp: " + formatting.format(timestamp) + "\n" +
                "author: " + author + "\n" +
                "message: " + message + "\n";
    }
}


