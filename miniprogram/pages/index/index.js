Page({
    data: {
        planName: '',
        cycleDuration: '30',
        planItems: [],
        showModal: false,
        editingIndex: -1,
        tempItem: {
            name: '',
            sets: '3',
            rest: '60'
        }
    },

    onLoad: function() {
        this.loadPlanData();
    },

    onShow: function() {
        this.loadPlanData();
    },

    loadPlanData: function() {
        const app = getApp();
        this.setData({
            planItems: app.globalData.planItems || [],
            planName: app.globalData.planName || '',
            cycleDuration: app.globalData.cycleDuration || '30'
        });
    },

    savePlanData: function() {
        const app = getApp();
        app.globalData.planItems = this.data.planItems;
        app.globalData.planName = this.data.planName;
        app.globalData.cycleDuration = this.data.cycleDuration;
        app.saveToStorage();
    },

    // 输入计划名称 / 循环时长
    onPlanNameInput: function(e) {
        this.setData({ planName: e.detail });
        this.savePlanData();
    },

    onCycleDurationInput: function(e) {
        this.setData({ cycleDuration: e.detail });
        this.savePlanData();
    },

    // 打开添加弹窗
    handleAddItem: function() {
        this.setData({
            showModal: true,
            editingIndex: -1,
            tempItem: { name: '', sets: '3', rest: '60' }
        });
    },

    // 打开编辑弹窗
    handleEditItem: function(e) {
        const index = e.currentTarget.dataset.index;
        const item = this.data.planItems[index];
        if (!item) return;
        this.setData({
            showModal: true,
            editingIndex: index,
            tempItem: {
                name: item.name,
                sets: String(item.sets),
                rest: String(item.rest)
            }
        });
    },

    // 删除训练项
    handleDeleteItem: function(e) {
        const index = e.currentTarget.dataset.index;
        const item = this.data.planItems[index];
        wx.showModal({
            title: '删除训练项',
            content: '确定删除「' + (item ? item.name : '') + '」吗？',
            success: (res) => {
                if (!res.confirm) return;
                const planItems = this.data.planItems.slice();
                planItems.splice(index, 1);
                this.setData({ planItems: planItems });
                this.savePlanData();
                wx.showToast({ title: '已删除', icon: 'success' });
            }
        });
    },

    handleCloseModal: function() {
        this.setData({ showModal: false });
    },

    onTempNameInput: function(e) {
        this.setData({ 'tempItem.name': e.detail });
    },

    onTempSetsInput: function(e) {
        this.setData({ 'tempItem.sets': e.detail });
    },

    onTempRestInput: function(e) {
        this.setData({ 'tempItem.rest': e.detail });
    },

    handleSaveItem: function() {
        const tempItem = this.data.tempItem;
        const name = (tempItem.name || '').trim();
        const sets = parseInt(tempItem.sets, 10);
        const rest = parseInt(tempItem.rest, 10);

        if (!name) {
            wx.showToast({ title: '请输入训练项名称', icon: 'none' });
            return;
        }
        if (!sets || sets < 1 || sets > 50) {
            wx.showToast({ title: '组数需为 1 - 50', icon: 'none' });
            return;
        }
        if (isNaN(rest) || rest < 0 || rest > 600) {
            wx.showToast({ title: '休息时间需为 0 - 600 秒', icon: 'none' });
            return;
        }

        const newItem = {
            name: name,
            sets: sets,
            rest: rest
        };

        const planItems = this.data.planItems.slice();
        const editingIndex = this.data.editingIndex;

        if (editingIndex >= 0) {
            planItems[editingIndex] = newItem;
        } else {
            planItems.push(newItem);
        }

        this.setData({
            planItems: planItems,
            showModal: false,
            editingIndex: -1,
            tempItem: { name: '', sets: '3', rest: '60' }
        });

        this.savePlanData();
        wx.showToast({
            title: editingIndex >= 0 ? '已更新' : '已添加',
            icon: 'success',
            duration: 1000
        });
    }
});