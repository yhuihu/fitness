package com.example.fitnessapp;

import android.app.AlertDialog;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.View;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private EditText etPlanName, etCycleDuration;
    private Button btnAddItem, btnStartPlan;
    private LinearLayout llItemsContainer;
    private TextView tvCurrentItem, tvRestTimer;
    private Button btnRestStart, btnRestSkip;

    // 存储计划项数据
    private List<PlanItem> planItems = new ArrayList<>();
    private int currentItemIndex = 0;
    private CountDownTimer restTimer;
    private long restRemainingTime = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initViews();
        setupListeners();
    }

    private void initViews() {
        etPlanName = findViewById(R.id.et_plan_name);
        etCycleDuration = findViewById(R.id.et_cycle_duration);
        btnAddItem = findViewById(R.id.btn_add_item);
        btnStartPlan = findViewById(R.id.btn_start_plan);
        llItemsContainer = findViewById(R.id.ll_items_container);
        tvCurrentItem = findViewById(R.id.tv_current_item);
        tvRestTimer = findViewById(R.id.tv_rest_timer);
        btnRestStart = findViewById(R.id.btn_rest_start);
        btnRestSkip = findViewId(R.id.btn_rest_skip);
    }

    private void setupListeners() {
        btnAddItem.setOnClickListener(v -> addPlanItem());
        btnStartPlan.setOnClickListener(v -> startPlan());
        btnRestStart.setOnClickListener(v -> startRestTimer());
        btnRestSkip.setOnClickListener(v -> skipRest());
    }

    private void addPlanItem() {
        String groupCountStr = etPlanName.getText().toString(); // 复用 etPlanName 作为组数输入
        // 实际应该有单独的输入框，这里简化处理
        showInputDialog("组数", "请输入每组做多少次练习：", "10",
                count -> addItemWithGroups(Integer.parseInt(count)));
    }

    private void addItemWithGroups(int totalReps) {
        Dialog itemDialog = new Dialog(this);
        itemDialog.setTitle("计划项设置");
        itemDialog.setContentView(R.layout.dialog_plan_item);

        EditText etSets = itemDialog.findViewById(R.id.et_sets);
        EditText etRestBetween = itemDialog.findViewById(R.id.et_rest_between);

        Button btnSave = itemDialog.findViewById(R.id.btn_save_item);
        btnSave.setOnClickListener(v -> {
            int sets = etSets.getText().toString().isEmpty() ? 3 : Integer.parseInt(etSets.getText().toString());
            int restBetween = etRestBetween.getText().toString().isEmpty() ? 60 : Integer.parseInt(etRestBetween.getText().toString());

            PlanItem item = new PlanItem(
                    etPlanName.getText().toString(),
                    Integer.parseInt(etCycleDuration.getText().toString()),
                    sets,
                    restBetween,
                    totalReps
            );
            planItems.add(item);
            updateItemsDisplay();
            itemDialog.dismiss();
        });

        itemDialog.show();
    }

    private void updateItemsDisplay() {
        llItemsContainer.removeAllViews();
        for (int i = 0; i < planItems.size(); i++) {
            PlanItem item = planItems.get(i);
            View itemView = getLayoutInflater().inflate(R.layout.item_plan, llItemsContainer, false);
            TextView tvItemName = itemView.findViewById(R.id.tv_item_name);
            TextView tvSets = itemView.findViewById(R.id.tv_sets);
            TextView tvRest = itemView.findViewById(R.id.tv_rest_between);
            TextView tvReps = itemView.findViewById(R.id.tv_total_reps);

            tvItemName.setText((i + 1) + ". " + item.planName);
            tvSets.setText("组数: " + item.sets + "组");
            tvRest.setText("组间休息: " + item.restBetween + "秒");
            tvReps.setText("总次数: " + item.sets * item.totalReps + "次");

            llItemsContainer.addView(itemView);
        }
    }

    private void startPlan() {
        if (planItems.isEmpty()) {
            showToast("请先添加计划项");
            return;
        }
        if (etPlanName.getText().toString().isEmpty() || etCycleDuration.getText().toString().isEmpty()) {
            showToast("请输入计划名称和循环时长");
            return;
        }

        currentItemIndex = 0;
        showCurrentItem();
        startNextCycle();
    }

    private void showCurrentItem() {
        if (currentItemIndex < planItems.size()) {
            PlanItem item = planItems.get(currentItemIndex);
            tvCurrentItem.setText("当前: " + (currentItemIndex + 1) + "/" + planItems.size() +
                    " - " + item.planName);
        }
    }

    private void startNextCycle() {
        if (currentItemIndex >= planItems.size()) {
            showToast("恭喜！完成了全部计划");
            btnStartPlan.setText("开始计划");
            btnStartPlan.setTag("start");
            return;
        }

        PlanItem item = planItems.get(currentItemIndex);
        // 循环播放
        for (int i = 1; i <= item.sets; i++) {
            final int setNum = i;
            // 显示当前组
            runOnUiThread(() -> tvCurrentItem.setText("当前: 第 " + setNum + " 组 - " + item.planName));

            // 输入训练时长（这里简化：假设每次次数固定时长，或者可以再输入）
            new CountDownTimer(item.getSetDuration() * 1000, 1000) {
                public void onTick(long millisUntilFinished) {
                    tvCurrentItem.setText("第 " + setNum + " 组进行中 - 剩余: " + millisUntilFinished / 1000 + "s");
                }
                public void onFinish() {
                    // 组间休息
                    startRestTimer(item.restBetween * 1000);
                }
            }.start();

            // 等待当前组结束后继续下一组（由休息计时器触发）
            try {
                Thread.sleep(item.getSetDuration() * 1000 + item.restBetween * 1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        currentItemIndex++;
        startNextCycle();
    }

    private void startRestTimer(long duration) {
        restRemainingTime = duration;
        tvRestTimer.setVisibility(View.VISIBLE);
        tvRestTimer.setText("休息倒计时: " + restRemainingTime / 1000 + "s");

        restTimer = new CountDownTimer(duration, 1000) {
            public void onTick(long millisUntilFinished) {
                restRemainingTime = millisUntilFinished;
                tvRestTimer.setText("休息倒计时: " + restRemainingTime / 1000 + "s");
            }
            public void onFinish() {
                tvRestTimer.setVisibility(View.GONE);
                btnRestStart.setVisibility(View.GONE);
                btnRestSkip.setVisibility(View.GONE);
                // 继续下一组
                startNextCycle();
            }
        }.start();

        btnRestStart.setVisibility(View.VISIBLE);
        btnRestSkip.setVisibility(View.VISIBLE);
    }

    private void skipRest() {
        if (restTimer != null) {
            restTimer.cancel();
        }
        tvRestTimer.setVisibility(View.GONE);
        btnRestStart.setVisibility(View.GONE);
        btnRestSkip.setVisibility(View.GONE);
        startNextCycle();
    }

    private void showInputDialog(String title, String message, String initialValue, android.content.DialogInterface.OnInputCallback callback) {
        // 简化实现，实际应该用AlertDialog.Builder
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(title);
        builder.setMessage(message);
        final EditText input = new EditText(this);
        input.setText(initialValue);
        builder.setView(input);
        builder.setPositiveButton("确定", (dialog, which) -> callback.onInput(input.getText().toString()));
        builder.setNegativeButton("取消", (dialog, which) -> dialog.cancel());
        builder.show();
    }

    private void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    // 内部类：计划项
    public static class PlanItem {
        String planName;
        int cycleDuration; // 循环时长(分钟)
        int sets; // 每组组数
        int restBetween; // 组间休息(秒)
        int totalReps; // 每次总重复次数

        public PlanItem(String planName, int cycleDuration, int sets, int restBetween, int totalReps) {
            this.planName = planName;
            this.cycleDuration = cycleDuration;
            this.sets = sets;
            this.restBetween = restBetween;
            this.totalReps = totalReps;
        }

        // 计算单组总时长（假设每次重复10秒）
        public int getSetDuration() {
            return totalReps * 10; // 10秒/次
        }
    }
}