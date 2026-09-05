package com.training.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.training.business.bean.MaterialCategoryBean;
import com.training.service.MaterialService;

@CrossOrigin("http://localhost:3001")
@RestController
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @GetMapping("/")
    public String home() {
        return "Material Service deployed successfully";
    }

    @GetMapping("/health")
    public String health() {
        return "Material Service is UP";
    }

    @GetMapping(
        value = "/material/controller/getMaterialCategories",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<MaterialCategoryBean>> getMaterialCategories() {
        return ResponseEntity.ok(materialService.getMaterialCategories());
    }

    @GetMapping(
        value = "/material/controller/getMaterialCategoryById/{categoryId}",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<MaterialCategoryBean> getMaterialCategoryById(
            @PathVariable("categoryId") String categoryId) {

        return ResponseEntity.ok(
            materialService.getMaterialCategoryById(categoryId)
        );
    }
}