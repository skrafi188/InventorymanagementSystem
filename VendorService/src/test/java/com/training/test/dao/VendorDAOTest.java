package com.training.test.dao;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.training.dao.VendorDAO;
import com.training.entity.VendorEntity;

@SpringBootTest
public class VendorDAOTest {

    @Autowired
    private VendorDAO vendorDAO;

    @Test
    public void notNullVendorDAOTest() {
        assertNotNull(vendorDAO);
    }

    @Test
    public void findByIdVendorDAOTest() {

        Optional<VendorEntity> optionalVendor = vendorDAO.findById("V001");

        assertNotNull(optionalVendor);

        assertEquals(true, optionalVendor.isPresent());

        VendorEntity vendor = optionalVendor.get();

        assertNotNull(vendor);

        assertEquals("Only Vimal", vendor.getVendorName());
    }
}