angular.module('ap-files').directive('apImageUploader', [
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
