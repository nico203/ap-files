angular.module('ap-files', [
    'adminPanel'
]);
;angular.module('ap-files').directive('apFileUploader', [
    function(){
        return {
            require: 'ngModel',
            restrict: 'E',
            scope: true,
            link: function(scope, elem, attr, ngModel) {
                elem.addClass('ap-image-loader row columns');
                scope.image = {
                    path: null,
                    name: null
                };
                var imageFileMimeType = /^image\/[a-z]*/g;
                
                function onLoadFile(event) {
                    var file = event.target.files[0];
                    if(!file || !imageFileMimeType.test(file.type)) return;
                    
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        scope.$apply(function() {
                            var result = e.target.result;
                            scope.image.path = result;
                            scope.image.name = file.name;
                            ngModel.$setViewValue(file);
                        });
                    };
                    reader.readAsDataURL(file);
                }
                
                elem.find('input[type="file"]').bind('change', onLoadFile);

                scope.loadImage = function() {
                    
                };
                
                //evento que escucha el model para hacer el bindeo de las variables
                var modelWatcher = scope.$watch(function () {
                    return ngModel.$modelValue;
                }, function (modelValue) {
                    console.log('modelValue',modelValue);
                });
                
                //Desacoplamos los eventos al eliminar el objeto
                scope.$on('$destroy', function() {
                    elem.find('input[type="file"]').unbind('change', onLoadFile);
                    modelWatcher();
                });
                
            },
            templateUrl: 'directives/fileUploader/fileUploader.template.html'
        };
    }
]);
;angular.module('ap-files').directive('apImageUploader', [
    function(){
        return {
            require: 'ngModel',
            restrict: 'E',
            scope: true,
            link: function(scope, elem, attr, ngModel) {
                elem.addClass('ap-image-uploader row columns');
                scope.image = {
                    data: null,
                    name: null
                };
                var imageFileMimeType = /^image\/[a-z]*/g;
                
                function onLoadFile(event) {
                    var file = event.target.files[0];
                    if(!file || !imageFileMimeType.test(file.type)) return;
                    
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        scope.$apply(function() {
                            ngModel.$setViewValue({
                                name: file.name,
                                data: e.target.result
                            });
                        });
                    };
                    reader.readAsDataURL(file);
                }
                
                elem.find('input[type="file"]').bind('change', onLoadFile);

                //evento que escucha el model para hacer el bindeo de las variables
                var modelWatcher = scope.$watch(function () {
                    return ngModel.$modelValue;
                }, function (val) {
                    console.log('val',val);
                    if(val) {
                        //uso de filedata {name:'name',data:'base64data'}
                        scope.image.name = val.name;
                        scope.image.data = val.data;
                        console.log(scope.image);
                    }
                });
                
                //Desacoplamos los eventos al eliminar el objeto
                scope.$on('$destroy', function() {
                    elem.find('input[type="file"]').unbind('change', onLoadFile);
                    modelWatcher();
                });
                
            },
            templateUrl: 'directives/imageUploader/imageUploader.template.html'
        };
    }
]);
;angular.module('ap-files').run(['$templateCache', function ($templateCache) {
  $templateCache.put("directives/fileUploader/fileUploader.template.html",
    "<div class=image-view><img ng-src={{image.path}} ng-click=loadImage()></div><div class=input-group><div class=input-group-button><label for=exampleFileUpload class=\"button file\"><i class=\"fa fa-file-image-o\"></i></label><input type=file id=exampleFileUpload class=show-for-sr accept=image/*></div><input class=input-group-field type=text readonly ng-value=image.name></div>");
  $templateCache.put("directives/imageUploader/imageUploader.template.html",
    "<div class=image-view><img ng-src={{image.data}}></div><div class=input-group><div class=input-group-button><label for=exampleFileUpload class=\"button file\"><i class=\"fa fa-file-image-o\"></i></label><input type=file id=exampleFileUpload class=show-for-sr accept=image/*></div><input class=input-group-field type=text readonly ng-value=image.name></div>");
}]);
