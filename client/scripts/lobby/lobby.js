angular.module('fm.lobby', [])

.controller('LobbyCtrl',function($scope, Tournament){
	angular.extend($scope, Tournament);
})

.directive('fmLobby',function($animate, Tournament){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
		templateUrl  : '../scripts/lobby/lobby.html',
		link				 : function(scope,el,attr){
			var toggle = false;
			$(el).find('#nav-create').on('click',function(){
				if(!toggle){
					$(el).find('.tourny-blackout').toggleClass('show');
					$(el).find('#tourny-create').animate({
						  width: '80%',
						  top: '13vh',
						  right: '0',
						  height: '58%',
					},200);
					$(el).find('#nav-submit').animate({'margin-right': '60px'},200);
					$(el).find('#nav-clear').animate({'margin-right': '100px'},200);
					toggle = true;
				} else {
					$(el).find('#nav-submit').animate({'margin-right': '0px'},200);
					$(el).find('#nav-clear').animate({'margin-right': '0px'},200);					
					$(el).find('#tourny-create').animate({
						  width: '0%',
						  top: '85vh',
						  right: '5vh',
						  height: '0%',
					},
					{
						duration: 200,
						complete: function(){
							$(el).find('.tourny-blackout').toggleClass('show');
						}
					});
					toggle = false;
				}
			})
		}
	}
})

.directive('fmTournySearch',function(){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
		controller   : 'LobbyCtrl',
		templateUrl  : '../scripts/lobby/tournySearch.html',
		link				 : function(){
		}
	}
})