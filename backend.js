import pagination from './pagination.js';
import msgModal from './msgModal.js';
// import confirmModal from './confirmModal.js';
const api_path = 'week3-backend';
axios.defaults.baseURL = 'https://vue3-course-api.hexschool.io';
let add_modal = null;
let msg_modal = null;
// let confirm_modal = null;

const app = Vue.createApp({
  data() {
    return {
      status: true, // 取得資料的狀態，false 為取得失敗
      page: {},
      products: [],
      newProduct: {},
      imgMethod: "url", // 圖片取得方式
      tempSrc: {}, //上傳圖片的檔案與預覽網址
      editingProduct: {},
      msgText: '',
      // confirmText: '',
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
      if (this.imgMethod !== 'url') {
        const formData = new FormData();
        let url = '';
        formData.append('file-to-upload', this.tempSrc.origin_src);
        axios
          .post(`/v2/api/${api_path}/admin/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(res => {
            if (res.data.success) {
              url = res.data.imageUrl;
              this.newProduct.imageUrl = url;
              axios
                .post(`/v2/api/${api_path}/admin/product`, {
                  data: this.newProduct,
                })
                .then(() => {
                  this.getAllProducts();
                  this.newProduct = {};
                  add_modal.hide();
                })
                .catch(err => {
                  this.msgText = err.response.data.message;
                  msg_modal.show();
                })
            } else {
              this.msgText = res.data.message;
              msg_modal.show();
            }
          })
      } else {
        axios
          .post(`/v2/api/${api_path}/admin/product`, {
            data: this.newProduct,
          })
          .then(() => {
            this.getAllProducts();
            this.newProduct = {};
            add_modal.hide();
          })
          .catch((err) => {
            this.msgText = err.response.data.message;
            msg_modal.show();
          });
      }
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
    getProductInfo(index) {
      this.editingProduct = { ...this.products[index] };
    },
    editProduct(id) {
      axios
        .put(`/v2/api/${api_path}/admin/product/${id}`, {
          data: this.editingProduct,
        })
        .then(() => this.getAllProducts())
        .catch((err) => {
          this.msgText = err.response.data.message;
          msg_modal.show();
        });
    },
    changePage(pageNum) {
      axios
        .get(`/v2/api/${api_path}/admin/products?page=${pageNum}`)
        .then((res) => {
          this.page = res.data.pagination;
          this.products = res.data.products;
        })
        .catch(() => (this.status = false)); 1
    },
    showUploadImg(e) {
      this.tempSrc.origin_src = e.target.files[0];
      const src = URL.createObjectURL(e.target.files[0]);
      this.tempSrc.blob_src = src;
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

    add_modal = new bootstrap.Modal(document.getElementById('addModal'));
    msg_modal = new bootstrap.Modal(document.getElementById('msgModal'));
    // confirm_modal = new bootstrap.Modal(document.getElementById('confirmModal'));
  }
});


app.mount('#app');