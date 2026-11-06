Page({
    data: {
        planName: '',
        cycleDuration: '30',
        planItems: [],
        currentItemIndex: 0
    },

    onLoad: function() {
        const app = getApp();
        this.setData({
            planName: app.globalData.planName || '',
            cycleDuration: app.globalData.cycleDuration || '30',
            planItems: app.globalData.planItems || [],
            currentItemIndex: app.globalData.currentItemIndex || 0
        });
    },

    onShow: function() {
        const app = getApp();
        this.setData({
            planName: app.globalData.planName || '',
            cycleDuration: app.globalData.cycleDuration || '30',
            planItems: app.globalData.planItems || [],
            currentItemIndex: app.globalData.currentItemIndex || 0
        });
    },

    // 清除缓存
    clearStorage: function() {
        const app = getApp();
        wx.showModal({
            title: '确认清除',
            content: '确定要清除所有缓存数据吗？清除后无法恢复。',
            success: (res) => {
                if (res.confirm) {
                    app.clearStorage();
                    this.setData({
                        planItems: [],
                        planName: '',
                        cycleDuration: '30',
                        currentItemIndex: 0
                    });
                    wx.showToast({
                        title: '已清除缓存',
                        icon: 'success'
                    });
                }
            }
        });
    }
});