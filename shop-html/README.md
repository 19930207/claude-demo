# HTML5电商网站项目

基于HTML5、CSS3和JavaScript的纯前端电商网站，无需后端支持，使用localStorage进行数据持久化。

## 项目特色

- ✅ **响应式设计**: 完美适配PC、平板、手机设备
- ✅ **纯前端实现**: 无需后端支持，部署简单
- ✅ **模块化架构**: 代码结构清晰，易于维护
- ✅ **用户体验优秀**: 流畅的交互和视觉效果
- ✅ **性能优化**: 图片懒加载、防抖节流等优化策略
- ✅ **本地存储**: 购物车、用户偏好等数据本地持久化

## 技术栈

- **前端**: HTML5 + CSS3 + JavaScript ES6+
- **样式**: CSS自定义属性、Flexbox、Grid布局
- **图标**: Font Awesome
- **数据存储**: localStorage + JSON文件
- **工具**: 原生JavaScript，无框架依赖

## 项目结构

```
shop-html/
├── index.html                 # 首页
├── pages/                     # 页面文件
├── assets/                    # 静态资源
│   ├── css/                  # 样式文件
│   │   ├── style.css        # 主样式
│   │   └── responsive.css   # 响应式样式
│   ├── js/                  # JavaScript文件
│   │   ├── utils.js         # 工具函数
│   │   ├── storage.js       # 存储管理
│   │   ├── cart.js          # 购物车逻辑
│   │   ├── products.js      # 商品管理
│   │   └── main.js          # 主应用
│   ├── images/              # 图片资源
│   └── data/                # 模拟数据
│       ├── products.json    # 商品数据
│       ├── categories.json  # 分类数据
│       └── banners.json     # 轮播数据
├── components/              # 公共组件
└── docs/                    # 文档
```

## 主要功能

### 已实现功能
- [x] 响应式导航栏
- [x] 轮播图展示
- [x] 商品分类导航
- [x] 商品列表展示
- [x] 购物车功能
- [x] 本地数据存储
- [x] 搜索功能
- [x] 用户偏好设置
- [x] 浏览历史记录

### 待实现功能
- [ ] 商品详情页
- [ ] 结算页面
- [ ] 订单管理
- [ ] 用户评价系统
- [ ] 商品筛选和排序

## 快速开始

1. **克隆项目**
   ```bash
   git clone [项目地址]
   cd shop-html
   ```

2. **启动项目**
   
   由于是纯前端项目，可以直接用浏览器打开 `index.html`，或使用本地服务器：
   
   ```bash
   # 使用Python启动本地服务器
   python -m http.server 8000
   
   # 或使用Node.js的http-server
   npx http-server
   ```

3. **访问网站**
   
   打开浏览器访问 `http://localhost:8000`

## 使用说明

### 购物车功能
- 点击商品卡片上的"加入购物车"按钮
- 购物车数量会实时更新显示
- 数据自动保存到本地存储

### 搜索功能
- 在顶部搜索框输入关键词
- 支持商品名称、品牌、描述搜索
- 提供搜索建议功能

### 响应式适配
- 桌面端：完整功能展示
- 平板端：布局自动调整
- 手机端：触摸友好界面，折叠菜单

## 浏览器支持

- Chrome 70+
- Firefox 63+
- Safari 12+
- Edge 79+
- 移动浏览器：iOS Safari 12+, Chrome Mobile 70+

## 开发指南

### 代码规范
项目遵循严格的代码规范，详见 `CLAUDE.md` 文件。

### 添加新商品
编辑 `assets/data/products.json` 文件，按照现有格式添加商品数据。

### 自定义样式
- 主要样式变量定义在 `assets/css/style.css` 的 `:root` 中
- 响应式断点在 `assets/css/responsive.css` 中定义
- 遵循BEM命名规范

### 扩展功能
1. 在相应的JavaScript模块中添加功能
2. 更新HTML模板
3. 添加对应的CSS样式
4. 测试响应式适配

## 性能优化

- **图片懒加载**: 使用Intersection Observer API
- **防抖节流**: 搜索、滚动等操作进行优化
- **缓存策略**: localStorage缓存用户数据
- **代码分离**: 模块化JavaScript结构
- **CSS优化**: 使用CSS变量，减少重复代码

## 数据结构

### 商品数据格式
```json
{
  "id": 1,
  "name": "商品名称",
  "price": 99.00,
  "image": "图片路径",
  "categoryId": 1,
  "brand": "品牌",
  "isHot": true,
  "isRecommended": false
}
```

### 购物车数据格式
```json
{
  "id": 1,
  "quantity": 2,
  "specifications": {},
  "addedAt": "时间戳"
}
```

## 部署说明

项目为纯静态网站，支持多种部署方式：

1. **GitHub Pages**: 直接部署到GitHub Pages
2. **Vercel**: 一键部署
3. **Netlify**: 拖拽部署
4. **传统服务器**: 上传到任意Web服务器

## 许可证

MIT License

## 更新日志

### v1.0.0 (2024-01-17)
- 完成基础架构搭建
- 实现响应式首页
- 添加购物车功能
- 完善数据存储机制