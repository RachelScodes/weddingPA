angular

.module('ptwfm', ['ui.router'])
.config(

   function MainRouter($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('landing', {
        url: "/",
        templateUrl: "_landing.html",
        controller: "AccountsController"
      })
      .state('account', {
        url: "/account",
        views: {
          "": {
            templateUrl: "_add-guest.html",
            controller: "GuestsController as guests"
          },
          "list@account": {
            templateUrl: "_guestList.html",
            controller: "GuestsController as guests"
          },
          "footer@account": {
            templateUrl: "_footer.html",
            controller: "AccountsController as accounts"
          }
        }
      })

    $urlRouterProvider.otherwise("/");
  }
)

.controller('AccountsController', function AccountsController($scope, $state, $http, $window){

  var self = this;
  self.all = [];

  self.addAccount = addAccount;

   function addAccount(){
      $http.post('/account/signup', self.newAccount).then(function(response){
         if (response.data.success) {
            $window.localStorage.token = response.data.token;
            $window.localStorage.setItem("myAccount", response.data.account._id);
            // $window.localStorage.account = response.data.account._id;
            self.message = 'Success';
            $state.go('account');
         }
      })
   }
})
