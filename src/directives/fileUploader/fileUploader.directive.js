angular.module('ap-files').directive('apFileUploader', [
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
