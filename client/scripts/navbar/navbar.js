angular.module('fm.navbar', [])

.controller('NavbarCtrl',function($scope){
})

.directive('fmNavbar',function(){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
		controller   : 'DashboardCtrl',
		templateUrl  : '../scripts/navbar/navbar.html',
		link				 : function(scope,el,attr){
			//Click event for opening left panel
			el.find('#nav-logo3').bind('click',function(e){
				$(el).find('div.left').animate({
					left:'0'
				});
				$(document).find('div.navbar')
					.animate({
						left:'200px'
					})
				$(document).find('div.main')
					.animate({
						left:'200px'
					})
			});
			//Click event for opening left panel
			el.find('#nav-icon').bind('click',function(e){
				$(el).find('div.right').animate({
					right:'0'
				});
				$(document).find('div.navbar')
					.animate({
						left:'-200px'
					})
				$(document).find('div.main')
					.animate({
						left:'-200px'
					})
			});
		}
	}
})

.directive('fmLeftPanel',function(){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
		templateUrl  : '../scripts/navbar/leftPanel.html',
		link				 : function(scope,el,attr){
			//Click event for closing left panel
			el.find('.back-icon').bind('click',function(e){
				$(document).find('div.left').animate({
					left:'-200px'
				});
				$(document).find('div.navbar')
					.animate({
						left:'0'
					})
				$(document).find('div.main')
					.animate({
						left:'0'
					})
			})
			$(el).on('click','#left-navi',function(e){
				$(document).find('div.left').animate({
					left:'-200px'
				});
				$(document).find('div.navbar')
					.animate({
						left:'0'
					})
				$(document).find('div.main')
					.animate({
						left:'0'
					})
			})
		}
	}
})

.directive('fmRightPanel',function(){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
		templateUrl  : '../scripts/navbar/rightPanel.html',
		link				 : function(scope,el,attr){
			//Click event for closing left panel
			el.find('.back-icon').bind('click',function(e){
				$(document).find('div.right').animate({
					right:'-200px'
				});
				$(document).find('div.navbar')
					.animate({
						left:'0'
					})
				$(document).find('div.main')
					.animate({
						left:'0'
					})
			})
			$(el).on('click','#right-navi',function(e){
				$(document).find('div.right').animate({
					right:'-200px'
				});
				$(document).find('div.navbar')
					.animate({
						left:'0'
					})
				$(document).find('div.main')
					.animate({
						left:'0'
					})
			})
		}
	}
})