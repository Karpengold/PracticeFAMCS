package by.bsu.up.chat.storage;

import by.bsu.up.chat.common.models.Message;
import by.bsu.up.chat.logging.Logger;
import by.bsu.up.chat.logging.impl.Log;
import com.google.gson.Gson;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class InMemoryMessageStorage implements MessageStorage {

    private static final String DEFAULT_PERSISTENCE_FILE = "messages.srg";

    private static final Logger logger = Log.create(InMemoryMessageStorage.class);

    private List<Message> messages = new ArrayList<>();

    public InMemoryMessageStorage() {
        this.read("test.txt");
    }

    @Override
    public synchronized List<Message> getPortion(Portion portion) {
        int from = portion.getFromIndex();
        if (from < 0) {
            throw new IllegalArgumentException(String.format("Portion from index %d can not be less then 0", from));
        }
        int to = portion.getToIndex();
        if (to != -1 && to < portion.getFromIndex()) {
            throw new IllegalArgumentException(String.format("Porting last index %d can not be less then start index %d", to, from));
        }
        to = Math.max(to, messages.size());

        List <Message> result =  messages.subList(from, to);
        for(Message i: result){
            if (i.getTimestamp()==-1){
                result.remove(i);
            }
        }
        return result;
    }

    @Override
    public void addMessage(Message message) {

        messages.add(message);
        this.save(message, "test.txt");
    }

    @Override
    public boolean updateMessage(Message message) {
        for (Message i : messages) {
            if (i.getId().equals(message.getId()) && i.getTimestamp() != 0) {
                i.setText(message.getText());
                return true;
            }
        }
        return false;
    }

    @Override
    public synchronized boolean removeMessage(String messageId) {
        for (Message i : messages) {
            if (i.getId().equals(messageId)) {
                i.setTimestamp(-1);
                return true;
            }
        }
        return false;
    }

    public boolean read(String path) {
        try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
            Gson gson = new Gson();
            String json = reader.readLine();

            while (json != null) {
                Message message = gson.fromJson(json, Message.class);
                messages.add(message);
                json = reader.readLine();
            }
            logger.info("Read messages from: " + path);
            return true;
        } catch (IOException e) {
            logger.error("Cant read messages from file",e);
            return false;
        }

    }

    public void save(Message message, String path) {

        Gson gson = new Gson();
        String json = gson.toJson(message);
        try (FileWriter writer = new FileWriter(path, false)) {
            writer.write(json);
            logger.info("Save message, path: " + path);
        } catch (IOException e) {
            logger.error("Can't save message",e);
        }
    }

    @Override
    public int size() {
        return messages.size();
    }

}

