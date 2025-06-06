package com.example.flutterapp.service;

import com.example.flutterapp.dto.FlutterAppForm;
import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class FlutterAppService {

    private static final Path TEMPLATE_PATH = Paths.get("src/main/resources/flutter_template");
    private static final Path OUTPUT_DIR = Paths.get("generated_apps");

    public String generateFlutterApp(FlutterAppForm formData) {
        String appId = UUID.randomUUID().toString();
        Path appPath = OUTPUT_DIR.resolve(appId);

        try {
            FileUtils.copyDirectory(TEMPLATE_PATH.toFile(), appPath.toFile());
            removeFile(appPath.resolve("test/widget_test.dart"));

            // Replace main.dart
            Path mainPath = appPath.resolve("lib/main.dart");
            String content = new String(Files.readAllBytes(mainPath));
            content = content.replace("{{BRIDE_NAME}}", formData.brideName)
                    .replace("{{GROOM_NAME}}", formData.groomName)
                    .replace("{{WEDDING_DATE}}", formData.weddingDate)
                    .replace("{{WEDDING_LOCATION}}", formData.weddingLocation != null ? formData.weddingLocation : "")
                    .replace("{{APP_PASSWORD}}", formData.appPassword != null ? formData.appPassword : "")
                    .replace("{{SELECTED_COLOR}}", formData.selectedColor != null ? formData.selectedColor : "#B0848B")
                    .replace("{{SELECTED_FONT}}", formData.selectedFont != null ? formData.selectedFont : "Sans")
                    .replace("{{ENABLE_RSVP_NOTIFICATION}}", String.valueOf(formData.enableRSVPNotification))
                    .replace("{{ENABLE_EVENT_NOTIFICATION}}", String.valueOf(formData.enableEventNotification))
                    .replace("{{ENABLE_PLANNER_UPDATES}}", String.valueOf(formData.enablePlannerUpdates));
            Files.write(mainPath, content.getBytes());

            Path zipPath = OUTPUT_DIR.resolve(appId + ".zip");
            zipDirectory(appPath, zipPath);
            FileUtils.deleteDirectory(appPath.toFile());

            return zipPath.toString();

        } catch (IOException e) {
            throw new RuntimeException("Error generating Flutter app", e);
        }
    }

    private void removeFile(Path path) throws IOException {
        if (Files.exists(path)) {
            Files.delete(path);
        }
    }

    private void zipDirectory(Path sourceDir, Path zipFilePath) throws IOException {
        try (ZipOutputStream zs = new ZipOutputStream(Files.newOutputStream(zipFilePath))) {
            Files.walk(sourceDir)
                    .filter(path -> !Files.isDirectory(path))
                    .forEach(path -> {
                        ZipEntry zipEntry = new ZipEntry(sourceDir.relativize(path).toString());
                        try {
                            zs.putNextEntry(zipEntry);
                            Files.copy(path, zs);
                            zs.closeEntry();
                        } catch (IOException e) {
                            throw new UncheckedIOException(e);
                        }
                    });
        }
    }
}
