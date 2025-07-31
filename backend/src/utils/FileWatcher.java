package utils;

import analyzer.LogAnalyzer;

import java.io.IOException;
import java.nio.file.*;

public class FileWatcher {
    private final Path path;
    private final LogAnalyzer analyzer;

    public FileWatcher(String filePath, LogAnalyzer analyzer) {
        this.path = Paths.get(filePath).toAbsolutePath();
        this.analyzer = analyzer;
    }

    public void startWatching() {
        try (WatchService watchService = FileSystems.getDefault().newWatchService()) {
            Path dir = path.getParent();
            dir.register(watchService, StandardWatchEventKinds.ENTRY_MODIFY);
            System.out.println("Watching file: " + path);

            while (true) {
                WatchKey key = watchService.take();
                for (WatchEvent<?> event : key.pollEvents()) {
                    if (path.getFileName().equals(event.context())) {
                        Files.lines(path).skip(Files.lines(path).count() - 1).forEach(analyzer::analyze);
                    }
                }
                key.reset();
            }
        } catch (IOException | InterruptedException e) {
            System.err.println("Error in file watching: " + e.getMessage());
        }
    }
}