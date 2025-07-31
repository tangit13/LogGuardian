

import analyzer.LogAnalyzer;
import utils.FileWatcher;
public class Main {
    public static void main(String[] args) {
        System.out.println("Starting LogGuardian...");

        String logPath = "backend/resources/sample.log";
        LogAnalyzer analyzer = new LogAnalyzer();
        FileWatcher watcher = new FileWatcher(logPath, analyzer);
        watcher.startWatching();
    }
}