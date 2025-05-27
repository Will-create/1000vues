
exports.install = function() {
    ROUTE('#401', function($) {
        respond($, 401, '401 Unauthorized request');
    });

    ROUTE('#400', function($) {
        respond($, 400, '400 Bad request');
    });

    ROUTE('#404', function($) {
        respond($, 404, '404 not found');
    });

    ROUTE('#408', function($) {
        respond($, 408, '408 reqest timeout');
    });
}


function respond($, code, message) {

    $.json({ success: false, code: code, message: message });
}