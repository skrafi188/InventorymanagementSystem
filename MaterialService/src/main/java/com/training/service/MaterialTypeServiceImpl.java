package com.training.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.training.business.bean.MaterialTypeBean;
import com.training.dao.MaterialTypeDAO;
import com.training.entity.MaterialTypeEntity;

@Service
public class MaterialTypeServiceImpl implements MaterialTypeService {

    private final MaterialTypeDAO materialTypeDAO;

    public MaterialTypeServiceImpl(MaterialTypeDAO materialTypeDAO) {
        this.materialTypeDAO = materialTypeDAO;
    }

    @Override
    public List<MaterialTypeBean> getMaterialTypesBasedOnCategoryId(
            String categoryId) {

        List<MaterialTypeBean> beans = new ArrayList<>();

        List<MaterialTypeEntity> entities =
                materialTypeDAO.findByMaterialCategoryEntityCategoryId(categoryId);

        for (MaterialTypeEntity entity : entities) {

            MaterialTypeBean bean = new MaterialTypeBean();

            bean.setTypeId(entity.getTypeId());
            bean.setTypeName(entity.getTypeName());
            bean.setCategoryId(
                    entity.getMaterialCategoryEntity().getCategoryId()
            );

            beans.add(bean);
        }

        return beans;
    }

    @Override
    public List<MaterialTypeBean> getMaterialTypes() {

        List<MaterialTypeBean> beans = new ArrayList<>();

        List<MaterialTypeEntity> entities =
                materialTypeDAO.findAll();

        for (MaterialTypeEntity entity : entities) {

            MaterialTypeBean bean = new MaterialTypeBean();

            bean.setTypeId(entity.getTypeId());
            bean.setTypeName(entity.getTypeName());
            bean.setCategoryId(
                    entity.getMaterialCategoryEntity().getCategoryId()
            );

            beans.add(bean);
        }

        return beans;
    }
}