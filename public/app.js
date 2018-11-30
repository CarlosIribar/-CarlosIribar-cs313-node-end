var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      books: []
    },
    methods: {
        getBooks(resource) {
            this.$http.get('/books').then((response) => {
                this.books = response.body
            });
        }
    },
    beforeMount(){
        this.getBooks()
    },

})