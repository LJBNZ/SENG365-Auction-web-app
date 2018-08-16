<template>
  <div>
    <div class="navbar">
      <div class="logo">
        <router-link :to="{name: 'home'}">
          <h1>
            AUCTIONS 365
          </h1>
        </router-link>
      </div>

      <div v-if="!this.$cookies.isKey('token')" class="links">
        <p>
          <router-link :to="{name: 'auctions'}">Browse</router-link>
          <router-link :to="{name: 'login'}" tag="button">Login</router-link>
          <router-link :to="{name: 'register'}" tag="button"> Register </router-link>
        </p>
      </div>
      <div v-else class="links">
        <p>
          <router-link :to="{name: 'auctions'}">Browse</router-link> •
          <router-link :to="{name: 'createAuction'}">Sell</router-link> •
          <router-link :to="{name: 'user', params: {userId: this.$cookies.get('id')}}">My account</router-link>
          <button type="button" v-on:click="logout()"> Logout </button>
        </p>
      </div>
    </div>

  <div class = "homePage">
    <div class="biglogo">
      <h1>
        AUCTIONS 365
      </h1>
    </div>


    <div class="search">
      <form>
        <input v-model="search_q" width="200px">
        <router-link :to="{name: 'auctions', query: {q: this.search_q}}" tag="button" id="searchbtn">
          Search
        </router-link>
      </form>
    </div>
    <div class="homeBottom">
      <router-link :to="{name: 'auctions'}" id="allauctions"><h1>All auctions</h1></router-link>
      <div class="cats">
        <h1>Browse by category</h1>
        <ul>
          <div v-for="category in categories">
            <li><router-link :to="{name: 'auctions', query: {'category-id': category.categoryId}}">{{category.categoryTitle}}</router-link></li>
          </div>
        </ul>
      </div>
    </div>

  </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        result: "",
        error: "",
        errorFlag: false,
        search_q: "",
        categories: ''
      }
    },
    mounted: function () {
      this.getCategories();
    },
    methods: {
      logout: function () {
        let token = this.$cookies.get('token');
        this.$http.post('http://localhost:4941/api/v1/users/logout', {}, {headers: {'X-Authorization': token}})
          .then(function (response) {
            this.$cookies.remove('token');
            this.$cookies.remove('id');
            this.$forceUpdate();
          }, function (error) {
            this.error = error.body;
            this.errorFlag = true;
          });
      },
      getCategories: function () {
        this.$http.get('http://localhost:4941/api/v1/categories')
          .then(function (response) {
            this.categories = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Montserrat:400,500,700i');
  .navbar {
    width: 100%;
    height: 40px;
    background-color: #3f7fff;
    padding: 0 15% 0 15%;
  }
  .navbar a {
    color:white;
    text-underline: none;
  }
  .links{
    float:right;
    text-align: right;
    display: flex;
    justify-content: space-around;

  }
  .links a, p {
    padding-top: 10px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 18px;
    color: white;
  }
  .logo {
    height:40px;
    float:left;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-style: italic;
    color: white;
    display: flex;
    justify-content: space-around
  }
  .logo h1 {
    font-size: 25px;
    margin-top: 10px;
  }
  .logo a:hover {
   text-decoration: none;
  }

  .search input {
    padding: 0px 10px 0px 10px;
    border-color: #3f7fff;
    border-width: 2px;
    border-radius:15px;
    height: 30px;
    width: 300px;
  }
  .search {
    position: absolute;
    padding-left: 265px;
    margin-left: auto;
    margin-right: auto;
  }
  .biglogo {
    padding-bottom: 120px;
    height:40px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-style: italic;
    color: #3f7fff;
    display: flex;
    justify-content: space-around
  }
  .biglogo h1 {
    font-size: 50px;
    margin-top: 10px;
  }

  .links button {
    color: white;
    padding: 3px 10px 3px 10px;
    border-radius: 15px;
    border-width: 0px;
    background-color: #7294ff;
    margin-left:15px;
  }
  .homePage {
    font-family: 'Montserrat', sans-serif;
    padding-top: 50px;
    width: 900px;
    margin-left: auto;
    margin-right: auto;
  }
  .homeBottom {
    margin-top: 120px;
    border-top: darkgrey;
    border-width: 2px;
  }
  #searchbtn {
    padding: 0px 10px 0px 10px;
    border-color: #3f7fff;
    height: 30px;
    color: white;
    background-color: #3f7fff;
    border-width: 1px;
    border-radius:15px;
  }
  hr {
    color: black;
  }
  #allauctions {
    padding-left: 100px;
    float:left;
  }
  .cats {
    padding-right: 100px;
    float:right;
  }
  .cats h1 {
    font-size: 30px;
  }
  #allauctions h1 {
    font-size: 30px;
  }
  .cats ul {
    color: #3f7fff;
    font-size: 19px;
    padding-left: 110px;
  }



</style>
