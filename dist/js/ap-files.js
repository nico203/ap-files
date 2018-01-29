angular.module('ap-files', [
    'adminPanel'
]);
;angular.module('ap-files').directive('apFileUploader', [
    'FileManager',
    function(FileManager){
        return {
            require: 'ngModel',
            restrict: 'E',
            scope: {
                id: '@',
                name: '@?'
            },
            link: function(scope, elem, attr, ngModel) {
                elem.addClass('ap-file-loader row columns');
                scope.file = {
                    data: null,
                    name: null
                };
                scope.error = {
                    state: false,
                    msg: ''
                };
                scope.showViewFile = false;
                var fileMimeType = /^./g;
                var fileManager = new FileManager(fileMimeType);
                
                function isBase64(str) {
                    return str && str.includes('base64') && str.slice(-1) === '=';
                }
                
                function onLoadFile(event) {
                    var file = event.target.files[0];
                    console.log('file', file);
                    
                    fileManager.manageFile(file).then(function(rSuccess) {
                        ngModel.$setViewValue(rSuccess.data);
                        scope.file.name = rSuccess.name;
                        scope.error = {
                            state: false,
                            msg: ''
                        };
                    }, function(rError) {
                        ngModel.$setViewValue(null);
                        scope.file.name = null;
                        scope.error.state = true;
                        if(rError === 'invalid') {
                            scope.error.msg = 'El archivo no es valido';
                        }
                        if(rError === 'error') {
                            scope.error.msg = 'El archivo no es valido';
                        }
                        if(rError === 'abort') {
                            scope.error.msg = 'Ocurrio un error inesperado';
                        }
                    });
                }
                
                elem.find('input[type="file"]').bind('change', onLoadFile);

                //evento que escucha el model para hacer el bindeo de las variables
                var modelWatcher = scope.$watch(function () {
                    return ngModel.$modelValue;
                }, function (val) {
                    scope.showViewFile = val ? !isBase64(val) : false;
                    scope.file.data = val;
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
    'FileManager',
    function(FileManager){
        return {
            require: 'ngModel',
            restrict: 'E',
            scope: {
                id: '@',
                name: '@?'
            },
            link: function(scope, elem, attr, ngModel) {
                elem.addClass('ap-image-uploader row columns');
                scope.image = {
                    data: null,
                    name: null
                };
                scope.error = {
                    state: false,
                    msg: ''
                };
                var imageFileMimeType = /^image\/[a-z]*/g;
                var fileManager = new FileManager(imageFileMimeType);
                
                function onLoadFile(event) {
                    var file = event.target.files[0];
                    
                    fileManager.manageFile(file).then(function(rSuccess) {
                        ngModel.$setViewValue(rSuccess.data);
                        scope.image.name = rSuccess.name;
                        scope.error = {
                            state: false,
                            msg: ''
                        };
                    }, function(rError) {
                        ngModel.$setViewValue(null);
                        scope.image.name = null;
                        scope.error.state = true;
                        if(rError === 'invalid') {
                            scope.error.msg = 'El archivo no es valido';
                        }
                        if(rError === 'error') {
                            scope.error.msg = 'El archivo no es valido';
                        }
                        if(rError === 'abort') {
                            scope.error.msg = 'Ocurrio un error inesperado';
                        }
                    });
                }
                
                elem.find('input[type="file"]').bind('change', onLoadFile);

                //evento que escucha el model para hacer el bindeo de las variables
                var modelWatcher = scope.$watch(function () {
                    return ngModel.$modelValue;
                }, function (val) {
                    scope.image.data = val;
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
;angular.module('ap-files').service('FileManager', [
    '$q',
    function($q) {
        function FileManager(validMimeTypes) {
            var self = this;
            
            self.validMimeTypes = validMimeTypes;
            

            self.validate = function(file) {
                if(!file) return false;
                return self.validMimeTypes.test(file.type);
            };

            /**
             * Recibe un archivo que puede ser una cadena referenciando a un 'path' desde el servidor,
             * o un archivo cargado desde el cliente. 
             * Si es un path, lo retorna tal cual, sino encodea el archivo
             * en base64 y retorna una cadena.
             * Si es un archivo, retorna una promesa, la cual falla si el archivo no es valido,
             * o retorna la cadena en base64 si el archivo es valido
             * 
             * 
             * @param {type} file
             * @returns {undefined}
             */
            self.manageFile = function(file) {
                var deferred = $q.defer();
                
                if(!self.validate(file)) {
                    deferred.reject('invalid');
                }
                
                var reader = new FileReader();
                reader.onload = function() {
                    deferred.resolve({
                        data: reader.result,
                        name: file.name
                    });
                };
                reader.onerror = function(e) {
                    console.log('reader.onerror',e);
                    deferred.reject('error');
                };
                reader.onabort = function(e) {
                    console.log('reader.onabort',e);
                    deferred.reject('abort');
                };
                reader.readAsDataURL(file);
                
                return deferred.promise;
            };
        }
        
        return FileManager;
    }
]);;angular.module('ap-files').run(['$templateCache', function ($templateCache) {
  $templateCache.put("directives/fileUploader/fileUploader.template.html",
    "<div class=row ng-if=showViewFile><a class=\"button view-file\" ng-href={{file.data}} target=_blank><i class=\"fa fa-file-o\"></i></a></div><div class=input-group><div class=input-group-button><label for={{id}}2 class=\"button file\"><i class=\"fa fa-file-text-o\"></i></label><input type=file id={{id}}2 class=show-for-sr></div><input class=input-group-field type=text readonly ng-class=\"{'is-invalid-input':error.state}\" ng-value=file.name></div><span ng-class=\"{'is-visible':error.state}\" class=form-error ng-bind=error.msg></span>");
  $templateCache.put("directives/imageUploader/imageUploader.template.html",
    "<div class=image-view><img ng-src={{image.data}} ng-show=image.data></div><div class=input-group><div class=input-group-button><label for={{id}}2 class=\"button file\"><i class=\"fa fa-file-image-o\"></i></label><input type=file id={{id}}2 class=show-for-sr accept=image/*></div><input class=input-group-field type=text readonly ng-class=\"{'is-invalid-input':error.state}\" ng-value=image.name></div><span ng-class=\"{'is-visible':error.state}\" class=form-error ng-bind=error.msg></span>");
}]);
