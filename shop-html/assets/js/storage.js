/**
 * 本地存储管理类
 * 提供localStorage的封装和数据管理功能
 */
class StorageManager {
    /**
     * 设置存储项
     * @param {string} key 存储键
     * @param {any} value 存储值
     * @returns {boolean} 是否成功
     */
    static setItem(key, value) {
        try {
            const serializedValue = JSON.stringify({
                data: value,
                timestamp: Date.now()
            });
            localStorage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.error('存储数据失败:', error);
            return false;
        }
    }
    
    /**
     * 获取存储项
     * @param {string} key 存储键
     * @param {any} defaultValue 默认值
     * @returns {any} 存储值
     */
    static getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return defaultValue;
            
            const parsed = JSON.parse(item);
            return parsed.data !== undefined ? parsed.data : defaultValue;
        } catch (error) {
            console.error('读取数据失败:', error);
            return defaultValue;
        }
    }
    
    /**
     * 删除存储项
     * @param {string} key 存储键
     * @returns {boolean} 是否成功
     */
    static removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('删除数据失败:', error);
            return false;
        }
    }
    
    /**
     * 清空所有存储
     * @returns {boolean} 是否成功
     */
    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('清空数据失败:', error);
            return false;
        }
    }
    
    /**
     * 检查存储项是否存在
     * @param {string} key 存储键
     * @returns {boolean} 是否存在
     */
    static hasItem(key) {
        try {
            return localStorage.getItem(key) !== null;
        } catch (error) {
            console.error('检查数据失败:', error);
            return false;
        }
    }
    
    /**
     * 获取存储大小（近似值）
     * @returns {number} 存储大小（字节）
     */
    static getStorageSize() {
        let total = 0;
        try {
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length + key.length;
                }
            }
        } catch (error) {
            console.error('计算存储大小失败:', error);
        }
        return total;
    }
    
    /**
     * 获取所有存储键
     * @returns {Array} 键数组
     */
    static getAllKeys() {
        try {
            return Object.keys(localStorage);
        } catch (error) {
            console.error('获取存储键失败:', error);
            return [];
        }
    }
    
    /**
     * 设置过期时间的存储项
     * @param {string} key 存储键
     * @param {any} value 存储值
     * @param {number} expireTime 过期时间（毫秒）
     * @returns {boolean} 是否成功
     */
    static setItemWithExpire(key, value, expireTime) {
        try {
            const item = {
                data: value,
                timestamp: Date.now(),
                expire: Date.now() + expireTime
            };
            localStorage.setItem(key, JSON.stringify(item));
            return true;
        } catch (error) {
            console.error('存储带过期时间的数据失败:', error);
            return false;
        }
    }
    
    /**
     * 获取带过期时间的存储项
     * @param {string} key 存储键
     * @param {any} defaultValue 默认值
     * @returns {any} 存储值
     */
    static getItemWithExpire(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return defaultValue;
            
            const parsed = JSON.parse(item);
            
            // 检查是否过期
            if (parsed.expire && Date.now() > parsed.expire) {
                localStorage.removeItem(key);
                return defaultValue;
            }
            
            return parsed.data !== undefined ? parsed.data : defaultValue;
        } catch (error) {
            console.error('读取带过期时间的数据失败:', error);
            return defaultValue;
        }
    }
    
    /**
     * 批量设置存储项
     * @param {Object} items 键值对象
     * @returns {boolean} 是否全部成功
     */
    static setMultipleItems(items) {
        let success = true;
        for (const [key, value] of Object.entries(items)) {
            if (!this.setItem(key, value)) {
                success = false;
            }
        }
        return success;
    }
    
    /**
     * 批量获取存储项
     * @param {Array} keys 键数组
     * @returns {Object} 键值对象
     */
    static getMultipleItems(keys) {
        const result = {};
        keys.forEach(key => {
            result[key] = this.getItem(key);
        });
        return result;
    }
    
    /**
     * 导出存储数据
     * @returns {Object} 所有存储数据
     */
    static exportData() {
        const data = {};
        try {
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    data[key] = this.getItem(key);
                }
            }
        } catch (error) {
            console.error('导出数据失败:', error);
        }
        return data;
    }
    
    /**
     * 导入存储数据
     * @param {Object} data 要导入的数据
     * @param {boolean} overwrite 是否覆盖现有数据
     * @returns {boolean} 是否成功
     */
    static importData(data, overwrite = false) {
        try {
            if (!overwrite) {
                // 不覆盖现有数据，只添加不存在的键
                for (const [key, value] of Object.entries(data)) {
                    if (!this.hasItem(key)) {
                        this.setItem(key, value);
                    }
                }
            } else {
                // 覆盖现有数据
                for (const [key, value] of Object.entries(data)) {
                    this.setItem(key, value);
                }
            }
            return true;
        } catch (error) {
            console.error('导入数据失败:', error);
            return false;
        }
    }
    
    /**
     * 清理过期数据
     * @returns {number} 清理的项目数量
     */
    static cleanExpiredItems() {
        let cleanedCount = 0;
        try {
            const keys = this.getAllKeys();
            keys.forEach(key => {
                try {
                    const item = localStorage.getItem(key);
                    if (item) {
                        const parsed = JSON.parse(item);
                        if (parsed.expire && Date.now() > parsed.expire) {
                            localStorage.removeItem(key);
                            cleanedCount++;
                        }
                    }
                } catch (error) {
                    // 如果解析失败，可能是旧格式的数据，跳过
                }
            });
        } catch (error) {
            console.error('清理过期数据失败:', error);
        }
        return cleanedCount;
    }
}

/**
 * 用户偏好设置管理
 */
class UserPreferences {
    static STORAGE_KEY = 'user_preferences';
    
    /**
     * 获取用户偏好设置
     * @returns {Object} 偏好设置对象
     */
    static getPreferences() {
        return StorageManager.getItem(this.STORAGE_KEY, {
            theme: 'light',
            language: 'zh-CN',
            currency: 'CNY',
            itemsPerPage: 12,
            sortBy: 'default',
            showImages: true,
            autoPlay: true
        });
    }
    
    /**
     * 设置用户偏好
     * @param {Object} preferences 偏好设置
     * @returns {boolean} 是否成功
     */
    static setPreferences(preferences) {
        const currentPrefs = this.getPreferences();
        const newPrefs = { ...currentPrefs, ...preferences };
        return StorageManager.setItem(this.STORAGE_KEY, newPrefs);
    }
    
    /**
     * 获取单个偏好设置
     * @param {string} key 设置键
     * @param {any} defaultValue 默认值
     * @returns {any} 设置值
     */
    static getPreference(key, defaultValue = null) {
        const preferences = this.getPreferences();
        return preferences[key] !== undefined ? preferences[key] : defaultValue;
    }
    
    /**
     * 设置单个偏好
     * @param {string} key 设置键
     * @param {any} value 设置值
     * @returns {boolean} 是否成功
     */
    static setPreference(key, value) {
        const preferences = this.getPreferences();
        preferences[key] = value;
        return StorageManager.setItem(this.STORAGE_KEY, preferences);
    }
}

/**
 * 浏览记录管理
 */
class BrowseHistory {
    static STORAGE_KEY = 'browse_history';
    static MAX_ITEMS = 50;
    
    /**
     * 添加浏览记录
     * @param {Object} item 商品信息
     * @returns {boolean} 是否成功
     */
    static addItem(item) {
        try {
            let history = StorageManager.getItem(this.STORAGE_KEY, []);
            
            // 移除已存在的同一商品
            history = history.filter(historyItem => historyItem.id !== item.id);
            
            // 添加到开头
            history.unshift({
                ...item,
                viewTime: Date.now()
            });
            
            // 限制数量
            if (history.length > this.MAX_ITEMS) {
                history = history.slice(0, this.MAX_ITEMS);
            }
            
            return StorageManager.setItem(this.STORAGE_KEY, history);
        } catch (error) {
            console.error('添加浏览记录失败:', error);
            return false;
        }
    }
    
    /**
     * 获取浏览记录
     * @param {number} limit 限制数量
     * @returns {Array} 浏览记录数组
     */
    static getHistory(limit = this.MAX_ITEMS) {
        const history = StorageManager.getItem(this.STORAGE_KEY, []);
        return history.slice(0, limit);
    }
    
    /**
     * 清空浏览记录
     * @returns {boolean} 是否成功
     */
    static clearHistory() {
        return StorageManager.removeItem(this.STORAGE_KEY);
    }
    
    /**
     * 删除单个记录
     * @param {number} productId 商品ID
     * @returns {boolean} 是否成功
     */
    static removeItem(productId) {
        try {
            let history = StorageManager.getItem(this.STORAGE_KEY, []);
            history = history.filter(item => item.id !== productId);
            return StorageManager.setItem(this.STORAGE_KEY, history);
        } catch (error) {
            console.error('删除浏览记录失败:', error);
            return false;
        }
    }
}