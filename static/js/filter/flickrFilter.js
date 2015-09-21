
'use strict';

/* Filters */

var flickrFilters = angular.module('flickrFilters', []);

/**

	shorten the text
*/

flickrFilters.filter('shorten', function () {
    return function (input, chars) {
        return input.length > chars ? input.substring(0, chars) + '...' : input;
    };
});