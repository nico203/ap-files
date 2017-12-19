angular.module('ap-files').directive('apImageUploader', [
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
