package utils;

import java.io.FileWriter;
import java.io.IOException;

public class CSVExporter {
    public static void export(String logLine) {
        try (FileWriter writer = new FileWriter("backend/resources/anomalies.csv", true)) {
            writer.append(logLine).append("\n");
        } catch (IOException e) {
            System.err.println("Error exporting CSV: " + e.getMessage());
        }
    }
}