Page({
    data: {
        planItems: [],
        currentItemIndex: 0,
        currentItemName: '',
        currentSets: 0,
        nextItemName: '',
        isTraining: false,
        showRestTimer: false,
        restRemainingTime: 0,
        restPercent: 100
    },

    onLoad: function() {
        this.restTimer = null;
        this.loadPlanData();
    },

    onShow: function() {
        this.loadPlanData();
    },

    onUnload: function() {
        this.clearRestTimer();
    },

    onHide: function() {
        // 切换 Tab 时保持计时，不清理
    },

    loadPlanData: function() {
        const app = getApp();
        const planItems = app.globalData.planItems || [];
        const index = Math.min(app.globalData.currentItemIndex || 0, Math.max(planItems.length - 1, 0));
        this.setData({
            planItems: planItems,
            currentItemIndex: index,
            isTraining: !!app.globalData.isTraining,
            currentItemName: planItems[index] ? planItems[index].name : '',
            currentSets: planItems[index] ? planItems[index].sets : 0,
            nextItemName: planItems[index + 1] ? planItems[index + 1].name : ''
        });
    },

    clearRestTimer: function() {
        if (this.restTimer) {
            clearInterval(this.restTimer);
            this.restTimer = null;
        }
    },

    handleToggleTraining: function() {
        if (this.data.isTraining) {
            this.stopTraining();
        } else {
            this.startTraining();
        }
    },

    startTraining: function() {
        const app = getApp();
        const planItems = app.globalData.planItems || [];
        if (planItems.length === 0) {
            wx.showToast({ title: '请先添加训练项', icon: 'none' });
            return;
        }

        app.globalData.currentItemIndex = 0;
        app.globalData.isTraining = true;
        app.saveToStorage();

        this.setData({
            planItems: planItems,
            currentItemIndex: 0,
            isTraining: true,
            showRestTimer: false,
            restRemainingTime: 0,
            restPercent: 100
        });

        this.runCurrentItem();
    },

    stopTraining: function() {
        this.clearRestTimer();
        const app = getApp();
        app.globalData.isTraining = false;
        app.globalData.currentItemIndex = 0;
        app.saveToStorage();

        this.setData({
            isTraining: false,
            currentItemIndex: 0,
            showRestTimer: false,
            restRemainingTime: 0,
            restPercent: 100
        });

        wx.showToast({ title: '训练已结束', icon: 'none' });
    },

    runCurrentItem: function() {
        const planItems = this.data.planItems;
        const index = this.data.currentItemIndex;

        if (index >= planItems.length) {
            this.finishTraining();
            return;
        }

        const item = planItems[index];
        this.setData({
            currentItemName: item.name,
            currentSets: item.sets,
            nextItemName: planItems[index + 1] ? planItems[index + 1].name : ''
        });

        const rest = parseInt(item.rest, 10) || 0;
        if (rest > 0) {
            this.startRestCountdown(rest);
        } else {
            this.goNext();
        }
    },

    startRestCountdown: function(totalSeconds) {
        this.clearRestTimer();
        let secondsLeft = totalSeconds;

        this.setData({
            showRestTimer: true,
            restRemainingTime: secondsLeft,
            restPercent: 100
        });

        this.restTimer = setInterval(() => {
            secondsLeft -= 1;
            if (secondsLeft <= 0) {
                this.clearRestTimer();
                this.setData({
                    showRestTimer: false,
                    restRemainingTime: 0,
                    restPercent: 100
                });
                this.goNext();
                return;
            }
            this.setData({
                restRemainingTime: secondsLeft,
                restPercent: (secondsLeft / totalSeconds) * 100
            });
        }, 1000);
    },

    goNext: function() {
        const nextIndex = this.data.currentItemIndex + 1;
        const app = getApp();
        app.globalData.currentItemIndex = nextIndex;

        this.setData({ currentItemIndex: nextIndex });
        this.runCurrentItem();
    },

    handleSkipRest: function() {
        this.clearRestTimer();
        this.setData({
            showRestTimer: false,
            restRemainingTime: 0,
            restPercent: 100
        });
        this.goNext();
    },

    finishTraining: function() {
        const app = getApp();
        app.globalData.isTraining = false;
        app.globalData.currentItemIndex = 0;
        app.saveToStorage();

        this.setData({
            isTraining: false,
            currentItemIndex: 0,
            showRestTimer: false,
            restRemainingTime: 0,
            restPercent: 100,
            currentItemName: '训练完成',
            nextItemName: ''
        });

        wx.showModal({
            title: '训练完成',
            content: '恭喜完成全部训练计划！',
            showCancel: false,
            confirmText: '好的'
        });
    }
});