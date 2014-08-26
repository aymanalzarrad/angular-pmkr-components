/*
pmkr.components v0.0.0
https://github.com/m59peacemaker/angular-pmkr-components
License: MIT
Author: Johnny Hauser
File created: 8.25.2014
*/

angular.module('pmkr.components.directives', [
  'pmkr.pristineOriginal',
  'pmkr.validateCustom'
]);

angular.module('pmkr.pristineOriginal', [])

.directive('pmkrPristineOriginal', [
  function() {

    var directive = {
      restrict : 'A',
      require : 'ngModel',
      link: function($scope, $element, $atts, $ngModel) {

        var pristineVal = null;

        $scope.$watch(function() {
          return $ngModel.$viewValue;
        }, function(val) {
          // set pristineVal to newVal the first time this function runs
          if (pristineVal === null) {
            pristineVal = $ngModel.$isEmpty(val) ? '' : val.toString();
          }

          // newVal is the original value - set input to pristine state
          if (pristineVal === val) {
            $ngModel.$setPristine();
          }

        });

      }
    };

    return directive;

  }
])

;

angular.module('pmkr.validateCustom', [
  'pmkr.debounce'
])

.directive('pmkrValidateCustom', [
  '$q',
  'pmkr.debounce',
  function($q, debounce) {

    var directive = {
      restrict: 'A',
      require: 'ngModel',
      // set priority so that other directives can change ngModel state ($pristine, etc) before gate function
      priority: 1,
      link: function($scope, $element, $attrs, $ngModel) {

        var opts = $scope.$eval($attrs.pmkrValidateCustom);
        var props = {};
        opts.props && ($scope[opts.props] = props);

        var valid = true; // field is initially valid
        var gate = false;

        $ngModel.$validators[opts.name] = function() {
          return valid;
        };

        var debouncedFn = debounce(validate, opts.wait);
        var latestFn = debounce.latest(debouncedFn);

        function validate(val) {
          if (gate) { return; }
          props.validating = true;
          return opts.fn(val);
        }

        function valueChange(val) {

          props.valid = props.invalid = false;

          if (opts.gate && (gate = opts.gate(val, $ngModel))) {
            props.pending = props.validating = false;
            return;
          }

          props.pending = true;

          latestFn(val).then(function(isValid) {
            if (gate) { return; }
            props.checkedValue = val;
            valid = props.valid = isValid;
            props.invalid = !valid;
            $ngModel.$validate();
            props.pending = props.validating = false;
          });

        }

        $scope.$watch(function() {
          return $ngModel.$viewValue;
        }, valueChange);

      } // link

    }; // directive

    return directive;

  }
])

;