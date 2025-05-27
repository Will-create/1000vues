
MAIN.sessions = {};
AUTH(async function($) {

    let token = $.headers['token'];

    if(!token || token.length < 20) {
        $.invalid();
        return;
    }

    var data = DECRYPTREQ($, token, CONF.passwordizor);

    if (!data || !data.id) {
        $.invalid();
        return;
    }

    var session;


    if (MAIN.sessions[data.id]) {
        session = MAIN.sessions[data.id];
        $.success(session);

    } else {
        session = await DATA.read('tbl_session').id(data.id).promise();
    }

    if (!session) {
        $.invalid();
        return;
    }

    DATA.read('tbl_user').id(session.id).callback(function(err, response) {
        response.sessionid = session.id;
        MAIN.sessions[session.id] = response;
        $.success(response);
    });
});

ON('service', function(tick) {
    if (tick % 60 == 0) {
        console.log('RESET SESSIONS');
    }
})