package com.project.lootquest.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;
import java.util.UUID;

@Service
public class S3Service {
    @Autowired
    private AmazonS3 amazonS3;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public String uploadFile(MultipartFile file) throws IOException {
        String key = UUID.randomUUID() + "_" + file.getOriginalFilename();
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        amazonS3.putObject(bucketName, key, file.getInputStream(), metadata);
        return amazonS3.getUrl(bucketName, key).toString();
    }

    public void deleteFile(String key) {
        amazonS3.deleteObject(bucketName, key);
    }

    public byte[] downloadFileAsBytes(String fileUrl) throws IOException {
        URI uri = URI.create(fileUrl);
        try (InputStream in = uri.toURL().openStream()) {
            return in.readAllBytes();
        }
    }

}
