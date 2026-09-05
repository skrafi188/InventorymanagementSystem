package com.training.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.training.business.bean.UnitBean;
import com.training.dao.UnitDAO;
import com.training.entity.UnitEntity;

@Service
public class UnitServiceImpl implements UnitService {

    private final UnitDAO unitDAO;

    public UnitServiceImpl(UnitDAO unitDAO) {
        this.unitDAO = unitDAO;
    }

    @Override
    public List<UnitBean> getUnitsBasedOnCategoryId(String categoryId) {

        List<UnitBean> beans = new ArrayList<>();

        List<UnitEntity> entities =
                unitDAO.findByMaterialCategoryEntityCategoryId(categoryId);

        for (UnitEntity entity : entities) {

            UnitBean bean = new UnitBean();

            bean.setUnitId(entity.getUnitId());
            bean.setUnitName(entity.getUnitName());
            bean.setCategoryId(
                    entity.getMaterialCategoryEntity().getCategoryId()
            );

            beans.add(bean);
        }

        return beans;
    }

    @Override
    public List<UnitBean> getUnits() {

        List<UnitBean> beans = new ArrayList<>();

        List<UnitEntity> entities =
                unitDAO.findAll();

        for (UnitEntity entity : entities) {

            UnitBean bean = new UnitBean();

            bean.setUnitId(entity.getUnitId());
            bean.setUnitName(entity.getUnitName());
            bean.setCategoryId(
                    entity.getMaterialCategoryEntity().getCategoryId()
            );

            beans.add(bean);
        }

        return beans;
    }
}