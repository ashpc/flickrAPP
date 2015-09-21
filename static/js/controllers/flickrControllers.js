var flickrControllers = angular.module('flickrControllers', [
]);


/*
 * Controller for the menu active class to the menu*/
flickrControllers.controller('menuBar', ['$scope', '$location' , '$log',
    function ($scope, $location, $log) {
        $scope.isActive = function (viewLocation) {
            var active = (viewLocation === $location.path() || ($location.path()).indexOf(viewLocation) === 0);
            return active;

        };

    }]);


/*
 * controller for
 * Dependencies -- Flickr Servcie to amke api calls
 *
 * variables --  phostoSizes,
 *               photosList
                 loading,fail -- flags
                 photoSelected -- size selected

 *
 * functions --
 *              init -- main function to ge the ui ready and make the call
 *
 * */
flickrControllers.controller('PicturesController', ['$scope', '$log', '$sce', 'FlickrApi', '$modal',
    function ($scope, $log, $sce, FlickrApi, $modal) {
        var init = function init() {
            $scope.photoSizes = [
                {'displayName': 'Square', 'value': '_s'},
                {'displayName': 'Large Square', 'value': '_q'},
                {'displayName': 'ThumbNail', 'value': '_t'},
                {'displayName': 'Small', 'value': '_m'},
                {'displayName': 'Medium', 'value': ''},
                {'displayName': 'Large', 'value': '_b'}
            ];

            $scope.photoSelected = '_q';
            $scope.apiSelected ='recent';
            $scope.fail = false;
            $scope.photoList =[];
            $scope.loading = true;
            $scope.prev = false;
            $scope.next = false;
            
            $scope.getPhoto($scope.apiSelected,1);


        };
        /**
         * Service call to get the first list
         Pagination is also done based on the page,pages values fromt the reposne
         */
        $scope.getPhoto = function getPhoto(url,page) {
            var pageId = page,
                urlID = url+'URL',
                photoList;
            if (!page) {
                pageId = 1;
            }
            $scope.photoList =[];
            $scope.loading = true;
            

            FlickrApi.getList(urlID,pageId).then(function (value) {
                $scope.fail = false;
                $scope.loading = false;

                $scope.photoData = value['photos'];
                $log.info('Current Page -- ',$scope.photoData.page);
                $log.info('Total Pages-- ',$scope.photoData.pages);

                /**
                 * set pagination values
                 * page == pages  --> no more next in the last page
                 * if page =1 and pages =1 then no next and prev
                 */
                $scope.currentPage = $scope.photoData.page;
                $scope.totalPages = $scope.photoData.pages;

                if ($scope.photoData.pages == 1) {
                    $scope.prev = false;
                    $scope.next = false;
                } else if ($scope.photoData.pages == $scope.photoData.page) {
                    $scope.prev = true;
                    $scope.next = false;
                } else if ($scope.photoData.page == 1) {
                    $scope.prev = false;
                    $scope.next = true;
                }
                photoList = $scope.photoData.photo;

                $log.info('$scope',$scope);

                /**
                 * sort
                 */

                $scope.predicate = 'id';
                $scope.reverse = true;
                $scope.order = function (predicate) {
                    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                    $scope.predicate = predicate;
                };
                /**
                 * create image url for each image
                 */
                $.each(photoList, function (key, val) {
                    val['url'] = 'https://farm' + val.farm + '.staticflickr.com/' + val.server + '/' + val.id + '_' + val.secret + $scope.photoSelected + '.jpg';
                });
                $scope.photoList = photoList;
                $log.debug($scope.photoList);

            }, function (reason) {
                $scope.fail = true;
                $scope.className = 'red';
                var msg = (reason.data && reason.data.message) ? reason.data.message : Flickr.errorMsg;
                $log.error('Reason for Failure ---', msg);
                $scope.message = $sce.trustAsHtml('Reason for Failure ---' + msg);
            }, function (update) {
                $log.info('Update  ---', update);
            });

        };
        /**
         * Modal to display the info
         * @param photo
         */
        $scope.photoInfo = function (photo) {
            $modal.open({
                templateUrl: 'static/partials/photoInfo.html',
                controller: 'PhotoController',
                size: 'lg',
                backdrop: 'static',
                resolve: {
                    photoData: function () {
                        return photo;
                    }}
            });
        };
        /**
         *  Increment the page Id and make the call
         */
        $scope.getNext = function getNext() {
            var nextpage = $scope.currentPage + 1;
            $scope.getPhoto($scope.apiSelected,nextpage);
        };
        /**
         *  Decrement the page Id and make the call
         */
        $scope.getPrev = function getPrev() {
            var prevpage = $scope.currentPage - 1;
            $scope.getPhoto($scope.apiSelected,prevpage);
        };
        
        init();
    }]);
/**
 *  Modal controller to display the phtot details
 */
flickrControllers.controller('PhotoController', ['$scope', '$log', '$modalInstance', 'photoData',
    function ($scope, $log, $modalInstance, photoData) {
        $scope.photo = photoData;

        $scope.close = function () {
            $modalInstance.dismiss('cancel');

        };
        $scope.ok = function () {
            $modalInstance.dismiss('cancel');
        }

    }]);

