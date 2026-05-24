/**
 * 购物车管理类
 * 负责购物车相关的所有操作
 */
class CartManager {
    constructor() {
        this.cartKey = 'shop_cart';
        this.cart = StorageManager.getItem(this.cartKey, []);
        this.initEventListeners();
    }
    
    /**
     * 初始化事件监听
     */
    initEventListeners() {
        // 监听购物车更新事件
        window.addEventListener('cartUpdated', (event) => {
            this.updateCartDisplay();
        });
        
        // 监听页面加载完成，更新购物车显示
        document.addEventListener('DOMContentLoaded', () => {
            this.updateCartDisplay();
        });
    }
    
    /**
     * 添加商品到购物车
     * @param {number} productId 商品ID
     * @param {number} quantity 数量
     * @param {Object} specifications 商品规格
     * @returns {boolean} 是否成功
     */
    addItem(productId, quantity = 1, specifications = {}) {
        try {
            // 验证参数
            if (!productId || quantity <= 0) {
                Utils.showNotification('商品信息无效', 'error');
                return false;
            }
            
            // 检查商品是否已存在
            const existingItemIndex = this.cart.findIndex(item => 
                item.id === productId && 
                JSON.stringify(item.specifications) === JSON.stringify(specifications)
            );
            
            if (existingItemIndex !== -1) {
                // 更新现有商品数量
                this.cart[existingItemIndex].quantity += quantity;
                this.cart[existingItemIndex].updateTime = Date.now();
            } else {
                // 添加新商品
                this.cart.push({
                    id: productId,
                    quantity: quantity,
                    specifications: specifications,
                    addedAt: Date.now(),
                    updateTime: Date.now()
                });
            }
            
            this.saveCart();
            this.updateCartDisplay();
            Utils.showNotification('商品已添加到购物车', 'success');
            
            // 触发自定义事件
            this.dispatchCartEvent('itemAdded', { productId, quantity, specifications });
            
            return true;
        } catch (error) {
            console.error('添加商品到购物车失败:', error);
            Utils.showNotification('添加失败，请稍后重试', 'error');
            return false;
        }
    }
    
    /**
     * 从购物车移除商品
     * @param {number} productId 商品ID
     * @param {Object} specifications 商品规格
     * @returns {boolean} 是否成功
     */
    removeItem(productId, specifications = {}) {
        try {
            const beforeLength = this.cart.length;
            this.cart = this.cart.filter(item => 
                !(item.id === productId && 
                  JSON.stringify(item.specifications) === JSON.stringify(specifications))
            );
            
            if (this.cart.length < beforeLength) {
                this.saveCart();
                this.updateCartDisplay();
                Utils.showNotification('商品已从购物车移除', 'success');
                
                // 触发自定义事件
                this.dispatchCartEvent('itemRemoved', { productId, specifications });
                
                return true;
            } else {
                Utils.showNotification('商品不存在', 'warning');
                return false;
            }
        } catch (error) {
            console.error('从购物车移除商品失败:', error);
            Utils.showNotification('移除失败，请稍后重试', 'error');
            return false;
        }
    }
    
    /**
     * 更新商品数量
     * @param {number} productId 商品ID
     * @param {number} quantity 新数量
     * @param {Object} specifications 商品规格
     * @returns {boolean} 是否成功
     */
    updateQuantity(productId, quantity, specifications = {}) {
        try {
            if (quantity <= 0) {
                return this.removeItem(productId, specifications);
            }
            
            const item = this.cart.find(item => 
                item.id === productId && 
                JSON.stringify(item.specifications) === JSON.stringify(specifications)
            );
            
            if (item) {
                item.quantity = quantity;
                item.updateTime = Date.now();
                this.saveCart();
                this.updateCartDisplay();
                
                // 触发自定义事件
                this.dispatchCartEvent('quantityUpdated', { productId, quantity, specifications });
                
                return true;
            } else {
                Utils.showNotification('商品不存在', 'warning');
                return false;
            }
        } catch (error) {
            console.error('更新商品数量失败:', error);
            Utils.showNotification('更新失败，请稍后重试', 'error');
            return false;
        }
    }
    
    /**
     * 清空购物车
     * @returns {boolean} 是否成功
     */
    clearCart() {
        try {
            this.cart = [];
            this.saveCart();
            this.updateCartDisplay();
            Utils.showNotification('购物车已清空', 'success');
            
            // 触发自定义事件
            this.dispatchCartEvent('cartCleared', {});
            
            return true;
        } catch (error) {
            console.error('清空购物车失败:', error);
            Utils.showNotification('清空失败，请稍后重试', 'error');
            return false;
        }
    }
    
    /**
     * 获取购物车商品数量
     * @returns {number} 总数量
     */
    getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    /**
     * 获取购物车商品种类数
     * @returns {number} 种类数
     */
    getCartItemsCount() {
        return this.cart.length;
    }
    
    /**
     * 获取购物车所有商品
     * @returns {Array} 购物车商品数组
     */
    getCartItems() {
        return Utils.deepClone(this.cart);
    }
    
    /**
     * 检查商品是否在购物车中
     * @param {number} productId 商品ID
     * @param {Object} specifications 商品规格
     * @returns {boolean} 是否存在
     */
    hasItem(productId, specifications = {}) {
        return this.cart.some(item => 
            item.id === productId && 
            JSON.stringify(item.specifications) === JSON.stringify(specifications)
        );
    }
    
    /**
     * 获取商品在购物车中的数量
     * @param {number} productId 商品ID
     * @param {Object} specifications 商品规格
     * @returns {number} 数量
     */
    getItemQuantity(productId, specifications = {}) {
        const item = this.cart.find(item => 
            item.id === productId && 
            JSON.stringify(item.specifications) === JSON.stringify(specifications)
        );
        return item ? item.quantity : 0;
    }
    
    /**
     * 计算购物车总价（需要商品价格信息）
     * @param {Array} products 商品数据数组
     * @returns {Object} 价格信息
     */
    calculateTotal(products = []) {
        let totalPrice = 0;
        let totalOriginalPrice = 0;
        let totalItems = 0;
        
        this.cart.forEach(cartItem => {
            const product = products.find(p => p.id === cartItem.id);
            if (product) {
                totalPrice += product.price * cartItem.quantity;
                totalOriginalPrice += (product.originalPrice || product.price) * cartItem.quantity;
                totalItems += cartItem.quantity;
            }
        });
        
        return {
            totalPrice: totalPrice,
            totalOriginalPrice: totalOriginalPrice,
            discountAmount: totalOriginalPrice - totalPrice,
            totalItems: totalItems,
            formattedTotalPrice: Utils.formatPrice(totalPrice),
            formattedOriginalPrice: Utils.formatPrice(totalOriginalPrice),
            formattedDiscountAmount: Utils.formatPrice(totalOriginalPrice - totalPrice)
        };
    }
    
    /**
     * 保存购物车到本地存储
     */
    saveCart() {
        StorageManager.setItem(this.cartKey, this.cart);
    }
    
    /**
     * 更新购物车显示
     */
    updateCartDisplay() {
        // 更新购物车数量显示
        const cartCountElements = document.querySelectorAll('.cart-link__count, #cart-count');
        const count = this.getCartCount();
        
        cartCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'block' : 'none';
        });
        
        // 更新购物车按钮状态
        this.updateCartButtons();
    }
    
    /**
     * 更新购物车按钮状态
     */
    updateCartButtons() {
        const cartButtons = document.querySelectorAll('[data-product-id]');
        
        cartButtons.forEach(button => {
            const productId = parseInt(button.getAttribute('data-product-id'));
            const specifications = JSON.parse(button.getAttribute('data-specifications') || '{}');
            
            if (this.hasItem(productId, specifications)) {
                button.classList.add('in-cart');
                const quantity = this.getItemQuantity(productId, specifications);
                button.innerHTML = `<i class="fas fa-check"></i> 已加入 (${quantity})`;
            } else {
                button.classList.remove('in-cart');
                button.innerHTML = '<i class="fas fa-cart-plus"></i> 加入购物车';
            }
        });
    }
    
    /**
     * 触发购物车相关事件
     * @param {string} eventType 事件类型
     * @param {Object} detail 事件详情
     */
    dispatchCartEvent(eventType, detail) {
        const event = new CustomEvent(`cart${eventType.charAt(0).toUpperCase() + eventType.slice(1)}`, {
            detail: {
                ...detail,
                cart: this.getCartItems(),
                cartCount: this.getCartCount()
            }
        });
        window.dispatchEvent(event);
    }
    
    /**
     * 导出购物车数据
     * @returns {Object} 购物车数据
     */
    exportCart() {
        return {
            items: this.getCartItems(),
            count: this.getCartCount(),
            timestamp: Date.now()
        };
    }
    
    /**
     * 导入购物车数据
     * @param {Array} cartItems 购物车商品数组
     * @param {boolean} merge 是否合并现有数据
     * @returns {boolean} 是否成功
     */
    importCart(cartItems, merge = false) {
        try {
            if (!Array.isArray(cartItems)) {
                throw new Error('购物车数据格式无效');
            }
            
            if (merge) {
                // 合并模式：将新商品添加到现有购物车
                cartItems.forEach(item => {
                    this.addItem(item.id, item.quantity, item.specifications || {});
                });
            } else {
                // 替换模式：清空现有购物车并导入新数据
                this.cart = cartItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity || 1,
                    specifications: item.specifications || {},
                    addedAt: item.addedAt || Date.now(),
                    updateTime: item.updateTime || Date.now()
                }));
                
                this.saveCart();
                this.updateCartDisplay();
            }
            
            Utils.showNotification('购物车数据导入成功', 'success');
            return true;
        } catch (error) {
            console.error('导入购物车数据失败:', error);
            Utils.showNotification('导入失败：' + error.message, 'error');
            return false;
        }
    }
    
    /**
     * 获取购物车统计信息
     * @returns {Object} 统计信息
     */
    getCartStats() {
        const now = Date.now();
        const oneDayAgo = now - 24 * 60 * 60 * 1000;
        const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
        
        const recentItems = this.cart.filter(item => item.addedAt > oneDayAgo);
        const weekOldItems = this.cart.filter(item => item.addedAt < oneWeekAgo);
        
        return {
            totalItems: this.cart.length,
            totalQuantity: this.getCartCount(),
            recentItemsCount: recentItems.length,
            oldItemsCount: weekOldItems.length,
            averageQuantityPerItem: this.cart.length > 0 ? 
                this.getCartCount() / this.cart.length : 0
        };
    }
}

// 创建全局购物车管理器实例
const cartManager = new CartManager();