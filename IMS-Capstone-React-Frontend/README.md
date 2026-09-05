# IMS Capstone React Frontend

This frontend is built from the uploaded IMS-UI project as the UI/UX reference and is aligned to the Java/Spring Boot microservices in the Capstone project.

## Backend services

- Material Service: `http://localhost:8088`
- Vendor Service: `http://localhost:8087`
- Inventory Management System: `http://localhost:8082`
- React UI: `http://localhost:3000`

## Main API mapping

### Material Service
- `GET /material/controller/getMaterialCategories`
- `GET /material/controller/getMaterialCategoryById/{categoryId}`
- `GET /type/controller/getTypeDetails`
- `GET /type/controller/getTypeDetailsByCategoryId/{categoryId}`
- `GET /unit/controller/getUnitDetails`
- `GET /unit/controller/getUnitsByCategoryId/{categoryId}`

### Vendor Service
- `GET /vendor/controller/getVendors`

### Inventory Management System
- `GET /purchaseEntry`
- `GET /vendors`
- `GET /categories`
- `POST /getUnitAndTypeList`
- `POST /addPurchaseDetail`
- `POST /report/controller/getPurchaseDetails`

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Important backend note

`PurchaseBean.purchaseDate` currently uses `@Past`. If today's date should be accepted for a purchase, change the backend validation accordingly. The UI prevents future dates but allows today.