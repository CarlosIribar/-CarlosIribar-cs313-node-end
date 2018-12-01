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

const books = Vue.component('button-counter', {
    data: {
        message: 'Hello Vue!',
        books: []
    },
    template:`<div>
        {{ message }}
        <table>
        <tr>
        <th>Name</th>
        <th>Author</th>
        <th>ISBN</th>
        <th>Owner</th>
        <th>Actions</th>
        </tr>
        <tr v-for="row in books">
            <td><a href=""> {{row['name']}} </a></td>
            <td>{{row['author']}}</td>
            <td>{{row['isbn']}}</td>
            <td>{{row['user']}}</td>
            <td><button onClick=''> Remove </button></td>
            <td><button onClick=''> Edit </button></td>
        </tr>
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

const routes = [
    { path: '/', component: books },
]

const router = new VueRouter({
    routes // short for `routes: routes`
})

const app = new Vue({
    router
}).$mount('#app')