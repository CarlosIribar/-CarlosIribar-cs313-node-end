const books = Vue.component('books', {
    data: function () {
        return {
            books: []
        }
    },
    template:` 
        <div>
        <router-link to="/addBook">Add book</router-link>
        <h1> Book List </h1>
        <table>
        <tr>
        <th>Name</th>
        <th>Author</th>
        <th>ISBN</th>
        <th>Owner</th>
        <th>Actions</th>
        </tr>
        <tr v-for="row in books">
            <td> <router-link :to="'/book/' + row['id']">{{row['name']}}</router-link></td>
            <td>{{row['author']}}</td>
            <td>{{row['isbn']}}</td>
            <td>{{row['user']}}</td>
            <td><button @click="removeBook(row['id'])"> Remove </button></td>
            <td><button onClick=''> Edit </button></td>
        </tr>
        </table>
        </div>`,
    methods: {
        getBooks(resource) {
            this.$http.get('/books').then((response) => {
                this.books = response.body
            });
        },
        removeBook(id){
            this.$http.post('/removeBook', {id: id}).then((response) => {
                console.log('removeBook');
                this.books = this.books.filter((item)=> {return item.id !== id });

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
            book: {}
        }
    },
    template:`<div>
        <router-link to="/">Back to Book List</router-link>
        <h1>Book Detail</h1>
        <b>Name:</b>
        {{book['name']}}<br>
        <b>Author:</b>
        {{book['author']}}<br>
        <b>ISBN:</b> 
        {{book['isbn']}}<br>
        <b>Owner:</b> 
        {{book['user']}}<br>
        <img height='300px' width='200px' :src="book['cover']"/><br>
        </div>`,
    methods: {
        getBook() {
            this.$http.get('/book',  {params: {id: this.id}}).then((response) => {
                this.book = response.body
            });
        }
    },
    beforeMount(){
        this.getBook()
    }
})

const addBook = Vue.component('addBook', {
    data: function () {
        return {
            book: {
                name: '',
                isbn: '',
                author: '',
                cover: '',
                owner: '',
            },
            owners: []
        };
    },
    template:`<div>
        <router-link to="/">Back to Book List</router-link>
        <h1>Add Book</h1>
        <label>Name</label>
        <input type="text" v-model="book.name" placeholder="Name" name="name">
        <br>
        <label>Author</label>
        <input type="text" v-model="book.author" placeholder="Author" name="author">
        <br>
        <label>ISBN</label>
        <input type="text" v-model="book.isbn" placeholder="ISBN" name="isbn">
        <br>
        <label>OWNER</label>
        <select name='owner' v-model="owner">
            <option v-for="row in owners" selected="selected" value="{{row['id']}}"> {{row['name']}}</option>
        </select>
        <br>
        <label>Cover link</label>
        <input type="text" v-model="book.cover" placeholder="Cover link" name="cover">
        <br>
        <input type="submit" @click="addBook" >
    </form>



</div>`,
    methods: {
        addBook() {
            console.log(this.book);
            // this.$http.get('/addBook',  {params: {id: this.id}}).then((response) => {
            //     this.book = response.body
            // });
        },
        getUsers() {
            this.$http.get('/getUsers').then((response) => {
                this.owners = response.body
            });
        }
    },
    beforeMount(){
        this.getUsers();
    }
})

const routes = [
    { path: '/', component: books },
    { path: '/book/:id', component: book, props: true },
    { path: '/addBook', component: addBook, props: true }
]


const router = new VueRouter({
    routes
})

const app = new Vue({
    router
}).$mount('#app')