import pagination from './pagination.js';
import msgModal from './msgModal.js';
const api_path = 'week3-backend';
axios.defaults.baseURL = 'https://vue3-course-api.hexschool.io';
let msg_modal = null;

const app = Vue.createApp({
  data() {
    return {
      status: true, // 取得資料的狀態，false 為取得失敗
      page: {},
      products: [],
      newProduct: {},
      editingProduct: {},
      modalText: '',
    };
  },
  components: {
    pagination,
    msgModal
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
    getEnabled(e) {
      this.newProduct.is_enabled = e.target.checked ? 1 : 0;
    },
    getEditingEnabled(e) {
      this.editingProduct.is_enabled = e.target.checked ? 1 : 0;
    },
    addProduct() {
      axios
        .post(`/v2/api/${api_path}/admin/product`, {
          data: this.newProduct,
        })
        .then(() => {
          this.getAllProducts();
          this.newProduct = {};
        })
        .catch((err) => {
          this.modalText = err.response.data.message;
          msg_modal.show();
        });
    },
    deleteProduct(id) {
      if (confirm('確認刪除此產品嗎?')) {
        axios
          .delete(`/v2/api/${api_path}/admin/product/${id}`)
          .then(() => this.getAllProducts())
          .catch((err) => {
            this.modalText = err.response.data.message;
            msg_modal.show();
          });
      }
    },
    getProductInfo(index) {
      this.editingProduct = {...this.products[index]};
    },
    editProduct(id) {
      axios
        .put(`/v2/api/${api_path}/admin/product/${id}`, {
          data: this.editingProduct,
        })
        .then(() => this.getAllProducts())
        .catch((err) => {
          this.modalText = err.response.data.message;
          msg_modal.show();
        });
    },
    changePage(pageNum) {
      axios
        .get(`/v2/api/${api_path}/admin/products?page=${pageNum}`)
        .then((res) => {
          this.products = res.data.products;
          this.page = res.data.pagination;
        })
        .catch(() => (this.status = false));1
    },
    previousPage() {
      axios
        .get(`/v2/api/${api_path}/admin/products?page=${--this.page.current_page}`)
        .then((res) => {
          this.products = res.data.products;
          this.page = res.data.pagination;
        })
        .catch(() => (this.status = false));
    },
    nextPage() {
      axios
      .get(`/v2/api/${api_path}/admin/products?page=${++this.page.current_page}`)
      .then((res) => {
        this.products = res.data.products;
        this.page = res.data.pagination;
      })
      .catch(() => (this.status = false));
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
  }
});


app.mount('#app');