angular.module('fm.dashboard', [])

.controller('DashboardCtrl',function($http, $scope, User, Tournament){
	angular.extend($scope,User, Tournament);
	$scope._active = [];
	$scope._invited = [];
	var fetched = false;
	if(!$scope.user.name && !fetched){
		User.getInfo().then(function(d){
			fetched = true;
			Tournament.user_id = d.user_id;
			$scope.user = d;
			$scope.user.tournamentsActive.forEach(function(id){
				Tournament.fetch(id)
					.then(function(d){
						$scope._active.push(d);
					})
			});
			$scope.user.tournamentsInvited.forEach(function(id){
				Tournament.fetch(id)
					.then(function(d){
						$scope._invited.push(d);
					})
			});
			$scope.user.strideRunning = Math.round(d.strideRunning);
			$scope.user.strideWalking = Math.round(d.strideWalking);
		})
	};

	/**
	 * Declines a pending invitation for a user, affects the tournament declined.
	 * @param  {[type]} user_id       [description]
	 * @param  {[type]} tournament_id [description]
	 * @return {[type]}               [description]
	 */
	$scope.decline = function(user_id, tournament_id){
		Tournament.declineInvite(user_id,tournament_id);
		$scope._invited.forEach(function(t,i){
			if(t._id === tournament_id){
				$scope._invited.splice(i,1);
				return;
			}
		});
	};

	//Accepts a pending invitation.
	$scope.accept = function(user_id, tournament_id){
		Tournament.acceptInvite(user_id,tournament_id);
		$scope._invited.forEach(function(t,i){
			if(t._id === tournament_id){
				$scope._invited.splice(i,1);
				return;
			}
		});
		Tournament.fetch(tournament_id)
		  .then(function(d){
		  	$scope._active.push(d);
		  })
	}

})

.directive('fmDashboard',function(){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
		templateUrl  : '../scripts/dashboard/dashboard.html',
		link				 : function(scope,el,attr){
		}
	}
})

.directive('fmInvites',function(){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
		templateUrl  : '../scripts/dashboard/invites.html',
		link				 : function(scope,el,attr){
		}
	}
})

.directive('fmOverview',function(){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
		templateUrl  : '../scripts/dashboard/overview.html',
		link				 : function(scope,el,attr){
		}
	}
})

.directive('fmProgress',function(){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
		templateUrl  : '../scripts/dashboard/progress.html',
		link				 : function(scope,el,attr){
		}
	}
})
