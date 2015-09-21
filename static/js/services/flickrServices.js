
'use strict';

/* Services */

var flickrServices = angular.module('flickrServices', []);

/* Flickr Api  Services
*/

flickrServices.factory('FlickrApi', ['$http', '$timeout', '$q', '$log' ,
    function ($http, $timeout, $q, $log) {
    var flickr = {
      getList: function (url,pageId) {
            var url = Flickr[url] ,
                deferred = $q.defer();
          url += '&api_key='+Flickr.apiKey+'&user_id='+Flickr.apiUser+'&page='+pageId+'&format=json&nojsoncallback=1';
            $log.info(url);
            $http.get(url).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject("error");
            });
            return deferred.promise;
        }

    };
    return flickr;
}]);
