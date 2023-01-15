export default {
  props: ['pages'],
  template:
  `
  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-end">
      <li class="page-item" :class="{disabled: pages.current_page === 1, 'pe-none': pages.current_page === 1}" @click="previousPage">
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <template v-for="page in pages.total_pages">
        <li class="page-item" :class="{ active: page === pages.current_page,'pe-none': page === pages.current_page }" @click="changePage(page)"><a class="page-link" href="#">{{ page }}</a></li>
      </template>
      <li class="page-item" :class="{disabled: pages.current_page === pages.total_pages, 'pe-none': pages.current_page === pages.total_pages}" @click="nextPage">
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
  `,
  methods: {
    changePage(pageNum) {
      this.$emit('changePage', pageNum);
    },
    previousPage() {
      this.$emit('previousPage')
    },
    nextPage() {
      this.$emit('nextPage')
    }
  }
}