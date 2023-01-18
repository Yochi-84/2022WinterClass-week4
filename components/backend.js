import pagination from './pagination.js';
import msgModal from './msgModal.js';
import manageModal from './manageModal.js';
// import confirmModal from './confirmModal.js';
const api_path = 'week3-backend';
axios.defaults.baseURL = 'https://vue3-course-api.hexschool.io';
let msg_modal = null;
// let confirm_modal = null;

const app = Vue.createApp({
  data() {
    return {
      status: true, // 取得資料的狀態，false 為取得失敗
      page: {}, // api 回傳的 page 資料
      products: [], // 所有產品
      editingProduct: {}, // 要傳給 manageModal 的產品資訊
      msgText: '', // msgModal 內文
      // confirmText: '',
    };
  },
  components: {
    pagination,
    msgModal,
    manageModal
  },
  methods: {
    getAllProducts() {
      axios
        .get(`/v2/api/${api_path}/admin/products`)
        .then((res) => {
          this.products = res.data.products;
          this.page = res.data.pagination;
        })
        .catch(() => (this.status = false));
    },
    deleteProduct(id) {
      if (confirm('確認刪除此產品嗎?')) {
        axios
          .delete(`/v2/api/${api_path}/admin/product/${id}`)
          .then(() => this.getAllProducts())
          .catch((err) => {
            this.msgText = err.response.data.message;
            msg_modal.show();
          });
      }
    },
    getProductInfo(id) {
      this.editingProduct = { ...this.products[this.products.findIndex(item => item.id === id)] };
    },
    changePage(pageNum) {
      axios
        .get(`/v2/api/${api_path}/admin/products?page=${pageNum}`)
        .then((res) => {
          this.page = res.data.pagination;
          this.products = res.data.products;
        })
        .catch(() => (this.status = false));
    },
    showMsg(text) {
      this.msgText = text;
      msg_modal.show();
    }
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common['Authorization'] = token;

    axios
      .post(`/v2/api/user/check`)
      .then(() => {
        return this.getAllProducts();
      })
      .catch(() => (window.location.href = './index.html'));

    msg_modal = new bootstrap.Modal(document.getElementById('msgModal'));
    // confirm_modal = new bootstrap.Modal(document.getElementById('confirmModal'));
  }
});


app.mount('#app');