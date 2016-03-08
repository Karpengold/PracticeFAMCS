package by.bsu.sp.lab1;

import java.util.Scanner;

public class StartMenu {

    public void outputMenu() {
        MessageManager manager = new MessageManager();
        String line;
        Scanner in = new Scanner(System.in);
        while (true) {
            System.out.println("Input command: ");
            line = in.nextLine();
            switch (line) {
                case "read": {
                    System.out.print("Input path: ");
                    manager.read(in.nextLine());
                    break;
                }

                case "add": {
                    manager.addMessage();
                    break;
                }

                case "history": {
                    manager.messageHistory();
                    break;
                }

                case "history -p": {
                    System.out.println("Date format: dd MM yyyy");
                    System.out.print("Input begin: ");
                    String begin = in.nextLine();
                    System.out.print("Input end: ");
                    String end = in.nextLine();
                    manager.messageHistoryPeriod(begin, end);
                    break;
                }

                case "save": {
                    System.out.print("Input path: ");
                    manager.save(in.nextLine());
                    break;
                }

                case "search -a": {
                    System.out.print("Input author: ");
                    manager.searchByAuthor(in.nextLine());
                    break;
                }

                case "search -l": {
                    System.out.print("Input lexeme: ");
                    manager.searchByLexeme(in.nextLine());
                    break;
                }

                case "search -r": {
                    System.out.print("Input regex: ");
                    manager.searchByRegex(in.nextLine());
                    break;
                }

                case "delete": {
                    System.out.print("Input id: ");
                    manager.deleteById(in.nextLine());
                    break;
                }

                case "help": {
                    this.help();
                    break;
                }
                default: {
                    System.out.println("No such command");
                    break;
                }
            }
        }
    }

    public void help() {
        System.out.println("What do you want?");
        System.out.println("help       - I need somebody, HELP!");
        System.out.println("read       - read messages");
        System.out.println("save       - save messages");
        System.out.println("add        - add new message");
        System.out.println("history    - show message history");
        System.out.println("delete     - delete message by id");
        System.out.println("search -r  - search messages by regex");
        System.out.println("search -a  - search messages by author");
        System.out.println("search -l  - search messages by lexeme");
        System.out.println("history -p - show message history by period");
        System.out.println();
    }

    public static void main(String[] args) {
        StartMenu startMenu = new StartMenu();
        startMenu.help();
        startMenu.outputMenu();
    }
}
