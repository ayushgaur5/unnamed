/*var bcrypt = require('bcrypt');

var userSchema = new Schema({
    firstname: { type: String, maxlength: 100 },
    lastname: { tpe: String, maxlength: 100 },
    mobile: { type: Number, unique: true, min: 10, max: 10 },
    email_address: { type: String },
    password: { type: String, minlength: 8, maxlength: 64 },
    addresses: [{
        longitude: Schema.Types.Decimal128,
        latittude: Schema.Types.Decimal128,
        line1: string,
        line2: string,
        city: string,
        state: string,
        pincode: { type: Number, min: 6, max: 6 }
    }]
});

// hash the password
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.virtual('full_name').get(function () {
    return this.firstname + ' ' + this.lastname;
});

var User = mongoose.model('user', userSchema);
module.exports = User;
*/