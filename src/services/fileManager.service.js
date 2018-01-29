angular.module('ap-files').service('FileManager', [
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
]);