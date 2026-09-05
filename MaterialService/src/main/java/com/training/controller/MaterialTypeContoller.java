package com.training.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.training.business.bean.MaterialTypeBean;
import com.training.service.MaterialTypeService;

@CrossOrigin("http://localhost:3001")
@RestController
public class MaterialTypeContoller {

    private final MaterialTypeService materialTypeService;

    public MaterialTypeContoller(MaterialTypeService materialTypeService) {
        this.materialTypeService = materialTypeService;
    }

    @GetMapping(
        value = "/type/controller/getTypeDetails",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<MaterialTypeBean>> getTypeDetails() {
        return ResponseEntity.ok(materialTypeService.getMaterialTypes());
    }

    @GetMapping(
        value = "/type/controller/getTypeDetailsByCategoryId/{categoryId}",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<MaterialTypeBean>> getTypesBasedOnCategoryId(
            @PathVariable("categoryId") String categoryId) {

        return ResponseEntity.ok(
            materialTypeService.getMaterialTypesBasedOnCategoryId(categoryId)
        );
    }
}