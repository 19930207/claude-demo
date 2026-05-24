/**
 * 商品管理类
 * 负责商品数据加载、搜索、筛选和展示
 */
class ProductManager {
    constructor() {
        this.products = [];
        this.categories = [];
        this.currentFilters = {
            category: null,
            searchTerm: '',
            sortBy: 'default',
            priceRange: [0, Infinity]
        };
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.isLoading = false;
        
        this.init();
    }
    
    /**
     * 初始化
     */
    async init() {
        try {
            await this.loadData();
            this.initEventListeners();
            this.initFromURL();
        } catch (error) {
            console.error('初始化产品管理器失败:', error);
            Utils.showNotification('加载商品数据失败', 'error');
        }
    }
    
    /**
     * 加载数据
     */
    async loadData() {
        Utils.showLoading();
        this.isLoading = true;
        
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                fetch('assets/data/products.json'),
                fetch('assets/data/categories.json')
            ]);
            
            if (!productsRes.ok || !categoriesRes.ok) {
                throw new Error('网络请求失败');
            }
            
            this.products = await productsRes.json();
            this.categories = await categoriesRes.json();
            
            // 验证数据格式
            if (!Array.isArray(this.products) || !Array.isArray(this.categories)) {
                throw new Error('数据格式错误');
            }
            
            console.log(`已加载 ${this.products.length} 个商品，${this.categories.length} 个分类`);
            
        } catch (error) {
            console.error('加载数据失败:', error);
            // 使用模拟数据作为降级方案
            this.loadMockData();
        } finally {
            Utils.hideLoading();
            this.isLoading = false;
        }
    }
    
    /**
     * 加载模拟数据（降级方案）
     */
    loadMockData() {
        console.log('使用模拟数据');
        this.products = this.generateMockProducts();
        this.categories = this.generateMockCategories();
    }
    
    /**
     * 生成模拟商品数据
     */
    generateMockProducts() {
        const mockProducts = [];
        const brands = ['Apple', '华为', '小米', '三星', '联想', '戴尔', '惠普'];
        const categories = [1, 2, 3, 4];
        
        for (let i = 1; i <= 24; i++) {
            mockProducts.push({
                id: i,
                name: `商品 ${i}`,
                description: `这是商品 ${i} 的详细描述`,
                price: Math.floor(Math.random() * 5000) + 100,
                originalPrice: Math.floor(Math.random() * 6000) + 500,
                image: `assets/images/products/product-${i}.jpg`,
                images: [
                    `assets/images/products/product-${i}-1.jpg`,
                    `assets/images/products/product-${i}-2.jpg`,
                    `assets/images/products/product-${i}-3.jpg`
                ],
                categoryId: categories[Math.floor(Math.random() * categories.length)],
                brand: brands[Math.floor(Math.random() * brands.length)],
                stock: Math.floor(Math.random() * 100) + 10,
                sales: Math.floor(Math.random() * 1000),
                rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
                isHot: Math.random() > 0.7,
                isRecommended: Math.random() > 0.6,
                specifications: {
                    color: ['黑色', '白色', '银色'],
                    size: ['S', 'M', 'L', 'XL']
                },
                tags: Math.random() > 0.5 ? ['热门'] : [],
                createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
        
        return mockProducts;
    }
    
    /**
     * 生成模拟分类数据
     */
    generateMockCategories() {
        return [
            { id: 1, name: '手机数码', slug: 'mobile-digital', image: 'assets/images/categories/mobile.jpg' },
            { id: 2, name: '电脑办公', slug: 'computer-office', image: 'assets/images/categories/computer.jpg' },
            { id: 3, name: '服装鞋帽', slug: 'clothing-shoes', image: 'assets/images/categories/clothing.jpg' },
            { id: 4, name: '家居生活', slug: 'home-living', image: 'assets/images/categories/home.jpg' }
        ];
    }
    
    /**
     * 初始化事件监听
     */
    initEventListeners() {
        // 搜索功能
        const searchForm = document.querySelector('.search-form');
        const searchInput = document.querySelector('.search-form__input');
        
        if (searchForm && searchInput) {
            const debouncedSearch = Utils.debounce((term) => {
                this.setSearchTerm(term);
            }, 300);
            
            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value.trim());
            });
            
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.setSearchTerm(searchInput.value.trim());
            });
        }
        
        // 分类筛选
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-category]')) {
                e.preventDefault();
                const categoryId = parseInt(e.target.getAttribute('data-category'));
                this.setCategoryFilter(categoryId);
            }
        });
        
        // 排序功能
        const sortSelect = document.querySelector('#sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.setSortBy(e.target.value);
            });
        }
        
        // 添加到购物车按钮
        document.addEventListener('click', (e) => {
            if (e.target.matches('.product-card__button, .add-to-cart-btn')) {
                e.preventDefault();
                const productId = parseInt(e.target.getAttribute('data-product-id') || 
                                         e.target.closest('[data-product-id]')?.getAttribute('data-product-id'));
                const specifications = JSON.parse(e.target.getAttribute('data-specifications') || '{}');
                
                if (productId && cartManager) {
                    cartManager.addItem(productId, 1, specifications);
                }
            }
        });
    }
    
    /**
     * 从URL初始化参数
     */
    initFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // 分类筛选
        const categoryParam = urlParams.get('category');
        if (categoryParam) {
            this.setCategoryFilter(parseInt(categoryParam), false);
        }
        
        // 搜索词
        const searchParam = urlParams.get('search');
        if (searchParam) {
            this.setSearchTerm(searchParam, false);
            const searchInput = document.querySelector('.search-form__input');
            if (searchInput) {
                searchInput.value = searchParam;
            }
        }
        
        // 排序
        const sortParam = urlParams.get('sort');
        if (sortParam) {
            this.setSortBy(sortParam, false);
        }
        
        // 页码
        const pageParam = urlParams.get('page');
        if (pageParam) {
            this.setPage(parseInt(pageParam), false);
        }
    }
    
    /**
     * 根据ID获取商品
     */
    getProductById(id) {
        return this.products.find(product => product.id === parseInt(id));
    }
    
    /**
     * 根据分类获取商品
     */
    getProductsByCategory(categoryId) {
        if (!categoryId) return this.products;
        return this.products.filter(product => product.categoryId === parseInt(categoryId));
    }
    
    /**
     * 搜索商品
     */
    searchProducts(keyword) {
        if (!keyword) return this.products;
        
        const searchTerm = keyword.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
    }
    
    /**
     * 排序商品
     */
    sortProducts(products, sortBy) {
        const sortedProducts = [...products];
        
        switch (sortBy) {
            case 'price-asc':
                return sortedProducts.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sortedProducts.sort((a, b) => b.price - a.price);
            case 'name-asc':
                return sortedProducts.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
            case 'name-desc':
                return sortedProducts.sort((a, b) => b.name.localeCompare(a.name, 'zh-CN'));
            case 'sales-desc':
                return sortedProducts.sort((a, b) => b.sales - a.sales);
            case 'rating-desc':
                return sortedProducts.sort((a, b) => b.rating - a.rating);
            case 'newest':
                return sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            default:
                // 默认排序：推荐商品优先，然后按销量
                return sortedProducts.sort((a, b) => {
                    if (a.isRecommended && !b.isRecommended) return -1;
                    if (!a.isRecommended && b.isRecommended) return 1;
                    return b.sales - a.sales;
                });
        }
    }
    
    /**
     * 筛选商品
     */
    filterProducts() {
        let filtered = [...this.products];
        
        // 分类筛选
        if (this.currentFilters.category) {
            filtered = filtered.filter(product => product.categoryId === this.currentFilters.category);
        }
        
        // 搜索筛选
        if (this.currentFilters.searchTerm) {
            const searchTerm = this.currentFilters.searchTerm.toLowerCase();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm) ||
                (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        }
        
        // 价格区间筛选
        if (this.currentFilters.priceRange[0] > 0 || this.currentFilters.priceRange[1] < Infinity) {
            filtered = filtered.filter(product => 
                product.price >= this.currentFilters.priceRange[0] && 
                product.price <= this.currentFilters.priceRange[1]
            );
        }
        
        // 排序
        filtered = this.sortProducts(filtered, this.currentFilters.sortBy);
        
        return filtered;
    }
    
    /**
     * 分页处理
     */
    paginateProducts(products) {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        
        return {
            items: products.slice(startIndex, endIndex),
            totalItems: products.length,
            totalPages: Math.ceil(products.length / this.itemsPerPage),
            currentPage: this.currentPage,
            hasNextPage: endIndex < products.length,
            hasPrevPage: this.currentPage > 1
        };
    }
    
    /**
     * 渲染商品列表
     */
    renderProducts(containerId = 'products-container', showPagination = true) {
        const container = document.getElementById(containerId) || 
                         document.querySelector('.products__grid');
        
        if (!container) {
            console.warn('商品容器未找到');
            return;
        }
        
        const filteredProducts = this.filterProducts();
        const paginatedResult = showPagination ? 
            this.paginateProducts(filteredProducts) : 
            { items: filteredProducts, totalItems: filteredProducts.length };
        
        // 渲染商品
        container.innerHTML = paginatedResult.items.map(product => 
            this.createProductCard(product)
        ).join('');
        
        // 渲染分页
        if (showPagination && paginatedResult.totalPages > 1) {
            this.renderPagination(paginatedResult);
        }
        
        // 更新结果统计
        this.updateResultsInfo(paginatedResult);
        
        // 重新初始化图片懒加载
        Utils.initLazyLoading();
        
        // 更新购物车按钮状态
        if (window.cartManager) {
            cartManager.updateCartButtons();
        }
    }
    
    /**
     * 创建商品卡片HTML
     */
    createProductCard(product) {
        const discountPercent = product.originalPrice > product.price ? 
            Math.round((1 - product.price / product.originalPrice) * 100) : 0;
        
        const badgeHtml = product.isHot ? '<span class="product-card__badge">热门</span>' : '';
        const originalPriceHtml = product.originalPrice > product.price ? 
            `<span class="product-card__original-price">${Utils.formatPrice(product.originalPrice)}</span>` : '';
        
        return `
            <article class="product-card" data-product-id="${product.id}">
                ${badgeHtml}
                <div class="product-card__image-container">
                    <img class="product-card__image" 
                         src="${product.image}" 
                         alt="${product.name}"
                         width="280" 
                         height="220"
                         onerror="this.src='assets/images/placeholder.jpg'">
                    ${discountPercent > 0 ? `<span class="product-card__discount">-${discountPercent}%</span>` : ''}
                </div>
                <div class="product-card__content">
                    <h3 class="product-card__title" title="${product.name}">
                        <a href="pages/product-detail.html?id=${product.id}">${product.name}</a>
                    </h3>
                    <div class="product-card__brand">${product.brand}</div>
                    <div class="product-card__rating">
                        ${this.createRatingStars(product.rating)}
                        <span class="product-card__rating-text">${product.rating}</span>
                        <span class="product-card__sales">(${product.sales}人已购买)</span>
                    </div>
                    <div class="product-card__price-container">
                        <span class="product-card__price">${Utils.formatPrice(product.price)}</span>
                        ${originalPriceHtml}
                    </div>
                    <button class="product-card__button" 
                            data-product-id="${product.id}"
                            data-specifications='{}'>
                        <i class="fas fa-cart-plus"></i> 加入购物车
                    </button>
                </div>
            </article>
        `;
    }
    
    /**
     * 创建评分星星HTML
     */
    createRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHtml = '';
        
        // 实心星星
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        
        // 半星
        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // 空心星星
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        
        return `<div class="product-rating">${starsHtml}</div>`;
    }
    
    /**
     * 渲染分页
     */
    renderPagination(paginatedResult) {
        const paginationContainer = document.querySelector('.pagination-container');
        if (!paginationContainer) return;
        
        const { currentPage, totalPages, hasPrevPage, hasNextPage } = paginatedResult;
        
        let paginationHtml = '<div class="pagination">';
        
        // 上一页按钮
        if (hasPrevPage) {
            paginationHtml += `<button class="pagination__btn pagination__prev" data-page="${currentPage - 1}">
                <i class="fas fa-chevron-left"></i> 上一页
            </button>`;
        }
        
        // 页码按钮
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);
        
        if (startPage > 1) {
            paginationHtml += `<button class="pagination__btn" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHtml += '<span class="pagination__ellipsis">...</span>';
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === currentPage ? 'pagination__btn--active' : '';
            paginationHtml += `<button class="pagination__btn ${isActive}" data-page="${i}">${i}</button>`;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHtml += '<span class="pagination__ellipsis">...</span>';
            }
            paginationHtml += `<button class="pagination__btn" data-page="${totalPages}">${totalPages}</button>`;
        }
        
        // 下一页按钮
        if (hasNextPage) {
            paginationHtml += `<button class="pagination__btn pagination__next" data-page="${currentPage + 1}">
                下一页 <i class="fas fa-chevron-right"></i>
            </button>`;
        }
        
        paginationHtml += '</div>';
        
        paginationContainer.innerHTML = paginationHtml;
        
        // 绑定分页事件
        paginationContainer.addEventListener('click', (e) => {
            if (e.target.matches('.pagination__btn[data-page]')) {
                const page = parseInt(e.target.getAttribute('data-page'));
                this.setPage(page);
            }
        });
    }
    
    /**
     * 更新结果统计信息
     */
    updateResultsInfo(paginatedResult) {
        const infoElement = document.querySelector('.results-info');
        if (!infoElement) return;
        
        const { items, totalItems, currentPage } = paginatedResult;
        const startIndex = (currentPage - 1) * this.itemsPerPage + 1;
        const endIndex = Math.min(startIndex + items.length - 1, totalItems);
        
        infoElement.innerHTML = `
            显示第 ${startIndex}-${endIndex} 个商品，共 ${totalItems} 个商品
        `;
    }
    
    /**
     * 设置分类筛选
     */
    setCategoryFilter(categoryId, updateURL = true) {
        this.currentFilters.category = categoryId || null;
        this.currentPage = 1;
        
        if (updateURL) {
            this.updateURL();
        }
        
        this.renderProducts();
    }
    
    /**
     * 设置搜索词
     */
    setSearchTerm(term, updateURL = true) {
        this.currentFilters.searchTerm = term;
        this.currentPage = 1;
        
        if (updateURL) {
            this.updateURL();
        }
        
        this.renderProducts();
    }
    
    /**
     * 设置排序方式
     */
    setSortBy(sortBy, updateURL = true) {
        this.currentFilters.sortBy = sortBy;
        this.currentPage = 1;
        
        if (updateURL) {
            this.updateURL();
        }
        
        this.renderProducts();
    }
    
    /**
     * 设置价格区间
     */
    setPriceRange(min, max, updateURL = true) {
        this.currentFilters.priceRange = [min || 0, max || Infinity];
        this.currentPage = 1;
        
        if (updateURL) {
            this.updateURL();
        }
        
        this.renderProducts();
    }
    
    /**
     * 设置页码
     */
    setPage(page, updateURL = true) {
        this.currentPage = Math.max(1, parseInt(page) || 1);
        
        if (updateURL) {
            this.updateURL();
        }
        
        this.renderProducts();
        Utils.scrollToElement('.products-section', 100);
    }
    
    /**
     * 更新URL参数
     */
    updateURL() {
        const url = new URL(window.location);
        
        // 清除现有参数
        url.searchParams.delete('category');
        url.searchParams.delete('search');
        url.searchParams.delete('sort');
        url.searchParams.delete('page');
        
        // 设置新参数
        if (this.currentFilters.category) {
            url.searchParams.set('category', this.currentFilters.category);
        }
        
        if (this.currentFilters.searchTerm) {
            url.searchParams.set('search', this.currentFilters.searchTerm);
        }
        
        if (this.currentFilters.sortBy !== 'default') {
            url.searchParams.set('sort', this.currentFilters.sortBy);
        }
        
        if (this.currentPage > 1) {
            url.searchParams.set('page', this.currentPage);
        }
        
        window.history.replaceState({}, '', url);
    }
    
    /**
     * 获取热门商品
     */
    getHotProducts(limit = 8) {
        return this.products
            .filter(product => product.isHot)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, limit);
    }
    
    /**
     * 获取推荐商品
     */
    getRecommendedProducts(limit = 8) {
        return this.products
            .filter(product => product.isRecommended)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }
    
    /**
     * 获取商品统计信息
     */
    getProductStats() {
        return {
            totalProducts: this.products.length,
            totalCategories: this.categories.length,
            averagePrice: this.products.reduce((sum, p) => sum + p.price, 0) / this.products.length,
            hotProductsCount: this.products.filter(p => p.isHot).length,
            recommendedProductsCount: this.products.filter(p => p.isRecommended).length
        };
    }
}

// 创建全局产品管理器实例
const productManager = new ProductManager();