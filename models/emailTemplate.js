// import package
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const EmailTemplateSchema = new Schema({
	identifier: {
		type: String, unique: true
	},
	subject: {
		type: String
	},
	content: {
		type: String
	},
	status: {
		type: Boolean
	},
	created_date: {
		type: Date, default: Date.now
	},
})

const EmailTemplate = mongoose.model("emailtemplates", EmailTemplateSchema);

export default EmailTemplate;