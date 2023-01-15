import msgModal from './msgModal.js';
axios.defaults.baseURL = 'https://vue3-course-api.hexschool.io';
let msg_modal = null;

const app = Vue.createApp({
  data() {
    return {
      status: false,
      username: '',
      password: '',
      msgText: '',
    };
  },
  components: {
    msgModal
  },
  methods: {
    checkUserInfo() {
      if (this.username === "" || this.password === "") {
        this.msgText = "帳號密碼不可為空";
        msg_modal.show();
      } else {
        axios
          .post(`/v2/admin/signin`, {
            username: this.username,
            password: this.password,
          })
          .then((res) => {
            axios.defaults.headers.common['Authorization'] = res.data.token;
            document.cookie = `token = ${res.data.token}`;
            this.status = true;
            window.location.href = './backend.html';
          })
          .catch((err) => {
            this.msgText = err.response.data.message;
            msg_modal.show();
          });
      }
    },
  },
  mounted() {
    msg_modal = new bootstrap.Modal(document.getElementById('msgModal'));
  }
});

app.mount('#app');