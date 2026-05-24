/**
 * 工具函数类
 * 提供通用的工具方法
 */
class Utils {
    /**
     * 防抖函数
     * @param {Function} func 要执行的函数
     * @param {number} wait 等待时间（毫秒）
     * @returns {Function} 防抖后的函数
     */
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
    
    /**
     * 节流函数
     * @param {Function} func 要执行的函数
     * @param {number} limit 限制时间（毫秒）
     * @returns {Function} 节流后的函数
     */
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
    
    /**
     * 格式化价格
     * @param {number} price 价格
     * @returns {string} 格式化后的价格字符串
     */
    static formatPrice(price) {
        if (typeof price !== 'number' || isNaN(price)) {
            return '￥0.00';
        }
        return `￥${price.toFixed(2)}`;
    }
    
    /**
     * 格式化日期
     * @param {Date|string} date 日期对象或日期字符串
     * @returns {string} 格式化后的日期字符串
     */
    static formatDate(date) {
        try {
            const d = new Date(date);
            if (isNaN(d.getTime())) {
                return '无效日期';
            }
            return d.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (error) {
            return '无效日期';
        }
    }
    
    /**
     * 生成唯一ID
     * @returns {string} 唯一ID字符串
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    /**
     * 获取URL参数
     * @param {string} name 参数名
     * @returns {string|null} 参数值
     */
    static getURLParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
    
    /**
     * 设置URL参数
     * @param {string} name 参数名
     * @param {string} value 参数值
     */
    static setURLParameter(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.pushState({}, '', url);
    }
    
    /**
     * 图片懒加载
     */
    static initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('lazy-loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                img.classList.add('lazy');
                imageObserver.observe(img);
            });
        } else {
            // 降级处理：直接加载所有图片
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('lazy-loaded');
            });
        }
    }
    
    /**
     * 显示loading
     */
    static showLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
    }
    
    /**
     * 隐藏loading
     */
    static hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    }
    
    /**
     * 显示通知消息
     * @param {string} message 消息内容
     * @param {string} type 消息类型：success, error, warning, info
     * @param {number} duration 显示时长（毫秒）
     */
    static showNotification(message, type = 'success', duration = 3000) {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        const textElement = notification.querySelector('.notification__text');
        if (textElement) {
            textElement.textContent = message;
        }
        
        // 设置通知类型样式
        notification.className = 'notification show';
        switch (type) {
            case 'success':
                notification.style.backgroundColor = 'var(--success-color)';
                break;
            case 'error':
                notification.style.backgroundColor = 'var(--danger-color)';
                break;
            case 'warning':
                notification.style.backgroundColor = 'var(--warning-color)';
                break;
            case 'info':
                notification.style.backgroundColor = 'var(--info-color)';
                break;
            default:
                notification.style.backgroundColor = 'var(--success-color)';
        }
        
        // 自动隐藏
        setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
    }
    
    /**
     * 动画滚动到指定元素
     * @param {Element|string} target 目标元素或选择器
     * @param {number} offset 偏移量
     */
    static scrollToElement(target, offset = 0) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    /**
     * 验证邮箱格式
     * @param {string} email 邮箱地址
     * @returns {boolean} 是否有效
     */
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * 验证手机号格式
     * @param {string} phone 手机号
     * @returns {boolean} 是否有效
     */
    static validatePhone(phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phone);
    }
    
    /**
     * 深拷贝对象
     * @param {any} obj 要拷贝的对象
     * @returns {any} 拷贝后的对象
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        
        if (obj instanceof Array) {
            return obj.map(item => Utils.deepClone(item));
        }
        
        if (typeof obj === 'object') {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = Utils.deepClone(obj[key]);
                }
            }
            return cloned;
        }
    }
    
    /**
     * 加载外部脚本
     * @param {string} src 脚本URL
     * @returns {Promise} Promise对象
     */
    static loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    /**
     * 检测设备类型
     * @returns {string} 设备类型：mobile, tablet, desktop
     */
    static getDeviceType() {
        const width = window.innerWidth;
        if (width <= 576) return 'mobile';
        if (width <= 768) return 'tablet';
        return 'desktop';
    }
    
    /**
     * 获取随机数
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @returns {number} 随机数
     */
    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /**
     * 截断文本
     * @param {string} text 原始文本
     * @param {number} maxLength 最大长度
     * @param {string} suffix 后缀
     * @returns {string} 截断后的文本
     */
    static truncateText(text, maxLength, suffix = '...') {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - suffix.length) + suffix;
    }
}