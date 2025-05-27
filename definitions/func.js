FUNC.sendSMS = async function(phone, text) {

    console.log('SMS SENT TO '+ phone);
    console.log(text);
 
    TotalAPI('sms', { from: '1000Vues', to: '+' + phone, body: text}, function(err, response) {
        if (err) {
            console.log(err);
            return;
        }

    });
}