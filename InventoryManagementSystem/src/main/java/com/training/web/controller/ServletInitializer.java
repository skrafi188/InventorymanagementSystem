package com.training.web.controller;

import org.springframework.boot.builder.SpringApplicationBuilder;
import com.training.InventoryManagementSystemApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

public class ServletInitializer extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(InventoryManagementSystemApplication.class);
    }
}