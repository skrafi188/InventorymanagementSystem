package com.training.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.training.business.bean.MaterialCategoryBean;
import com.training.dao.MaterialCategoryDAO;
import com.training.entity.MaterialCategoryEntity;

@Service
public class MaterialServiceImpl implements MaterialService {

    private final MaterialCategoryDAO materialCategoryDAO;

    public MaterialServiceImpl(MaterialCategoryDAO materialCategoryDAO) {
        this.materialCategoryDAO = materialCategoryDAO;
    }

    @Override
    public MaterialCategoryBean getMaterialCategoryById(String categoryId) {

        MaterialCategoryEntity entity =
                materialCategoryDAO.findById(categoryId).orElse(null);

        if (entity == null) {
            return null;
        }

        MaterialCategoryBean bean = new MaterialCategoryBean();
        bean.setCategoryId(entity.getCategoryId());
        bean.setCategoryName(entity.getCategoryName());

        return bean;
    }

    @Override
    public List<MaterialCategoryBean> getMaterialCategories() {

        List<MaterialCategoryBean> beans = new ArrayList<>();

        List<MaterialCategoryEntity> entities =
                materialCategoryDAO.findAll();

        for (MaterialCategoryEntity entity : entities) {

            MaterialCategoryBean bean = new MaterialCategoryBean();
            bean.setCategoryId(entity.getCategoryId());
            bean.setCategoryName(entity.getCategoryName());

            beans.add(bean);
        }

        return beans;
    }
}