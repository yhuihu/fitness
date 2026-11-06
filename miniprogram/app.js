App({
    globalData: {
        planName: '',
        cycleDuration: '30',
        planItems: [],
        currentItemIndex: 0,
        isTraining: false
    },

    STORAGE_KEYS: {
        PLAN_DATA: 'fitness_plan_data',
        PLAN_NAME: 'fitness_plan_name',
        CYCLE_DURATION: 'fitness_cycle_duration'
    },

    onLaunch: function() {
        this.loadFromStorage();
    },

    loadFromStorage: function() {
        try {
            const planData = wx.getStorageSync(this.STORAGE_KEYS.PLAN_DATA);
            const planName = wx.getStorageSync(this.STORAGE_KEYS.PLAN_NAME);
            const cycleDuration = wx.getStorageSync(this.STORAGE_KEYS.CYCLE_DURATION);

            this.globalData.planItems = Array.isArray(planData) ? planData : [];
            this.globalData.planName = planName || '';
            this.globalData.cycleDuration = cycleDuration || '30';
        } catch (e) {
            console.error('加载缓存失败:', e);
        }
    },

    saveToStorage: function() {
        try {
            wx.setStorageSync(this.STORAGE_KEYS.PLAN_DATA, this.globalData.planItems || []);
            wx.setStorageSync(this.STORAGE_KEYS.PLAN_NAME, this.globalData.planName || '');
            wx.setStorageSync(this.STORAGE_KEYS.CYCLE_DURATION, this.globalData.cycleDuration || '30');
        } catch (e) {
            console.error('保存缓存失败:', e);
        }
    },

    clearStorage: function() {
        try {
            wx.removeStorageSync(this.STORAGE_KEYS.PLAN_DATA);
            wx.removeStorageSync(this.STORAGE_KEYS.PLAN_NAME);
            wx.removeStorageSync(this.STORAGE_KEYS.CYCLE_DURATION);
        } catch (e) {
            console.error('清除缓存失败:', e);
        }
        this.globalData.planItems = [];
        this.globalData.planName = '';
        this.globalData.cycleDuration = '30';
        this.globalData.currentItemIndex = 0;
        this.globalData.isTraining = false;
    }
});