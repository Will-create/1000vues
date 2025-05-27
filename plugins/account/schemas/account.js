NEWSCHEMA('Account', function(schema) {
    schema.action('exec', {
        name: 'Account',
        action: function($) {
            let user = $.user;
            $.callback(user);
        }
    });
    schema.action('create', {
        name: 'Create Account',
        input: 'phone:Phone',
        action: async function($, model) {
            let user = await DATA.read('tbl_user').where('phone', model.phone).promise();
            if (user) {
                $.invalid('@(User already exists)');
                return;
            }
            let data = {};
            data.phone = data.name = model.phone;
            data.id = UID();
            data.dtcreated = NOW;
            let label = 'create-account-' + data.id;
            DATA.insert('tbl_user', data).callback($.done(model.phone));
            
            let id = label.makeid();
            let response = await RESTBuilder.POST(CONF.flow_url + '/generate/' + id, {}).promise();
            let text = 'Your verification code: ' + response.value;
            FUNC.sendSMS(model.phone, text);
        }
    });


    schema.action('otpverify', {
        name: 'Verify the otp client code',
        params: '*value:String',
        input: '*phone:Phone',
        action: async function($, model) {
            let value = $.params.value;
            let user = await DATA.read('tbl_user').where('phone', model.phone).promise();
            if (!user) {
                $.invalid('@(User does not exist)');
                return;
            }

            let label = 'create-account-' + user.id;
            let id = label.makeid();
            let response = await RESTBuilder.POST(CONF.flow_url + '/verify/' + id + '/'+ value, {}).promise();

            if (!response.success) {
                $.invalid('@(Invalid or expired code)');
                return;
            }

            // create a session
            let session = {};
            session.id = UID();
            session.userid = user.id;
            session.token = ENCRYPTREQ($, { id: session.id }, CONF.passwordizor);
            session.dtcreated = NOW;
            DATA.insert('tbl_session', session).callback($.done(session.token));
        }
    });
});