angular.module('InfamousAccounts')
.controller('AccountsController', AccountsController);

AccountsController.$inject = ['$http'];

function AccountsController($http){
  var self = this;
  self.all = [];
  self.addAccount = addAccount;
  self.newAccount = {};
  self.getAccounts = getAccounts;
  self.deleteAccount = deleteAccount;

  getAccounts();
  function getAccounts(){
    $http
      .get('http://localhost:3000/accounts')
      .then(function(response){
        self.all = response.data.accounts;
    });
  }

  function addAccount(){
    $http
      .post('http://localhost:3000/accounts', self.newAccount)
      .then(function(response){
        getAccounts();
    });
    self.newAccount = {};
  }

  function deleteAccount(account){
    $http
      .delete("http://localhost:3000/accounts/" + account._id)
      .then(function(response){
        var index = self.all.indexOf(account);
        self.all.splice(index, 1);
      });
  }

}
