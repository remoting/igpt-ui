<template>
  {{ data.home }}

  <button @click="example_command">example_command</button>
  <br />
  <br />
  <button @click="get_command_registry">get_command_registry</button>
  <br />
  <br />
  <button @click="invoke_dynamic_command">invoke_dynamic_command</button>
  <br />
  <br />
  <br />
  <br />
  <button @click="exec">exec</button>
  <br />
  <br />
  <button @click="query">query</button>
  <br />
  <br />
  <input v-model="data.inp" />
  <button @click="callApi">api</button>
</template>
<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import useUser from "@/stores/user.js";
import sqlite from "@/stores/sqlite.js";
import useApi from "@/stores/api.js";
import { invoke } from "@tauri-apps/api/core";
const router = useRouter();
const user = useUser();
const api = useApi();
const data = reactive({
  home: "",
  inp: "a",
});
const logout = () => {
  router.push("/logout");
};
const callApi = () => {
  api.user.test1({ s: "s" }).then((e) => {
    console.log(e);
  });
  api.home.example_command({ s: "s" }).then((e) => {
    console.log(e);
  });
};
const example_command2 = async () => {
  try {
    let params = { name: "testaa" };
    const response = await invoke("example_command", { args: params });
    console.log(response);
  } catch (error) {
    console.error("Error calling Tauri command:", error);
  }
};
const get_command_registry = async () => {
  try {
    const response = await invoke("get_command_registry");
    debugger;
    console.log(response);
  } catch (error) {
    console.error("Error calling Tauri command:", error);
  }
};
const invoke_dynamic_command = async () => {
  try {
    const response = await invoke("invoke_dynamic_command", {
      name: "app_lib/controller/user/test1",
      args: ["null"],
    });
    console.log(response);
  } catch (error) {
    console.error("Error calling Tauri command:", error);
  }
};

const exec = () => {
  sqlite
    .exec("insert into abc(id) values(?)", 6)
    .then((e) => {
      console.log(e);
    })
    .catch((err) => {
      console.log(err);
    });
};
const query = async () => {
  sqlite
    .query("select * from abc  ")
    .then((e) => {
      debugger;
      console.log(e);
    })
    .catch((err) => {
      console.log(err);
    });
};
onMounted(() => {
  //callTauriCommand();
  data.home = window.location.href + "#" + window.location.hash;
});
</script>
