export default {
  props: ['text'],
  template: `
  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">再次確認</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          {{ text }}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="confirm(false)">取消</button>
          <button type="button" class="btn btn-primary" @click="confirm(true)">確定</button>
        </div>
      </div>
    </div>
  </div>
  `,
  methods: {
    confirm(ans) {
      this.$emit(confirm, ans);
    }
  }
}