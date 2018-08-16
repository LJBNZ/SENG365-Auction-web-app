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

      <div class="search-container">
        <form>
          <input v-model="search_q" id="navSearch">
          <router-link :to="{name: 'auctions', query: {q: this.search_q}}">
            <input type="submit" value="Search" id="navSearchBtn" />
          </router-link>
        </form>
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

    <div v-if="$route.name === 'login'">
      <div class="loginOptions">
        <div class="loginSuccess">
          {{ this.login_data.success }}
        </div>
        <div class="loginError">
          {{ this.login_data.error }}
        </div>
        <h2>Login</h2>
        <form>
          <h1> Username/Email: </h1><p> <input v-model="login_data.username" /></p><br /><br />
          <h1> Password: </h1><p><input type="password" v-model="login_data.password"/></p><br /><br />
          <button type="button" v-on:click="login()">Login</button>
        </form>
      </div>


    </div>
    <div v-else-if="$route.name === 'user' && this.$cookies.isKey('token')" class="user">
      <div class="editError">
        {{ editError }}
      </div>
      <div class="editSuccess">
        {{ editSuccess }}
      </div>
      <h2 v-if="this.$cookies.get('id') == this.$route.params.userId">My Account</h2>
      <h2 v-else>{{ user_data.username }}'s Account</h2>
      <div class="userInfo" v-if="!this.editing && this.$cookies.isKey('token')">
        <h1> Username: </h1><p>{{ user_data.username }}</p><br/><br/>
        <h1> First name: </h1><p>{{ user_data.givenName }}</p><br/>
        <h1> Last name: </h1><p>{{ user_data.familyName }}</p><br/><br/>
        <div v-if="this.$cookies.get('id') == this.$route.params.userId">
          <h1> Email: </h1><p>{{ user_data.email }}</p><br/><br/>
          <h1> Account balance: </h1><p>${{ user_data.accountBalance }}</p><br/><br/>
          <button type="button" v-on:click="beginEditing()">Edit</button>
        </div>

      </div>
      <div class="userEdit" v-if="this.editing">
        <h1> Username: </h1><p>{{ user_data.username }}</p><br/><br/>
        <h1> First name: </h1><p><input type="text" v-model="edited_user_data.givenName" :placeholder="edited_user_data.givenName"></p><br/>
        <h1> Last name: </h1><p><input type="text" v-model="edited_user_data.familyName" :placeholder="edited_user_data.familyName"></p><br/><br/>
        <div v-if="this.$cookies.get('id') == this.$route.params.userId">
          <h1> Email: </h1><p>{{ user_data.email }}</p><br/><br/>
          <h1> Account balance: </h1><p>${{ user_data.accountBalance }}</p><br/><br/>
        </div>

        <button type="button" v-on:click="editUser()">Submit</button>
        <button type="button" v-on:click="editing = false">Cancel</button>
      </div>

      <div v-if="this.$cookies.get('id') == this.$route.params.userId && editing == false" class="myAuctionLinks">
        <ul>
          <li><router-link :to="{name: 'auctions', query: {bidder: this.$cookies.get('id'), status: 'active'}}"><p>Auctions I bid on</p></router-link></li>
          <li><router-link :to="{name: 'auctions', query: {winner: 'me'}}"><p>Auctions I won</p></router-link></li>
          <li><router-link :to="{name: 'auctions', query: {seller: this.$cookies.get('id'), status: 'active'}}"><p>Auctions of mine that are yet to complete</p></router-link></li>
          <li><router-link :to="{name: 'auctions', query: {bidder: this.$cookies.get('id'), status: 'won'}}"><p>Auctions of mine that have sold</p></router-link></li>
          <li><router-link :to="{name: 'auctions', query: {bidder: this.$cookies.get('id'), status: 'expired'}}"><p>Auctions of mine that did not sell</p></router-link></li>
        </ul>

      </div>
    </div>

    <div v-else-if="$route.name === 'user' && !this.$cookies.isKey('token')" class="user">
      <h1> Please <router-link :to="{name: 'login'}">log in</router-link> to see user details </h1>

    </div>


  <div v-else-if="$route.name === 'register'">


      <div class="registerOptions">
        <div class="registerError">
          {{ this.registerError }}
        </div>
        <div class="registerSuccess">
          {{ this.result }}
        </div>

        <h2>Register Account</h2><br/>
        <form>
          <h3>*</h3> = required field<br/><br/><br/>
          <h1>Username<h3>*</h3>:</h1> <p><input v-model="new_user.username" /></p><br/><br/>
          <h1>Given name<h3>*</h3>:</h1> <p><input v-model="new_user.givenName" /></p><br/><br/>
          <h1>Family name<h3>*</h3>:</h1> <p><input v-model="new_user.familyName" /></p><br/><br/>
          <h1>Email<h3>*</h3>:</h1> <p><input v-model="new_user.email" /></p><br/><br/>
          <h1>Password<h3>*</h3>:</h1> <p><input type="password" v-model="new_user.password" /></p><br/><br/><br/><br/>
          <button type="button" v-on:click="addUser()">Submit</button>
        </form>
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
            editError: "",
            editSuccess: "",
            registerError: "",
            userError: "",
            errorFlag: false,
            search_q: "",

            login_data: {
              username: "",
              password: "",

              id: "",
              token: "",
              success: "",
              error: ""
            },

            new_user: {
              username: "",
              givenName: "",
              familyName: "",
              email: "",
              password: ""
            },

            user_data: "",
            edited_user_data: {
              "givenName": '',
              "familyName": '',
            },
            new_password: "",
            editing: false
          }
      },
      mounted: function () {
        if (this.$route.params.userId > 0) {
          this.getUser();
        }
      },
      methods: {
        beginEditing: function () {
          this.editSuccess = '';
          this.editError = '';
          this.editing = true;
          this.edited_user_data.givenName = this.user_data.givenName;
          this.edited_user_data.familyName = this.user_data.familyName;
        },
        getUser: function() {
          let userId = this.$route.params.userId;
          let token = '';
          if (this.$cookies.isKey('token')) {
            token = this.$cookies.get('token');
          }
          console.log(token);
          this.$http.get('http://localhost:4941/api/v1/users/' + userId, {headers: {'X-Authorization': token}})
            .then(function (response) {
              console.log(response);
              this.user_data = response.data;
            }, function (error) {
              this.userError = error;
            });
        },
        editUser: function () {
          this.editSuccess = '';
          this.editError = '';
          const new_data = this.edited_user_data;
          let user_id = '';
          if (this.$cookies.isKey('id')) {
            user_id = this.$cookies.get('id');
          }
          let token = '';
          if (this.$cookies.isKey('token')) {
            token = this.$cookies.get('token');
          }
          if (new_data.givenName.length > 0 && new_data.familyName.length > 0) {
            this.$http.patch('http://localhost:4941/api/v1/users/' + user_id,
              JSON.stringify({
                "givenName": new_data.givenName,
                "familyName": new_data.familyName
              }),
              {headers: {'X-Authorization': token}})
              .then(function (response) {
                this.editSuccess = 'User updated successfully';
                this.editing = false;
                this.getUser();
                this.$forceUpdate();
              }, function (error) {
                this.editError = error;
                this.errorFlag = true;
              });
          } else {
            this.editError = 'Fields must not be blank';
          }


        },

        addUser: function () {
          this.error = '';
          this.result = '';
          this.$http.post('http://localhost:4941/api/v1/users/',
            JSON.stringify({"username": this.new_user.username, "givenName": this.new_user.givenName,
              "familyName": this.new_user.familyName, "email": this.new_user.email,
              "password": this.new_user.password}))
            .then(function (response) {
              this.result = "Account successfully created! You have been logged in.";
              this.login_data.username = this.new_user.username;
              this.login_data.password = this.new_user.password;
              this.login();
            }, function (error) {
              console.log(error);
              this.registerError = error.body;
              this.errorFlag = true;
            });
        },
        login: function () {
          this.login_data.error = '';
          this.$http.post('http://localhost:4941/api/v1/users/login',
            JSON.stringify({"username": this.login_data.username, "email": this.login_data.username, "password": this.login_data.password}))
            .then(function (response) {
              this.login_data.success = "Successfully logged in";
              this.$cookies.set('token', response.body.token);
              this.$cookies.set('id', response.body.id);
              this.$router.push({ name: 'home' });
              console.log(this.$cookies.get("token"));
            }, function (error) {
              this.login_data.error = error.body;
              this.errorFlag = true;
            });
        },
        logout: function () {
          let token = this.$cookies.get('token');
          this.$http.post('http://localhost:4941/api/v1/users/logout', {}, {headers: {'X-Authorization': token}})
            .then(function (response) {
              this.$cookies.remove('token');
              this.$cookies.remove('id');
              this.$router.push({ name: 'home' });
              this.$forceUpdate();
            }, function (error) {
              this.error = error.body;
              this.errorFlag = true;
            });
        }
      },
    watch: {
      '$route'() {
        this.getUser();
      }
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
  .links button {
    color: white;
    padding: 3px 10px 3px 10px;
    border-radius: 15px;
    border-width: 0px;
    background-color: #7294ff;
    margin-left:15px;
  }
  #navSearchBtn {
    padding-left: 260px;
    padding-right: 10px;
    font-family: 'Montserrat', sans-serif;
    border-width: 0px;
    height: 30px;
    color: white;
    background-color: #7294ff;
    border-radius:15px;
  }
  #navSearch {
    width: 250px;
    position: absolute;
    padding: 0px 10px 0px 10px;
    border-width: 0px;
    height: 30px;
    color: black;
    border-radius:15px;
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

  .search-container {
    float: left;
    padding-left: 23%;
    padding-top: 10px;
    margin-right: 0;
    justify-content: space-around
  }
  .search-container a {
    color: black;
  }
  .registerOptions {
    width: 700px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 20px;
    font-family: 'Montserrat', sans-serif;
  }
  .registerOptions h3 {
    display: inline;
    color: red;
  }
  .registerOptions p {
    display: inline;
    color: black;
  }
  .registerOptions h1 {
    display: inline;
    color: darkgrey;
    font-size: 18px;
  }
  .registerOptions h2 {
    font-family: 'Montserrat', sans-serif;
    padding-bottom: 30px;
    color: #555254;
  }
  .registerError {
    color: red;
  }
  .registerSuccess {
    color: green;
  }
  .loginOptions {
    width: 700px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 20px;
    font-family: 'Montserrat', sans-serif;
  }
  .loginOptions p {
    display: inline;
    color: black;
  }
  .loginOptions h1 {
    display: inline;
    color: darkgrey;
    font-size: 18px;
  }
  .loginOptions h2 {
    font-family: 'Montserrat', sans-serif;
    padding-bottom: 30px;
    color: #555254;
  }
  .loginError {
    color: red;
  }
  .loginSuccess {
    color: green;
  }
  .editError {
    color: red;
  }
  .editSuccess {
    color: green;
  }
  .user {
    padding-top: 20px;
    width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
  .user h2 {
    font-family: 'Montserrat', sans-serif;
    padding-bottom: 30px;
    color: #555254;
  }
  .userInfo p {
    display: inline;
    color: black;
  }
  .userInfo h1 {
    display: inline;
    color: darkgrey;
    font-size: 18px;
  }
  .userInfo {
    display: inline;
    float: left;
  }
  .myAuctionLinks {
    display: inline;
    float: right;
  }
  .myAuctionLinks p {
    display: inline;
    color: dodgerblue;
  }
  .myAuctions h1 {
    display: inline;
    color: darkgrey;
    font-size: 18px;
  }
  .userEdit p {
    display: inline;
    color: black;
  }
  .userEdit h1 {
    display: inline;
    color: darkgrey;
    font-size: 18px;
  }
  .userEdit input {
    height: 22px;
  }
</style>
