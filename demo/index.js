angular.module('pmkr.componentsDemo', [
  'ui.router',
  'ui.bootstrap',
  'pmkr.components'
])

.config([
  '$urlRouterProvider',
  '$locationProvider',
  function($urlRouterProvider, $locationProvider) {
    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
  }
])

.config([
  '$stateProvider',
  function($stateProvider) {

    $stateProvider
    .state('home', {
      url: '/'
    })
    
    .state('pristineOriginal', {
      url: '/pristine-original',
      templateUrl: 'pages/pristineOriginal.html'
    })
    
    .state('validateCustom', {
      url: '/validate-custom',
      templateUrl: 'pages/validateCustom.html'
    })
    
    ;

  }
])

.directive('plnkrDemo', function() {

  var directive = {
    controller: function($scope) {
      this.demo = {
        description: "sample desc",
        tags: ['someTag'],
        files: []
      };
    },
    link: function() {

    }
  };

  return directive;

})

.directive('plnkrDemoFile', function() {

  var directive = {
    require: '^plnkrDemo',
    scope: {
      fileName: '=plnkrDemoFile'
    },
    link: function($scope, $element, $attrs, plnkrDemo) {
      plnkrDemo.demo.files.push({
        filename: $scope.fileName,
        content: $element.text().trim()
      });
    }
  };

  return directive;

})

.directive('plnkrDemoButton', function($http, formPostData) {

  var directive = {
    require: '^plnkrDemo',
    link: function($scope, $element, $attrs, plnkrDemo) {
      $element.on('click', function() {
        var postData = {};
        plnkrDemo.demo.files.forEach(function(file) {
          postData['files['+file.filename+']'] = file.content;
        });
        plnkrDemo.demo.tags.forEach(function(tag, index) {
          postData['tags['+index+']'] = tag;
        });
        postData.description = plnkrDemo.demo.description;
        formPostData('//plnkr.co/edit/', postData);
      });
    }
  };

  return directive;

})

.factory('formPostData', [
  '$document',
  function($document) {

    function service(url, fields) {

      var form = angular.element('<form style="display: none;" method="post" action="'+url+'"></form>');

      angular.forEach(fields, function(value, name) {

        var input = angular.element('<input type="hidden" name="'+name+'">');
        input.attr('value', value);
        $document.find('body').append(input);
        form.append(input);
      });

      $document.find('body').append(form);
      form[0].submit();
      form.remove();

    }

    return service;

  }
])

;