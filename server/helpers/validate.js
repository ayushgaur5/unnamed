module.exports = {
    firstName: function (firstName) {
        if (firstName.trim() == '') return false;
        return true;
    },

    emailAddress: function (email) {
        if(email.trim() == '') return false;
        return true;
    },

    mobileNumber: function (number) {
        if(number.trim() == '') return false;
        return true;
    },

    password: function (password) {
        if(password.trim() == '') return false;
        return true;
    }
}