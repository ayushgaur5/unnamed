module.exports = {
    firstName: function (firstName, errors) {
        if (this.isEmptyOrNull(firstName)) {
            errors.push("FirstName");
            return '';
        }
        return firstName.trim();
    },

    lastName: function (lastName, errors) {
        if (this.isEmptyOrNull(lastName)) {
            return '';
        }
        return lastName.trim();
    },

    emailAddress: function (email, errors) {
        if (this.isEmptyOrNull(email)) {
            errors.push("EmailAddress");
            return '';
        }
        return emailAddress.trim();
    },

    mobileNumber: function (number, errors) {
        if (this.isEmptyOrNull(number)) {
            errors.push("Mobilenumber");
            return '';
        }
        return number.trim();
    },

    password: function (password, errors) {
        if (this.isEmptyOrNull(password)) {
            errors.push("Password");
            return '';
        }
        return password.trim();
    },

    isEmptyOrNull: function (str) {
        if (!str || str.trim() == '') return true;
        return false;
    },
}