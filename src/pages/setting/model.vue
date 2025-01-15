<template>
  <van-form @submit="onSubmit"><van-cell-group inset title="模型名称">
      <van-field label="模型名称" v-model="data.name" name="name" placeholder=""
        :rules="[{ required: true, message: '请输入名称' }]" />
      <van-field label="默认模型" name="name" placeholder="">
        <template #input>
          <van-switch v-model="data.default" size="22px" />
        </template>
      </van-field>
    </van-cell-group>
    <van-cell-group inset title="模型设置">
      <van-field label="API 类型" class="ly-vant-redio-group">
        <template #input>
          <van-radio-group v-model="data.provider">
            <van-radio v-for="item in model.provider()" :name="item.name" :key="item.name">
              {{ item.title }}
            </van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <template v-if="data.provider === 'openai' || data.provider === 'gemini' || data.provider === 'claude'">
        <van-field v-model="data.config.apiurl" label="API 地址" placeholder="https://xxx.xxx.com"
          :rules="[{ required: true, message: '请填写 API 地址, https://xxx.xxx.xxx' }]" />
        <van-field v-model="data.config.apikey" label="API Key" placeholder="xxxxxxxxxxxx"
          :rules="[{ required: true, message: '请填写 API Key' }]" />
        <van-field v-model="data.config.modelname" label="模型名称" placeholder="模型名称"
          :rules="[{ required: true, message: '请填写模型名称' }]" />
      </template>
      <template v-if="data.provider === 'azure'">
        <van-field v-model="data.config.apiurl" label="API 地址" placeholder="https://xxx.xxx.com"
          :rules="[{ required: true, message: '请填写 API Key, https://xxx.xxx.xxx' }]" />
        <van-field v-model="data.config.apikey" label="API Key" placeholder="xxxxxxxxxxxx"
          :rules="[{ required: true, message: '请填写 API Key' }]" />
        <van-field v-model="data.config.apiversion" label="API Version" placeholder="API Version"
          :rules="[{ required: true, message: '请填写 API Version' }]" />
        <van-field v-model="data.config.modelname" label="模型名称" placeholder="模型名称"
          :rules="[{ required: true, message: '请填写模型名称' }]" />
      </template>
    </van-cell-group>

    <div style="margin: 16px">
      <van-row justify="center">
        <van-col span="6">
          <van-button round style="width: 100%" plain @click="goto">返回
          </van-button></van-col>
        <van-col span="2"> </van-col>
        <van-col span="6">
          <van-button v-if="data.id !== 0" round type="warning" style="width: 100%" @click="delModel">
            删除
          </van-button></van-col>
        <van-col span="2"> </van-col>
        <van-col span="6">
          <van-button round type="primary" style="width: 100%" native-type="submit">
            确定
          </van-button></van-col>
      </van-row>
    </div>
  </van-form>
  <van-popup v-model:show="state.showPicker" destroy-on-close position="bottom">
    <van-picker :columns="state.columns" :model-value="state.pickerValue" @confirm="onConfirm"
      @cancel="state.showPicker = false" />
  </van-popup>
</template>
<script setup>
import sqlite from "@/utils/sqlite.js";
import global from "@/utils/global.js";
import useModel from "@/stores/model.js";
import { useRoute, useRouter } from "vue-router";
import { onMounted, reactive } from "vue";
import { showConfirmDialog } from "vant";
const model = useModel();
const route = useRoute();
const router = useRouter();
const state = reactive({
  showPicker: false,
  pickerValue: "",
  columns: [],
});
const data = reactive({
  id: 0,
  name: "",
  provider: "openai",
  default: false,
  config: {},
});
const goto = () => {
  router.push({
    path: global.path("/setting/home"),
  });
};
const onConfirm = (value) => {
  data.showPicker = false;
  data.result = value;
};
const delModel = () => {
  showConfirmDialog({
    title: "删除确认",
    message: "确定要删除？",
  })
    .then(() => {
      sqlite
        .exec(`delete from model where id=?`, data.id)
        .then(() => {
          global.toast("删除成功");
          model.init(() => {
            router.push({
              path: global.path("/setting/home"),
            });
          });
        })
        .catch((err) => {
          global.toast("删除失败" + err);
        });
    })
    .catch(() => { });
};
const onSubmit = async () => {
  if (data.id == 0) {
    if (data.default) {
      let x = await sqlite.exec(`update model set 'default'=0`);
    }
    sqlite
      .exec(
        `INSERT INTO model (name, provider, config, 'default') VALUES (?,?,?,?)`,
        data.name,
        data.provider,
        JSON.stringify(data.config),
        data.default ? 1 : 0
      )
      .then(() => {
        global.toast("添加成功");
        model.init(() => {
          router.push({
            path: global.path("/setting/home"),
          });
        });
      })
      .catch((err) => {
        global.toast("添加失败" + err);
      });
  } else {
    if (data.default) {
      await sqlite.exec(`update model set 'default'=0`);
    }
    sqlite
      .exec(
        `update model set name=?,provider=?,config=?,'default'=? where id=? `,
        data.name,
        data.provider,
        JSON.stringify(data.config),
        data.default ? 1 : 0,
        data.id
      )
      .then(() => {
        global.toast("修改成功");
        model.init(() => {
          router.push({
            path: global.path("/setting/home"),
          });
        });
      })
      .catch((err) => {
        global.toast("修改失败" + err);
      });
  }
};
onMounted(() => {
  if (route.query != null && route.query.id != null && route.query.id != "") {
    data.id = route.query.id;
    let x = model.getById(data.id);
    data.name = x.name;
    data.config = JSON.parse(x.config);
    data.provider = x.provider;
    data.default = x.default === 1 ? true : false;
  } else {
    data.id = 0;
    data.name = "";
    data.config = {};
    data.provider = "openai";
    data.default = false;
  }
});
</script>
<style lang="scss">
.ly-vant-redio-group {
  .van-radio {
    padding-top: 10px;
  }
}
</style>
