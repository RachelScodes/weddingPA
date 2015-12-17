angular
  .module('PlanThisWeddingForMe', ['ui.router'])
  .config(AccountRouter);

function AccountRouter($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise("/index");

  $stateProvider
  .state('index', {
    url: '/',
    templateUrl: 'list.html'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'signup.html'
  })
  .state('about', {
    url: '/about',
    templateUrl: 'about.html'
  })
  // .state('show', {
  //   url: '/account/:id',
  //   templateUrl: 'show.html'
  // });
}
