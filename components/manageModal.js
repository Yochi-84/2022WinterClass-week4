const api_path = 'week3-backend';
axios.defaults.baseURL = 'https://vue3-course-api.hexschool.io';
let manage_modal = null;

export default {
  props: ['product'],
  data() {
    return {
      imgMethod: "url", // 圖片取得方式
      tempSrc: {}, // 上傳圖片的檔案與預覽網址
      editingProduct: {}, // 新產品或要編輯的產品資料
    }
  },
  template: `
  <div
    class="modal fade"
    id="manageModal"
    tabindex="-1"
    aria-labelledby="manageModalLabel"
    aria-hidden="true"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header bg-warning">
          <h5 class="modal-title" id="manageModalLabel">{{ editingProduct.id ? '編輯':'新增' }}產品</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form class="container-fluid">
            <div class="row">
              <div class="col-5 border-end">
                <div>
                  <label for="imageUrl" class="form-label me-4"
                    >產品圖片:</label
                  >
                  <div
                    class="btn-group mb-2"
                    role="group"
                    aria-label="Basic radio toggle button group"
                  >
                    <input
                      type="radio"
                      class="btn-check"
                      name="imgMethod"
                      id="imgMethod_url"
                      v-model="imgMethod"
                      value="url"
                      autocomplete="off"
                      checked
                    />
                    <label
                      class="btn btn-outline-warning"
                      for="imgMethod_url"
                      >圖片網址</label
                    >

                    <input
                      type="radio"
                      class="btn-check"
                      name="imgMethod"
                      id="imgMethod_upload"
                      v-model="imgMethod"
                      value="upload"
                      autocomplete="off"
                    />
                    <label
                      class="btn btn-outline-warning"
                      for="imgMethod_upload"
                      >上傳圖片</label
                    >
                  </div>
                  <keep-alive>
                    <div v-if="imgMethod === 'url'">
                      <input
                        type="text"
                        id="imageUrl"
                        class="form-control mb-2"
                        v-model="editingProduct.imageUrl"
                        placeholder="圖片網址"
                      />
                      <div class="ratio ratio-1x1">
                        <img
                          :src="editingProduct.imageUrl"
                          alt="主圖片"
                          v-show="editingProduct.imageUrl"
                          class="object-cover"
                        />
                      </div>
                    </div>
                    <div v-else>
                      <div class="mb-3">
                        <input
                          class="form-control"
                          type="file"
                          id="imgUpload"
                          accept="image/*"
                          @change="showUploadImg"
                        />
                      </div>
                      <div class="ratio ratio-1x1">
                        <img
                          :src="tempSrc.blob_src"
                          alt="主圖片"
                          v-show="tempSrc.blob_src"
                          class="object-cover"
                        />
                      </div>
                    </div>
                  </keep-alive>
                </div>
              </div>
              <div class="col-7 row">
                <div class="col-6">
                  <label for="title" class="form-label">產品名稱:</label>
                  <input
                    type="text"
                    id="title"
                    class="form-control mb-2"
                    v-model="editingProduct.title"
                    placeholder="請輸入產品名稱"
                  />
                </div>
                <div class="col-6">
                  <label for="number" class="form-label">數量:</label>
                  <input
                    type="text"
                    id="number"
                    class="form-control mb-2"
                    v-model.number="editingProduct.number"
                    placeholder="請輸入產品數量"
                  />
                </div>
                <div class="col-6">
                  <label for="category" class="form-label">分類:</label>
                  <input
                    type="text"
                    id="category"
                    class="form-control mb-2"
                    v-model="editingProduct.category"
                    placeholder="請輸入產品分類"
                  />
                </div>
                <div class="col-6">
                  <label for="unit" class="form-label">單位:</label>
                  <input
                    type="text"
                    id="unit"
                    class="form-control mb-2"
                    v-model="editingProduct.unit"
                    placeholder="請輸入產品單位"
                  />
                </div>
                <div class="col-6">
                  <label for="origin_price" class="form-label">原價:</label>
                  <input
                    type="text"
                    id="origin_price"
                    class="form-control mb-2"
                    v-model.number="editingProduct.origin_price"
                    placeholder="請輸入產品原價"
                  />
                </div>
                <div class="col-6">
                  <label for="price" class="form-label">售價:</label>
                  <input
                    type="text"
                    id="price"
                    class="form-control mb-2"
                    v-model.number="editingProduct.price"
                    placeholder="請輸入產品售價"
                  />
                </div>
                <div>
                  <label for="description" class="form-label">描述:</label>
                  <textarea
                    type="text"
                    id="description"
                    class="form-control mb-2"
                    v-model="editingProduct.description"
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>
                <label for="content" class="form-label">說明:</label>
                <div>
                  <textarea
                    type="text"
                    id="content"
                    class="form-control mb-2"
                    v-model="editingProduct.content"
                    placeholder="請輸入產品說明"
                  ></textarea>
                </div>
                <div>
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="is_enabled"
                      @change="getEditingEnabled"
                      :checked="editingProduct.is_enabled ? true: false"
                    />
                    <label class="form-check-label" for="is_enabled"
                      >是否啟用</label
                    >
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="manageProduct()"
            v-if="!editingProduct.id"
          >
            確認新增
          </button>
          <button
            type="button"
            class="btn btn-success"
            @click="manageProduct(editingProduct.id)"
            v-else
          >
            更新
          </button>
        </div>
      </div>
    </div>
  </div>
  `,
  methods: {
    // 重置
    initModal() {
      this.imgMethod = 'url';
      this.editingProduct = {};
    },
    manageProduct() {
      // 如果有 id 就是編輯，沒有就是新增
      if (!this.editingProduct.id) {
        this.addProduct();
      } else {
        this.editProduct();
      }
    },
    addProduct() {
      if (this.imgMethod !== 'url') {
        // 上傳圖片
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
              this.editingProduct.imageUrl = url;
              axios
                .post(`/v2/api/${api_path}/admin/product`, {
                  data: this.editingProduct,
                })
                .then(() => {
                  this.initModal();
                  this.$emit('update');
                  manage_modal.hide();
                })
                .catch(err => {
                  this.$emit('showMsg', err.response.data.message);
                })
            } else {
              this.$emit('showMsg', res.data.message);
            }
          })
      } else {
        // 圖片使用網址
        axios
          .post(`/v2/api/${api_path}/admin/product`, {
            data: this.editingProduct,
          })
          .then(() => {
            this.initModal();
            this.$emit('update');
            manage_modal.hide();
          })
          .catch((err) => {
            this.$emit('showMsg', err.response.data.message);
          });
      }
    },
    editProduct() {
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
              this.editingProduct.imageUrl = url;
              axios
                .put(`/v2/api/${api_path}/admin/product/${this.editingProduct.id}`, {
                  data: this.editingProduct,
                })
                .then(() => {
                  this.initModal();
                  this.$emit('update');
                  manage_modal.hide();
                })
                .catch(err => {
                  this.$emit('showMsg', err.response.data.message);
                })
            } else {
              this.$emit('showMsg', res.data.message);
            }
          })
      } else {
        axios
          .put(`/v2/api/${api_path}/admin/product/${this.editingProduct.id}`, {
            data: this.editingProduct,
          })
          .then(() => {
            this.initModal();
            this.$emit('update');
            manage_modal.hide();
          })
          .catch((err) => {
            this.$eit('showMsg', err.response.data.message);
          });
      }
    },
    getEditingEnabled(e) {
      this.editingProduct.is_enabled = e.target.checked ? 1 : 0;
    },
    showUploadImg(e) {
      this.tempSrc.origin_src = e.target.files[0];
      const src = URL.createObjectURL(e.target.files[0]);
      this.tempSrc.blob_src = src;
    }
  },
  watch: {
    product(newV) {
      this.editingProduct = { ...newV };
    }
  },
  mounted() {
    manage_modal = new bootstrap.Modal(document.getElementById('manageModal'));
  }
}
