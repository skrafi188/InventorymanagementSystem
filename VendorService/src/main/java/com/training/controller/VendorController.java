package com.training.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.training.business.bean.VendorBean;
import com.training.service.VendorService;

@CrossOrigin("http://localhost:3001")
@RestController
public class VendorController {
	private final VendorService vendorServiceImpl;

	public VendorController(VendorService vendorServiceImpl) {
	    this.vendorServiceImpl = vendorServiceImpl;
	}

    @GetMapping("/")
    public String index() {
        return "Welcome to Spring Boot Vendor Service API!";
    }

    @GetMapping("/vendor/controller/getVendors")
    public ResponseEntity<List<VendorBean>> getVendorDetails() {

        List<VendorBean> list = vendorServiceImpl.getVendorDetails();

        return ResponseEntity.ok(list);
    }
}