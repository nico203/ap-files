angular.module('ap-files').service('FileManager', [
    function() {
        function FileManager(validMimeTypes) {
            this.validMimeTypes = validMimeTypes;

            this.validate = function(file) {

            };

            /**
             * Recibe una cadena y chequea que sea 'string', si es retorna la cadena, sino retorna nulo
             * 
             * @param {type} str
             * @returns {undefined}
             */
            this.manageString = function(str) {
                return angular.isString(str) ? str : null;
            };

            /**
             * Recibe un archivo que puede ser una cadena referenciando a un 'path' desde el servidor,
             * o un archivo cargado desde el cliente. Si es un path, lo retorna tal cual, sino encodea el archivo
             * en base64 y retorna una cadena
             * 
             * @param {type} file
             * @returns {undefined}
             */
            this.manageFile = function(file) {

            };
        }
        
        return FileManager;
    }
]);