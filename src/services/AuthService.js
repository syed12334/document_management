const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/UserRepository');
const { getRequestInfo } = require("../helpers/requestInfo");
class AuthService {
	// login with email,password
	async login(email, password) {
		//fetching users by email 
		const user = await userRepository.findByEmail(email);
		//checking and throwing error 
		if (!user) {
			throw new Error('Invalid email or password');
		}
		
		//matching password by bcrypt
		const passwordMatch = await bcrypt.compare(password, user.password);
		//throwing invalid email or password
		if (!passwordMatch) {
			throw new Error('Invalid email or password');
		}
        // returning results
		return user;
	}
	// Create login history
	async createUserLoginHistory(data) {
		return await userRepository.userCreateLoginHistory(data);
	}
}
module.exports = new AuthService();