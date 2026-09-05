package com.training.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.training.business.bean.UnitBean;
import com.training.service.UnitService;

@CrossOrigin("http://localhost:3001")
@RestController
public class UnitController {

    private final UnitService unitService;

    public UnitController(UnitService unitService) {
        this.unitService = unitService;
    }

    @GetMapping(
        value = "/unit/controller/getUnitDetails",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<UnitBean>> getUnitDetails() {
        return ResponseEntity.ok(unitService.getUnits());
    }

    @GetMapping(
        value = "/unit/controller/getUnitsByCategoryId/{categoryId}",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<UnitBean>> getUnitsByCategoryId(
            @PathVariable("categoryId") String categoryId) {

        return ResponseEntity.ok(
            unitService.getUnitsBasedOnCategoryId(categoryId)
        );
    }
}