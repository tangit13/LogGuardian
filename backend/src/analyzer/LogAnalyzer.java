package analyzer;

import observer.LogObserver;
import utils.CSVExporter;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class LogAnalyzer {
    private final List<LogObserver> observers = new ArrayList<>();
    private final Pattern errorPattern = Pattern.compile("ERROR|Exception|Failed", Pattern.CASE_INSENSITIVE);

    public void addObserver(LogObserver observer) {
        observers.add(observer);
    }

    public void analyze(String logLine) {
        if (errorPattern.matcher(logLine).find()) {
            System.out.println("Anomaly Detected: " + logLine);
            CSVExporter.export(logLine);
            for (LogObserver observer : observers) {
                observer.onAnomalyDetected(logLine);
            }
        }
    }
}