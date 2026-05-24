/**
 * 主应用类
 * 负责整个应用的初始化和协调
 */
class ShopApp {
    constructor() {
        this.isInitialized = false;
        this.components = {};
        this.init();
    }
    
    /**
     * 初始化应用
     */
    async init() {
        try {
            // 显示loading
            Utils.showLoading();
            
            // 检测设备类型
            this.deviceType = Utils.getDeviceType();
            document.body.setAttribute('data-device', this.deviceType);
            
            // 加载用户偏好设置
            this.loadUserPreferences();
            
            // 初始化组件
            await this.initComponents();
            
            // 绑定全局事件
            this.bindGlobalEvents();
            
            // 初始化页面特定功能
            this.initPageSpecificFeatures();
            
            // 清理过期数据
            this.cleanupExpiredData();
            
            this.isInitialized = true;
            console.log('Shop App 初始化完成');
            
        } catch (error) {
            console.error('应用初始化失败:', error);
            Utils.showNotification('应用初始化失败', 'error');
        } finally {
            Utils.hideLoading();
        }
    }
    
    /**
     * 加载用户偏好设置
     */
    loadUserPreferences() {
        const preferences = UserPreferences.getPreferences();
        
        // 应用主题设置
        if (preferences.theme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        // 应用其他偏好设置
        if (productManager) {
            productManager.itemsPerPage = preferences.itemsPerPage || 12;
            productManager.currentFilters.sortBy = preferences.sortBy || 'default';
        }
    }
    
    /**
     * 初始化组件
     */
    async initComponents() {
        // 初始化导航组件
        this.initNavigation();
        
        // 初始化轮播图
        this.initHeroSlider();
        
        // 初始化搜索功能
        this.initSearch();
        
        // 初始化通知组件
        this.initNotifications();
        
        // 初始化图片懒加载
        Utils.initLazyLoading();
        
        // 等待产品管理器初始化完成
        if (window.productManager) {
            await this.waitForProductManager();
            this.loadHomePageProducts();
        }
        
        // 初始化购物车显示
        if (window.cartManager) {
            cartManager.updateCartDisplay();
        }
    }
    
    /**
     * 等待产品管理器初始化完成
     */
    async waitForProductManager() {
        let attempts = 0;
        const maxAttempts = 50;
        
        while (productManager.isLoading && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (attempts >= maxAttempts) {
            console.warn('产品管理器初始化超时');
        }
    }
    
    /**
     * 初始化导航组件
     */
    initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isActive = navToggle.classList.contains('active');
                
                if (isActive) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                } else {
                    navToggle.classList.add('active');
                    navMenu.classList.add('active');
                    navToggle.setAttribute('aria-expanded', 'true');
                }
            });
            
            // 点击菜单项时关闭移动菜单
            navMenu.addEventListener('click', (e) => {
                if (e.target.matches('.nav-menu__link')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
        
        // 滚动时隐藏/显示导航栏
        let lastScrollY = window.scrollY;
        const header = document.querySelector('.header');
        
        if (header) {
            const throttledScroll = Utils.throttle(() => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    // 向下滚动时隐藏
                    header.style.transform = 'translateY(-100%)';
                } else {
                    // 向上滚动时显示
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollY = currentScrollY;
            }, 100);
            
            window.addEventListener('scroll', throttledScroll);
        }
    }
    
    /**
     * 初始化轮播图
     */
    initHeroSlider() {
        const slider = document.getElementById('hero-slider');
        if (!slider) return;
        
        const slides = slider.querySelectorAll('.hero__slide');
        const dots = document.querySelectorAll('.hero__dot');
        const prevBtn = document.querySelector('.hero__prev');
        const nextBtn = document.querySelector('.hero__next');
        
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        let autoPlayInterval;
        
        // 显示指定幻灯片
        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('hero__slide--active'));
            dots.forEach(dot => dot.classList.remove('hero__dot--active'));
            
            slides[index].classList.add('hero__slide--active');
            if (dots[index]) {
                dots[index].classList.add('hero__dot--active');
            }
        };
        
        // 下一张幻灯片
        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };
        
        // 上一张幻灯片
        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        };
        
        // 开始自动播放
        const startAutoPlay = () => {
            const autoPlay = UserPreferences.getPreference('autoPlay', true);
            if (autoPlay) {
                autoPlayInterval = setInterval(nextSlide, 5000);
            }
        };
        
        // 停止自动播放
        const stopAutoPlay = () => {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        };
        
        // 绑定事件
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopAutoPlay();
                setTimeout(startAutoPlay, 10000); // 10秒后重新开始自动播放
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopAutoPlay();
                setTimeout(startAutoPlay, 10000);
            });
        }
        
        // 点击指示器
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
                stopAutoPlay();
                setTimeout(startAutoPlay, 10000);
            });
        });
        
        // 鼠标悬停时暂停自动播放
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);
        
        // 触摸滑动支持
        let startX = 0;
        let endX = 0;
        
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // 最小滑动距离
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                stopAutoPlay();
                setTimeout(startAutoPlay, 10000);
            }
        });
        
        // 开始自动播放
        startAutoPlay();
        
        // 键盘导航
        document.addEventListener('keydown', (e) => {
            if (slider.matches(':hover')) {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                }
            }
        });
    }
    
    /**
     * 初始化搜索功能
     */
    initSearch() {
        const searchInput = document.querySelector('.search-form__input');
        if (!searchInput) return;
        
        // 搜索建议功能
        const searchSuggestions = document.createElement('div');
        searchSuggestions.className = 'search-suggestions';
        searchInput.parentNode.appendChild(searchSuggestions);
        
        const debouncedSuggestions = Utils.debounce(async (term) => {
            if (term.length < 2) {
                searchSuggestions.style.display = 'none';
                return;
            }
            
            if (productManager && productManager.products.length > 0) {
                const suggestions = this.getSearchSuggestions(term);
                this.renderSearchSuggestions(suggestions, searchSuggestions);
            }
        }, 300);
        
        searchInput.addEventListener('input', (e) => {
            debouncedSuggestions(e.target.value.trim());
        });
        
        // 点击外部关闭建议
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.style.display = 'none';
            }
        });
    }
    
    /**
     * 获取搜索建议
     */
    getSearchSuggestions(term) {
        const suggestions = [];
        const termLower = term.toLowerCase();
        
        // 从商品名称中获取建议
        productManager.products.forEach(product => {
            if (product.name.toLowerCase().includes(termLower)) {
                suggestions.push({
                    text: product.name,
                    type: 'product',
                    id: product.id
                });
            }
            
            if (product.brand.toLowerCase().includes(termLower)) {
                suggestions.push({
                    text: product.brand,
                    type: 'brand',
                    brand: product.brand
                });
            }
        });
        
        // 去重并限制数量
        const uniqueSuggestions = suggestions
            .filter((suggestion, index, self) => 
                self.findIndex(s => s.text === suggestion.text) === index
            )
            .slice(0, 8);
        
        return uniqueSuggestions;
    }
    
    /**
     * 渲染搜索建议
     */
    renderSearchSuggestions(suggestions, container) {
        if (suggestions.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.innerHTML = suggestions.map(suggestion => {
            const icon = suggestion.type === 'product' ? 'fas fa-box' : 'fas fa-tag';
            return `
                <div class="search-suggestion" data-type="${suggestion.type}" 
                     data-id="${suggestion.id || ''}" data-text="${suggestion.text}">
                    <i class="${icon}"></i>
                    <span>${suggestion.text}</span>
                </div>
            `;
        }).join('');
        
        container.style.display = 'block';
        
        // 绑定点击事件
        container.addEventListener('click', (e) => {
            const suggestion = e.target.closest('.search-suggestion');
            if (suggestion) {
                const searchInput = document.querySelector('.search-form__input');
                const searchForm = document.querySelector('.search-form');
                
                searchInput.value = suggestion.getAttribute('data-text');
                container.style.display = 'none';
                
                // 提交搜索
                if (searchForm) {
                    searchForm.dispatchEvent(new Event('submit'));
                }
            }
        });
    }
    
    /**
     * 初始化通知组件
     */
    initNotifications() {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        const closeBtn = notification.querySelector('.notification__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.classList.remove('show');
            });
        }
        
        // 自动关闭通知
        let autoCloseTimeout;
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (notification.classList.contains('show')) {
                        clearTimeout(autoCloseTimeout);
                        autoCloseTimeout = setTimeout(() => {
                            notification.classList.remove('show');
                        }, 5000);
                    }
                }
            });
        });
        
        observer.observe(notification, { attributes: true });
    }
    
    /**
     * 初始化页面特定功能
     */
    initPageSpecificFeatures() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'home':
                this.initHomePage();
                break;
            case 'products':
                this.initProductsPage();
                break;
            case 'product-detail':
                this.initProductDetailPage();
                break;
            case 'cart':
                this.initCartPage();
                break;
            default:
                console.log('当前页面:', currentPage);
        }
    }
    
    /**
     * 获取当前页面类型
     */
    getCurrentPage() {
        const path = window.location.pathname;
        
        if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
            return 'home';
        } else if (path.includes('products.html')) {
            return 'products';
        } else if (path.includes('product-detail.html')) {
            return 'product-detail';
        } else if (path.includes('cart.html')) {
            return 'cart';
        }
        
        return 'unknown';
    }
    
    /**
     * 初始化首页
     */
    initHomePage() {
        console.log('初始化首页');
        // 首页特定的初始化逻辑已在 loadHomePageProducts 中处理
    }
    
    /**
     * 加载首页商品
     */
    loadHomePageProducts() {
        // 加载热门商品
        const hotProductsContainer = document.getElementById('hot-products');
        if (hotProductsContainer && productManager.products.length > 0) {
            const hotProducts = productManager.getHotProducts(8);
            hotProductsContainer.innerHTML = hotProducts.map(product => 
                productManager.createProductCard(product)
            ).join('');
        }
        
        // 加载推荐商品
        const recommendedProductsContainer = document.getElementById('recommended-products');
        if (recommendedProductsContainer && productManager.products.length > 0) {
            const recommendedProducts = productManager.getRecommendedProducts(8);
            recommendedProductsContainer.innerHTML = recommendedProducts.map(product => 
                productManager.createProductCard(product)
            ).join('');
        }
        
        // 重新初始化图片懒加载
        Utils.initLazyLoading();
        
        // 更新购物车按钮状态
        if (window.cartManager) {
            setTimeout(() => {
                cartManager.updateCartButtons();
            }, 100);
        }
    }
    
    /**
     * 初始化商品列表页
     */
    initProductsPage() {
        console.log('初始化商品列表页');
        // 商品列表页的初始化逻辑在 ProductManager 中处理
    }
    
    /**
     * 初始化商品详情页
     */
    initProductDetailPage() {
        console.log('初始化商品详情页');
        const productId = Utils.getURLParameter('id');
        if (productId && productManager) {
            this.loadProductDetail(parseInt(productId));
        }
    }
    
    /**
     * 加载商品详情
     */
    loadProductDetail(productId) {
        const product = productManager.getProductById(productId);
        if (product) {
            // 添加到浏览记录
            BrowseHistory.addItem({
                id: product.id,
                name: product.name,
                image: product.image,
                price: product.price
            });
            
            // 渲染商品详情
            this.renderProductDetail(product);
        } else {
            Utils.showNotification('商品未找到', 'error');
        }
    }
    
    /**
     * 渲染商品详情
     */
    renderProductDetail(product) {
        // 这里应该渲染商品详情页面
        // 由于当前没有详情页模板，先在控制台输出
        console.log('商品详情:', product);
    }
    
    /**
     * 初始化购物车页面
     */
    initCartPage() {
        console.log('初始化购物车页面');
        // 购物车页面的初始化逻辑
    }
    
    /**
     * 绑定全局事件
     */
    bindGlobalEvents() {
        // 窗口大小变化时更新设备类型
        const debouncedResize = Utils.debounce(() => {
            const newDeviceType = Utils.getDeviceType();
            if (newDeviceType !== this.deviceType) {
                this.deviceType = newDeviceType;
                document.body.setAttribute('data-device', this.deviceType);
                console.log('设备类型变更为:', this.deviceType);
            }
        }, 250);
        
        window.addEventListener('resize', debouncedResize);
        
        // 监听购物车事件
        window.addEventListener('cartItemAdded', (e) => {
            console.log('商品已添加到购物车:', e.detail);
        });
        
        window.addEventListener('cartItemRemoved', (e) => {
            console.log('商品已从购物车移除:', e.detail);
        });
        
        // 页面可见性变化处理
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                // 页面变为可见时，清理过期数据
                this.cleanupExpiredData();
            }
        });
        
        // 在线/离线状态处理
        window.addEventListener('online', () => {
            Utils.showNotification('网络连接已恢复', 'success');
        });
        
        window.addEventListener('offline', () => {
            Utils.showNotification('网络连接已断开，部分功能可能无法使用', 'warning');
        });
    }
    
    /**
     * 清理过期数据
     */
    cleanupExpiredData() {
        try {
            const cleanedCount = StorageManager.cleanExpiredItems();
            if (cleanedCount > 0) {
                console.log(`已清理 ${cleanedCount} 个过期数据项`);
            }
        } catch (error) {
            console.error('清理过期数据失败:', error);
        }
    }
    
    /**
     * 获取应用状态
     */
    getAppStatus() {
        return {
            isInitialized: this.isInitialized,
            deviceType: this.deviceType,
            currentPage: this.getCurrentPage(),
            storageSize: StorageManager.getStorageSize(),
            cartItemsCount: cartManager ? cartManager.getCartCount() : 0,
            productsCount: productManager ? productManager.products.length : 0
        };
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.shopApp = new ShopApp();
});

// 导出给window对象，方便调试
if (typeof window !== 'undefined') {
    window.ShopApp = ShopApp;
}