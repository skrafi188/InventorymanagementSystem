package com.training.test.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.training.business.bean.VendorBean;
import com.training.service.VendorService;

@SpringBootTest
public class VendorServiceTest {

    @Autowired
    private VendorService vendorService;

    @Test
    public void notNullVendorServiceTest() {
        assertNotNull(vendorService);
    }

    @Test
    public void notNullGetVendorDetailsTest() {
        List<VendorBean> vendors = vendorService.getVendorDetails();

        assertNotNull(vendors);
    }

    @Test
    public void countGetVendorDetailsTest() {
        List<VendorBean> vendors = vendorService.getVendorDetails();

        assertEquals(5, vendors.size());
    }

    @Test
    public void recordGetVendorDetailsTest() {
        List<VendorBean> vendors = vendorService.getVendorDetails();

        assertEquals("Only Vimal", vendors.get(0).getVendorName());
    }
}