import React from 'react';
import { Breadcrumb, Typography } from 'antd';
import { Link } from 'react-router-dom';
import {
  getRetailCatLandingRoutes,
  getRetailSubcategoryRoute,
} from '../../common/getRoutes';

const { Title } = Typography;

export const NavBar = (parameter) => {
  let templateName = parameter.templateName;
  let categoryId = parameter.categoryData.id;
  let categoryName = parameter.categoryData.name;
  let subCategoryName = parameter.subCategoryData.name;
  let subCategoryId = parameter.subCategoryData.id;
  return (
    <div>
      <Title level={2} className='text-blue mt-20 mb-10'>
        Post an Ad
      </Title>
      <Breadcrumb separator='|' className='pb-30'>
        <Breadcrumb.Item>
          <Link to='/classifieds'>Classified</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link
            to={`/classifieds-${templateName}/${categoryName}/${categoryId}`}
          >
            {categoryName}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link
            to={`/classifieds-general/${categoryName}/${categoryId}/${subCategoryName}/${subCategoryId}`}
          >
            {subCategoryName}
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
};

export const RetailNavBar = (parameter) => {
  let categoryId = parameter.categoryData.id;
  let categoryName = parameter.categoryData.text
    ? parameter.categoryData.text
    : parameter.categoryData.name;
  let subCategoryName = parameter.subCategoryData.text
    ? parameter.subCategoryData.text
    : parameter.subCategoryData.name;
  let subCategoryId = parameter.subCategoryData.id;
  let categoryPath = getRetailCatLandingRoutes(categoryId, categoryName);
  let subcategoryPath = getRetailSubcategoryRoute(
    categoryName,
    categoryId,
    subCategoryName,
    subCategoryId
  );
  return (
    <div>
      <Title level={2} className='text-blue mt-20 mb-10'>
        Post an Ad
      </Title>
      <Breadcrumb separator='|' className='pb-30'>
        <Breadcrumb.Item>
          Retail
        </Breadcrumb.Item>
        <Breadcrumb.Item>
         {categoryName}
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {subCategoryName}
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
};
