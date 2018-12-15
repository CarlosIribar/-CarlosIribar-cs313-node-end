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
            <td><router-link :to="'/editBook/' + row['id']">Edit</router-link></td>
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
        <bookProgress :id="book['id']"></bookProgress>
        <router-link :to="'/addProgress/' + book['id']">Add Progress</router-link>
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
        <select name='owner' v-model="book.owner">
            <option v-for="row in owners" :value="row['id']"> {{row['name']}}</option>
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
            this.$http.post('/addBook', {book: this.book}).then((response) => {
                console.log(response);
                this.$router.push('/')
            });
        },
        getUsers() {
            this.$http.get('/getUsers').then((response) => {
                this.owners = response.body
                this.book.owner = response.body[0].id;
            });
        }
    },
    beforeMount(){
        this.getUsers();
    }
})

const editBook = Vue.component('editBook', {
    props: ['id'],
    data: function () {
        return {
            book: {},
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
        <select name='owner' v-model="book.owner">
            <option v-for="row in owners" :value="row['id']"> {{row['name']}}</option>
        </select>
        <br>
        <label>Cover link</label>
        <input type="text" v-model="book.cover" placeholder="Cover link" name="cover">
        <br>
        <input type="submit" @click="editBook" >
    </form>



</div>`,
    methods: {
        editBook() {
            console.log(this.book);
            this.$http.post('/editBook', {book: this.book}).then((response) => {
                console.log(response);
                this.$router.push('/')
            });
        },
        getUsers() {
            this.$http.get('/getUsers').then((response) => {
                this.owners = response.body
                this.book.owner = response.body[0].id;
            });
        },
        getBook() {
            this.$http.get('/book',  {params: {id: this.id}}).then((response) => {
                this.book = response.body
                this.book.owner = response.body.owner;
            });
        }
    },
    beforeMount(){
        this.getUsers();
        this.getBook();
    }
})

const addProgress = Vue.component('addProgress', {
    props: ['id'],
    data: function () {
        return {
            owners: [],
            progress: {}
        };
    },
    template:`<div>
        <router-link to="/">Back to Book List</router-link>
        <h1>Add Progress</h1>
        <label>Start Date</label>
        <input type="date" placeholder="Start Date" name="start" v-model="progress.start">
        <br>
        <label>End Date</label>
			<input type="date" placeholder="End Date" name="end" v-model="progress.end">
        <br>
        <label>User</label>
        <select name='user' v-model="progress.user">
            <option v-for="row in owners" :value="row['id']"> {{row['name']}}</option>
        </select>
        <br>
        <input type="submit" @click="addProgress" >
    </form>



</div>`,
    methods: {
        addProgress() {
            console.log(this.progress);
            this.progress.bookId = this.id; 
            this.$http.post('/addProgress', {progress: this.progress}).then((response) => {
                console.log(response);
                this.$router.back();
            });
        },
        getUsers() {
            this.$http.get('/getUsers').then((response) => {
                this.owners = response.body
                this.progress.user = response.body[0].id;
            });
        }
    },
    beforeMount(){
        this.getUsers();
    }
})

const bookProgress = Vue.component('bookProgress', {
    props: ['id'],
    data: function () {
        return {
            progress: []
        };
    },
    template:`<div>
            <table>
            <tr>
            <th>StartDate</th>
            <th>EndDate</th>
            <th>User</th>
            </tr>
            <tr v-for="row in progress">
                <td>row['startdate']</td>
                <td>row['enddate']</td>
                <td>row['user']</td>
            </tr>
            
            </table>
        </div>`,
    methods: {
        getProgress() {
            console.log(this.progress);
            this.$http.get('/progress', {params: {id: this.id}}).then((response) => {
                console.log(response.body);
            });
        },
    },
    beforeMount(){
        this.getProgress();
    }
})

const routes = [
    { path: '/', component: books },
    { path: '/book/:id', component: book, props: true },
    { path: '/addBook', component: addBook, props: true },
    { path: '/editBook/:id', component: editBook, props: true },
    { path: '/addProgress/:id', component: addProgress, props: true }
]


const router = new VueRouter({
    routes
})

const app = new Vue({
    router
}).$mount('#app')