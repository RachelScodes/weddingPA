angular.module('addGuests', ['ui.router']).config(GuestRouter);

function GuestRouter($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('add-edit', {
			url: "/addGuests",
			templateUrl: "addGuests.html"
		})
		.state('email', {
			url: "/emailGuests",
			templateUrl: "emailGuests.html"
		});

	$urlRouterProvider.otherwise("/");
}
