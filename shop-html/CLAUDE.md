# HTML5电商网站代码规范

## 项目信息
- **项目名称**: HTML5电商网站 (shop-html)
- **技术栈**: HTML5 + CSS3 + JavaScript ES6+
- **开发方式**: 纯前端开发，无后端依赖
- **数据存储**: localStorage + JSON文件

## HTML代码规范

### 1. 文档结构规范
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题 - 电商网站</title>
    <meta name="description" content="页面描述">
    <meta name="keywords" content="关键词">
    <!-- CSS文件 -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <!-- 页面内容 -->
    
    <!-- JavaScript文件 -->
    <script src="assets/js/main.js"></script>
</body>
</html>
```

### 2. 语义化标签使用
- 使用语义化HTML5标签：`<header>`、`<nav>`、`<main>`、`<section>`、`<article>`、`<aside>`、`<footer>`
- 商品列表使用 `<section>` 包装
- 商品卡片使用 `<article>` 标签
- 导航使用 `<nav>` 标签
- 按钮功能使用 `<button>` 而非 `<div>`

### 3. 类名命名规范（BEM方法论）
```html
<!-- 块（Block） -->
<div class="product-card">
    <!-- 元素（Element） -->
    <img class="product-card__image" src="" alt="">
    <h3 class="product-card__title">商品标题</h3>
    <p class="product-card__price">￥99.00</p>
    <!-- 修饰符（Modifier） -->
    <button class="product-card__button product-card__button--primary">
        添加到购物车
    </button>
</div>
```

### 4. 属性规范
- 所有属性使用小写
- 属性值使用双引号
- 必要的alt属性和title属性
- 表单元素必须包含label
- 图片必须包含width和height属性（或CSS设置）

## CSS代码规范

### 1. 文件结构规范
```css
/* ==========================================================================
   基础样式
   ========================================================================== */

/* Reset和Normalize */
/* 变量定义 */
/* 基础元素样式 */

/* ==========================================================================
   组件样式
   ========================================================================== */

/* Header组件 */
/* Navigation组件 */
/* Product Card组件 */
/* Footer组件 */

/* ==========================================================================
   页面样式
   ========================================================================== */

/* 首页样式 */
/* 商品列表页样式 */
/* 商品详情页样式 */

/* ==========================================================================
   响应式样式
   ========================================================================== */

/* 平板设备 */
/* 手机设备 */
```

### 2. CSS变量定义
```css
:root {
    /* 颜色变量 */
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    --light-color: #f8f9fa;
    --dark-color: #343a40;
    --white: #ffffff;
    --black: #000000;
    
    /* 字体变量 */
    --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
    --font-size-base: 1rem;
    --font-size-lg: 1.25rem;
    --font-size-sm: 0.875rem;
    --font-weight-light: 300;
    --font-weight-normal: 400;
    --font-weight-bold: 700;
    
    /* 间距变量 */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 3rem;
    
    /* 断点变量 */
    --breakpoint-sm: 576px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 992px;
    --breakpoint-xl: 1200px;
}
```

### 3. 响应式设计规范
```css
/* 移动优先设计 */
.container {
    width: 100%;
    padding: 0 var(--spacing-md);
}

/* 平板设备 */
@media (min-width: 768px) {
    .container {
        max-width: 750px;
        margin: 0 auto;
    }
}

/* 桌面设备 */
@media (min-width: 992px) {
    .container {
        max-width: 970px;
    }
}

/* 大屏幕设备 */
@media (min-width: 1200px) {
    .container {
        max-width: 1170px;
    }
}
```

### 4. 组件样式模板
```css
/* 商品卡片组件 */
.product-card {
    background: var(--white);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    padding: var(--spacing-md);
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-card__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
}

.product-card__title {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    margin: var(--spacing-md) 0 var(--spacing-sm);
    line-height: 1.4;
}

.product-card__price {
    color: var(--primary-color);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    margin: var(--spacing-sm) 0;
}

.product-card__button {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--primary-color);
    color: var(--white);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.product-card__button:hover {
    background: var(--primary-color-dark);
}
```

## JavaScript代码规范

### 1. 模块结构规范
```javascript
// main.js - 主入口文件
class ShopApp {
    constructor() {
        this.init();
    }
    
    init() {
        this.loadComponents();
        this.bindEvents();
        this.loadData();
    }
    
    loadComponents() {
        // 加载组件
    }
    
    bindEvents() {
        // 绑定事件
    }
    
    loadData() {
        // 加载数据
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new ShopApp();
});
```

### 2. 数据管理规范
```javascript
// storage.js - 本地存储工具类
class StorageManager {
    static setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('存储数据失败:', error);
            return false;
        }
    }
    
    static getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('读取数据失败:', error);
            return defaultValue;
        }
    }
    
    static removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('删除数据失败:', error);
            return false;
        }
    }
}
```

### 3. 购物车管理规范
```javascript
// cart.js - 购物车管理类
class CartManager {
    constructor() {
        this.cartKey = 'shop_cart';
        this.cart = StorageManager.getItem(this.cartKey, []);
    }
    
    addItem(productId, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('商品已添加到购物车');
    }
    
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }
    
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item && quantity > 0) {
            item.quantity = quantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }
    
    getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    saveCart() {
        StorageManager.setItem(this.cartKey, this.cart);
    }
    
    updateCartDisplay() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = this.getCartCount();
        }
        
        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { cart: this.cart }
        }));
    }
    
    showNotification(message) {
        // 显示通知消息
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}
```

### 4. 产品管理规范
```javascript
// products.js - 商品管理类
class ProductManager {
    constructor() {
        this.products = [];
        this.categories = [];
        this.loadData();
    }
    
    async loadData() {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                fetch('assets/data/products.json'),
                fetch('assets/data/categories.json')
            ]);
            
            this.products = await productsRes.json();
            this.categories = await categoriesRes.json();
            
            this.renderProducts();
        } catch (error) {
            console.error('加载数据失败:', error);
        }
    }
    
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }
    
    getProductsByCategory(categoryId) {
        return this.products.filter(product => product.categoryId === categoryId);
    }
    
    searchProducts(keyword) {
        return this.products.filter(product => 
            product.name.toLowerCase().includes(keyword.toLowerCase()) ||
            product.description.toLowerCase().includes(keyword.toLowerCase())
        );
    }
    
    sortProducts(products, sortBy) {
        const sortedProducts = [...products];
        
        switch (sortBy) {
            case 'price-asc':
                return sortedProducts.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sortedProducts.sort((a, b) => b.price - a.price);
            case 'name':
                return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return sortedProducts;
        }
    }
    
    renderProducts(products = this.products) {
        const container = document.querySelector('.products-container');
        if (!container) return;
        
        container.innerHTML = products.map(product => this.createProductCard(product)).join('');
    }
    
    createProductCard(product) {
        return `
            <article class="product-card" data-product-id="${product.id}">
                <img class="product-card__image" 
                     src="${product.image}" 
                     alt="${product.name}"
                     width="200" 
                     height="200">
                <h3 class="product-card__title">${product.name}</h3>
                <p class="product-card__price">￥${product.price.toFixed(2)}</p>
                <button class="product-card__button" 
                        onclick="cartManager.addItem(${product.id})">
                    添加到购物车
                </button>
            </article>
        `;
    }
}
```

### 5. 工具函数规范
```javascript
// utils.js - 工具函数
class Utils {
    // 防抖函数
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // 节流函数
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // 格式化价格
    static formatPrice(price) {
        return `￥${price.toFixed(2)}`;
    }
    
    // 格式化日期
    static formatDate(date) {
        return new Date(date).toLocaleDateString('zh-CN');
    }
    
    // 生成唯一ID
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // 图片懒加载
    static lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}
```

## 数据结构规范

### 1. 商品数据结构
```json
{
  "id": 1,
  "name": "iPhone 15 Pro",
  "description": "苹果最新旗舰手机",
  "price": 7999.00,
  "originalPrice": 8999.00,
  "image": "assets/images/products/iphone15pro.jpg",
  "images": [
    "assets/images/products/iphone15pro-1.jpg",
    "assets/images/products/iphone15pro-2.jpg"
  ],
  "categoryId": 1,
  "brand": "Apple",
  "stock": 50,
  "sales": 125,
  "rating": 4.8,
  "specifications": {
    "color": ["深空黑", "银色", "金色"],
    "storage": ["128GB", "256GB", "512GB"],
    "screen": "6.1英寸"
  },
  "tags": ["热门", "推荐"],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### 2. 分类数据结构
```json
{
  "id": 1,
  "name": "手机数码",
  "slug": "mobile-digital",
  "parentId": 0,
  "image": "assets/images/categories/mobile.jpg",
  "description": "手机及数码产品",
  "sortOrder": 1,
  "isActive": true
}
```

### 3. 购物车数据结构
```json
{
  "id": 1,
  "quantity": 2,
  "specifications": {
    "color": "深空黑",
    "storage": "256GB"
  },
  "addedAt": "2024-01-15T10:30:00Z"
}
```

## 性能优化规范

1. **图片优化**: 使用WebP格式，添加图片懒加载
2. **代码压缩**: 生产环境压缩CSS和JavaScript
3. **缓存策略**: 合理设置静态资源缓存
4. **减少HTTP请求**: 合并CSS和JavaScript文件
5. **首屏优化**: 关键CSS内联，非关键资源延迟加载

## 浏览器兼容性

- 现代浏览器：Chrome 70+, Firefox 63+, Safari 12+, Edge 79+
- 移动浏览器：iOS Safari 12+, Chrome Mobile 70+
- 兼容性处理：使用Babel转译ES6+代码，CSS前缀处理

## 代码质量要求

1. 代码必须通过ESLint检查
2. 遵循一致的代码风格
3. 添加必要的注释和文档
4. 实现错误处理和用户反馈
5. 确保代码的可读性和可维护性

## 开发指导原则

1. **渐进增强**: 基础功能优先，高级功能作为增强
2. **用户体验**: 快速响应，友好反馈，直观操作
3. **可访问性**: 支持键盘导航，屏幕阅读器友好
4. **安全性**: 输入验证，XSS防护，安全的数据处理
5. **可维护性**: 模块化设计，清晰的代码结构
6. **性能优先**: 优化加载速度和运行性能

在生成代码时，请严格遵循以上规范，确保代码质量和项目的整体一致性。