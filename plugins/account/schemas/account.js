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
            // let label = 'create-account-' + data.id;

            // let meta = MAIN.Totp.generate(label.makeid(), 'Account');


            // console.log('label', label, 'meta', meta);
            // console.log('label', label.makeid());


            DATA.insert('tbl_user', data).callback($.done(model.phone));
        }
    });




});