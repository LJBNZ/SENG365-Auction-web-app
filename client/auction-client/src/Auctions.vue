<template xmlns="http://www.w3.org/1999/html">
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
          <input v-model="search_q" :placeholder="this.$route.query.q" id="navSearch">
          <router-link :to="{name: 'auctions', query: {'q': this.search_q}}" replace>
            <input type="submit" value="Search" id="navSearchBtn"/>
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

    <div class="create_auction" v-if="$route.name === 'createAuction'">

      <div class="createOptions">
        <div class="createError">
        {{ this.createError }}
        </div>
        <div class="createSuccess">
          {{ this.createSuccess }}
        </div>

        <h2>Create Auction</h2><br/>

        <form>
          <h3>*</h3> = required field<br/><br/><br/>
          <h1>Category<h3>*</h3>: </h1><p><select v-model="new_auction.categoryId" id="cat_select" >
            <option v-for="category in categories" :value="category.categoryId">{{category.categoryTitle}}</option>
          </select></p><br/><br/>
            <h1>Title<h3>*</h3>: </h1><p><input v-model="new_auction.title" /></p><br/><br/>
            <h1>Description<h3>*</h3>:</h1> <p><input v-model="new_auction.description" /></p><br/><br/>
            <h1>Start time<h3>*</h3>:</h1> <p><input v-model="new_auction.startDateTime" type="datetime-local"/></p><br/><br/>
            <h1>End time<h3>*</h3>:</h1> <p><input v-model="new_auction.endDateTime" type="datetime-local"/></p><br/><br/>
            <h1>Reserve price<h3>*</h3>: $</h1><p><input v-model="new_auction.reservePrice" /></p><br/><br/>
            <h1>Starting bid<h3>*</h3>: $</h1><p><input v-model="new_auction.startingBid" /><br/></p><br/><br/>
            <h1>Photo: </h1><input type="file" @change="addFileChange($event.target.files)" accept="image/*" class="input-file"><br/><br/><br/>
          <button type="button" v-on:click="newAuction()">Submit</button>
        </form>
      </div>
    </div>

    <div class="auction_details" v-else-if="$route.params.auctionId">
      <div class="auction_photo">
        <img v-bind:src = "getAuctionPhotoURL($route.params.auctionId)" width="400px">
      </div>

      <div class="sideInfo" v-if="!editing">
        <h1>{{ bid_result }}</h1>
        <h1>{{ edit_result }}</h1>
        <h3><strong>{{ auction.title }}</strong></h3><br/>
        <h1><i>{{ auction.description }}</i></h1><br/><br/>
        <form v-if="this.$cookies.isKey('token') && ((Date.now() > new Date(auction.startDateTime).getTime() && Date.now() < new Date(auction.endDateTime).getTime()))">
          <h1> Post a bid: $ </h1><input v-model="new_bid_amount" :placeholder="parseFloat(auction.currentBid + 1)" />
          <button type="button" v-on:click="postBid()">Submit</button><br/><br/>
        </form>
        <h1> Current Bid: </h1><p>${{ auction.currentBid }}</p><br/><br/>
        <h1> Start date: </h1><p>{{ toDate(auction.startDateTime) }}</p><br/>
        <h1> End date: </h1><p>{{ toDate(auction.endDateTime) }}</p><br/><br/>
        <h1> Category: </h1><p>{{ auction.categoryTitle }}</p><br/>
        <h1> Posted by: </h1><router-link :to="{name: 'user', params: {userId: auction.seller.id}}"><p>{{ auction.seller.username }}</p></router-link><br/><br/><br/>
        <button type="button" v-if="(auction.seller.id == this.$cookies.get('id')) && (Date.now() < new Date(auction.startDateTime).getTime())" v-on:click="beginEditing()">Edit Details</button>
      </div>



      <div class="sideInfo" v-if="editing">
        <h1>{{ edit_result }}</h1><br/><br/>
        <h1> Photo: </h1> <input type="file" @change="editFileChange($event.target.files)" accept="image/*" class="input-file"><br/>
        <button type="button" v-on:click="deletePhoto()">Delete Photo</button><br/><br/>
        <h1> Title: </h1><h3><strong><input type="text" v-model="edited_auction_data.title" :placeholder="auction.title"></strong></h3><br/>
        <h1> Description: </h1><h1><i><input type="text" v-model="edited_auction_data.description" :placeholder="auction.description"></i></h1><br/><br/>
        <h1> Starting Bid: $</h1><p><input type="text" v-model="edited_auction_data.startingBid" :placeholder="auction.startingBid"></p><br/>
        <h1> Reserve price: $</h1><p><input type="text" v-model="edited_auction_data.reservePrice" :placeholder="auction.reservePrice"></p><br/><br/>
        <h1> Start date: </h1><p><input type="datetime-local" v-model="new_start"></p><br/>
        <h1> End date: </h1><p><input type="datetime-local" v-model="new_end"></p><br/><br/>
        <h1> Category: </h1><p><select v-model="edited_auction_data.categoryId" id="edit_cat_select" >

          <option v-for="category in categories" :value="category.categoryId">{{category.categoryTitle}}</option>
        </select></p><br/><br/>
        <button type="button" v-on:click="editAuction()">Submit</button>
        <button type="button" v-on:click="editing = false">Cancel</button>


      </div>

    <div class="bottomInfo">
      <p v-if="auction.bids.length > 0">Bid history:</p><br/><br/>
      <div class="bid" v-for="bid in ordered_bids">
          <div class="bidAmt">
            <p><strong>${{ bid.amount }}</strong></p>
          </div>
          <div class="bidUser">
            <p><router-link :to="{name: 'user', params: {userId: bid.buyerId}}">{{ bid.buyerUsername }}</router-link></p>
          </div>
          <div class="bidDate">
            <p>{{ toDate(bid.datetime) }}</p>
          </div>
      </div>
    </div>
  </div>

    <div v-else>

      <div class = "filters">
        <form>
          <p>
            <label for="category-id">Category:</label>
            <select v-model="cat_id" id="category-id" >
              <option value=''>any category</option>
              <option v-for="category in categories" :value="category.categoryId">{{ category.categoryTitle }}</option>
            </select>
            <label for="status">Auction status:</label>
            <select v-model="status" id="status">
              <option value='all'>All</option>
              <option value='active'>Active</option>
              <option value='upcoming'>Upcoming</option>
              <option value='won'>Sold</option>
              <option value='expired'>Expired</option>
            </select>
            <label for="num_results">Results per page:</label>
            <select v-model="auctions_per_page" id="num_results" >
              <option value=5>5</option>
              <option value=10>10</option>
              <option value=20>20</option>
              <option value=''>all</option>
            </select>

            <router-link :to="{name: 'auctions', query: Object.assign({}, this.$route.query, {'category-id': cat_id, 'show': auctions_per_page, 'page': 0, 'status': status})}" replace>
              <input type="submit" value="Filter" />
            </router-link>
          </p>
        </form>
      </div>




      <div class="results">
        <p> Number of results: {{ num_auctions }} </p>
        <div class="auction_listing" v-for="auction in auctions">
            <router-link v-on:click.native="getSingleAuction(auction.id)" :to="{name: 'auction', params: {auctionId: auction.id}}">
              <div class="photo">
                <img v-bind:src = "getAuctionPhotoURL(auction.id)" width="90px">
              </div>
            </router-link>

            <div class="title">
                <router-link v-on:click.native="getSingleAuction(auction.id)" :to="{name: 'auction', params: {auctionId: auction.id}}">
                  <h1>{{ auction.title }}</h1>
                </router-link>
              </div>
            <div class="current_bid">
              <p>Current bid</p>
              <h2>${{ auction.currentBid }}</h2>
            </div>
          </div>


          <div class="pages">
            <router-link :to="{name: 'auctions', query: {q: this.$route.query.q, 'category-id': cat_id, 'show': this.$route.query.show, page: parseInt(this.$route.query.page) - 1 }}" replace v-if="$route.query.page && $route.query.page !== 0" tag="button" id="lastpagebtn">
              Last page
            </router-link>
            <div v-if="$route.query.show" id="pageNum">
              Page {{ this.$route.query.page + 1}}
            </div>
            <router-link :to="{name: 'auctions', query: {q: this.$route.query.q, 'category-id': cat_id, 'show': this.$route.query.show, page: parseInt(this.$route.query.page) + 1}}" replace v-if="$route.query.page >= 0 && $route.query.show !== '' && this.auctions.length > 0 && this.auctions.length == $route.query.show" tag="button" id="nextpagebtn">
               Next page
            </router-link>
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
        num_auctions: 0,
        auctions: [],
        categories: [],
        auction: null,
        ordered_bids: null,
        auctions_per_page: this.$route.query.show,
        status: 'all',
        search_q: '',
        cat_id: '',
        new_bid_amount: 0,
        new_auction: {
          categoryId: "",
          title: "",
          description: "",
          startDateTime: "",
          endDateTime: "",
          reservePrice: "",
          startingBid: "",
          photo: ''
        },
        createError: '',
        createSuccess: '',
        editing: false,
        edit_result: '',
        bid_result: '',
        edited_auction_data: {
          categoryId: '',
          title: '',
          description: '',
          reservePrice: '',
          startingBid: '',
          photo: ''
        },
        new_start: '',
        new_end: ''
      }
    },
    mounted: function () {
      this.getAuctions();
      this.getCategories();
      if (this.$route.params.auctionId) {
        this.getSingleAuction(this.$route.params.auctionId);
      }
    },
    methods: {
      beginEditing: function () {
        this.edit_result = '';
        this.editing = true;
        this.edited_auction_data.categoryId = this.auction.categoryId;
        this.edited_auction_data.title = this.auction.title;
        this.edited_auction_data.description = this.auction.description;
        this.edited_auction_data.reservePrice = this.auction.reservePrice;
        this.edited_auction_data.startingBid = this.auction.startingBid;
      },
      getAuctions: function () {
        this.auctions_per_page = '';
        this.auctions = [];

        let token = '';
        if (this.$cookies.isKey('token')) {
          token = this.$cookies.get('token');
        }
        let endpoint = 'http://localhost:4941/api/v1/auctions?';
        let query_params = ["q", "category-id", "count", "startIndex", "seller", "bidder", "status"];
        let query_options = {
          q: this.$route.query.q,
          'category-id': this.$route.query['category-id'],
          count: parseInt(this.$route.query.show),
          startIndex: parseInt(this.$route.query.show * this.$route.query.page),
          seller: parseInt(this.$route.query.seller),
          bidder: parseInt(this.$route.query.bidder),
          status: this.$route.query.status
        };
        let inserted_params = 0;
        for (let i = 0; i < query_params.length; i++) {
          let parameter = query_params[i];
          let value = query_options[parameter];
          if (value) {
            if (inserted_params > 0) {
              endpoint += '&';
            }
            endpoint += parameter + '=' + value;
            inserted_params++;
          }
        }
        if (this.$route.query.winner) {
          endpoint = 'http://localhost:4941/api/v1/my_won_auctions';
        }
        console.log(token);
        this.$http.get(endpoint, {headers: {'X-Authorization': token}})
          .then(function (response) {
            console.log(response.data);
            this.num_auctions = response.data.length;
            this.auctions = response.data;
          }, function (error) {
            this.error = error;
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
      getSingleAuction: function (auctionId) {
        this.$http.get('http://localhost:4941/api/v1/auctions/' + auctionId)
          .then(function (response) {
            console.log(response.data);
            this.auction = response.data;
            this.ordered_bids = this.auction.bids.reverse();
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      addFileChange: function (file) {
        this.new_auction.photo = file[0];
      },
      editFileChange: function (file) {
        this.edited_auction_data.photo = file[0];
      },
      editAuction: function () {
        let categoryId = this.edited_auction_data.categoryId;
        let title = this.edited_auction_data.title;
        let description = this.edited_auction_data.description;
        let reservePrice = this.edited_auction_data.reservePrice;
        let startDateTime;
        let endDateTime;
        if (this.new_start !== '') {
          startDateTime = new Date(this.new_start).getTime();
        } else {
          startDateTime = this.auction.startDateTime;
        }
        if (this.new_end !== '') {
          endDateTime = new Date(this.new_end).getTime();
        } else {
          endDateTime = this.auction.endDateTime;
        }
        let startingBid = this.edited_auction_data.startingBid;


        let token = '';
        if (this.$cookies.isKey('token')) {
          token = this.$cookies.get('token');
        }

        this.$http.patch('http://localhost:4941/api/v1/auctions/' + this.$route.params.auctionId,
          JSON.stringify({
            "categoryId": categoryId,
            "title": title,
            "description": description,
            "reservePrice": reservePrice,
            "startDateTime": startDateTime,
            "endDateTime": endDateTime,
            "startingBid": startingBid
          }),
          {headers: {'X-Authorization': token}})
          .then(function (response) {
            if (this.edited_auction_data.photo !== '') {
              let file_name = this.edited_auction_data.photo.name;
              file_name = file_name.toLowerCase();
              let file_extension = '';
              if (file_name.includes(".jpg") || file_name.includes(".jpeg")) {
                file_extension = 'jpeg';
              } else if (file_name.includes(".png")) {
                file_extension = 'png';
              }
              console.log(this.edited_auction_data.photo);
              this.$http.post('http://localhost:4941/api/v1/auctions/' + this.$route.params.auctionId + '/photos',
                this.edited_auction_data.photo,
                {headers: {'content-type': 'image/' + file_extension, 'X-Authorization': token}})
                .then(function (response) {
                  this.edit_result = 'Auction updated, refresh to see changes';
                  this.editing = false;
                  this.getSingleAuction(this.$route.params.auctionId);
                  this.$forceUpdate();
                }, function (error) {
                  this.edit_result = error.body;
                });
            }
            this.edit_result = 'Auction updated, refresh to see changes';
            this.editing = false;
            this.getSingleAuction(this.$route.params.auctionId);
            this.$forceUpdate();
          }, function (error) {
            this.edit_result = error.body;
            console.log(error);
            this.error = error;
            this.errorFlag = true;
          });
      },
      getAuctionPhotoURL: function (auctionId) {
        return 'http://localhost:4941/api/v1/auctions/' + auctionId + '/photos';
      },
      deletePhoto: function () {
        let auctionId = this.$route.params.auctionId;
        let token = this.$cookies.get('token');
        this.$http.delete('http://localhost:4941/api/v1/auctions/' + auctionId + '/photos',
          {headers: {'X-Authorization': token}})
          .then(function (response) {
            this.edit_result = 'Photo deleted';
          }, function (error) {
            this.edit_result = 'No photo to delete';
          });
      },
      logout: function () {
        let token = this.$cookies.get('token');
        this.$http.post('http://localhost:4941/api/v1/users/logout', {}, {headers: {'X-Authorization': token}})
          .then(function (response) {
            this.$cookies.remove('token');
            this.$cookies.remove('id');
            this.$router.push({name: 'home'});
            this.$forceUpdate();
          }, function (error) {
            this.error = error.body;
            this.errorFlag = true;
          });
      },
      toDate: function (milliseconds) {
        let date = new Date(milliseconds);
        return date.toLocaleString();
      },
      postBid: function () {
        this.bid_result = '';
        let bid = this.new_bid_amount;
        let token = this.$cookies.get('token');
        this.$http.post('http://localhost:4941/api/v1/auctions/' + this.$route.params.auctionId + '/bids?amount=' + bid, {}, {headers: {'X-Authorization': token}})
          .then(function (response) {
            this.bid_result = 'Bid posted!';
            this.getSingleAuction(this.$route.params.auctionId);
            this.$forceUpdate();
          }, function (error) {
            this.bid_result = 'Bid unsuccessful';
            console.log(error);
            this.error = error.body;
            this.errorFlag = true;
          });
      },
      newAuction: function () {
        this.createError = '';
        this.createSuccess = '';
        let data = this.new_auction;
        let token = this.$cookies.get('token');
        this.$http.post('http://localhost:4941/api/v1/auctions/',
          JSON.stringify({
            "categoryId": parseInt(data.categoryId),
            "title": data.title,
            "description": data.description,
            "startDateTime": new Date(data.startDateTime).getTime(),
            "endDateTime": new Date(data.endDateTime).getTime(),
            "reservePrice": parseInt(data.reservePrice),
            "startingBid": parseInt(data.startingBid)
          }),
          {headers: {'X-Authorization': token}})
          .then(function (response) {
            if (data.photo !== '') {
              let file_name = data.photo.name;
              file_name = file_name.toLowerCase();
              let file_extension = '';
              if (file_name.includes(".jpg") || file_name.includes(".jpeg")) {
                file_extension = 'jpeg';
              } else if (file_name.includes(".png")) {
                file_extension = 'png';
              }
              this.$http.post('http://localhost:4941/api/v1/auctions/' + response.body.id + '/photos',
                data.photo,
                {headers: {'content-type': 'image/' + file_extension, 'X-Authorization': token}})
                .then(function (response) {
                  this.createSuccess = "Auction Created";
                  this.$forceUpdate();
                }, function (error) {
                  this.createError = error.body;
                });
            }

            this.createSuccess = "Auction Created";
            this.$forceUpdate();
            }, function (error) {
              this.createError = error.body;
          });
      }
    },
      watch: {
        '$route'() {
          this.getAuctions();
        }
      }
    }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Montserrat:400,500,700i');

  .filters {
    margin-top: 50px;
    color: darkgrey;
    background-color: #f5f5f5;
    margin-bottom: 40px;
    height: 60px;
    margin-left: auto;
    margin-right: auto;
    width:700px;
  }
  .filters p {
    padding-top: 15px;
    text-align: center;
    color: darkgrey;
    font-size: 14px;
  }
  .filters select {
    margin-right:10px;
    text-align: center;
    color: darkgrey;
    font-size: 14px;
  }
  .results {
    padding-bottom: 40px;
    margin-left: auto;
    margin-right: auto;
    width:700px;
  }
  .pages {
    padding-top: 20px;
    margin-right: auto;
    margin-left: auto;
    padding-bottom: 100px;
    width: 240px;
    margin-left: auto;
    margin-right: auto;
  }
  #nextpagebtn {
    display: inline-block;
    float: right;
    border-width: 0px;
    background-color: #7294ff;
    border-radius:15px;
    color:white;
  }
  #lastpagebtn {
    display: inline-block;
    float: left;
    border-width: 0px;
    background-color: #7294ff;
    border-radius:15px;
    color:white;
  }
  #pageNum {
    padding: 0 20px 0 20px;
    display: inline-block;
  }

  .results p {
    padding: 0;
    color: darkgrey;
    font-size: 14px;
  }

  .auction_listing {
    height: 100px;
    margin-left: auto;
    margin-right: auto;
    width:700px;
  }
  .title {
    float: left;
    margin: 0;
    width: 200px;
    padding: 15px 0 0 15px;
  }
  .title h1 {
    margin: 0;
    font-size: 18px;
  }
  .photo {
    float:left;
    display: inline;
    margin-top: 5px;
    margin-left: 5px;
    width: 90px;
    height: 90px;
  }
  .auction_listing:nth-of-type(odd) {
    background-color: #f5f5f5;
  }
  .auction_listing:nth-of-type(even) {
    background-color: #ededed;
  }
  .current_bid {
    margin: 15px;
    float:right;
    text-align: right;
  }
  .current_bid h2 {
    font-size:25px;
    color: #666666;
    padding: 0;
    margin: 0;
  }
  .auction_listing p {
    padding: 0;
    color: #666666;
    font-size: 14px;
  }
  .createOptions {
    width: 700px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 20px;
    font-family: 'Montserrat', sans-serif;
  }
  .createOptions h3 {
    display: inline;
    color: red;
  }
  .createOptions p {
    display: inline;
    color: black;
  }
  .createOptions h1 {
    display: inline;
    color: darkgrey;
    font-size: 18px;
  }
  .createOptions h2 {
    font-family: 'Montserrat', sans-serif;
    padding-bottom: 30px;
    color: #555254;
  }
  .createError {
    font-family: 'Montserrat', sans-serif;
    color: red;
  }
  .createSuccess {
    font-family: 'Montserrat', sans-serif;
    color: green;
  }
  .input-file {
    display: inline;
  }
  .auction_details p {
    display: inline;
    color: black;
  }
  .auction_details h1 {
    display: inline;
    color: darkgrey;
    font-size: 18px;
  }
  .auction_details {
    padding-top: 20px;
    font-family: 'Montserrat', sans-serif;
    margin-left: auto;
    margin-right: auto;
    width:900px;
  }
  .auction_photo {
    float: left;
    width:400px;
    height: 400px;
    display: inline;
  }
  .sideInfo {
    padding: 30px;
    width: 500px;
    display: inline;
    float: right;
  }
  .bottomInfo {
    text-align: center;
    padding-top:450px;
    margin-left: auto;
    margin-right: auto;
    width: 900px;
  }
  .bottomInfo p {
    color: darkgrey;
  }
  .bid {
    padding-top: 15px;
    margin-left: auto;
    margin-right: auto;
    width: 600px;
    height: 50px;
  }
  .bid:nth-of-type(odd) {
    background-color: #f5f5f5;
  }
  .bid:nth-of-type(even) {
    background-color: #ededed;
  }
  .bid p {
    color: #666666;
  }
  .bidAmt {
    text-align: left;
    width: 100px;
    padding-left: 15px;
    float:left;
  }
  .bidUser {
    float:left;
    text-align: left;
    padding-left: 100px;
  }
  .bidDate {
    padding-right: 15px;
    float:right;
  }





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

  .search-container {
    width: 350px;
    float: left;
    padding-left: 23%;
    padding-top: 10px;
    margin-right: 0;
  }
  .search-container a {
    color: black;
    display: inline;
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
</style>
