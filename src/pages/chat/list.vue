<template>
  <div class="ly-session-list">
    <div v-if="list.list.length <= 0"><br /><br />暂无会话<br /></div>
    <div v-for="(item, i) in list.list" :key="item.id" :class="className(item)" @click="onClick(item)">
      <div class="subject">
        {{ item.subject }}
      </div>
      <div class="opts">
        <div class="opt" @click="deleteSession($event, item.id, i)">
          <van-icon name="delete-o" size="15" style="color: red" />
        </div>
      </div>
      <div class="info">
        <div class="count">{{ item.count }} 条对话</div>
        <div class="time">{{ item.create_time }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import global from "@/utils/global.js";
import useSession from "./session";
import useModel from "@/stores/model";
import useList from "./list.js";
import { showConfirmDialog, showToast } from "vant";
const router = useRouter();
const session = useSession();
const list = useList();
const model = useModel();
const deleteSession = (e, id, i) => {
  e.preventDefault(); // 阻止默认行为
  e.stopPropagation(); // 停止事件冒泡
  showConfirmDialog({
    title: "删除会话",
    message: "确定要删除这个会话吗？",
  })
    .then(() => {
      if (session.id == id) {
        if (i == 0 && i == list.list.length - 1) {
          showToast("Oops! 最后一个了, 别删了! ");
          return;
        } else if (i > 0) {
          list.deleteItem(id, () => {
            session.start(list.list[i - 1].id);
          });
        } else {
          list.deleteItem(id, () => {
            session.start(list.list[i].id);
          });
        }
      } else {
        list.deleteItem(id);
      }
    })
    .catch((e) => {
      showToast("别删了! 出现错误了" + e);
    });
};

const onClick = (item) => {
  session.set(item, () => {
    router.push({
      path: "/pc/home",
    });
  });
};
const className = (item) => {
  if (item.id == session.id) {
    return "ly-session-item active";
  }
  return "ly-session-item";
};

onMounted(() => {
  model.init((e) => {
    if (e != null) {
      global.toast("系统故障");
    } else {
      if (model.list.length <= 0) {
        let path = "/pc/setting/model";
        if (global.isMobile()) {
          path = "/mobile/setting/model";
        }
        router.push({
          path: path,
        });
      } else {
        list.load(() => {
          if (list.list.length <= 0) {
            let path = "/pc/new";
            if (global.isMobile()) {
              path = "/mobile/new";
            }
            router.push({
              path: path,
            });
          }
        });
      }
    }
  });
});
</script>
<style lang="scss">
.ly-session-list {
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;

  .ly-session-item.active {
    border: #315ef8 2px solid;
  }

  .ly-session-item {
    position: relative;
    line-height: 30px;
    margin-top: 10px;
    box-sizing: border-box;
    padding: 5px 10px;
    border: 0px;
    background-color: white;
    border-radius: 5px;
    overflow: hidden;

    &:hover .opts {
      display: flex;
    }

    .opts {
      position: absolute;
      right: 2px;
      top: 5px;
      display: none;
      z-index: 20;

      .opt {
        height: 15px;
        margin-right: 5px;
        cursor: pointer;

        i {
          vertical-align: top;
        }
      }
    }

    .subject {
      font-size: 16px;
    }

    .info {
      display: flex;
      color: #a6a6a6;
      font-size: 12px;
      overflow: hidden;
      height: 30px;

      .count {
        flex: 1;
      }

      .time {
        text-align: right;
        color: #a6a6a6;
        font-size: 12px;
        width: 130px;
      }
    }
  }
}
</style>
