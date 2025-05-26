exports.name = "Account";
exports.icon = "ti ti-user";
exports.permissions = (user) => user.sa || user.permissions.includes('account');
exports.install = function() {
    ROUTE('API /api/         -account --> Account/exec');
    ROUTE('API /api/         +account_create --> Account/create');
    ROUTE('API /api/         +account_otp_verify/{value} --> Account/otpverify');
}

