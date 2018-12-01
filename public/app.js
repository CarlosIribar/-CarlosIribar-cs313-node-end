// var app = new Vue({
//     el: '#app',
//     data: {
//       message: 'Hello Vue!',
//       books: []
//     },
//     methods: {
//         getBooks(resource) {
//             this.$http.get('https://tranquil-anchorage-56858.herokuapp.com/books').then((response) => {
//                 this.books = response.body
//             });
//         }
//     },
//     beforeMount(){
//         this.getBooks()
//     },

// })

const books = Vue.component('books', {
    data: function () {
        return {
            books: []
        }
    },
    template:`<div>
        <table>
        <tr>
        <th>Name</th>
        <th>Author</th>
        <th>ISBN</th>
        <th>Owner</th>
        <th>Actions</th>
        </tr>
        <tr v-for="row in books">
            <td> <router-link to="/book">{{row['name']}}</router-link></td>
            <td>{{row['author']}}</td>
            <td>{{row['isbn']}}</td>
            <td>{{row['user']}}</td>
            <td><button onClick=''> Remove </button></td>
            <td><button onClick=''> Edit </button></td>
        </tr>
        </table>
        </div>`,
    methods: {
        getBooks(resource) {
            this.$http.get('/books').then((response) => {
                this.books = response.body
            });
        }
    },
    beforeMount(){
        this.getBooks()
    }
})

const book = Vue.component('book', {
    props: ['id'],
    data: function () {
        return {
            book: null
        }
    },
    template:`<div>
        <a href="/books.php"> Back to Book List </a>
        <h1>Book Detail</h1>
        <b>Name:</b>
        {{book['name']}}<br>
        <b>Author:</b>
        {{book['author']}}<br>
        <b>ISBN:</b> 
        {{book['isbn']}}<br>
        <b>Owner:</b> 
        {{book['user']}}<br>
        <img height='300px' width='200px' src="{{book['cover']}}"/><br>
        </div>`,
    methods: {
        getBook() {
            this.$http.get('/book', {id: this.id}).then((response) => {
                this.book = response.body
            });
        }
    },
    beforeMount(){
        this.getBook()
    }
})

const routes = [
    { path: '/', component: books },
    { path: '/book/:id', component: book, props: true }
]

const router = new VueRouter({
    routes // short for `routes: routes`
})

const app = new Vue({
    router
}).$mount('#app')