angular.module('ap-files').service('FileManager', [
    '$q',
    function($q) {
        function FileManager(validMimeTypes) {
            var self = this;
            
            self.validMimeTypes = validMimeTypes;
            

            self.validate = function(file) {
                return self.validMimeTypes.test(file.type);
            };

            /**
             * Recibe una cadena y chequea que sea 'string', si es retorna la cadena, sino retorna nulo
             * 
             * @param {type} str
             * @returns {undefined}
             */
            self.manageString = function(str) {
                return angular.isString(str) ? str : null;
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
                
                if(angular.isString(file)) return file;
                
                if(!self.validate(file)) {
                    deferred.reject();
                }
                
                var reader = new FileReader();
                reader.onload = function(e) {
//                    if(!self.validate(file)) {
//                        deferred.reject();
//                    }
                    deferred.resolve(e.target.result);
                };
                reader.readAsDataURL(file);
                
                return deferred.promise;
            };
        }
        
        return FileManager;
    }
]);